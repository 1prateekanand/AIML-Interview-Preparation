import { useMemo } from 'react';
import { Problem } from '../types';
import {
  CONSTELLATION_CONFIG,
  ConstellationCategoryConfig,
  CENTRAL_HUB,
} from '../components/insights/constellationConfig';
import { getCachedProblems } from '../services/questionService';
import { INITIAL_PROBLEMS } from '../data/mockData';

export type ConstellationNodeStatus = 'completed' | 'in-progress' | 'not-started' | 'locked';

export interface ConstellationCategoryData extends ConstellationCategoryConfig {
  totalCount: number;
  solvedCount: number;
  attemptedCount: number;
  completionRate: number; // percentage (0 - 100)
  status: ConstellationNodeStatus;
  keyConcepts: string[];
}

export interface ConstellationOverallStats {
  totalSolved: number;
  totalQuestions: number;
  totalAttempted: number;
  completedCategoriesCount: number;
  inProgressCategoriesCount: number;
  notStartedCategoriesCount: number;
  overallCompletion: number;
}

export interface ConstellationDataResult {
  categories: ConstellationCategoryData[];
  overall: ConstellationOverallStats;
  centralHub: typeof CENTRAL_HUB;
  getCategoryById: (id: string) => ConstellationCategoryData | undefined;
}

export function useConstellationData(problemsProp?: Problem[]): ConstellationDataResult {
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

    // 2. Filter out items marked for review
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

    // 3. Map each of the 11 categories
    const categories: ConstellationCategoryData[] = CONSTELLATION_CONFIG.map((catConfig) => {
      const catProblems = eligibleProblems.filter(
        (p) =>
          p.categorySlug === catConfig.id ||
          p.category?.toLowerCase() === catConfig.name.toLowerCase() ||
          p.categoryName?.toLowerCase() === catConfig.name.toLowerCase()
      );

      const totalCount = catProblems.length;
      const solvedCount = catProblems.filter((p) => p.status === 'Solved').length;
      const attemptedCount = catProblems.filter(
        (p) => p.status === 'Attempted' || p.status === 'Solved'
      ).length;

      const completionRate =
        totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

      let status: ConstellationNodeStatus = 'not-started';
      if (solvedCount > 0 && (solvedCount === totalCount || completionRate >= 80)) {
        status = 'completed';
      } else if (solvedCount > 0 || attemptedCount > 0) {
        status = 'in-progress';
      } else {
        status = 'not-started';
      }

      // Collect unique tags from questions in this category and merge with canonical concepts
      const questionTags = new Set<string>();
      catProblems.forEach((p) => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach((tag) => {
            if (tag && tag.trim().length > 0) {
              questionTags.add(tag.trim());
            }
          });
        }
      });

      // Combine tags, prioritising question tags, with fallback to default concepts
      const mergedConcepts: string[] = [];
      questionTags.forEach((t) => {
        if (mergedConcepts.length < 6) mergedConcepts.push(t);
      });
      catConfig.defaultConcepts.forEach((c) => {
        if (mergedConcepts.length < 6 && !mergedConcepts.includes(c)) {
          mergedConcepts.push(c);
        }
      });

      return {
        ...catConfig,
        totalCount,
        solvedCount,
        attemptedCount,
        completionRate,
        status,
        keyConcepts: mergedConcepts,
      };
    });

    // 4. Overall stats
    const totalSolved = categories.reduce((sum, c) => sum + c.solvedCount, 0);
    const totalQuestions = categories.reduce((sum, c) => sum + c.totalCount, 0);
    const totalAttempted = categories.reduce((sum, c) => sum + c.attemptedCount, 0);
    const completedCategoriesCount = categories.filter((c) => c.status === 'completed').length;
    const inProgressCategoriesCount = categories.filter((c) => c.status === 'in-progress').length;
    const notStartedCategoriesCount = categories.filter((c) => c.status === 'not-started').length;
    const overallCompletion =
      totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

    const getCategoryById = (id: string) => categories.find((c) => c.id === id);

    return {
      categories,
      overall: {
        totalSolved,
        totalQuestions,
        totalAttempted,
        completedCategoriesCount,
        inProgressCategoriesCount,
        notStartedCategoriesCount,
        overallCompletion,
      },
      centralHub: CENTRAL_HUB,
      getCategoryById,
    };
  }, [problemsProp]);
}
