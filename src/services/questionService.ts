import { getSupabaseClient, isSupabaseConfigured, getSupabaseUrl } from '../lib/supabase';
import { Problem, Difficulty, ProblemStatus } from '../types';
import { CATEGORIES_LIST, AimCategory } from '../data/categories';
import { INITIAL_PROBLEMS } from '../data/mockData';

const CACHE_KEY = 'codenexus-problems';
const CACHE_TIMESTAMP_KEY = 'codenexus-problems-timestamp';
const CACHE_SOURCE_KEY = 'codenexus-problems-source';

export interface FetchResult {
  problems: Problem[];
  totalCount: number;
  isDatabaseBacked: boolean;
  error?: string;
  source: 'supabase' | 'cache' | 'local_fallback';
}

/**
 * Normalizes any category string or slug into one of the 11 official CodeNexus categories.
 */
export function resolveCategory(rawCategory?: string | null): { name: string; slug: string } {
  if (!rawCategory) {
    return { name: 'ML Fundamentals', slug: 'ml-fundamentals' };
  }

  const clean = rawCategory.trim();
  const lower = clean.toLowerCase();

  // 1. Exact match by category ID/slug
  const byId = CATEGORIES_LIST.find((c) => c.id.toLowerCase() === lower);
  if (byId) return { name: byId.name, slug: byId.id };

  // 2. Exact match by category Name
  const byName = CATEGORIES_LIST.find((c) => c.name.toLowerCase() === lower);
  if (byName) return { name: byName.name, slug: byName.id };

  // 3. Keyword / partial matching
  if (lower.includes('deep learning') || lower.includes('nlp') || lower.includes('vision') || lower.includes('cnn') || lower.includes('rnn') || lower.includes('transformer')) {
    return { name: 'Deep Learning, NLP & Vision', slug: 'deep-learning' };
  }
  if (lower.includes('agent') || lower.includes('agentic') || lower.includes('tool use') || lower.includes('react framework')) {
    return { name: 'AI Agents & Agentic AI', slug: 'ai-agents' };
  }
  if (lower.includes('rag') || lower.includes('retrieval') || lower.includes('vector') || lower.includes('embedding') || lower.includes('chunking')) {
    return { name: 'RAG & Retrieval', slug: 'rag-retrieval' };
  }
  if (lower.includes('llm') || lower.includes('prompt') || lower.includes('fine-tun') || lower.includes('lora') || lower.includes('tokeniz')) {
    return { name: 'LLM Foundations & Customization', slug: 'llm-foundations' };
  }
  if (lower.includes('eval') || lower.includes('metric') || lower.includes('benchmark') || lower.includes('rouge') || lower.includes('bleu')) {
    return { name: 'Evaluation & Metrics', slug: 'eval-metrics' };
  }
  if (lower.includes('safety') || lower.includes('guardrail') || lower.includes('governance') || lower.includes('red team') || lower.includes('moderation') || lower.includes('jailbreak')) {
    return { name: 'Safety, Guardrails & Governance', slug: 'safety-governance' };
  }
  if (lower.includes('mlops') || lower.includes('llmops') || lower.includes('monitor') || lower.includes('pipeline') || lower.includes('drift')) {
    return { name: 'MLOps, LLMOps & Monitoring', slug: 'mlops-monitoring' };
  }
  if (lower.includes('inference') || lower.includes('serving') || lower.includes('kv cache') || lower.includes('quantiz') || lower.includes('vllm') || lower.includes('tensorrt')) {
    return { name: 'Inference & Serving', slug: 'inference-serving' };
  }
  if (lower.includes('system design') || lower.includes('architecture') || lower.includes('distributed') || lower.includes('scale') || lower.includes('cluster')) {
    return { name: 'System Design & Architecture', slug: 'system-design' };
  }
  if (lower.includes('coding') || lower.includes('algorithm') || lower.includes('data structure') || lower.includes('python') || lower.includes('leetcode')) {
    return { name: 'Coding & Problem-Solving', slug: 'coding-problems' };
  }
  if (lower.includes('fundamental') || lower.includes('statistic') || lower.includes('math') || lower.includes('regression') || lower.includes('classification')) {
    return { name: 'ML Fundamentals', slug: 'ml-fundamentals' };
  }

  // Fallback slugification
  const slug = lower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'ml-fundamentals';
  return { name: clean, slug };
}

/**
 * Normalizes raw difficulty string to 'Easy' | 'Medium' | 'Hard'.
 */
