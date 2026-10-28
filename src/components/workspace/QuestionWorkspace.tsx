import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  AlertCircle,
  X,
} from 'lucide-react';
import { Problem, ProblemStatus } from '../../types';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { YourAnswerPanel } from './YourAnswerPanel';
import { EvaluationModal } from './EvaluationModal';
import { getProblemRequirements } from '../../utils/problemWorkspaceUtils';
import { evaluateSubmission, EvaluationResult } from '../../utils/evaluationEngine';
import { createSubmission } from '../../services/submissionService';

interface QuestionWorkspaceProps {
  problem: Problem;
  problemsList: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onClose: () => void;
  onStatusChange: (problemId: number, newStatus: ProblemStatus) => void;
  initialShowEvaluation?: boolean;
}

export const QuestionWorkspace: React.FC<QuestionWorkspaceProps> = ({
  problem,
  problemsList,
  onSelectProblem,
  onClose,
  onStatusChange,
  initialShowEvaluation = false,
}) => {
  // Navigation index: current problem in problemsList
  const currentIndex = Math.max(
    0,
    problemsList.findIndex((p) => p.id === problem.id)
  );
  const totalCount = problemsList.length || 50;

  // Marked for review state
  const [isMarkedForReview, setIsMarkedForReview] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`codenexus-review-${problem.id}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Typed / Spoken Answer state
  const [answerText, setAnswerText] = useState<string>(() => {
    try {
      return localStorage.getItem(`codenexus-answer-${problem.id}`) || '';
    } catch {
      return '';
    }
  });

  // Answer expansion state
  const [answerExpanded, setAnswerExpanded] = useState<boolean>(false);

  // Canvas export reference
  const exportCanvasRef = useRef<(() => string | null) | null>(null);
  const [elementsCount, setElementsCount] = useState<number>(0);

  // Evaluation modal state
  const [showEvaluation, setShowEvaluation] = useState<boolean>(initialShowEvaluation);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(() => {
    try {
      const raw = window.location.hash.replace(/^#\/?/, '');
      const [, qs] = raw.split('?');
      if (qs) {
        const params = new URLSearchParams(qs);
        const subId = params.get('submission_id') || params.get('submissionId');
        if (subId) return subId;
      }
      return localStorage.getItem('codenexus-active-submission-id');
    } catch {
      return null;
    }
  });
  const [capturedCanvasImage, setCapturedCanvasImage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(() => {
    try {
      const saved = localStorage.getItem(`codenexus-eval-${problem.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return null;
  });

  // Keep showEvaluation synced when initialShowEvaluation changes
  useEffect(() => {
    if (initialShowEvaluation) {
      setShowEvaluation(true);
    }
  }, [initialShowEvaluation]);

  // Sync answer state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`codenexus-answer-${problem.id}`, answerText);
    } catch {
      // Ignore
    }
  }, [answerText, problem.id]);

  // Load problem-specific answer and evaluation when problem switches
  useEffect(() => {
    try {
      const savedAnswer = localStorage.getItem(`codenexus-answer-${problem.id}`) || '';
      setAnswerText(savedAnswer);
      const savedReview = localStorage.getItem(`codenexus-review-${problem.id}`) === 'true';
      setIsMarkedForReview(savedReview);
      const savedEval = localStorage.getItem(`codenexus-eval-${problem.id}`);
      setCurrentEvaluation(savedEval ? JSON.parse(savedEval) : null);
      setAnswerExpanded(false);
      setSubmissionError(null);
    } catch {
      // Ignore
    }
  }, [problem.id]);

  // Navigation handlers
  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      onSelectProblem(problemsList[currentIndex - 1]);
    } else {
      onSelectProblem(problemsList[problemsList.length - 1]);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex < problemsList.length - 1) {
      onSelectProblem(problemsList[currentIndex + 1]);
    } else {
      onSelectProblem(problemsList[0]);
    }
  };

  const handleToggleReview = () => {
    setIsMarkedForReview((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`codenexus-review-${problem.id}`, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Submit Answer — User's choice: text answer, diagram answer, or both
  const handleSubmitAnswer = async () => {
    const hasText = answerText.trim().length > 0;
    const hasDiagram = elementsCount > 0;

    // Validate that at least one answer method contains meaningful content
    if (!hasText && !hasDiagram) {
      setSubmissionError(
        'Please enter a written answer or draw an architecture diagram before submitting.'
      );
      setTimeout(() => setSubmissionError(null), 6000);
      return;
    }

    setSubmissionError(null);
    let imgData: string | null = null;
    if (exportCanvasRef.current && hasDiagram) {
      imgData = exportCanvasRef.current();
    }
    setCapturedCanvasImage(imgData);

    // Persist submission record with stable question_id
    const record = await createSubmission(problem, answerText, imgData, elementsCount);
    setCurrentEvaluation(record.evaluation);
    setActiveSubmissionId(record.id);

    // Navigate URL hash to evaluation with question_id and submission_id
    window.location.hash = `#/evaluation?question_id=${problem.id}&submission_id=${record.id}`;

    setShowEvaluation(true);
  };

  // Difficulty pill styling
  const diffBadgeColor =
    problem.difficulty === 'Easy'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
      : problem.difficulty === 'Medium'
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
      : 'border-rose-500/40 bg-rose-500/10 text-rose-400';

  const requirements = getProblemRequirements(problem);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050c19] text-white flex flex-col font-sans selection:bg-[#00f2fe]/30 selection:text-white">
      {/* Container matching Image 1 layout */}
      <div className="w-full max-w-[1520px] mx-auto p-4 sm:p-6 lg:p-7 flex flex-col gap-5 flex-1">
        {/* TOP BAR: Breadcrumb (left) & Navigation / Review / Submit (right) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb: < Problems > System Design & Architecture */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 text-[#00f2fe] hover:text-[#38bdf8] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Problems</span>
            </button>
            <span className="text-slate-500 font-normal">{'>'}</span>
            <span className="text-[#00f2fe] hover:underline cursor-pointer">
              {problem.category}
            </span>
          </nav>

          {/* Right Header Controls: Pagination, Mark for review, Submit Answer */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Pagination Capsule: < 15 / 50 > */}
            <div className="flex items-center bg-[#0a1527] border border-slate-700/80 rounded-full px-2 py-1 text-xs text-slate-300 shadow-sm">
              <button
                type="button"
                onClick={handlePrevProblem}
                className="p-1 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-slate-800"
                title="Previous Question"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 font-medium text-slate-200">
                {currentIndex + 1} / {totalCount}
              </span>
              <button
                type="button"
                onClick={handleNextProblem}
                className="p-1 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-slate-800"
                title="Next Question"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mark for review button */}
            <button
              type="button"
              onClick={handleToggleReview}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                isMarkedForReview
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-[#0a1527] hover:bg-[#101f38] border-slate-700/80 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  isMarkedForReview ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                }`}
              />
              <span>{isMarkedForReview ? 'Marked' : 'Mark for review'}</span>
            </button>

            {/* Submit Answer Button (Matches Image 1: vibrant teal with paper plane icon) */}
            <button
              type="button"
              onClick={handleSubmitAnswer}
              className="flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full bg-[#00f2fe] hover:bg-[#38bdf8] text-[#050c19] text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Submit Answer</span>
            </button>
          </div>
        </div>

        {/* Validation error if neither text nor diagram provided */}
        {submissionError && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs sm:text-sm animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{submissionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmissionError(null)}
              className="text-amber-400 hover:text-white p-1 rounded-md cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* QUESTION HEADER: Icon, Title, Difficulty Pill */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            {/* Blue circular question icon badge */}
            <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-600/30">
              <span className="text-base font-bold">?</span>
            </div>

            {/* Question Title */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white tracking-tight">
              {problem.title}
            </h1>

            {/* Difficulty Badge */}
            <span
              className={`px-3 py-0.5 rounded-full border text-xs font-semibold tracking-wide ${diffBadgeColor}`}
            >
              {problem.difficulty}
            </span>

            {/* Optional Subcategory Badge */}
            {problem.subcategory && (
              <span className="px-3 py-0.5 rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-300 text-xs font-semibold tracking-wide">
                {problem.subcategory}
              </span>
            )}
          </div>

          {/* Complete Question Description */}
          <p className="text-sm text-slate-300 leading-relaxed max-w-6xl pt-1">
            {problem.description ||
              `Design a scalable server architecture for a high-traffic web application (e.g., an e-commerce platform). Discuss the components, how they work together, and how you would handle scalability, high availability, and fault tolerance.`}
          </p>

          {/* Requirements as a readable bullet list */}
          <div className="pt-1.5 space-y-1 text-sm text-slate-300">
            <h2 className="font-bold text-white text-sm">Requirements:</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 text-xs sm:text-sm">
              {requirements.map((req, idx) => (
                <li key={idx} className="leading-relaxed">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LARGE DRAWING CANVAS */}
        <div className="w-full">
          <WhiteboardCanvas
            problemId={problem.id}
            onExportReady={(fn) => {
              exportCanvasRef.current = fn;
            }}
            onElementsChange={setElementsCount}
          />
        </div>

        {/* FULL-WIDTH ANSWER INPUT PANEL */}
        <div className="w-full pt-1 pb-4">
          <YourAnswerPanel
            answerText={answerText}
            onChangeAnswer={setAnswerText}
            isExpanded={answerExpanded}
            onToggleExpand={() => {
              setAnswerExpanded((prev) => !prev);
            }}
          />
        </div>
      </div>

      {/* DYNAMIC EVALUATION MODAL */}
      {showEvaluation && (
        <EvaluationModal
          problem={problem}
          questionId={problem.id}
          submissionId={activeSubmissionId}
          canvasImage={capturedCanvasImage}
          answerText={answerText}
          elementsCount={elementsCount}
          evaluation={
            currentEvaluation ||
            evaluateSubmission(problem, answerText, capturedCanvasImage, elementsCount)
          }
          onClose={() => {
            setShowEvaluation(false);
            if (window.location.hash.includes('evaluation') || window.location.hash.includes('submission')) {
              window.location.hash = `#/problems?category=${problem.categorySlug || ''}`;
            }
          }}
          onConfirmSolved={() => {
            onStatusChange(problem.id, 'Solved');
            setShowEvaluation(false);
            if (window.location.hash.includes('evaluation') || window.location.hash.includes('submission')) {
              window.location.hash = `#/problems?category=${problem.categorySlug || ''}`;
            }
          }}
        />
      )}
    </div>
  );
};
