export interface SkillCategoryInfo {
  id: string; // Category slug
  name: string; // Full display name
  order: number;
}

export interface SkillDomainConfig {
  id: string;
  name: string;
  shortName: string;
  categoryIds: string[];
  categoryNames: string[];
  iconName: 'Brain' | 'Layers' | 'Bot' | 'Code' | 'ShieldCheck' | 'Rocket';
  description: string;
  color: string;
}

/**
 * Six official Skill Domains grouping all 11 core CodeNexus/Sabevia categories.
 * Needs Review is strictly excluded from radar calculations.
 */
export const SKILL_DOMAINS: SkillDomainConfig[] = [
  {
    id: 'ml-deep-learning',
    name: 'ML & Deep Learning',
    shortName: 'ML & Deep Learning',
    categoryIds: ['ml-fundamentals', 'deep-learning'],
    categoryNames: ['ML Fundamentals', 'Deep Learning, NLP & Vision'],
    iconName: 'Brain',
    description: 'Statistical foundations, feature scaling, neural architectures, computer vision, and NLP models.',
    color: '#10B981', // emerald
  },
  {
    id: 'llm-retrieval',
    name: 'LLM & Retrieval',
    shortName: 'LLM & Retrieval',
    categoryIds: ['llm-foundations', 'rag-retrieval'],
    categoryNames: ['LLM Foundations & Customization', 'RAG & Retrieval'],
    iconName: 'Layers',
    description: 'Transformer mechanics, tokenization, LoRA fine-tuning, embeddings, vector indexing, and hybrid RAG pipelines.',
    color: '#8B5CF6', // violet
  },
  {
    id: 'agentic-ai',
    name: 'Agentic AI',
    shortName: 'Agentic AI',
    categoryIds: ['ai-agents'],
    categoryNames: ['AI Agents & Agentic AI'],
    iconName: 'Bot',
    description: 'Autonomous agent loops (ReAct), multi-agent collaboration, tool validation, and memory management.',
    color: '#F59E0B', // amber
  },
  {
    id: 'ai-engineering',
    name: 'AI Engineering',
    shortName: 'AI Engineering',
    categoryIds: ['system-design', 'coding-problems'],
    categoryNames: ['System Design & Architecture', 'Coding & Problem-Solving'],
    iconName: 'Code',
    description: 'Distributed ML system design, high-availability architecture, algorithms, and production coding.',
    color: '#3B82F6', // blue
  },
  {
    id: 'eval-responsible-ai',
    name: 'Evaluation & Responsible AI',
    shortName: 'Evaluation & Responsible AI',
    categoryIds: ['eval-metrics', 'safety-governance'],
    categoryNames: ['Evaluation & Metrics', 'Safety, Guardrails & Governance'],
    iconName: 'ShieldCheck',
    description: 'Benchmark metrics (ROUGE/BLEU/Perplexity), red-teaming, guardrails, prompt injection mitigation, and governance.',
    color: '#0EA5E9', // sky blue
  },
  {
    id: 'production-deployment',
    name: 'Production & Deployment',
    shortName: 'Production & Deployment',
    categoryIds: ['mlops-monitoring', 'inference-serving'],
    categoryNames: ['MLOps, LLMOps & Monitoring', 'Inference & Serving'],
    iconName: 'Rocket',
    description: 'MLOps pipelines, drift detection, GPU inference acceleration, KV cache optimization, and vLLM serving.',
    color: '#EC4899', // pink/rose
  },
];

export function getDomainByCategoryId(categoryId: string): SkillDomainConfig | undefined {
  return SKILL_DOMAINS.find((d) => d.categoryIds.includes(categoryId));
}

export function getDomainById(domainId: string): SkillDomainConfig | undefined {
  return SKILL_DOMAINS.find((d) => d.id === domainId);
}
