export interface AimCategory {
  id: string;
  order: number;
  name: string;
  numberedName: string;
  description: string;
  color: string;
  progressBg: string;
  bannerImage: string;
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

// Corrected paths: all images are stored in public/assets/categories/
export const categoryBannerImages: Record<string, string> = {
  'ML Fundamentals': '/assets/categories/01_ML_Fundamentals.png',
  'Deep Learning, NLP & Vision': '/assets/categories/02_Deep_Learning_NLP_Vision.png',
  'LLM Foundations & Customization': '/assets/categories/03_LLM_Foundations_Customization.png',
  'RAG & Retrieval': '/assets/categories/04_RAG_Retrieval.png',
  'AI Agents & Agentic AI': '/assets/categories/05_AI_Agents_Agentic_AI.png',
  'Evaluation & Metrics': '/assets/categories/06_Evaluation_Metrics.png',
  'Safety, Guardrails & Governance': '/assets/categories/07_Safety_Guardrails_Governance.png',
  'MLOps, LLMOps & Monitoring': '/assets/categories/08_MLOps_LLMOps_Monitoring.png',
  'Inference & Serving': '/assets/categories/09_Inference_Serving.png',
  'System Design & Architecture': '/assets/categories/10_System_Design_Architecture.png',
  'Coding & Problem-Solving': '/assets/categories/11_Coding_Problem_Solving.png',

  'ml-fundamentals': '/assets/categories/01_ML_Fundamentals.png',
  'deep-learning': '/assets/categories/02_Deep_Learning_NLP_Vision.png',
  'llm-foundations': '/assets/categories/03_LLM_Foundations_Customization.png',
  'rag-retrieval': '/assets/categories/04_RAG_Retrieval.png',
  'ai-agents': '/assets/categories/05_AI_Agents_Agentic_AI.png',
  'eval-metrics': '/assets/categories/06_Evaluation_Metrics.png',
  'safety-governance': '/assets/categories/07_Safety_Guardrails_Governance.png',
  'mlops-monitoring': '/assets/categories/08_MLOps_LLMOps_Monitoring.png',
  'inference-serving': '/assets/categories/09_Inference_Serving.png',
  'system-design': '/assets/categories/10_System_Design_Architecture.png',
  'coding-problems': '/assets/categories/11_Coding_Problem_Solving.png',
};

export const CATEGORIES_LIST: AimCategory[] = [
  {
    id: 'ml-fundamentals',
    order: 1,
    name: 'ML Fundamentals',
    numberedName: '1. ML Fundamentals',
    description: 'Build strong foundations in machine learning, from statistics to model training.',
    color: '#10B981',
    progressBg: 'bg-emerald-400',
    bannerImage: '/assets/categories/01_ML_Fundamentals.png',
    artworkType: 'ml-fundamentals',
  },
  {
    id: 'deep-learning',
    order: 2,
    name: 'Deep Learning, NLP & Vision',
    numberedName: '2. Deep Learning, NLP & Vision',
    description: 'Master neural networks, natural language processing, and computer vision techniques.',
    color: '#3B82F6',
    progressBg: 'bg-blue-500',
    bannerImage: '/assets/categories/02_Deep_Learning_NLP_Vision.png',
    artworkType: 'deep-learning',
  },
  {
    id: 'llm-foundations',
    order: 3,
    name: 'LLM Foundations & Customization',
    numberedName: '3. LLM Foundations & Customization',
    description: 'Learn transformer fundamentals, prompting, fine-tuning, and model adaptation.',
    color: '#8B5CF6',
    progressBg: 'bg-purple-500',
    bannerImage: '/assets/categories/03_LLM_Foundations_Customization.png',
    artworkType: 'llm',
  },
  {
    id: 'rag-retrieval',
    order: 4,
    name: 'RAG & Retrieval',
    numberedName: '4. RAG & Retrieval',
    description: 'Explore embeddings, vector search, retrieval pipelines, and grounded generation.',
    color: '#06B6D4',
    progressBg: 'bg-cyan-500',
    bannerImage: '/assets/categories/04_RAG_Retrieval.png',
    artworkType: 'rag',
  },
  {
    id: 'ai-agents',
    order: 5,
    name: 'AI Agents & Agentic AI',
    numberedName: '5. AI Agents & Agentic AI',
    description: 'Learn tool use, planning, orchestration, agent workflows, and multi-agent systems.',
    color: '#F59E0B',
    progressBg: 'bg-amber-500',
    bannerImage: '/assets/categories/05_AI_Agents_Agentic_AI.png',
    artworkType: 'agents',
  },
  {
    id: 'eval-metrics',
    order: 6,
    name: 'Evaluation & Metrics',
    numberedName: '6. Evaluation & Metrics',
    description: 'Understand model evaluation, benchmarking, validation, and performance metrics.',
    color: '#0EA5E9',
    progressBg: 'bg-sky-500',
    bannerImage: '/assets/categories/06_Evaluation_Metrics.png',
    artworkType: 'eval',
  },
  {
    id: 'safety-governance',
    order: 7,
    name: 'Safety, Guardrails & Governance',
    numberedName: '7. Safety, Guardrails & Governance',
    description: 'Build responsible AI with security, risk management, guardrails, and governance.',
    color: '#EF4444',
    progressBg: 'bg-rose-500',
    bannerImage: '/assets/categories/07_Safety_Guardrails_Governance.png',
    artworkType: 'safety',
  },
  {
    id: 'mlops-monitoring',
    order: 8,
    name: 'MLOps, LLMOps & Monitoring',
    numberedName: '8. MLOps, LLMOps & Monitoring',
    description: 'Learn deployment workflows, observability, monitoring, and model lifecycle management.',
    color: '#0284C7',
    progressBg: 'bg-sky-600',
    bannerImage: '/assets/categories/08_MLOps_LLMOps_Monitoring.png',
    artworkType: 'mlops',
  },
  {
    id: 'inference-serving',
    order: 9,
    name: 'Inference & Serving',
    numberedName: '9. Inference & Serving',
    description: 'Master model inference, API serving, latency, batching, and throughput optimisation.',
    color: '#818CF8',
    progressBg: 'bg-indigo-500',
    bannerImage: '/assets/categories/09_Inference_Serving.png',
    artworkType: 'inference',
  },
  {
    id: 'system-design',
    order: 10,
    name: 'System Design & Architecture',
    numberedName: '10. System Design & Architecture',
    description: 'Design scalable AI systems, architecture decisions, distributed systems, and trade-offs.',
    color: '#10B981',
    progressBg: 'bg-emerald-500',
    bannerImage: '/assets/categories/10_System_Design_Architecture.png',
    artworkType: 'system-design',
  },
  {
    id: 'coding-problems',
    order: 11,
    name: 'Coding & Problem-Solving',
    numberedName: '11. Coding & Problem-Solving',
    description: 'Practise data structures, algorithms, coding exercises, and programming fundamentals.',
    color: '#6366F1',
    progressBg: 'bg-indigo-600',
    bannerImage: '/assets/categories/11_Coding_Problem_Solving.png',
    artworkType: 'coding',
  },
];