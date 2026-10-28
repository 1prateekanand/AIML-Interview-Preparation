/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Problems } from './components/Problems';
import { Favorites } from './components/Favorites';
import { Insights } from './components/Insights';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { QuestionWorkspace } from './components/workspace/QuestionWorkspace';
import { INITIAL_PROBLEMS } from './data/mockData';
import { CATEGORIES_LIST } from './data/categories';
import { PageId, Problem, ProblemStatus, InsightViewId } from './types';

import { EvaluationModal } from './components/workspace/EvaluationModal';
import {
  getQuestionByIdSync,
  fetchQuestionById,
  fetchSubmissionById,
} from './services/submissionService';
import { fetchQuestions } from './services/questionService';

const VALID_PAGES: PageId[] = [
  'dashboard',
  'problems',
  'favorites',
  'insights',
];

const VALID_INSIGHT_VIEWS: InsightViewId[] = [
  'skill-radar',
  'progress-rings',
  'algorithm-constellation',
  'mastery-grid',
];

interface ParsedHashResult {
  page: PageId;
  isEvaluation: boolean;
  questionId: number | null;
  submissionId: string | null;
  category: string | null;
  insightView: InsightViewId | null;
}

function parseHash(): ParsedHashResult {
  try {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const [path, queryString] = raw.split('?');
    const isEvaluation = path === 'evaluation' || path === 'submission';

    let category: string | null = null;
    let insightView: InsightViewId | null = null;
    let questionId: number | null = null;
    let submissionId: string | null = null;

    if (queryString) {
      const params = new URLSearchParams(queryString);
      category = params.get('category');
      const viewParam = params.get('view');
      if (viewParam && VALID_INSIGHT_VIEWS.includes(viewParam as InsightViewId)) {
        insightView = viewParam as InsightViewId;
      }
      const qIdParam =
        params.get('question_id') ||
        params.get('questionId') ||
        params.get('id');
      if (qIdParam) {
        const parsedQId = parseInt(qIdParam, 10);
        if (!isNaN(parsedQId)) {
          questionId = parsedQId;
        }
      }
      const subIdParam =
        params.get('submission_id') ||
        params.get('submissionId');
      if (subIdParam) {
        submissionId = subIdParam;
      }
    }

    if (path === 'learning-paths') {
      window.location.hash = '#/dashboard';
      return {
        page: 'dashboard',
        isEvaluation: false,
        questionId: null,
        submissionId: null,
        category: null,
        insightView: null,
      };
    }

    const page: PageId = VALID_PAGES.includes(path as PageId)
      ? (path as PageId)
      : isEvaluation
      ? 'problems'
      : 'dashboard';

    return { page, isEvaluation, questionId, submissionId, category, insightView };
  } catch {
    return {
      page: 'dashboard',
      isEvaluation: false,
      questionId: null,
      submissionId: null,
      category: null,
      insightView: null,
    };
  }
}

