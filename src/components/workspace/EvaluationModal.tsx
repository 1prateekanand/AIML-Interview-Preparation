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

interface EvaluationModalProps {
  problem?: Problem | null;
  questionId?: number | string | null;
  submissionId?: string | null;
  canvasImage?: string | null;
  answerText?: string;
  elementsCount?: number;
  evaluation?: EvaluationResult | null;
  onClose: () => void;
  onConfirmSolved?: () => void;
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

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-[#050c19] border border-cyan-500/30 rounded-2xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#00f2fe]" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide">
            Loading Question & Evaluation...
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Retrieving question metadata, architecture requirements, and submission verification records.
          </p>
        </div>
      </div>
    );
  }

  // ERROR OR QUESTION UNAVAILABLE
  if (!problem || !evaluation) {
    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-[#050c19] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Question Unavailable</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {errorMessage || 'Unable to load the question record for this evaluation.'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg transition-colors"
          >
            Return to Questions
          </button>
        </div>
      </div>
    );
  }

  const handleSendDoubt = (text: string) => {
    if (!text.trim()) return;

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

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#050c19] border border-cyan-500/25 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 text-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* DYNAMIC PAGE HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3 min-w-0">
            {/* Teal document icon inside cyan square */}
            <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/15 border border-[#00f2fe]/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#00f2fe]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Architecture Solution Evaluation
              </h2>
              {/* Dynamically populated subtitle: Question Title · Category */}
              <p className="text-xs text-slate-400 truncate">
                {problem.title} · {problem.category}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
            title="Close evaluation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DEDICATED QUESTION DETAILS SECTION */}
        <div className="bg-[#071326]/85 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Question:
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

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Category:</span>
            <span className="text-cyan-300 font-semibold">{problem.category}</span>
            {problem.subcategory && (
              <>
                <span>·</span>
                <span>Subcategory:</span>
                <span className="text-sky-300 font-semibold">{problem.subcategory}</span>
              </>
            )}
            {problem.difficulty && (
              <>
                <span>·</span>
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
              <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Requirements & Constraints:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-1 leading-relaxed">
                  {requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>

        {/* SUBMISSION RECEIVED STATUS PILL */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs sm:text-sm text-cyan-300">
          <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-medium">
            Submission received: {evaluation.submissionType}
          </span>
        </div>

        {/* SUBMITTED ARTIFACTS SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
            Submitted Artifacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Left Card: Whiteboard Diagram */}
            <div className="bg-[#071326]/70 border border-slate-800/90 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Whiteboard Diagram</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {hasDiagram ? `${elementsCount} elements drawn` : 'Not drawn (Optional)'}
                </span>
              </div>

              {hasDiagram && canvasImage ? (
                <div className="h-32 rounded-xl overflow-hidden bg-[#FEFDF6] flex items-center justify-center border border-slate-700">
                  <img
                    src={canvasImage}
                    alt="Submitted Architecture Diagram"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-32 rounded-xl bg-[#030814]/70 border border-slate-800/80 flex flex-col items-center justify-center p-3 text-center text-xs text-slate-500 gap-1.5">
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                  <span className="font-medium text-slate-400">No whiteboard diagram submitted.</span>
                  <span className="text-[10px] text-slate-500">
                    Diagram is optional when written analysis is provided.
                  </span>
                </div>
              )}
            </div>

            {/* Right Card: Written Explanation */}
            <div className="bg-[#071326]/70 border border-slate-800/90 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Written Explanation</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {hasText ? `${wordCount} words` : 'Not typed (Optional)'}
                </span>
              </div>

              <div className="h-32 overflow-y-auto text-xs text-slate-200 p-3 bg-[#030814] rounded-xl font-mono whitespace-pre-wrap leading-relaxed border border-slate-800/60">
                {hasText ? answerText.trim() : (
                  <span className="text-slate-500 italic">No written explanation submitted.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SCORE & FEEDBACK CARD */}
        <div className="bg-[#071326]/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
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
                  stroke="#00f2fe"
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
                <span className="text-[11px] text-slate-400 font-medium">/10</span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium mt-1">Score</span>
          </div>

          {/* Evaluation Status & Reasoning Text */}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/60 text-cyan-300 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{evaluation.status}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {evaluation.overallFeedback}
            </p>
          </div>
        </div>

        {/* MISSED CONCEPTS CARD */}
        <div className="bg-[#071326]/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-slate-700 bg-slate-800/60 flex items-center justify-center text-slate-300">
              <List className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Missed
            </span>
          </div>

          <div className="space-y-2.5">
            {evaluation.missedConcepts.map((concept, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* EXPANDABLE MODEL ANSWER CARD */}
        <div className="bg-[#071326]/70 border border-slate-800/90 rounded-2xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setModelAnswerOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Model Answer</span>
            </div>
            <div className="text-slate-400">
              {modelAnswerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {modelAnswerOpen && (
            <div className="p-4 pt-0 space-y-2.5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-[#030814]/90 border border-cyan-500/25 space-y-2">
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Key Insight
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {evaluation.keyInsight}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                  {evaluation.modelAnswer}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* EXPANDABLE ASK A DOUBT ASSISTANT */}
        <div className="bg-[#071326]/70 border border-slate-800/90 rounded-2xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setDoubtOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Ask a doubt</span>
            </div>
            <div className="text-slate-400">
              {doubtOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {doubtOpen && (
            <div className="p-4 pt-0 space-y-3 animate-in fade-in duration-150">
              {/* Dynamic Suggested Question Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {evaluation.suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendDoubt(q)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#030814] hover:bg-[#071830] border border-cyan-500/30 text-xs text-cyan-200 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div className="h-44 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {doubtMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-cyan-600 text-white rounded-tr-none'
                          : 'bg-[#030814] border border-slate-800 text-slate-200 rounded-tl-none'
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
                  <div className="flex items-center gap-2 text-cyan-300 text-xs">
                    <Sparkles className="w-3 h-3 animate-spin text-cyan-400" />
                    <span>Mentor is formulating answer...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Field */}
              <div className="flex items-center gap-2 bg-[#030814] border border-slate-800 rounded-xl p-1.5 focus-within:border-cyan-500">
                <input
                  type="text"
                  value={doubtInput}
                  onChange={(e) => setDoubtInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendDoubt(doubtInput);
                  }}
                  placeholder="Ask anything about this question..."
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 outline-none px-2"
                />
                <button
                  type="button"
                  onClick={() => handleSendDoubt(doubtInput)}
                  disabled={!doubtInput.trim()}
                  className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
