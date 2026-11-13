import { useMemo, useState, useEffect } from 'react';
import { Problem } from '../types';
import { getStoredSubmissions, SubmissionRecord } from '../services/submissionService';
import { getCachedProblems } from '../services/questionService';
import { INITIAL_PROBLEMS } from '../data/mockData';

export type MasteryTimeRange =
  | '30d'
  | '3m'
  | '6m'
  | '12m'
  | 'this_year'
  | 'all_time'
  | 'custom';

export interface SolvedQuestionRecord {
  id: number;
  title: string;
  category: string;
  difficulty?: string;
  score?: number;
  timeAgo?: string;
}

export interface MasteryDayData {
  date: string; // YYYY-MM-DD local
  displayDate: string; // e.g. "November 1, 2026"
  shortDate: string; // e.g. "Nov 1"
  dayOfWeek: number; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  count: number; // Unique questions solved on this date
  attemptedCount: number; // Unique questions attempted
  accuracy: number | null; // percentage (0-100) or null
  level: 0 | 1 | 2 | 3 | 4; // 0: 0, 1: 1-2, 2: 3-5, 3: 6-10, 4: 11+
  isFuture: boolean;
  isInRange: boolean;
  solvedQuestions: SolvedQuestionRecord[];
}

export interface MonthLabelPlacement {
  label: string; // e.g. "Nov" or "Nov 2026"
  weekIndex: number;
}

export interface MasteryGridOverallStats {
  periodSolved: number;
  previousPeriodSolved: number;
  percentageChange: number | null;
  dayStreak: number;
  overallAccuracy: number | null;
  totalSubmissionsInPeriod: number;
  activeDaysCount: number;
}

export interface MasteryGridDataResult {
  weeks: MasteryDayData[][];
  monthLabels: MonthLabelPlacement[];
  overall: MasteryGridOverallStats;
  allDays: MasteryDayData[];
  timeRange: MasteryTimeRange;
  customStartDate: string;
  customEndDate: string;
}

/**
 * Converts a Date object to YYYY-MM-DD local format without UTC shift.
 */