export function normalizeDifficulty(raw?: string | null): Difficulty {
  if (!raw) return 'Medium';
  const lower = raw.trim().toLowerCase();
  if (lower === 'easy') return 'Easy';
  if (lower === 'hard') return 'Hard';
  return 'Medium';
}

/**
 * Normalizes requirements field from raw DB record.
 */
function parseRequirements(raw: any, description?: string): string[] | undefined {
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((r) => String(r).trim()).filter(Boolean);
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((r) => String(r).trim()).filter(Boolean);
    } catch {
      // Split by newlines or bullets
      const lines = raw.split(/\r?\n/).map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim()).filter(Boolean);
      if (lines.length > 0) return lines;
    }
  }

  // If description has bullet points, extract them
  if (description && (description.includes('\n-') || description.includes('\n•') || description.includes('\n*'))) {
    const lines = description.split(/\r?\n/)
      .filter((l) => /^[-*•]/.test(l.trim()))
      .map((l) => l.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }

  return undefined;
}

/**
 * Normalizes tags field from raw DB record.
 */
function parseTags(rawTags: any, subcategory?: string | null, categoryName?: string): string[] {
  if (Array.isArray(rawTags) && rawTags.length > 0) {
    return rawTags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof rawTags === 'string' && rawTags.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim()).filter(Boolean);
    } catch {
      const list = rawTags.split(/[,;|]/).map((t) => t.trim()).filter(Boolean);
      if (list.length > 0) return list;
    }
  }

  const generated: string[] = [];
  if (subcategory && subcategory.trim()) {
    generated.push(subcategory.trim());
  }
  if (categoryName) {
    generated.push(categoryName.split(',')[0].trim());
  }
  return generated.length > 0 ? generated : ['Architecture', 'Engineering'];
}

/**
 * Resolves the primary question title / heading following the exact fallback specification:
 * 1. If `heading` contains a valid value, display it.
 * 2. If `heading` is NULL, empty, or whitespace, use a meaningful fallback derived from question data
 *    if possible (e.g., first sentence or summary of question_text).
 * 3. If no meaningful fallback is available, display `Question #<source_question_number>`.
 * 4. Never display `undefined`, `null`, or an empty title.
 */
