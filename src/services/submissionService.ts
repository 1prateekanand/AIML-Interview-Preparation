import { Problem } from '../types';
import { INITIAL_PROBLEMS } from '../data/mockData';
import { EvaluationResult, evaluateSubmission } from '../utils/evaluationEngine';
import { getSupabaseClient } from '../lib/supabase';
import { mapSupabaseRowToProblem } from './questionService';

export interface SubmissionRecord {
  id: string; // stable submission_id (e.g. sub-171-1730000000000)
  submission_id: string; // alias for compatibility
  question_id: number; // stable question_id
  problem_id: number; // alias
  question_title: string;
  category: string;
  difficulty?: string;
  answer_text: string;
  canvas_image: string | null;
  elements_count: number;
  submission_type:
    | 'Written Technical Architecture Analysis'
    | 'Architecture Diagram Solution'
    | 'Combined Architecture Diagram & Written Analysis';
  evaluation: EvaluationResult;
  created_at: string;
}

const STORAGE_SUBMISSIONS_KEY = 'codenexus_submissions_v2';
const STORAGE_QUESTIONS_KEY = 'codenexus-problems';

const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // SecurityError or restricted environment
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // SecurityError or restricted environment
  }
  memoryStore[key] = value;
}

/**
 * Retrieves the full master list of questions.
 */
export async function getAllQuestions(): Promise<Problem[]> {
  try {
    const saved = safeGetItem(STORAGE_QUESTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading questions from storage:', err);
  }
  return INITIAL_PROBLEMS;
}

/**
 * Synchronous lookup for a question by ID (from localStorage or INITIAL_PROBLEMS).
 */
export function getQuestionByIdSync(questionId: number | string): Problem | null {
  const numericId = typeof questionId === 'string' ? parseInt(questionId, 10) : questionId;
  if (isNaN(numericId)) return null;

  try {
    const saved = safeGetItem(STORAGE_QUESTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const found = parsed.find((q: Problem) => q.id === numericId || q.number === numericId);
        if (found) return found;
      }
    }
  } catch {
    // Ignore
  }
  return INITIAL_PROBLEMS.find((q) => q.id === numericId || q.number === numericId) || null;
}

/**
 * Retrieves a single question by its stable question_id.
 */
export async function fetchQuestionById(
  questionId: number | string
): Promise<Problem | null> {
  const numericId = typeof questionId === 'string' ? parseInt(questionId, 10) : questionId;
  if (isNaN(numericId)) return null;

  const allQuestions = await getAllQuestions();
  const found = allQuestions.find((q) => q.id === numericId || q.number === numericId);
  if (found) return found;

  // Direct Supabase lookup fallback
  try {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client.from('questions').select('*').eq('id', numericId).maybeSingle();
      if (!error && data) {
        return mapSupabaseRowToProblem(data, 0);
      }
    }
  } catch (err) {
    console.warn('Direct Supabase question lookup failed:', err);
  }

  return null;
}

/**
 * Retrieves all stored submissions.
 */
export function getStoredSubmissions(): SubmissionRecord[] {
  try {
    const raw = safeGetItem(STORAGE_SUBMISSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading submissions:', err);
  }
  return [];
}

/**
 * Retrieves a submission record by its unique submission_id.
 */
export async function fetchSubmissionById(
  submissionId: string
): Promise<SubmissionRecord | null> {
  const submissions = getStoredSubmissions();
  const found = submissions.find(
    (s) => s.id === submissionId || s.submission_id === submissionId
  );
  return found || null;
}

/**
 * Retrieves the latest submission for a specific question_id.
 */
export async function fetchLatestSubmissionForQuestion(
  questionId: number | string
): Promise<SubmissionRecord | null> {
  const numericId = typeof questionId === 'string' ? parseInt(questionId, 10) : questionId;
  const submissions = getStoredSubmissions();
  const matches = submissions.filter((s) => s.question_id === numericId);
  if (matches.length === 0) return null;
  // Return most recent
  return matches[matches.length - 1];
}

/**
 * Persists a new submission record associated with the stable question_id.
 */
export async function createSubmission(
  question: Problem,
  answerText: string,
  canvasImage: string | null,
  elementsCount: number
): Promise<SubmissionRecord> {
  const submissionId = `sub-${question.id}-${Date.now()}`;
  const evaluation = evaluateSubmission(question, answerText, canvasImage, elementsCount);

  const hasDiagram = elementsCount > 0 && !!canvasImage;
  const hasText = answerText.trim().length > 0;
  const submissionType =
    hasDiagram && hasText
      ? 'Combined Architecture Diagram & Written Analysis'
      : hasDiagram
      ? 'Architecture Diagram Solution'
      : 'Written Technical Architecture Analysis';

  const record: SubmissionRecord = {
    id: submissionId,
    submission_id: submissionId,
    question_id: question.id,
    problem_id: question.id,
    question_title: question.title,
    category: question.category,
    difficulty: question.difficulty,
    answer_text: answerText,
    canvas_image: canvasImage,
    elements_count: elementsCount,
    submission_type: submissionType,
    evaluation,
    created_at: new Date().toISOString(),
  };

  try {
    const current = getStoredSubmissions();
    const updated = [...current.filter((s) => s.id !== submissionId), record];
    safeSetItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(updated));

    // Also persist quick pointers
    safeSetItem(`codenexus-eval-${question.id}`, JSON.stringify(evaluation));
    safeSetItem('codenexus-active-submission-id', submissionId);
    safeSetItem('codenexus-active-problem-id', String(question.id));
  } catch (err) {
    console.error('Error persisting submission record:', err);
  }

  return record;
}
