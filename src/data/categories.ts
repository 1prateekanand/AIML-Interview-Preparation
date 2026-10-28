export interface AimCategory {
  id: string; // slug
  order: number;
  name: string; // Full display name (e.g. "ML Fundamentals")
  numberedName: string; // Numbered name for cards (e.g. "1. ML Fundamentals")
  description: string;
  color: string;
  progressBg: string;
  artworkType:
    | 'ml-fundamentals'
    | 'deep-learning'
    | 'llm'
    | 'rag'
    | 'agents'
    | 'eval'
    | 'safety'
    | 'mlops'
    | 'inference'
    | 'system-design'
    | 'coding';
}

export const CATEGORIES_LIST: AimCategory[] = [
  {
    id: 'ml-fundamentals',
    order: 1,
    name: 'ML Fundamentals',
    numberedName: '1. ML Fundamentals',
    description: 'Build strong foundations in machine learning, from statistics to model training.',
    color: '#10B981', // emerald green
    progressBg: 'bg-emerald-400',
    artworkType: 'ml-fundamentals',
  },
  {
    id: 'deep-learning',
    order: 2,
    name: 'Deep Learning, NLP & Vision',
    numberedName: '2. Deep Learning, NLP & Vision',
    description: 'Master neural networks, natural language processing, and computer vision techniques.',
    color: '#3B82F6', // electric blue
    progressBg: 'bg-blue-500',
    artworkType: 'deep-learning',
  },
  {
    id: 'llm-foundations',
    order: 3,
    name: 'LLM Foundations & Customization',
    numberedName: '3. LLM Foundations & Customization',
    description: 'Learn transformer fundamentals, prompting, fine-tuning, and model adaptation.',
    color: '#8B5CF6', // violet / purple
    progressBg: 'bg-purple-500',
    artworkType: 'llm',
  },
  {
    id: 'rag-retrieval',
    order: 4,
    name: 'RAG & Retrieval',
    numberedName: '4. RAG & Retrieval',
    description: 'Explore embeddings, vector search, retrieval pipelines, and grounded generation.',
    color: '#06B6D4', // cyan / turquoise
    progressBg: 'bg-cyan-500',
    artworkType: 'rag',
  },
  {
    id: 'ai-agents',
    order: 5,
    name: 'AI Agents & Agentic AI',
    numberedName: '5. AI Agents & Agentic AI',
    description: 'Learn tool use, planning, orchestration, agent workflows, and multi-agent systems.',
    color: '#F59E0B', // amber / orange
    progressBg: 'bg-amber-500',
    artworkType: 'agents',
  },
  {
    id: 'eval-metrics',
    order: 6,
    name: 'Evaluation & Metrics',
    numberedName: '6. Evaluation & Metrics',
    description: 'Understand model evaluation, benchmarking, validation, and performance metrics.',
    color: '#0EA5E9', // electric blue / cyan
    progressBg: 'bg-sky-500',
    artworkType: 'eval',
  },
  {
    id: 'safety-governance',
    order: 7,
    name: 'Safety, Guardrails & Governance',
    numberedName: '7. Safety, Guardrails & Governance',
    description: 'Build responsible AI with security, risk management, guardrails, and governance.',
    color: '#EF4444', // crimson / red
    progressBg: 'bg-rose-500',
    artworkType: 'safety',
  },
  {
    id: 'mlops-monitoring',
    order: 8,
    name: 'MLOps, LLMOps & Monitoring',
    numberedName: '8. MLOps, LLMOps & Monitoring',
    description: 'Learn deployment workflows, observability, monitoring, and model lifecycle management.',
    color: '#0284C7', // cyan / blue
    progressBg: 'bg-sky-600',
    artworkType: 'mlops',
  },
  {
    id: 'inference-serving',
    order: 9,
    name: 'Inference & Serving',
    numberedName: '9. Inference & Serving',
    description: 'Master model inference, API serving, latency, batching, and throughput optimisation.',
    color: '#818CF8', // violet / indigo
    progressBg: 'bg-indigo-500',
    artworkType: 'inference',
  },
  {
    id: 'system-design',
    order: 10,
    name: 'System Design & Architecture',
    numberedName: '10. System Design & Architecture',
    description: 'Design scalable AI systems, architecture decisions, distributed systems, and trade-offs.',
    color: '#10B981', // emerald / teal
    progressBg: 'bg-emerald-500',
    artworkType: 'system-design',
  },
  {
    id: 'coding-problems',
    order: 11,
    name: 'Coding & Problem-Solving',
    numberedName: '11. Coding & Problem-Solving',
    description: 'Practise data structures, algorithms, coding exercises, and programming fundamentals.',
    color: '#6366F1', // blue / purple
    progressBg: 'bg-indigo-600',
    artworkType: 'coding',
  },
];
