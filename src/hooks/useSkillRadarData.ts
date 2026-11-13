import { useMemo } from 'react';
import { Problem } from '../types';
import { SKILL_DOMAINS, SkillDomainConfig } from '../components/insights/skillRadarConfig';
import { getStoredSubmissions, SubmissionRecord } from '../services/submissionService';
import { getCachedProblems } from '../services/questionService';
import { INITIAL_PROBLEMS } from '../data/mockData';

export interface CategoryMetric {
  id: string; // slug
  name: string; // display name
  totalCount: number;
  solvedCount: number;
  attemptedCount: number;
  totalAttempts: number;
  accuracy: number | null; // percentage or null if 0 attempts
  completion: number; // percentage (0 - 100)
  mastery: number; // calculated category mastery (0 - 100)
  hasData: boolean;
}

export interface DomainMetric extends SkillDomainConfig {
  categories: CategoryMetric[];
  totalQuestions: number;
  solvedCount: number;
  attemptedCount: number;
  totalAttempts: number;
  accuracy: number | null; // percentage or null
  completionRate: number; // percentage
  proficiency: number; // percentage (0 - 100)
  hasSufficientData: boolean;
  status: 'Mastered' | 'Proficient' | 'Developing' | 'Needs Practice' | 'Insufficient Data';
}

export interface OverallRadarStats {
  overallMastery: number;
  totalAttempted: number;
  totalSolved: number;
  totalQuestions: number;
  overallAccuracy: number | null;
  hasAnyData: boolean;
  domainsMasteredCount: number;
}

export interface SkillRadarDataResult {
  domains: DomainMetric[];
  overall: OverallRadarStats;
  selectedDomain: DomainMetric | null;
  insufficientDataNotice: boolean;
}

export function useSkillRadarData(problemsProp?: Problem[]): SkillRadarDataResult {
  return useMemo(() => {
    // 1. Resolve master questions list
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

    // 2. Filter out "Needs Review" items - rule 1:
    // "Keep Needs Review separate. Do not include it in the radar calculation."
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

    // 3. Load recorded submissions with AI evaluation scores
    const submissions: SubmissionRecord[] = getStoredSubmissions();

    // 4. Calculate metrics for each of the 6 Domains
    const domains: DomainMetric[] = SKILL_DOMAINS.map((domain) => {
      // Aggregate each category in this domain
      const categoryMetrics: CategoryMetric[] = domain.categoryIds.map((catId, idx) => {
        const catName = domain.categoryNames[idx] || catId;

        // Match questions belonging to this category
        const catQuestions = eligibleProblems.filter(
          (p) =>
            p.categorySlug === catId ||
            p.category?.toLowerCase() === catName.toLowerCase() ||
            p.categoryName?.toLowerCase() === catName.toLowerCase()
        );

        const totalCount = catQuestions.length;
        const solvedCount = catQuestions.filter((q) => q.status === 'Solved').length;
        const attemptedCount = catQuestions.filter((q) => q.status === 'Attempted').length;
        const totalAttempts = solvedCount + attemptedCount;

        // Check if there are evaluated submissions for this category
        const catSubmissions = submissions.filter(
          (s) =>
            s.category?.toLowerCase() === catName.toLowerCase() ||
            catQuestions.some((q) => q.id === s.question_id)
        );

        let accuracy: number | null = null;
        if (catSubmissions.length > 0) {
          // Average evaluation score percentage
          const avgScore =
            catSubmissions.reduce((sum, s) => sum + (s.evaluation?.score ?? 7), 0) /
            catSubmissions.length;
          accuracy = Math.round((avgScore / 10) * 100);
        } else if (totalAttempts > 0) {
          // Solved out of total attempted
          accuracy = Math.round((solvedCount / totalAttempts) * 100);
        }

        const completion = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

        // Calculate mastery:
        // When there is 0 activity: mastery is 0
        // When there are attempts: blended score of completion and accuracy
        let mastery = 0;
        if (totalAttempts > 0) {
          const accWeight = accuracy !== null ? accuracy : 60;
          mastery = Math.min(
            100,
            Math.round(completion * 0.45 + accWeight * 0.55)
          );
        }

        return {
          id: catId,
          name: catName,
          totalCount,
          solvedCount,
          attemptedCount,
          totalAttempts,
          accuracy,
          completion,
          mastery,
          hasData: totalAttempts > 0,
        };
      });

      // Domain aggregation
      const totalQuestions = categoryMetrics.reduce((sum, c) => sum + c.totalCount, 0);
      const solvedCount = categoryMetrics.reduce((sum, c) => sum + c.solvedCount, 0);
      const attemptedCount = categoryMetrics.reduce((sum, c) => sum + c.attemptedCount, 0);
      const totalAttempts = solvedCount + attemptedCount;
      const hasSufficientData = totalAttempts > 0;

      // Rule: "For a domain containing one category, use that category's score directly."
      // "Use equal weighting across categories initially, unless the existing application already has a defined mastery calculation."
      let proficiency = 0;
      if (hasSufficientData) {
        if (categoryMetrics.length === 1) {
          proficiency = categoryMetrics[0].mastery;
        } else {
          // Equal weighting across categories
          const sumMastery = categoryMetrics.reduce((sum, c) => sum + c.mastery, 0);
          proficiency = Math.round(sumMastery / categoryMetrics.length);
        }
      }

      // Domain overall accuracy
      const accuracy: number | null = hasSufficientData
        ? totalAttempts > 0
          ? Math.round((solvedCount / totalAttempts) * 100)
          : null
        : null;

      const completionRate =
        totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

      let status: DomainMetric['status'] = 'Insufficient Data';
      if (hasSufficientData) {
        if (proficiency >= 85) status = 'Mastered';
        else if (proficiency >= 65) status = 'Proficient';
        else if (proficiency >= 40) status = 'Developing';
        else status = 'Needs Practice';
      }

      return {
        ...domain,
        categories: categoryMetrics,
        totalQuestions,
        solvedCount,
        attemptedCount,
        totalAttempts,
        accuracy,
        completionRate,
        proficiency,
        hasSufficientData,
        status,
      };
    });

    // 5. Calculate Center Information:
    // "Calculate these from the actual underlying data. Do not simply average all six domain percentages."
    const totalQuestions = domains.reduce((sum, d) => sum + d.totalQuestions, 0);
    const totalSolved = domains.reduce((sum, d) => sum + d.solvedCount, 0);
    const totalAttempted = domains.reduce((sum, d) => sum + d.totalAttempts, 0);
    const hasAnyData = totalAttempted > 0;

    const overallAccuracy: number | null =
      totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : null;

    let overallMastery = 0;
    if (hasAnyData && totalQuestions > 0) {
      const overallCompletion = (totalSolved / totalQuestions) * 100;
      const acc = overallAccuracy !== null ? overallAccuracy : 65;
      overallMastery = Math.min(
        100,
        Math.round(overallCompletion * 0.45 + acc * 0.55)
      );
    }

    const domainsMasteredCount = domains.filter((d) => d.status === 'Mastered').length;

    const overall: OverallRadarStats = {
      overallMastery,
      totalAttempted,
      totalSolved,
      totalQuestions,
      overallAccuracy,
      hasAnyData,
      domainsMasteredCount,
    };

    return {
      domains,
      overall,
      selectedDomain: domains[0] || null,
      insufficientDataNotice: !hasAnyData,
    };
  }, [problemsProp]);
}
