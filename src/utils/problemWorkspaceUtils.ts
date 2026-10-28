import { Problem } from '../types';

export function getProblemRequirements(problem: Problem): string[] {
  if (problem.requirements && problem.requirements.length > 0) {
    return problem.requirements;
  }

  const cat = (problem.category || '').toLowerCase();
  const title = (problem.title || '').toLowerCase();

  if (cat.includes('system design') || title.includes('design') || title.includes('architecture')) {
    return [
      'Explain the overall architecture and key components (e.g., load balancer, application servers, database, cache, CDN, etc.).',
      'Discuss how the components interact with each other and handle traffic surges.',
      'Explain how you would handle scalability, high availability, and fault tolerance.',
      'You may draw a diagram and/or write your explanation.',
    ];
  }

  if (cat.includes('rag') || cat.includes('retrieval')) {
    return [
      'Outline the ingestion, chunking, and embedding generation pipeline.',
      'Describe vector indexing, approximate nearest neighbor search (HNSW/IVF), and hybrid reranking.',
      'Detail context window budgeting, latency constraints, and hallucination reduction strategies.',
      'You may draw the retrieval flow diagram and explain your design decisions.',
    ];
  }

  if (cat.includes('agent') || title.includes('agent')) {
    return [
      'Define the core agent loop: Perception, Planning (ReAct / Tree of Thoughts), and Execution.',
      'Specify tool schema definitions, validation checks, and error recovery strategies.',
      'Detail memory management: short-term conversation context vs long-term external knowledge stores.',
      'You may illustrate multi-agent collaboration and orchestration pipelines.',
    ];
  }

  if (cat.includes('llm') || cat.includes('deep learning')) {
    return [
      'Explain model architecture, parameter scale, attention mechanisms, and tokenization.',
      'Discuss training/fine-tuning methodology (LoRA, QLoRA, DPO/RLHF) and dataset mixture.',
      'Analyze computational complexity, memory footprints, and optimization trade-offs.',
      'You may sketch the network diagram or attention flow to support your answer.',
    ];
  }

  if (cat.includes('safety') || cat.includes('guardrails')) {
    return [
      'Identify key vulnerability vectors (prompt injection, jailbreaks, data leakage, toxic outputs).',
      'Architect a defense-in-depth moderation layer with pre-guardrails and post-output filters.',
      'Define auditing, logging, human-in-the-loop escalation paths, and compliance boundaries.',
      'You may diagram the request inspection pipeline and mitigation fallback tiers.',
    ];
  }

  if (cat.includes('mlops') || cat.includes('monitoring') || cat.includes('inference')) {
    return [
      'Specify CI/CD pipelines, model registry versioning, and continuous automated testing.',
      'Detail serving infrastructure: dynamic batching, GPU scheduling, and inference optimization.',
      'Architect observability: drift detection, latency percentiles (p95/p99), and rollback mechanisms.',
      'You may diagram the deployment pipeline and production monitoring topology.',
    ];
  }

  // General algorithmic / ML default
  return [
    `Analyze the time complexity and space complexity trade-offs for ${problem.title}.`,
    'Identify all potential edge cases (e.g., empty inputs, extreme boundaries, null/NaN conditions).',
    'Explain your step-by-step algorithmic approach before writing the final solution.',
    'You may draw the data structure flow or state transitions on the whiteboard.',
  ];
}

export interface ArchitectureComponentStamp {
  id: string;
  name: string;
  subtitle: string;
  iconType: 'balancer' | 'server' | 'database' | 'cache' | 'queue' | 'client' | 'cdn' | 'cloud';
  color: string;
  fill: string;
  border: string;
}

export const ARCHITECTURE_STAMPS: ArchitectureComponentStamp[] = [
  {
    id: 'client',
    name: 'Client / Users',
    subtitle: 'Web & Mobile',
    iconType: 'client',
    color: '#0284c7',
    fill: '#f0f9ff',
    border: '#38bdf8',
  },
  {
    id: 'cdn',
    name: 'Cloud CDN',
    subtitle: 'Edge Caching',
    iconType: 'cdn',
    color: '#0d9488',
    fill: '#f0fdfa',
    border: '#2dd4bf',
  },
  {
    id: 'lb',
    name: 'Load Balancer',
    subtitle: 'Nginx / ALB',
    iconType: 'balancer',
    color: '#d97706',
    fill: '#fffbeb',
    border: '#f59e0b',
  },
  {
    id: 'app-server',
    name: 'App Server Pool',
    subtitle: 'Stateless Service',
    iconType: 'server',
    color: '#2563eb',
    fill: '#eff6ff',
    border: '#60a5fa',
  },
  {
    id: 'cache',
    name: 'Redis Cache',
    subtitle: 'In-Memory Subsystem',
    iconType: 'cache',
    color: '#dc2626',
    fill: '#fef2f2',
    border: '#f87171',
  },
  {
    id: 'database',
    name: 'Primary Database',
    subtitle: 'PostgreSQL / Aurora',
    iconType: 'database',
    color: '#7c3aed',
    fill: '#f5f3ff',
    border: '#a78bfa',
  },
  {
    id: 'queue',
    name: 'Message Broker',
    subtitle: 'Kafka / RabbitMQ',
    iconType: 'queue',
    color: '#059669',
    fill: '#ecfdf5',
    border: '#34d399',
  },
];