export function resolveQuestionTitle(row: any, fallbackNumber: number): string {
  // 1. If `heading` contains a valid value, display it
  if (row && row.heading && typeof row.heading === 'string') {
    const cleanHeading = row.heading.trim();
    if (
      cleanHeading.length > 0 &&
      cleanHeading.toLowerCase() !== 'null' &&
      cleanHeading.toLowerCase() !== 'undefined'
    ) {
      return cleanHeading;
    }
  }

  // Check alias title fields if valid and not a generic placeholder
  if (row && row.title && typeof row.title === 'string') {
    const cleanTitle = row.title.trim();
    if (
      cleanTitle.length > 0 &&
      cleanTitle.toLowerCase() !== 'null' &&
      cleanTitle.toLowerCase() !== 'undefined' &&
      !cleanTitle.toLowerCase().startsWith('question #')
    ) {
      return cleanTitle;
    }
  }
  if (row && row.question_title && typeof row.question_title === 'string') {
    const clean = row.question_title.trim();
    if (clean.length > 0 && clean.toLowerCase() !== 'null' && clean.toLowerCase() !== 'undefined') {
      return clean;
    }
  }
  if (row && row.name && typeof row.name === 'string') {
    const clean = row.name.trim();
    if (clean.length > 0 && clean.toLowerCase() !== 'null' && clean.toLowerCase() !== 'undefined') {
      return clean;
    }
  }

  // 2. Meaningful fallback derived from question data (first sentence or summary of question_text)
  const fullText = (
    row?.question_text ||
    row?.description ||
    row?.problem_statement ||
    row?.statement ||
    row?.prompt ||
    row?.content ||
    row?.details ||
    ''
  ).trim();

  if (
    fullText.length > 0 &&
    fullText.toLowerCase() !== 'null' &&
    fullText.toLowerCase() !== 'undefined'
  ) {
    // Extract first sentence up to 90-100 characters
    const sentenceMatch = fullText.match(/^([^.?!\n\r]+[.?!]?)/);
    let candidate = (sentenceMatch ? sentenceMatch[1] : fullText).trim();

    // Strip leading markdown headers (###), bullet markers (-, *, •), or numbers (1., 2.)
    candidate = candidate.replace(/^#+\s*/, '').replace(/^[-*•\d.]+\s*/, '').trim();

    if (candidate.length > 95) {
      const truncated = candidate.slice(0, 90);
      const lastSpace = truncated.lastIndexOf(' ');
      candidate = (lastSpace > 30 ? truncated.slice(0, lastSpace) : truncated) + '...';
    }

    if (candidate.length >= 5) {
      return candidate;
    }
  }

  // 3. Fallback to Question #<source_question_number>
  const srcNumber = row?.source_question_number ?? row?.number ?? row?.id ?? fallbackNumber;
  if (srcNumber !== undefined && srcNumber !== null && String(srcNumber).trim().length > 0) {
    return `Question #${String(srcNumber).trim()}`;
  }

  // 4. Never display undefined, null, or empty string
  return `Question #${fallbackNumber}`;
}

/**
 * Converts a raw Supabase `public.questions` database record into the app's `Problem` interface.
 */
export function mapSupabaseRowToProblem(row: any, index: number): Problem {
  // Safe numeric ID
  let numericId = typeof row.id === 'number' ? row.id : parseInt(String(row.id), 10);
  if (isNaN(numericId) || numericId <= 0) {
    numericId = index + 1;
  }

  // Source question number from database column source_question_number
  const rawSrcNum = row.source_question_number;
  const sourceQuestionNumber = typeof rawSrcNum === 'number'
    ? rawSrcNum
    : (typeof rawSrcNum === 'string' && !isNaN(parseInt(rawSrcNum, 10))
      ? parseInt(rawSrcNum, 10)
      : undefined);

  const questionNumber = sourceQuestionNumber ?? (typeof row.number === 'number'
    ? row.number
    : (typeof row.question_number === 'number' ? row.question_number : numericId));

  // Resolved Question Title following fallback specification
  const title = resolveQuestionTitle(row, questionNumber);

  // Raw heading from database if present
  const heading = row.heading && typeof row.heading === 'string' && row.heading.trim().length > 0
    ? row.heading.trim()
    : undefined;

  // Complete Question Description / Statement (prioritizing question_text from public.questions)
  const description = (
    row.question_text ||
    row.description ||
    row.problem_statement ||
    row.statement ||
    row.prompt ||
    row.content ||
    row.details ||
    ''
  ).trim();

  // Category & Subcategory
  const rawCat = row.category || row.category_name || row.domain || row.topic || '';
  const { name: categoryName, slug: categorySlug } = resolveCategory(rawCat);

  // Nullable subcategory
  const subcategory = row.subcategory && typeof row.subcategory === 'string' && row.subcategory.trim().length > 0
    ? row.subcategory.trim()
    : null;

  // Difficulty
  const difficulty = normalizeDifficulty(row.difficulty || row.level);

  // Requirements & Tags
  const requirements = parseRequirements(row.requirements || row.constraints, description);
  const tags = parseTags(row.tags, subcategory, categoryName);

  // Success rate & companies
  const successRate = row.success_rate || row.successRate || `${Math.floor(45 + (numericId % 40))}.${numericId % 9}%`;
  const companies = Array.isArray(row.companies)
    ? row.companies
    : (typeof row.companies === 'string' ? row.companies.split(',').map((c: string) => c.trim()) : undefined);

  const status: ProblemStatus = (row.status === 'Solved' || row.status === 'Attempted')
    ? row.status
    : 'Todo';

  return {
    id: numericId,
    number: questionNumber,
    sourceQuestionNumber,
    heading,
    questionText: row.question_text || description,
    batchId: row.batch_id,
    duplicateGroupId: row.duplicate_group_id,
    duplicateType: row.duplicate_type,
    title,
    difficulty,
    category: categoryName,
    categorySlug,
    categoryName,
    subcategory,
    tags,
    successRate,
    status,
    description,
    requirements,
    companies,
    markedForReview: Boolean(row.marked_for_review || row.markedForReview),
  };
}

/**
 * Loads cached problems from localStorage if available.
 */
export function getCachedProblems(): { problems: Problem[] | null; source: 'supabase' | 'local_fallback' | null } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Try current cache key
      let raw = window.localStorage.getItem(CACHE_KEY);
      let source = window.localStorage.getItem(CACHE_SOURCE_KEY) as any;

      // Fallback to legacy cache key if present
      if (!raw) {
        raw = window.localStorage.getItem('codenexus-problems');
        source = (window.localStorage.getItem('codenexus-problems-source') as any) || source;
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Re-validate and upgrade titles if any had stale generic Question # titles
          const upgraded: Problem[] = parsed.map((p: any, idx: number) => {
            if (!p.title || p.title.toLowerCase().startsWith('question #')) {
              const freshTitle = resolveQuestionTitle(p, p.number || idx + 1);
              return { ...p, title: freshTitle };
            }
            return p;
          });
          return { problems: upgraded, source: source || 'local_fallback' };
        }
      }
    }
  } catch {
    // Ignore
  }
  return { problems: null, source: null };
}

