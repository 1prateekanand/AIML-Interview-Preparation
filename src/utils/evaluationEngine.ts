import { Problem } from '../types';

export interface EvaluationResult {
  submissionId: string;
  problemId: number;
  questionTitle: string;
  category: string;
  score: number; // out of 10
  status: 'Incomplete' | 'Developing' | 'Proficient' | 'Strong Hire';
  submissionType:
    | 'Written Technical Architecture Analysis'
    | 'Architecture Diagram Solution'
    | 'Combined Architecture Diagram & Written Analysis';
  overallFeedback: string;
  missedConcepts: string[];
  keyInsight: string;
  modelAnswer: string;
  suggestedQuestions: string[];
  evaluatedAt: string;
}

interface QuestionEvaluationKnowledge {
  keyInsight: string;
  modelAnswer: string;
  requiredConcepts: string[];
  suggestedQuestions: string[];
}

/**
 * Domain-specific architectural knowledge base for problems across all 11 categories.
 */
const QUESTION_KNOWLEDGE_BASE: Record<string, QuestionEvaluationKnowledge> = {
  // AI Agents - ReAct Pattern Loop
  'react-pattern-loop': {
    keyInsight:
      'The ReAct pattern alternates between Thought (reasoning), Action (tool selection & argument generation), and Observation (tool output ingestion) to prevent hallucinated execution and ground reasoning in external environments.',
    modelAnswer:
      'A robust ReAct execution engine implements a cyclic state machine: (1) Prompt formatting with tool schemas and execution history; (2) Model generation of a Thought trace explaining intent; (3) Strict regex or JSON parsing of the Action and arguments; (4) Safe sandboxed tool execution catching timeouts and exceptions; (5) Appending the Observation back into context; and (6) Halting upon a Final Answer action or when reaching maximum iteration depth to prevent infinite loops.',
    requiredConcepts: [
      'Thought-Action-Observation loop cycle mechanics',
      'Structured tool schema parsing and argument validation',
      'Observation injection into conversation context buffer',
      'Infinite loop termination guards and maximum step limits',
    ],
    suggestedQuestions: [
      'Loop termination & infinite loop guards?',
      'Thought parsing failure fallbacks?',
      'Tool error observation injection?',
    ],
  },

  // RAG & Retrieval - Vector DB / Namespaces / Cosine
  'pinecone-namespaces': {
    keyInsight:
      'Namespaces in Pinecone and modern vector databases are logical partitions within an index that isolate data, allowing queries to search only within a specified namespace. They enable multi-tenant or environment separation without extra cluster cost.',
    modelAnswer:
      'Namespaces partition vector collections logically without requiring dedicated hardware or multi-index overhead. Queries explicitly target a namespace, bounding the Approximate Nearest Neighbor (ANN) search graph (HNSW/IVF) to that tenant. This guarantees tenant data isolation, zero cross-tenant contamination, and sub-millisecond routing while sharing underlying index replicas and compaction workers.',
    requiredConcepts: [
      'Namespaces are logical partitions within an index',
      'Queries are strictly limited to a specified namespace',
      'Use cases include multi-tenancy, dev/prod separation, and user-level organization',
      'Zero extra cluster cost compared to spinning up dedicated physical indexes',
    ],
    suggestedQuestions: [
      'Cross-namespace querying latency?',
      'Metadata filtering vs namespaces?',
      'Tenant isolation & quota limits?',
    ],
  },

  // System Design - Scalable Server Architecture
  'scalable-server-architecture': {
    keyInsight:
      'A resilient web architecture decouples stateless compute behind Anycast DNS and Layer-7 Load Balancers from partitioned stateful tiers utilizing multi-tier Redis caching and primary-replica database replication.',
    modelAnswer:
      'High-traffic server architecture relies on defense in depth: (1) Cloudflare Anycast CDN for static asset caching, DDoS mitigation, and SSL termination; (2) Layer-7 Load Balancer (ALB / Nginx) routing traffic across auto-scaling EC2/Kubernetes stateless microservice pods; (3) Redis Cluster for distributed session state, rate-limiting tokens, and hot catalog cache using Cache-Aside invalidation; (4) Multi-AZ PostgreSQL primary for ACID writes with asynchronous read replicas; and (5) Asynchronous Kafka message queues for deferred write bursts and event streaming.',
    requiredConcepts: [
      'Layer 7 Load Balancer distribution across stateless app pools',
      'Multi-tier caching (Edge CDN + In-Memory Redis Cluster)',
      'Primary-replica database replication with connection pooling',
      'Asynchronous message queuing (Kafka/SQS) for spike leveling and fault isolation',
    ],
    suggestedQuestions: [
      'Expected traffic & peak QPS bounds?',
      'Cache invalidation & stampede guards?',
      'Database replication & failover RTO?',
    ],
  },

  // Deep Learning - Multi-Head Attention
  'multi-head-attention': {
    keyInsight:
      'Multi-Head Attention projects Queries, Keys, and Values into multiple lower-dimensional subspaces, allowing the model to jointly attend to information from different representation positions and semantic contexts.',
    modelAnswer:
      'Multi-head attention applies learned linear projections W_q, W_k, W_v of dimension (d_model, d_k * h). The projections are split into h heads. For each head, Scaled Dot-Product Attention computes Softmax((Q * K^T) / sqrt(d_k) + M) * V, where M is an optional causal mask. The head outputs are concatenated and projected through W_o. Scaling by sqrt(d_k) is critical to prevent dot-product magnitude growth that pushes softmax into regions with vanishing gradients.',
    requiredConcepts: [
      'Linear projections of Q, K, V into h distinct representation heads',
      'Scaled dot-product attention formula with 1/sqrt(d_k) normalization',
      'Causal masking for autoregressive sequence modeling',
      'Head concatenation and final output linear projection layer',
    ],
    suggestedQuestions: [
      'Softmax temperature scaling & gradient saturation?',
      'KV cache memory footprint during autoregressive decoding?',
      'FlashAttention kernel tiling optimizations?',
    ],
  },

  // ML Fundamentals - Bias-Variance Tradeoff
  'bias-variance-tradeoff': {
    keyInsight:
      'Expected generalization error decomposes into Bias^2 (underfitting due to erroneous assumptions), Variance (overfitting due to sensitivity to training fluctuations), and Irreducible Error (inherent noise).',
    modelAnswer:
      'The expected MSE of an estimator decomposes as E[(y - f_hat(x))^2] = Bias(f_hat(x))^2 + Var(f_hat(x)) + sigma^2. High-bias models (e.g. linear regression on nonlinear data) exhibit high training and testing error. High-variance models (e.g. unconstrained deep decision trees) memorize training noise. Optimal generalization occurs at the sweet spot, typically achieved via regularization (L1/L2), ensemble averaging (bagging/random forests), or cross-validation.',
    requiredConcepts: [
      'Mathematical decomposition: Expected Error = Bias^2 + Variance + Irreducible Noise',
      'Underfitting vs Overfitting dynamics relative to model capacity',
      'Regularization strategies (L1/L2 penalties, dropout, pruning)',
      'Cross-validation techniques for hyperparameter selection',
    ],
    suggestedQuestions: [
      'Ensemble methods impact on bias vs variance?',
      'Double descent phenomenon in modern overparameterized models?',
      'L1 vs L2 regularization trade-offs?',
    ],
  },
};

