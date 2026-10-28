
import React, { useMemo } from 'react';
import { Box, ChevronRight } from 'lucide-react';
import { CATEGORIES_LIST, AimCategory as BaseCategory } from '../../data/categories';
import { Problem } from '../../types';

export interface AimCategory extends BaseCategory {
  solved: number;
  total: number;
  percent: number;
}

interface CategoryCardsProps {
  problems?: Problem[];
  onSelectCategory: (categoryId: string) => void;
}

// Explicit mapping: category ID -> image in public/assets/categories/
const CATEGORY_IMAGES: Record<string, string> = {
  'ml-fundamentals': '/assets/categories/header-ml-fundamentals.png',
  'deep-learning': '/assets/categories/header-deep-learning.png',
  'llm-foundations': '/assets/categories/header-llm-foundations.png',
  'rag-retrieval': '/assets/categories/header-rag-retrieval.png',
  'ai-agents': '/assets/categories/header-ai-agents.png',
  'eval-metrics': '/assets/categories/header-eval-metrics.png',
  'safety-governance': '/assets/categories/header-safety-governance.png',
  'mlops-monitoring': '/assets/categories/header-mlops-monitoring.png',
  'inference-serving': '/assets/categories/header-inference-serving.png',
  'system-design': '/assets/categories/header-system-design.png',
  'coding-problems': '/assets/categories/header-coding-problems.png',
};

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  problems = [],
  onSelectCategory,
}) => {
  const categoriesWithStats: AimCategory[] = useMemo(() => {
    return CATEGORIES_LIST.map((cat) => {
      const catProblems = problems.filter(
        (p) => p.categorySlug === cat.id
      );

      const total = catProblems.length;
      const solved = catProblems.filter(
        (p) => p.status === 'Solved'
      ).length;

      return {
        ...cat,
        solved,
        total,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });
  }, [problems]);

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
          <Box className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Explore AI/ML Categories
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Choose a topic, practise interview questions, and build your AI
            engineering skills.
          </p>
        </div>
      </div>

      {/* Three-column desktop layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categoriesWithStats.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-label={`Open ${cat.name}`}
            className="group relative isolate flex min-h-[178px] w-full
              flex-col justify-between overflow-hidden rounded-2xl
              border bg-[#050b16] p-4 text-left
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#050b16]"
            style={{
              borderColor: `${cat.color}75`,
              ['--category-color' as string]: cat.color,
            }}
          >
            {/* Full-card category artwork */}
            <img
              src={CATEGORY_IMAGES[cat.id]}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-20
                h-full w-full object-cover object-center
                transition-transform duration-500
                group-hover:scale-[1.035]"
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden';
              }}
            />

            {/* Left-side gradient protects text readability */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background: `
                  linear-gradient(
                    90deg,
                    rgba(3, 8, 18, 0.98) 0%,
                    rgba(3, 8, 18, 0.92) 32%,
                    rgba(3, 8, 18, 0.68) 53%,
                    rgba(3, 8, 18, 0.12) 100%
                  ),
                  linear-gradient(
                    0deg,
                    rgba(3, 8, 18, 0.75) 0%,
                    transparent 45%
                  )
                `,
              }}
            />

            {/* Category-coloured hover glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10
                rounded-2xl opacity-0 transition-opacity duration-300
                group-hover:opacity-100"
              style={{
                boxShadow: `inset 0 0 32px ${cat.color}35`,
              }}
            />

            {/* Category heading and description */}
            <div className="w-[72%]">
              <p
                className="mb-2 text-[9px] font-mono uppercase
                  tracking-wider"
                style={{ color: cat.color }}
              >
                Problems <span className="text-slate-500">›</span> Domain{' '}
                {cat.order} of 11
              </p>

              <h3 className="text-base font-bold leading-tight text-white
                transition-colors duration-200
                group-hover:text-[var(--category-color)]">
                {cat.name}
              </h3>

              <p className="mt-2 line-clamp-2 text-[11px]
                leading-relaxed text-slate-300">
                {cat.description}
              </p>
            </div>

            {/* Progress and solved statistics */}
            <div className="mt-4 w-full">
              <div className="mb-2 flex items-center justify-between gap-2
                text-[10px]">
                <span className="font-mono tabular-nums text-slate-300">
                  {cat.solved} / {cat.total} questions solved
                </span>

                <span
                  className="font-mono font-bold tabular-nums"
                  style={{ color: cat.color }}
                >
                  {cat.percent}%
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>

            {/* Decorative arrow */}
            <ChevronRight
              aria-hidden="true"
              className="absolute right-3 top-3 h-4 w-4
                text-white/50 transition-all duration-200
                group-hover:translate-x-0.5 group-hover:text-white"
            />
          </button>
        ))}
      </div>
    </section>
  );
};
