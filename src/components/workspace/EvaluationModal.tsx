import React, { useState, useEffect } from 'react';
import {
  FileText,
  X,
  Check,
  Image as ImageIcon,
  Trophy,
  List,
  XCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Send,
  Sparkles,
  User,
  Loader2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { Problem } from '../../types';
import { EvaluationResult, evaluateSubmission } from '../../utils/evaluationEngine';
import { getProblemRequirements } from '../../utils/problemWorkspaceUtils';
import {
  fetchQuestionById,
  fetchSubmissionById,
  fetchLatestSubmissionForQuestion,
  SubmissionRecord,
} from '../../services/submissionService';

export interface EvaluationModalProps {
  problem?: Problem | null;
  questionId?: number | string | null;
  submissionId?: string | null;
  canvasImage?: string | null;
  answerText?: string;
  elementsCount?: number;
  evaluation?: EvaluationResult | null;
  onClose: () => void;
  onConfirmSolved?: () => void;
  isPageMode?: boolean;
}

interface DoubtMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  problem: initialProblem,
  questionId,
  submissionId,
  canvasImage: initialCanvasImage,
  answerText: initialAnswerText,
  elementsCount: initialElementsCount,
  evaluation: initialEvaluation,
  onClose,
  onConfirmSolved,
  isPageMode = false,
}) => {
  const [modelAnswerOpen, setModelAnswerOpen] = useState(true);
  const [doubtOpen, setDoubtOpen] = useState(true);

  // Asynchronous resolved state for direct route navigation or refresh
  const [resolvedProblem, setResolvedProblem] = useState<Problem | null>(initialProblem || null);
  const [resolvedSubmission, setResolvedSubmission] = useState<SubmissionRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProblem && !!(questionId || submissionId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        let sub: SubmissionRecord | null = null;
        let targetQuestionId = questionId || (initialProblem ? initialProblem.id : null);
        let targetSubId = submissionId;

        // Check URL parameters if not passed directly
        if (!targetSubId) {
          try {
            const raw = window.location.hash.replace(/^#\/?/, '');
            const [, queryString] = raw.split('?');
            if (queryString) {
              const params = new URLSearchParams(queryString);
              targetSubId = params.get('submission_id') || params.get('submissionId');
              if (!targetQuestionId) {
                const qp = params.get('question_id') || params.get('questionId') || params.get('id');
                if (qp) targetQuestionId = parseInt(qp, 10);
              }
            }
          } catch {
            // Ignore
          }
        }

        // If a submission ID is provided, retrieve submission first
        if (targetSubId) {
          sub = await fetchSubmissionById(targetSubId);
          if (sub) {
            setResolvedSubmission(sub);
            if (!targetQuestionId) {
              targetQuestionId = sub.question_id;
            }
          }
        }

        // If no submission yet, check localStorage active submission
        if (!sub && !targetSubId) {
          const storedSubId = localStorage.getItem('codenexus-active-submission-id');
          if (storedSubId) {
            sub = await fetchSubmissionById(storedSubId);
            if (sub) {
              setResolvedSubmission(sub);
              if (!targetQuestionId) {
                targetQuestionId = sub.question_id;
              }
            }
          }
        }

        // If still no question ID, check localStorage active problem
        if (!targetQuestionId) {
          const storedQId =
            sessionStorage.getItem('codenexus-active-problem-id') ||
            localStorage.getItem('codenexus-active-problem-id');
          if (storedQId) {
            targetQuestionId = parseInt(storedQId, 10);
          }
        }

        // Resolve question
        let prob = initialProblem || null;
        if (targetQuestionId) {
          if (!prob || prob.id !== targetQuestionId) {
            prob = await fetchQuestionById(targetQuestionId);
          }
        }

        if (prob) {
          if (isMounted) setResolvedProblem(prob);
          // If we still don't have submission record, fetch latest for this question
          if (!sub) {
            const latestSub = await fetchLatestSubmissionForQuestion(prob.id);
            if (latestSub && isMounted) {
              setResolvedSubmission(latestSub);
            }
          }
        } else {
          if (isMounted) setErrorMessage(`Question #${targetQuestionId || 'unknown'} not found in database.`);
        }
      } catch (err) {
        console.error('Error fetching evaluation data:', err);
        if (isMounted) setErrorMessage('Failed to load evaluation details.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [initialProblem, questionId, submissionId]);

  const problem = resolvedProblem || initialProblem;
  const answerText =
    initialAnswerText !== undefined && initialAnswerText !== ''
      ? initialAnswerText
      : resolvedSubmission?.answer_text || '';
  const canvasImage =
    initialCanvasImage !== undefined && initialCanvasImage !== null
      ? initialCanvasImage
      : resolvedSubmission?.canvas_image || null;
  const elementsCount =
    initialElementsCount !== undefined && initialElementsCount > 0
      ? initialElementsCount
      : resolvedSubmission?.elements_count || 0;

  const evaluation =
    initialEvaluation ||
    resolvedSubmission?.evaluation ||
    (problem
      ? evaluateSubmission(problem, answerText, canvasImage, elementsCount)
      : null);

  // Ask a doubt interactive state for this specific evaluation
  const [doubtMessages, setDoubtMessages] = useState<DoubtMessage[]>([]);
  const [doubtInput, setDoubtInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (problem) {
      setDoubtMessages([
        {
          id: 'init',
          sender: 'assistant',
          text: `Hello! I'm your AI Architecture Mentor for "${problem.title}". Ask me any clarifying question regarding scale, traffic bounds, database choices, or design trade-offs.`,
        },
      ]);
    }
  }, [problem?.id, problem?.title]);

  const hasDiagram = elementsCount > 0 && !!canvasImage;
  const hasText = answerText.trim().length > 0;
  const wordCount = hasText ? answerText.trim().split(/\s+/).length : 0;

  // Circular gauge circumference for radius 38
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0.08, Math.min(1, (evaluation?.score ?? 1) / 10));
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Format submission timestamp matching reference: "Oct 26, 2026, 10:14 AM"
  const formattedDate = resolvedSubmission?.created_at
    ? new Date(resolvedSubmission.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

  const submissionType =
    evaluation?.submissionType ||
    resolvedSubmission?.submission_type ||
    'Written Technical Architecture Analysis';

  const handleSendDoubt = (text: string) => {
    if (!text.trim() || !problem || !evaluation) return;

    const userMsg: DoubtMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setDoubtMessages((prev) => [...prev, userMsg]);
    setDoubtInput('');
    setIsThinking(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';

      if (lower.includes('traffic') || lower.includes('qps') || lower.includes('scale')) {
        reply = `For "${problem.title}", consider peak workloads: target 10,000–50,000 QPS with an 80/20 read/write ratio. Use horizontal auto-scaling compute pools behind Layer-7 load balancing to absorb surges.`;
      } else if (lower.includes('cache') || lower.includes('invalidation')) {
        reply = `In "${problem.title}", implement a Cache-Aside (Lazy Loading) pattern with Redis Cluster. Use short TTLs on fast-changing data and event-driven cache eviction on write operations to prevent stale reads.`;
      } else if (lower.includes('database') || lower.includes('replication') || lower.includes('trade-off')) {
        reply = `For data persistence in "${problem.title}", choose between strong consistency (CP) for transactional state vs high availability (AP) for non-blocking reads. Use primary-replica configurations with connection poolers.`;
      } else if (lower.includes('missed') || lower.includes('concept') || lower.includes('improve')) {
        reply = `To improve your score on "${problem.title}", focus on the missed requirements: ${evaluation.missedConcepts.join(', ')}. Addressing these will elevate your solution to production grade.`;
      } else {
        reply = `Regarding "${problem.title}": ${evaluation.keyInsight} You can also review the Model Answer section above for a complete reference architecture.`;
      }

      setDoubtMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: reply,
        },
      ]);
      setIsThinking(false);
    }, 600);
  };

  // LOADING STATE
  if (isLoading) {
    const loadingCard = (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-accent)] rounded-2xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center mx-auto text-[var(--accent)]">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] tracking-wide">
          Loading Question & Evaluation...
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Retrieving question metadata, architecture requirements, and submission verification records.
        </p>
      </div>
    );

    if (isPageMode) {
      return (
        <div className="w-full py-24 flex items-center justify-center animate-in fade-in duration-200">
          {loadingCard}
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
        {loadingCard}
      </div>
    );
  }

  // ERROR OR QUESTION UNAVAILABLE
  if (!problem || !evaluation) {
    const errorCard = (
      <div className="bg-[var(--bg-surface)] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl mx-auto">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">Question Unavailable</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {errorMessage || 'Unable to load the question record for this evaluation.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--bg-main)] font-bold text-xs cursor-pointer shadow-lg transition-colors hover:opacity-90"
        >
          Return to Questions
        </button>
      </div>
    );

    if (isPageMode) {
      return (
        <div className="w-full py-20 flex items-center justify-center animate-in fade-in duration-200">
          {errorCard}
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
        {errorCard}
      </div>
    );
  }

  // Main evaluation dashboard layout matching CodeNexus_Architecture_Evaluation_Dashboard_ec3f2d2d.png
  const evaluationDashboardContent = (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-accent)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl space-y-5 text-[var(--text-primary)] transition-colors">
      {/* 1. DYNAMIC PAGE HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Teal/accent document icon inside square */}
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--border-accent)] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Architecture Solution Evaluation
            </h2>
            {/* Dynamically populated subtitle: Question #X • Category */}
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
              {problem.title} • {problem.category}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          title="Close evaluation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. DEDICATED QUESTION DETAILS SECTION */}
      <div className="bg-[var(--bg-main)]/80 border border-[var(--border-accent)]/50 rounded-2xl p-4 sm:p-5 sm:p-6 space-y-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              QUESTION:
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {problem.title}
            </h3>
          </div>
          {/* Difficulty Badge */}
          {problem.difficulty && (
            <span
              className={`px-3 py-0.5 rounded-full border text-xs font-semibold tracking-wide shrink-0 ${
                problem.difficulty === 'Easy'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : problem.difficulty === 'Medium'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-400'
              }`}
            >
              {problem.difficulty}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
          <span>Category:</span>
          <span className="text-[var(--accent)] font-semibold">{problem.category}</span>
          {problem.subcategory && (
            <>
              <span>•</span>
              <span>Subcategory:</span>
              <span className="text-[var(--accent-secondary)] font-semibold">{problem.subcategory}</span>
            </>
          )}
          {problem.difficulty && (
            <>
              <span>•</span>
              <span>Difficulty:</span>
              <span className="text-slate-200 font-semibold">{problem.difficulty}</span>
            </>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
          {problem.description ||
            `Analyze the architecture requirements, trade-offs, and failure recovery modes for ${problem.title}.`}
        </p>

        {(() => {
          const requirements = getProblemRequirements(problem);
          if (!requirements || requirements.length === 0) return null;
          return (
            <div className="bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] rounded-xl p-3.5 sm:p-4 space-y-2 mt-2">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                REQUIREMENTS & CONSTRAINTS:
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pl-1 leading-relaxed">
                {requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>

      {/* 3. SUBMISSION STATUS BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--active-nav-bg)] border border-[var(--border-accent)] text-xs sm:text-sm text-[var(--accent)] shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg-main)] shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-semibold">
            Submission received: {submissionType}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--accent)]/90 opacity-90">
          <Calendar className="w-3.5 h-3.5" />
          <span>Submitted on {formattedDate}</span>
        </div>
      </div>

      {/* 4. SUBMITTED ARTIFACTS SECTION */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-200 tracking-tight">
          Submitted Artifacts
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Left Card: Whiteboard Diagram */}
          <div className="bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] rounded-2xl p-4 space-y-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-200">
                <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
                <span>Whiteboard Diagram</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                {hasDiagram ? `${elementsCount} elements drawn` : 'Not drawn (Optional)'}
              </span>
            </div>

            {hasDiagram && canvasImage ? (
              <div className="h-44 rounded-xl overflow-hidden bg-[#FEFDF6] flex items-center justify-center border border-slate-700 p-2">
                <img
                  src={canvasImage}
                  alt="Submitted Architecture Diagram"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-44 rounded-xl bg-[var(--bg-surface)]/50 border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center p-4 text-center text-xs text-[var(--text-muted)] gap-2">
                <div className="w-9 h-9 rounded-lg border border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                  <ImageIcon className="w-5 h-5 opacity-60" />
                </div>
                <span className="font-medium text-slate-300">No whiteboard diagram submitted.</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Diagram is optional when written analysis is provided.
                </span>
              </div>
            )}
          </div>

          {/* Right Card: Written Explanation */}
          <div className="bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] rounded-2xl p-4 space-y-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-200">
                <FileText className="w-4 h-4 text-[var(--accent)]" />
                <span>Written Explanation</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                {hasText ? `${wordCount} words` : 'Not typed (Optional)'}
              </span>
            </div>

            <div className="h-44 overflow-y-auto text-xs text-slate-200 p-3.5 bg-[var(--bg-surface)]/70 rounded-xl font-mono whitespace-pre-wrap leading-relaxed border border-[var(--border-subtle)]">
              {hasText ? answerText.trim() : (
                <span className="text-[var(--text-muted)] italic">No written explanation submitted.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. SCORE & FEEDBACK CARD */}
      <div className="bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
        {/* Circular Score Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
              {/* Background Ring */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth="7"
              />
              {/* Progress Arc */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">
                {evaluation.score}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">/10</span>
            </div>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium mt-1">Score</span>
        </div>

        {/* Evaluation Status & Reasoning Text */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--active-nav-bg)] border border-[var(--border-accent)] text-[var(--accent)] text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{evaluation.status}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
            {evaluation.overallFeedback}
          </p>
        </div>
      </div>

      {/* 6. MISSED CONCEPTS CARD */}
      <div className="bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-slate-300">
            <List className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white tracking-wider uppercase">
            MISSED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-1">
          {evaluation.missedConcepts.map((concept, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
              <XCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
              <span className="leading-snug">{concept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. EXPANDABLE MODEL ANSWER CARD */}
      <div className="bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all shadow-sm">
        <button
          type="button"
          onClick={() => setModelAnswerOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[var(--bg-surface)]/50 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-white">Model Answer</span>
          </div>
          <div className="text-[var(--text-muted)]">
            {modelAnswerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {modelAnswerOpen && (
          <div className="p-4 sm:p-5 pt-0 space-y-3 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-accent)]/40 space-y-2.5">
              <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                KEY INSIGHT
              </div>
              <p className="text-xs sm:text-sm text-white leading-relaxed font-medium">
                {evaluation.keyInsight}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                {evaluation.modelAnswer}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 8. EXPANDABLE ASK A DOUBT ASSISTANT */}
      <div className="bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-white">Ask a doubt</span>
          </div>

          {/* Dynamic Suggested Question Chips matching reference image */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar max-w-full">
            {evaluation.suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendDoubt(q)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[var(--active-nav-bg)] hover:bg-[var(--accent)]/20 border border-[var(--border-accent)] text-xs text-[var(--accent)] font-medium transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field matching reference image */}
        <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-accent)]/50 rounded-xl p-1.5 focus-within:border-[var(--accent)] transition-colors">
          <input
            type="text"
            value={doubtInput}
            onChange={(e) => setDoubtInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendDoubt(doubtInput);
            }}
            placeholder="Ask anything about this question..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-[var(--text-muted)] outline-none px-3 py-1"
          />
          <button
            type="button"
            onClick={() => handleSendDoubt(doubtInput)}
            disabled={!doubtInput.trim()}
            className="p-2 rounded-lg bg-[var(--accent)] hover:opacity-90 text-[var(--bg-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity cursor-pointer"
            title="Send question"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Chat Message Stream */}
        {doubtMessages.length > 1 && (
          <div className="max-h-52 overflow-y-auto space-y-2.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
            {doubtMessages.slice(1).map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--active-nav-bg)] border border-[var(--border-accent)] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[var(--accent)] text-[var(--bg-main)] font-medium rounded-tr-none'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-200" />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-[var(--accent)] text-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
                <span>Mentor is formulating answer...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // If in Page Mode: renders directly within main layout, full width, natural scroll, no clipping
  if (isPageMode) {
    return (
      <div className="w-full pb-16 animate-in fade-in duration-200">
        {evaluationDashboardContent}
      </div>
    );
  }

  // If in Modal Mode: uses items-start and max-w-6xl so top is NEVER cut off
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 lg:p-8 flex justify-center items-start">
      <div className="w-full max-w-6xl my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-150">
        {evaluationDashboardContent}
      </div>
    </div>
  );
};