/**
 * Helper to match problem to specialized knowledge or synthesize dynamic domain knowledge.
 */
function getKnowledgeForProblem(problem: Problem): QuestionEvaluationKnowledge {
  const title = (problem.title || '').toLowerCase();
  const slug = (problem.categorySlug || '').toLowerCase();
  const cat = (problem.category || '').toLowerCase();

  if (title.includes('react pattern') || (title.includes('agent') && title.includes('loop'))) {
    return QUESTION_KNOWLEDGE_BASE['react-pattern-loop'];
  }
  if (title.includes('namespace') || title.includes('pinecone') || (title.includes('vector') && title.includes('database'))) {
    return QUESTION_KNOWLEDGE_BASE['pinecone-namespaces'];
  }
  if (title.includes('scalable server') || (title.includes('architecture') && title.includes('server'))) {
    return QUESTION_KNOWLEDGE_BASE['scalable-server-architecture'];
  }
  if (title.includes('multi-head') || title.includes('attention')) {
    return QUESTION_KNOWLEDGE_BASE['multi-head-attention'];
  }
  if (title.includes('bias-variance') || title.includes('tradeoff')) {
    return QUESTION_KNOWLEDGE_BASE['bias-variance-tradeoff'];
  }

  // Synthesize dynamic topic-specific knowledge based on category and title
  if (cat.includes('rag') || cat.includes('retrieval')) {
    return {
      keyInsight: `Effective retrieval in ${problem.title} balances indexing throughput, semantic density, and candidate filtering to maintain sub-50ms latency while avoiding context poisoning.`,
      modelAnswer: `For ${problem.title}, construct a two-tier retrieval pipeline: (1) Hybrid dense-sparse search combining HNSW vector indexes with BM25 keyword matching via Reciprocal Rank Fusion (RRF); (2) Cross-encoder reranking to re-score the top 50 candidates; and (3) Contextual compression and deduplication before assembling the final prompt context window.`,
      requiredConcepts: [
        `Vector indexing strategy and similarity metric suitable for ${problem.title}`,
        'Hybrid search or reciprocal rank fusion to balance semantic and exact matches',
        'Latency budgeting and candidate reranking considerations',
        'Context window budgeting and hallucination reduction measures',
      ],
      suggestedQuestions: [
        'ANN search indexing (HNSW vs IVF) trade-offs?',
        'Reranker latency vs precision impact?',
        'Context window chunk overlap optimization?',
      ],
    };
  }

  if (cat.includes('agent') || cat.includes('agentic')) {
    return {
      keyInsight: `Autonomous agent architectures for ${problem.title} require strict separation of observation parsing, structured tool calling, and long-term memory retrieval to maintain deterministic control.`,
      modelAnswer: `Implement a resilient agent workflow for ${problem.title}: define explicit JSON schemas for tool invocations; execute actions inside sandboxed environments; feed structured observations back into working memory; and incorporate reflection checks (self-correction or critique) before presenting the terminal answer.`,
      requiredConcepts: [
        `Core control loop and decision architecture for ${problem.title}`,
        'Structured tool definitions, parameter validation, and error recovery',
        'Short-term conversational buffer vs long-term external memory indexing',
        'Guardrails for self-correction and execution boundaries',
      ],
      suggestedQuestions: [
        'Tool schema validation and recovery strategies?',
        'Multi-agent consensus vs single-agent reflection?',
        'Memory indexing and state serialization?',
      ],
    };
  }

  if (cat.includes('system design') || cat.includes('architecture')) {
    return {
      keyInsight: `Designing ${problem.title} requires explicit decoupling of high-throughput stateless compute from partitioned, durable storage tiers, using caching and asynchronous queues to absorb peak traffic.`,
      modelAnswer: `Architect ${problem.title} with multi-layered redundancy: DNS Anycast and Layer 7 Load Balancing distribute incoming traffic across auto-scaled microservices; Redis Cluster provides microsecond session caching; write operations commit to partitioned relational or document stores with read replicas; and Kafka topics buffer event-driven background tasks.`,
      requiredConcepts: [
        `Component decomposition and protocol interfaces for ${problem.title}`,
        'Traffic routing, load balancing, and horizontal auto-scaling',
        'Data persistence, sharding, and replication consistency guarantees',
        'Fault isolation, circuit breaking, and disaster recovery strategies',
      ],
      suggestedQuestions: [
        'Expected peak QPS and read/write ratios?',
        'Data consistency (CP vs AP) trade-offs?',
        'Disaster recovery RTO and RPO targets?',
      ],
    };
  }

  // Default dynamic synthesizer for ML / LLM / Evaluation / Coding categories
  return {
    keyInsight: `Solving ${problem.title} requires rigorous analysis of algorithmic complexity, mathematical edge cases, and computational stability under production constraints.`,
    modelAnswer: `For ${problem.title}, formulate the mathematical or algorithmic invariant explicitly. Validate input constraints, handle boundary conditions (zero-length, NaN, scale variance), optimize space/time trade-offs, and implement numerical stability safeguards.`,
    requiredConcepts: [
      `Algorithmic or mathematical formulation for ${problem.title}`,
      'Time complexity and space complexity optimization bounds',
      'Boundary conditions, null checks, and outlier handling',
      'Production deployment and computational trade-offs',
    ],
    suggestedQuestions: [
      `Time and space complexity bounds for ${problem.title}?`,
      'Key edge cases and failure modes?',
      'Alternative algorithmic approaches & trade-offs?',
    ],
  };
}

