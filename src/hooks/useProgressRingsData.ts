import { useMemo, useState, useEffect } from 'react';
import { Problem, Difficulty } from '../types';
import { CATEGORIES_LIST } from '../data/categories';
import { getStoredSubmissions, SubmissionRecord } from '../services/submissionService';
import { getCachedProblems, normalizeDifficulty } from '../services/questionService';
import { INITIAL_PROBLEMS } from '../data/mockData';

export interface DifficultyRingStats {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  total: number;
  solved: number;
  attempted: number;
  remaining: number;
  percent: number; // (solved / total) * 100
  accuracy: number | null; // (solved / attempted) * 100 or null if 0 attempts
  color: string;
  glowColor: string;
}

export interface ProgressRingsOverallStats {
  totalSolved: number;
  totalQuestions: number;
  totalAttempted: number;
  overallCompletion: number;
  overallAccuracy: number | null;
  dayStreak: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  hasActivity: boolean;
}

export interface ProgressRingsDataResult {
  rings: DifficultyRingStats[];
  overall: ProgressRingsOverallStats;
  selectedCategory: string;
  categoryName: string;
  categoriesList: typeof CATEGORIES_LIST;
  isLoading: boolean;
}

/**
 * Calculates current active streak in consecutive days based on submission/activity dates.
 */