/**
 * Saves problems to localStorage for high-speed offline / reload availability.
 */
export function setCachedProblems(problems: Problem[], source: 'supabase' | 'local_fallback'): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const serialized = JSON.stringify(problems);
      window.localStorage.setItem(CACHE_KEY, serialized);
      window.localStorage.setItem('codenexus-problems', serialized);
      window.localStorage.setItem(CACHE_SOURCE_KEY, source);
      window.localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
    }
  } catch (err) {
    console.warn('Storage quota exceeded or storage unavailable for problem cache:', err);
  }
}

/**
 * Fetches all questions from the connected Supabase database using batch pagination
 * to seamlessly handle 6,430+ records without hitting Supabase's default 1,000-row limit.
 *
 * If credentials are not yet supplied or query fails, falls back gracefully to
 * offline/mock data without disrupting user experience.
 */
export async function fetchQuestions(
  onProgress?: (loaded: number, totalEstimate: number) => void
): Promise<FetchResult> {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    const cached = getCachedProblems();
    if (cached.problems && cached.problems.length > INITIAL_PROBLEMS.length) {
      return {
        problems: cached.problems,
        totalCount: cached.problems.length,
        isDatabaseBacked: true,
        source: 'cache',
      };
    }
    return {
      problems: INITIAL_PROBLEMS,
      totalCount: INITIAL_PROBLEMS.length,
      isDatabaseBacked: false,
      source: 'local_fallback',
      error: 'Supabase publishable key not configured. Showing default question bank.',
    };
  }

  try {
    const PAGE_SIZE = 1000;
    let from = 0;
    let allFetchedRows: any[] = [];
    let totalEstimated = 6430;

    // First, let's probe count
    const { count, error: countError } = await client
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (!countError && typeof count === 'number') {
      totalEstimated = count;
    }

    while (true) {
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await client
        .from('questions')
        .select('*')
        .order('id', { ascending: true })
        .range(from, to);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        break;
      }

      allFetchedRows = allFetchedRows.concat(data);
      if (onProgress) {
        onProgress(allFetchedRows.length, totalEstimated);
      }

      // If returned batch is less than PAGE_SIZE, we reached the end
      if (data.length < PAGE_SIZE) {
        break;
      }

      from += PAGE_SIZE;

      // Safety guard against infinite loops
      if (from > 50000) break;
    }

    if (allFetchedRows.length === 0) {
      return {
        problems: INITIAL_PROBLEMS,
        totalCount: INITIAL_PROBLEMS.length,
        isDatabaseBacked: false,
        source: 'local_fallback',
        error: 'Table `questions` returned 0 rows. Showing default question bank.',
      };
    }

    // Map rows to Problem interface
    const mappedProblems: Problem[] = allFetchedRows.map((row, idx) =>
      mapSupabaseRowToProblem(row, idx)
    );

    // Cache to localStorage
    setCachedProblems(mappedProblems, 'supabase');

    return {
      problems: mappedProblems,
      totalCount: mappedProblems.length,
      isDatabaseBacked: true,
      source: 'supabase',
    };
  } catch (err: any) {
    console.error('Error fetching questions from Supabase:', err);

    // Fall back to cache or initial problems
    const cached = getCachedProblems();
    if (cached.problems && cached.problems.length > 0) {
      return {
        problems: cached.problems,
        totalCount: cached.problems.length,
        isDatabaseBacked: cached.source === 'supabase',
        source: 'cache',
        error: err?.message || 'Database connection error. Using local cache.',
      };
    }

    return {
      problems: INITIAL_PROBLEMS,
      totalCount: INITIAL_PROBLEMS.length,
      isDatabaseBacked: false,
      source: 'local_fallback',
      error: err?.message || 'Failed to fetch from Supabase. Using fallback questions.',
    };
  }
}