/**
 * Checks if a user's answer is an empty/filler non-answer.
 */
function isNonAnswer(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (clean.length === 0) return true;

  const words = clean.split(/\s+/);
  if (words.length < 6) {
    const fillerWords = [
      'hey',
      'this',
      'is',
      'interesting',
      'intresting',
      'cool',
      'test',
      'hello',
      'good',
      'question',
      'idk',
      'dunno',
      'yes',
      'no',
      'sure',
      'okay',
      'hi',
    ];
    const isAllFiller = words.every((w) => fillerWords.includes(w.replace(/[^a-z]/g, '')));
    if (isAllFiller) return true;
  }

  return false;
}

/**
 * Evaluates the user's submission dynamically against the specific question.
 */
export function evaluateSubmission(
  problem: Problem,
  answerText: string,
  canvasImage: string | null,
  elementsCount: number
): EvaluationResult {
  const knowledge = getKnowledgeForProblem(problem);
  const hasText = answerText.trim().length > 0;
  const hasDiagram = elementsCount > 0 && !!canvasImage;
  const nonAnswer = isNonAnswer(answerText);

  const submissionType =
    hasDiagram && hasText
      ? 'Combined Architecture Diagram & Written Analysis'
      : hasDiagram
      ? 'Architecture Diagram Solution'
      : 'Written Technical Architecture Analysis';

  // SCENARIO 1: Non-answer or conversational filler with no diagram (Matches the user's screenshot scenario!)
  if ((!hasText || nonAnswer) && !hasDiagram) {
    const conceptSummary = knowledge.requiredConcepts.slice(0, 2).join(' and ');
    return {
      submissionId: `sub-${problem.id}-${Date.now()}`,
      problemId: problem.id,
      questionTitle: problem.title,
      category: problem.category,
      score: 1,
      status: 'Incomplete',
      submissionType,
      overallFeedback: `The response does not address the question at all. A correct answer should explain that ${conceptSummary.toLowerCase()}, along with key architecture requirements. Providing no information results in a non-answer.`,
      missedConcepts: knowledge.requiredConcepts,
      keyInsight: knowledge.keyInsight,
      modelAnswer: knowledge.modelAnswer,
      suggestedQuestions: knowledge.suggestedQuestions,
      evaluatedAt: new Date().toISOString(),
    };
  }

  // SCENARIO 2: Diagram-only submission
  if (hasDiagram && (!hasText || nonAnswer)) {
    const score = elementsCount >= 6 ? 8 : elementsCount >= 3 ? 7 : 5;
    const status = score >= 8 ? 'Proficient' : 'Developing';
    const missed =
      elementsCount >= 6
        ? [knowledge.requiredConcepts[knowledge.requiredConcepts.length - 1]]
        : knowledge.requiredConcepts.slice(2);

    return {
      submissionId: `sub-${problem.id}-${Date.now()}`,
      problemId: problem.id,
      questionTitle: problem.title,
      category: problem.category,
      score,
      status,
      submissionType,
      overallFeedback: `Architecture diagram submission received with ${elementsCount} components. The visual structure illustrates key components for "${problem.title}". To achieve a top score, ensure data flow arrows explicitly specify protocols and include failure mitigation tiers.`,
      missedConcepts: missed,
      keyInsight: knowledge.keyInsight,
      modelAnswer: knowledge.modelAnswer,
      suggestedQuestions: knowledge.suggestedQuestions,
      evaluatedAt: new Date().toISOString(),
    };
  }

  // SCENARIO 3: Meaningful text submission (or combined text + diagram)
  const cleanText = answerText.toLowerCase();
  const matchedConcepts = knowledge.requiredConcepts.filter((concept) => {
    const terms = concept
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 3);
    return terms.some((term) => cleanText.includes(term));
  });

  const wordsCount = answerText.trim().split(/\s+/).length;
  let score = 5;

  if (wordsCount > 150) score += 2;
  else if (wordsCount > 60) score += 1;

  if (matchedConcepts.length >= 3) score += 2;
  else if (matchedConcepts.length >= 1) score += 1;

  if (hasDiagram && elementsCount >= 3) score += 1;

  score = Math.min(10, Math.max(3, score));

  const status: 'Incomplete' | 'Developing' | 'Proficient' | 'Strong Hire' =
    score >= 9
      ? 'Strong Hire'
      : score >= 7
      ? 'Proficient'
      : score >= 4
      ? 'Developing'
      : 'Incomplete';

  const missedConcepts = knowledge.requiredConcepts.filter(
    (c) => !matchedConcepts.includes(c)
  );

  const overallFeedback =
    score >= 8
      ? `Comprehensive solution for "${problem.title}". Demonstrates sound technical understanding of ${knowledge.requiredConcepts[0].toLowerCase()} and architectural trade-offs. Clearly satisfies the core requirements.`
      : `Solid initial approach for "${problem.title}". The submission touches upon key ideas but leaves critical aspects unaddressed, notably ${
          missedConcepts[0] ? missedConcepts[0].toLowerCase() : 'scalability details'
        }. Elaborating on these areas will elevate the solution to production grade.`;

  return {
    submissionId: `sub-${problem.id}-${Date.now()}`,
    problemId: problem.id,
    questionTitle: problem.title,
    category: problem.category,
    score,
    status,
    submissionType,
    overallFeedback,
    missedConcepts: missedConcepts.length > 0 ? missedConcepts : [knowledge.requiredConcepts[0]],
    keyInsight: knowledge.keyInsight,
    modelAnswer: knowledge.modelAnswer,
    suggestedQuestions: knowledge.suggestedQuestions,
    evaluatedAt: new Date().toISOString(),
  };
}