export function formatLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useMasteryGridData(
  problemsProp?: Problem[],
  timeRange: MasteryTimeRange = '3m',
  customStartDate?: string,
  customEndDate?: string
): MasteryGridDataResult {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => getStoredSubmissions());

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
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const todayKey = formatLocalDateKey(now);

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

    // Exclude Needs Review
    const eligibleProblems = sourceProblems.filter((p) => {
      if (p.markedForReview) return false;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          if (window.localStorage.getItem(`codenexus-review-${p.id}`) === 'true') {
            return false;
          }
        }
      } catch {
        // Ignore
      }
      return true;
    });

    // 2. Aggregate activity by local date key (YYYY-MM-DD)
    // Map: dateKey -> { solvedQuestionIds: Set<number>, attemptedQuestionIds: Set<number>, questions: SolvedQuestionRecord[] }
    const dailyActivity = new Map<
      string,
      {
        solvedIds: Set<number>;
        attemptedIds: Set<number>;
        solvedList: SolvedQuestionRecord[];
      }
    >();

    const getOrCreateDayEntry = (dateKey: string) => {
      let entry = dailyActivity.get(dateKey);
      if (!entry) {
        entry = {
          solvedIds: new Set(),
          attemptedIds: new Set(),
          solvedList: [],
        };
        dailyActivity.set(dateKey, entry);
      }
      return entry;
    };

    // A. Parse stored submissions (from actual solving sessions)
    submissions.forEach((sub) => {
      if (!sub.created_at) return;
      const d = new Date(sub.created_at);
      if (isNaN(d.getTime())) return;
      const dateKey = formatLocalDateKey(d);

      const qId = sub.question_id || sub.problem_id;
      const isPassed =
        sub.evaluation?.score !== undefined
          ? sub.evaluation.score >= 70
          : sub.evaluation?.status === 'Strong Hire' || sub.evaluation?.status === 'Proficient';

      const entry = getOrCreateDayEntry(dateKey);
      if (qId) {
        entry.attemptedIds.add(qId);
        if (isPassed && !entry.solvedIds.has(qId)) {
          entry.solvedIds.add(qId);
          entry.solvedList.push({
            id: qId,
            title: sub.question_title || `Question #${qId}`,
            category: sub.category || 'General',
            difficulty: sub.difficulty,
            score: sub.evaluation?.score,
          });
        }
      }
    });

    // B. Parse eligible questions that have status='Solved' or 'Attempted'
    eligibleProblems.forEach((p) => {
      if (p.status !== 'Solved' && p.status !== 'Attempted') return;

      let dateKey = todayKey;
      if (p.solvedAgo) {
        const d = new Date(now);
        if (p.solvedAgo.includes('hour') || p.solvedAgo.includes('min') || p.solvedAgo.includes('today')) {
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('1 day') || p.solvedAgo.includes('yesterday')) {
          d.setDate(d.getDate() - 1);
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('2 days')) {
          d.setDate(d.getDate() - 2);
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('3 days')) {
          d.setDate(d.getDate() - 3);
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('4 days')) {
          d.setDate(d.getDate() - 4);
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('5 days')) {
          d.setDate(d.getDate() - 5);
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('1 week')) {
          d.setDate(d.getDate() - 7);
          dateKey = formatLocalDateKey(d);
        } else if (p.solvedAgo.includes('2 weeks')) {
          d.setDate(d.getDate() - 14);
          dateKey = formatLocalDateKey(d);
        }
      }

      const entry = getOrCreateDayEntry(dateKey);
      entry.attemptedIds.add(p.id);

      if (p.status === 'Solved' && !entry.solvedIds.has(p.id)) {
        entry.solvedIds.add(p.id);
        entry.solvedList.push({
          id: p.id,
          title: p.title,
          category: p.categoryName || p.category || 'General',
          difficulty: p.difficulty,
          timeAgo: p.solvedAgo,
        });
      }
    });

    // 3. Determine start and end date of the requested range
    let rangeStartDate = new Date(now);
    let rangeEndDate = new Date(now);
    let previousPeriodStart = new Date(now);
    let previousPeriodEnd = new Date(now);

    switch (timeRange) {
      case '30d': {
        const days = 30;
        rangeStartDate.setDate(now.getDate() - days);
        previousPeriodEnd = new Date(rangeStartDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - days);
        break;
      }
      case '3m': {
        const days = 90;
        rangeStartDate.setDate(now.getDate() - days);
        previousPeriodEnd = new Date(rangeStartDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - days);
        break;
      }
      case '6m': {
        const days = 180;
        rangeStartDate.setDate(now.getDate() - days);
        previousPeriodEnd = new Date(rangeStartDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - days);
        break;
      }
      case '12m': {
        const days = 365;
        rangeStartDate.setDate(now.getDate() - days);
        previousPeriodEnd = new Date(rangeStartDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - days);
        break;
      }
      case 'this_year': {
        rangeStartDate = new Date(now.getFullYear(), 0, 1);
        const days = Math.max(1, Math.round((now.getTime() - rangeStartDate.getTime()) / (1000 * 60 * 60 * 24)));
        previousPeriodEnd = new Date(rangeStartDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - days);
        break;
      }
      case 'all_time': {
        // Find earliest activity date or fallback to 1 year
        let earliest = new Date(now);
        earliest.setFullYear(earliest.getFullYear() - 1);
        dailyActivity.forEach((_, key) => {
          const d = new Date(key);
          if (!isNaN(d.getTime()) && d < earliest) {
            earliest = d;
          }
        });
        rangeStartDate = earliest;
        previousPeriodStart = new Date(earliest);
        previousPeriodEnd = new Date(earliest);
        break;
      }
      case 'custom': {
        if (customStartDate && customEndDate) {
          rangeStartDate = new Date(customStartDate);
          rangeEndDate = new Date(customEndDate);
          if (isNaN(rangeStartDate.getTime())) rangeStartDate = new Date(now.getDate() - 90);
          if (isNaN(rangeEndDate.getTime())) rangeEndDate = new Date(now);
        } else {
          rangeStartDate.setDate(now.getDate() - 90);
        }
        const diffDays = Math.max(1, Math.round((rangeEndDate.getTime() - rangeStartDate.getTime()) / (1000 * 60 * 60 * 24)));
        previousPeriodEnd = new Date(rangeStartDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodEnd.getDate() - diffDays);
        break;
      }
    }

    // 4. Align grid to Monday (Monday = 0)
    // Start grid on the Monday on or before rangeStartDate
    const gridStart = new Date(rangeStartDate);
    const startDayOfWeek = (gridStart.getDay() + 6) % 7; // Monday = 0
    gridStart.setDate(gridStart.getDate() - startDayOfWeek);
    gridStart.setHours(0, 0, 0, 0);

    // End grid on the Sunday on or after rangeEndDate
    const gridEnd = new Date(rangeEndDate);
    const endDayOfWeek = (gridEnd.getDay() + 6) % 7;
    const daysToSunday = 6 - endDayOfWeek;
    gridEnd.setDate(gridEnd.getDate() + daysToSunday);
    gridEnd.setHours(23, 59, 59, 999);

    // 5. Build Weeks Matrix (each week has 7 days, Mon - Sun)
    const weeks: MasteryDayData[][] = [];
    const monthLabels: MonthLabelPlacement[] = [];
    const allDays: MasteryDayData[] = [];

    const cursor = new Date(gridStart);
    let currentWeek: MasteryDayData[] = [];
    let weekIndex = 0;
    let lastMonthSeen = -1;

    const startKey = formatLocalDateKey(rangeStartDate);
    const endKey = formatLocalDateKey(rangeEndDate);

    while (cursor <= gridEnd) {
      const dateKey = formatLocalDateKey(cursor);
      const dayOfWeek = (cursor.getDay() + 6) % 7; // 0=Mon, 6=Sun
      const isFuture = cursor > now;
      const isInRange = dateKey >= startKey && dateKey <= endKey;

      const act = !isFuture ? dailyActivity.get(dateKey) : undefined;
      const solvedCount = act ? act.solvedIds.size : 0;
      const attemptedCount = act ? act.attemptedIds.size : 0;
      const accuracy =
        attemptedCount > 0 ? Math.round((solvedCount / attemptedCount) * 100) : null;

      // Assign activity intensity
      // 0: 0, 1: 1-2, 2: 3-5, 3: 6-10, 4: 11+
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (solvedCount >= 11) level = 4;
      else if (solvedCount >= 6) level = 3;
      else if (solvedCount >= 3) level = 2;
      else if (solvedCount >= 1) level = 1;

      const displayDate = cursor.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const shortDate = cursor.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const dayData: MasteryDayData = {
        date: dateKey,
        displayDate,
        shortDate,
        dayOfWeek,
        count: solvedCount,
        attemptedCount,
        accuracy,
        level,
        isFuture,
        isInRange,
        solvedQuestions: act ? act.solvedList : [],
      };

      currentWeek.push(dayData);
      allDays.push(dayData);

      // Check month label placement (when day of month is between 1 and 7)
      if (cursor.getDate() <= 7 && cursor.getMonth() !== lastMonthSeen) {
        lastMonthSeen = cursor.getMonth();
        monthLabels.push({
          label: cursor.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex,
        });
      }

      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
        weekIndex += 1;
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // 6. Calculate summary metrics
    // A. Period Solved
    let periodSolved = 0;
    let periodAttempted = 0;
    let activeDaysCount = 0;

    allDays.forEach((day) => {
      if (day.isInRange && !day.isFuture) {
        periodSolved += day.count;
        periodAttempted += day.attemptedCount;
        if (day.count > 0) activeDaysCount += 1;
      }
    });

    // B. Previous Period Solved for comparison
    const prevStartKey = formatLocalDateKey(previousPeriodStart);
    const prevEndKey = formatLocalDateKey(previousPeriodEnd);
    let previousPeriodSolved = 0;

    dailyActivity.forEach((val, key) => {
      if (key >= prevStartKey && key <= prevEndKey) {
        previousPeriodSolved += val.solvedIds.size;
      }
    });

    let percentageChange: number | null = null;
    if (previousPeriodSolved > 0) {
      percentageChange = Math.round(
        ((periodSolved - previousPeriodSolved) / previousPeriodSolved) * 100
      );
    } else if (periodSolved > 0) {
      percentageChange = 100;
    } else {
      percentageChange = 0;
    }

    // C. Day Streak calculation based on actual local dates
    let dayStreak = 0;
    let streakCheck = new Date(now);
    const todayAct = dailyActivity.get(todayKey);

    // If no activity today, check if active yesterday to continue streak
    if (!todayAct || todayAct.solvedIds.size === 0) {
      streakCheck.setDate(streakCheck.getDate() - 1);
    }

    while (true) {
      const checkKey = formatLocalDateKey(streakCheck);
      const dayAct = dailyActivity.get(checkKey);
      if (dayAct && dayAct.solvedIds.size > 0) {
        dayStreak += 1;
        streakCheck.setDate(streakCheck.getDate() - 1);
      } else {
        break;
      }
    }

    // D. Overall Accuracy
    let overallAccuracy: number | null = null;
    if (periodAttempted > 0) {
      overallAccuracy = Math.round((periodSolved / periodAttempted) * 100);
    }

    return {
      weeks,
      monthLabels,
      overall: {
        periodSolved,
        previousPeriodSolved,
        percentageChange,
        dayStreak,
        overallAccuracy,
        totalSubmissionsInPeriod: periodSolved,
        activeDaysCount,
      },
      allDays,
      timeRange,
      customStartDate: customStartDate || startKey,
      customEndDate: customEndDate || endKey,
    };
  }, [problemsProp, timeRange, customStartDate, customEndDate, submissions]);
}