function calculateActivityStreak(submissions: SubmissionRecord[], solvedProblems: Problem[]): number {
  const activeDates = new Set<string>();

  // Helper to format Date to YYYY-MM-DD local
  const toDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add submission timestamps
  submissions.forEach((sub) => {
    if (sub.created_at) {
      const d = new Date(sub.created_at);
      if (!isNaN(d.getTime())) {
        activeDates.add(toDateKey(d));
      }
    }
  });

  // If solved problems exist with recent timestamps or default activity
  solvedProblems.forEach((p) => {
    if (p.solvedAgo) {
      const now = new Date();
      if (p.solvedAgo.includes('hour') || p.solvedAgo.includes('min') || p.solvedAgo.includes('today')) {
        activeDates.add(toDateKey(now));
      } else if (p.solvedAgo.includes('1 day') || p.solvedAgo.includes('yesterday')) {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        activeDates.add(toDateKey(y));
      } else if (p.solvedAgo.includes('2 days')) {
        const y2 = new Date(now);
        y2.setDate(y2.getDate() - 2);
        activeDates.add(toDateKey(y2));
      }
    }
  });

  if (activeDates.size === 0) {
    // If user has solved questions in the database, calculate minimum baseline from those
    if (solvedProblems.length > 0) {
      return Math.min(3, solvedProblems.length);
    }
    return 0;
  }

  // Count consecutive days ending today or yesterday
  const today = new Date();
  const todayKey = toDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  let currentCheckDate: Date;
  if (activeDates.has(todayKey)) {
    currentCheckDate = today;
  } else if (activeDates.has(yesterdayKey)) {
    currentCheckDate = yesterday;
  } else {
    // Streak broken or no activity in the past 24h
    return 0;
  }

  let streak = 0;
  while (true) {
    const key = toDateKey(currentCheckDate);
    if (activeDates.has(key)) {
      streak += 1;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function useProgressRingsData(
  problemsProp?: Problem[],
  categoryFilter = 'All Categories'
): ProgressRingsDataResult {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => getStoredSubmissions());

  // Listen for storage or submission updates
  useEffect(() => {
    const handleUpdate = () => {
      setSubmissions(getStoredSubmissions());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('codenexus_submission_created', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('codenexus_submission_created', handleUpdate);
    };
  }, []);

  return useMemo(() => {
    // 1. Resolve master questions
    let sourceProblems: Problem[] = [];
    if (problemsProp && problemsProp.length > 0) {
      sourceProblems = problemsProp;
    } else {
      const cached = getCachedProblems();
      if (cached.problems && cached.problems.length > 0) {
        sourceProblems = cached.problems;
      } else {
        sourceProblems = INITIAL_PROBLEMS;
      }
    }

    // 2. Filter out "Needs Review" items
    const eligibleProblems = sourceProblems.filter((p) => {
      if (p.markedForReview) return false;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          if (window.localStorage.getItem(`codenexus-review-${p.id}`) === 'true') {
            return false;
          }
        }
      } catch {
        // Ignore storage errors
      }
      return true;
    });

    // 3. Filter by category if not 'All Categories'
    let filteredProblems = eligibleProblems;
    let categoryName = 'All Categories';

    if (categoryFilter && categoryFilter !== 'All Categories') {
      const targetCat = CATEGORIES_LIST.find(
        (c) =>
          c.id === categoryFilter ||
          c.name.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (targetCat) {
        categoryName = targetCat.name;
        filteredProblems = eligibleProblems.filter(
          (p) =>
            p.categorySlug === targetCat.id ||
            p.category?.toLowerCase() === targetCat.name.toLowerCase() ||
            p.categoryName?.toLowerCase() === targetCat.name.toLowerCase()
        );
      } else {
        filteredProblems = eligibleProblems.filter(
          (p) =>
            p.categorySlug === categoryFilter ||
            p.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
    }

    // 4. Calculate difficulty totals and completions
    const difficulties: Array<{
      difficulty: 'Easy' | 'Medium' | 'Hard';
      color: string;
      glowColor: string;
    }> = [
      {
        difficulty: 'Easy',
        color: '#10B981', // Green
        glowColor: 'rgba(16, 185, 129, 0.4)',
      },
      {
        difficulty: 'Medium',
        color: '#F59E0B', // Amber
        glowColor: 'rgba(245, 158, 11, 0.4)',
      },
      {
        difficulty: 'Hard',
        color: '#F43F5E', // Red
        glowColor: 'rgba(244, 63, 94, 0.4)',
      },
    ];

    const rings: DifficultyRingStats[] = difficulties.map(({ difficulty, color, glowColor }) => {
      const diffQuestions = filteredProblems.filter(
        (p) => normalizeDifficulty(p.difficulty) === difficulty
      );

      const total = diffQuestions.length;
      const solved = diffQuestions.filter((p) => p.status === 'Solved').length;
      const attempted = diffQuestions.filter(
        (p) => p.status === 'Attempted' || p.status === 'Solved'
      ).length;
      const remaining = Math.max(0, total - solved);
      const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
      const accuracy = attempted > 0 ? Math.round((solved / attempted) * 100) : null;

      return {
        difficulty,
        total,
        solved,
        attempted,
        remaining,
        percent,
        accuracy,
        color,
        glowColor,
      };
    });

    // 5. Calculate summary metrics
    const totalSolved = rings.reduce((acc, r) => acc + r.solved, 0);
    const totalQuestions = rings.reduce((acc, r) => acc + r.total, 0);
    const totalAttempted = rings.reduce((acc, r) => acc + r.attempted, 0);

    const overallCompletion =
      totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
    const overallAccuracy =
      totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : null;

    const solvedProblems = filteredProblems.filter((p) => p.status === 'Solved');
    const dayStreak = calculateActivityStreak(submissions, solvedProblems);

    const easyRing = rings.find((r) => r.difficulty === 'Easy');
    const medRing = rings.find((r) => r.difficulty === 'Medium');
    const hardRing = rings.find((r) => r.difficulty === 'Hard');

    return {
      rings,
      overall: {
        totalSolved,
        totalQuestions,
        totalAttempted,
        overallCompletion,
        overallAccuracy,
        dayStreak,
        easyTotal: easyRing ? easyRing.total : 0,
        mediumTotal: medRing ? medRing.total : 0,
        hardTotal: hardRing ? hardRing.total : 0,
        hasActivity: totalAttempted > 0 || totalSolved > 0,
      },
      selectedCategory: categoryFilter,
      categoryName,
      categoriesList: CATEGORIES_LIST,
      isLoading: false,
    };
  }, [problemsProp, categoryFilter, submissions]);
}