function AppContent() {
  const initialHash = parseHash();
  const [currentPage, setCurrentPage] = useState<PageId>(initialHash.page);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialHash.category);
  const [insightView, setInsightView] = useState<InsightViewId | null>(initialHash.insightView);
  const [isEvaluationRoute, setIsEvaluationRoute] = useState<boolean>(initialHash.isEvaluation);
  const [evalQuestionId, setEvalQuestionId] = useState<number | null>(initialHash.questionId);
  const [evalSubmissionId, setEvalSubmissionId] = useState<string | null>(initialHash.submissionId);

  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem('codenexus-problems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return INITIAL_PROBLEMS;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);

  const loadQuestionsFromSupabase = useCallback(async () => {
    setIsLoadingQuestions(true);
    try {
      const result = await fetchQuestions();
      if (result.problems && result.problems.length > 0) {
        setProblems(result.problems);
      }
    } catch (err: any) {
      console.error('Failed to fetch questions from Supabase:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    loadQuestionsFromSupabase();
  }, [loadQuestionsFromSupabase]);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(() => {
    try {
      // 1. Direct from URL questionId if specified
      if (initialHash.questionId) {
        const found = getQuestionByIdSync(initialHash.questionId);
        if (found) return found;
      }
      // 2. Active stored problem ID
      const savedId =
        sessionStorage.getItem('codenexus-active-problem-id') ||
        localStorage.getItem('codenexus-active-problem-id');
      if (savedId) {
        const idNum = parseInt(savedId, 10);
        const found = getQuestionByIdSync(idNum);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  // Resolve question asynchronously if URL had question_id or submission_id on refresh
  useEffect(() => {
    let isMounted = true;
    async function hydrateQuestionFromUrl() {
      if (evalSubmissionId && !selectedProblem) {
        const sub = await fetchSubmissionById(evalSubmissionId);
        if (sub && isMounted) {
          setEvalQuestionId(sub.question_id);
          const prob = await fetchQuestionById(sub.question_id);
          if (prob && isMounted) {
            setSelectedProblem(prob);
          }
        }
      } else if (evalQuestionId && (!selectedProblem || selectedProblem.id !== evalQuestionId)) {
        const prob = await fetchQuestionById(evalQuestionId);
        if (prob && isMounted) {
          setSelectedProblem(prob);
        }
      }
    }
    hydrateQuestionFromUrl();
    return () => {
      isMounted = false;
    };
  }, [evalSubmissionId, evalQuestionId, selectedProblem]);

  // Persist selected problem ID so refreshes restore the same problem
  useEffect(() => {
    if (selectedProblem) {
      sessionStorage.setItem('codenexus-active-problem-id', String(selectedProblem.id));
      localStorage.setItem('codenexus-active-problem-id', String(selectedProblem.id));
    } else {
      sessionStorage.removeItem('codenexus-active-problem-id');
      localStorage.removeItem('codenexus-active-problem-id');
    }
  }, [selectedProblem]);

  // Save problems progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('codenexus-problems', JSON.stringify(problems));
    } catch {
      // Ignore
    }
  }, [problems]);

  // Sync with browser URL hash (without clobbering evaluation routes)
  useEffect(() => {
    if (isEvaluationRoute || window.location.hash.includes('evaluation') || window.location.hash.includes('submission')) {
      return;
    }
    if (currentPage === 'problems' && selectedCategory) {
      window.location.hash = `#/problems?category=${selectedCategory}`;
    } else if (currentPage === 'insights' && insightView) {
      window.location.hash = `#/insights?view=${insightView}`;
    } else {
      window.location.hash = `#/${currentPage}`;
    }
    try {
      sessionStorage.setItem('codenexus-current-page', currentPage);
    } catch {
      // Ignore
    }
  }, [currentPage, selectedCategory, insightView, isEvaluationRoute]);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handleHashChange = async () => {
      const parsed = parseHash();
      setCurrentPage(parsed.page);
      setSelectedCategory(parsed.category);
      setInsightView(parsed.insightView);
      setIsEvaluationRoute(parsed.isEvaluation);
      setEvalQuestionId(parsed.questionId);
      setEvalSubmissionId(parsed.submissionId);

      if (parsed.questionId) {
        const prob = await fetchQuestionById(parsed.questionId);
        if (prob) setSelectedProblem(prob);
      } else if (parsed.submissionId) {
        const sub = await fetchSubmissionById(parsed.submissionId);
        if (sub) {
          setEvalQuestionId(sub.question_id);
          const prob = await fetchQuestionById(sub.question_id);
          if (prob) setSelectedProblem(prob);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Category selection handler (supports slug or category name)
  const handleSelectCategory = (categoryInput: string | null) => {
    if (!categoryInput) {
      setSelectedCategory(null);
    } else {
      const found = CATEGORIES_LIST.find(
        (c) =>
          c.id === categoryInput ||
          c.name.toLowerCase() === categoryInput.toLowerCase() ||
          categoryInput.toLowerCase().includes(c.id)
      );
      setSelectedCategory(found ? found.id : categoryInput);
    }
    setCurrentPage('problems');
  };

  // Toggle problem status between Solved, Attempted, Todo
  const handleToggleStatus = (problemId: number) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          const nextStatus: ProblemStatus =
            p.status === 'Solved'
              ? 'Attempted'
              : p.status === 'Attempted'
              ? 'Todo'
              : 'Solved';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleStatusChange = (problemId: number, newStatus: ProblemStatus) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, status: newStatus } : p))
    );
    if (selectedProblem && selectedProblem.id === problemId) {
      setSelectedProblem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Left Sidebar Navigation with Expandable Problems Submenu */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          if (page === 'insights' && currentPage === 'insights') {
            setInsightView(null);
          } else if (page !== 'insights') {
            setInsightView(null);
          }
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        problems={problems}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Search, Theme Selector, Notification Bell, User Profile */}
        <Header
          currentPage={currentPage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateToProblems={() => {
            setCurrentPage('problems');
          }}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={setCurrentPage}
              onOpenProblem={(p) => setSelectedProblem(p)}
              onSelectCategory={handleSelectCategory}
              problems={problems}
            />
          )}

          {currentPage === 'problems' && (
            <Problems
              problems={problems}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onOpenProblem={(p) => setSelectedProblem(p)}
              onToggleStatus={handleToggleStatus}
              isLoading={isLoadingQuestions}
            />
          )}

          {currentPage === 'favorites' && <Favorites />}

          {currentPage === 'insights' && (
            <Insights
              activeView={insightView}
              onViewChange={(view) => setInsightView(view)}
              onNavigateToProblems={(tag) => {
                handleSelectCategory(tag || null);
              }}
            />
          )}
        </main>
      </div>

      {/* Direct Evaluation Route without active workspace problem */}
      {isEvaluationRoute && !selectedProblem && (
        <EvaluationModal
          questionId={evalQuestionId}
          submissionId={evalSubmissionId}
          onClose={() => {
            setIsEvaluationRoute(false);
            setEvalQuestionId(null);
            setEvalSubmissionId(null);
            window.location.hash = selectedCategory
              ? `#/problems?category=${selectedCategory}`
              : '#/problems';
          }}
          onConfirmSolved={() => {
            if (evalQuestionId) {
              handleStatusChange(evalQuestionId, 'Solved');
            }
            setIsEvaluationRoute(false);
            setEvalQuestionId(null);
            setEvalSubmissionId(null);
            window.location.hash = selectedCategory
              ? `#/problems?category=${selectedCategory}`
              : '#/problems';
          }}
        />
      )}

      {/* Question-Solving Architecture Workspace (matches Image 1 reference layout) */}
      {selectedProblem && (
        <QuestionWorkspace
          problem={selectedProblem}
          problemsList={problems}
          initialShowEvaluation={isEvaluationRoute}
          onSelectProblem={(p) => setSelectedProblem(p)}
          onClose={() => {
            setSelectedProblem(null);
            setIsEvaluationRoute(false);
            setEvalQuestionId(null);
            setEvalSubmissionId(null);
            if (
              window.location.hash.includes('evaluation') ||
              window.location.hash.includes('submission')
            ) {
              window.location.hash = selectedCategory
                ? `#/problems?category=${selectedCategory}`
                : '#/problems';
            }
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
