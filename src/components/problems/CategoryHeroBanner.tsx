
import React, { useEffect, useState } from 'react';
import { FileText, Target, ChevronRight } from 'lucide-react';
import { AimCategory } from '../../data/categories';
import { useTheme } from '../../context/ThemeContext';

interface CategoryHeroBannerProps {
  categoryMeta?: AimCategory;
  solvedCount: number;
  totalCount: number;
  percent: number;
  accuracy: number | null;
  onResetCategory?: () => void;
}

// Explicit mapping: category ID -> image in public/assets/categories/
const CATEGORY_HERO_IMAGES: Record<string, string> = {
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

export const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({
  categoryMeta,
  solvedCount,
  totalCount,
  percent,
  accuracy,
  onResetCategory,
}) => {
  const { currentTheme } = useTheme();
  const [imgError, setImgError] = useState(false);

  // Reset image fallback when switching categories
  useEffect(() => {
    setImgError(false);
  }, [categoryMeta?.id]);

  const categoryAccent = categoryMeta
    ? categoryMeta.color
    : currentTheme.tokens.accent;

  const title = categoryMeta ? categoryMeta.name : 'All Problems';

  const description = categoryMeta
    ? categoryMeta.description
    : 'Master AI/ML engineering interviews with our complete curriculum across all 11 core domains.';

  const categoryImagePath = categoryMeta
    ? CATEGORY_HERO_IMAGES[categoryMeta.id] ?? null
    : null;

  return (
    <div
      className="category-hero relative isolate overflow-hidden rounded-2xl border shadow-2xl flex flex-col justify-between min-h-[350px] lg:h-[370px] transition-all duration-300"
      style={{
        borderColor: `${categoryAccent}33`,
        boxShadow: `0 14px 40px -12px ${categoryAccent}35, 0 0 0 1px ${currentTheme.tokens.borderSubtle}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Full-size category background image */}
      {categoryImagePath && !imgError ? (
        <img
          key={categoryImagePath}
          src={categoryImagePath}
          alt=""
          aria-hidden="true"
          className="category-hero__image"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="category-hero__image flex items-center justify-end pr-12 overflow-hidden bg-[#070b14]">
          <AllDomainsCompositeIllustration accent={currentTheme.tokens.accent} />
        </div>
      )}

      {/* Dark overlay for readable text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[-1] pointer-events-none"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(3, 8, 18, 0.98) 0%,
              rgba(3, 8, 18, 0.91) 38%,
              rgba(3, 8, 18, 0.62) 58%,
              rgba(3, 8, 18, 0.12) 100%
            ),
            linear-gradient(
              0deg,
              rgba(3, 8, 18, 0.45),
              transparent 45%
            )
          `,
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${currentTheme.tokens.borderSubtle} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentTheme.tokens.borderSubtle} 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient accent glow */}
      <div
        className="absolute -right-8 -top-8 z-0 h-96 w-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: categoryAccent }}
      />

      <div
        className="absolute -left-16 -bottom-16 z-0 h-80 w-80 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ backgroundColor: currentTheme.tokens.accent }}
      />

      {/* Breadcrumb */}
      <div className="relative z-10 px-6 pt-5 md:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400"
        >
          <button
            type="button"
            onClick={onResetCategory}
            className="flex items-center gap-1 cursor-pointer transition-colors hover:text-white"
          >
            Problems
          </button>

          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />

          <span
            className="truncate font-semibold"
            style={{
              color: categoryMeta
                ? categoryAccent
                : currentTheme.tokens.accent,
            }}
          >
            {title}
          </span>
        </nav>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-between gap-6 px-6 py-2 lg:flex-row md:px-8">
        {/* Left-side text and statistics */}
        <div className="flex h-full min-w-0 flex-1 flex-col justify-center space-y-4 lg:max-w-[60%]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-[34px]">
                {title}
              </h1>

              <span
                className="shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                style={{
                  backgroundColor: `${categoryAccent}1a`,
                  borderColor: `${categoryAccent}40`,
                  color: categoryAccent,
                }}
              >
                {categoryMeta
                  ? `DOMAIN ${categoryMeta.order} OF 11`
                  : '11 DOMAINS'}
              </span>
            </div>

            <p className="mt-2 max-w-xl text-xs font-normal leading-relaxed text-slate-300 sm:text-sm">
              {description}
            </p>
          </div>

          {/* Three metric cards */}
          <div className="grid w-full max-w-xl grid-cols-1 gap-3 pt-1 sm:grid-cols-3 md:gap-3.5">
            {/* Questions solved */}
            <div
              className="flex h-[76px] items-center gap-3.5 rounded-xl border px-4 py-2.5 backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(12, 19, 34, 0.82)',
                borderColor: `${categoryAccent}35`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${categoryAccent}18`,
                  color: categoryAccent,
                  border: `1px solid ${categoryAccent}35`,
                }}
              >
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="font-mono text-lg font-bold leading-tight text-white tabular-nums sm:text-xl">
                  {solvedCount}{' '}
                  <span className="text-xs font-normal text-slate-500 sm:text-sm">
                    / {totalCount}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Questions Solved
                </div>
              </div>
            </div>

            {/* Completion gauge */}
            <div
              className="flex h-[76px] items-center gap-3.5 rounded-xl border px-4 py-2.5 backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(12, 19, 34, 0.82)',
                borderColor: `${categoryAccent}35`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <svg
                  className="-rotate-90"
                  width="38"
                  height="38"
                  viewBox="0 0 36 36"
                  aria-label={`${percent}% completion`}
                >
                  <path
                    stroke="#334155"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    strokeDasharray={`${Math.max(0, Math.min(percent, 100))}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke={categoryAccent}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style={{
                      filter: `drop-shadow(0 0 4px ${categoryAccent}80)`,
                    }}
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="font-mono text-lg font-bold leading-tight text-white tabular-nums sm:text-xl">
                  {percent}%
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Completion
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div
              className="flex h-[76px] items-center gap-3.5 rounded-xl border px-4 py-2.5 backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(12, 19, 34, 0.82)',
                borderColor: `${categoryAccent}35`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${categoryAccent}18`,
                  color: categoryAccent,
                  border: `1px solid ${categoryAccent}35`,
                }}
              >
                <Target className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="font-mono text-lg font-bold leading-tight text-white tabular-nums sm:text-xl">
                  {accuracy !== null ? `${accuracy}%` : '—'}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Accuracy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reserve the right side for the background illustration */}
        <div className="h-[160px] w-full shrink-0 pointer-events-none sm:h-[200px] lg:h-[280px] lg:w-[40%]" />
      </div>

      {/* Bottom progress bar */}
      <div className="relative z-10 px-6 pb-5 pt-1 md:px-8">
        <div className="mb-1.5 flex items-center justify-end text-xs font-mono text-slate-400">
          <span className="font-medium text-slate-300">
            {solvedCount} / {totalCount} questions solved ({percent}%)
          </span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full border"
          style={{
            backgroundColor: `${currentTheme.tokens.bgMain}ee`,
            borderColor: currentTheme.tokens.borderSubtle,
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(0, Math.min(percent, 100))}%`,
              backgroundColor: categoryAccent,
              boxShadow: `0 0 12px ${categoryAccent}, 0 0 3px #ffffff`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Fallback illustration used if a category image cannot be loaded
const AllDomainsCompositeIllustration: React.FC<{ accent: string }> = ({
  accent,
}) => (
  <svg
    viewBox="0 0 320 200"
    className="h-[240px] w-[380px] overflow-visible"
    role="img"
    aria-label="AI domains illustration"
  >
    <defs>
      <filter id="domain-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <linearGradient id="domain-cube-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor={accent} stopOpacity="0.8" />
      </linearGradient>

      <linearGradient id="domain-cube-left" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
      </linearGradient>

      <linearGradient id="domain-cube-right" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
      </linearGradient>
    </defs>

    {/* Orbit rings */}
    <ellipse
      cx="160"
      cy="100"
      rx="130"
      ry="55"
      fill="none"
      stroke={accent}
      strokeWidth="1.2"
      strokeDasharray="5 5"
      opacity="0.35"
    />
    <ellipse
      cx="160"
      cy="100"
      rx="95"
      ry="90"
      fill="none"
      stroke={accent}
      opacity="0.25"
    />

    {/* Isometric platform */}
    <polygon
      points="160,135 245,155 160,175 75,155"
      fill="#0b1120"
      stroke={accent}
      strokeWidth="1.5"
      filter="url(#domain-glow)"
      opacity="0.85"
    />

    {/* Central 3D cube */}
    <g filter="url(#domain-glow)">
      <polygon
        points="160,55 200,75 160,95 120,75"
        fill="url(#domain-cube-top)"
      />
      <polygon
        points="120,75 160,95 160,140 120,120"
        fill="url(#domain-cube-left)"
        stroke={accent}
      />
      <polygon
        points="200,75 160,95 160,140 200,120"
        fill="url(#domain-cube-right)"
        stroke={accent}
      />
      <text
        x="160"
        y="114"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="15"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {'</>'}
      </text>
    </g>

    {/* Vector database */}
    <g transform="translate(60, 65)">
      <ellipse cx="15" cy="15" rx="14" ry="7" fill={accent} opacity="0.6" />
      <rect x="1" y="15" width="28" height="14" fill={accent} opacity="0.5" />
      <ellipse cx="15" cy="29" rx="14" ry="7" fill="#3b82f6" opacity="0.8" />
      <ellipse cx="15" cy="15" rx="14" ry="7" fill="#06b6d4" opacity="0.7" />
    </g>

    {/* Neural network node */}
    <g transform="translate(230, 65)">
      <circle cx="15" cy="15" r="16" fill="#1e1b4b" stroke={accent} strokeWidth="1.5" />
      <circle cx="9" cy="12" r="2.5" fill="#a855f7" />
      <circle cx="21" cy="12" r="2.5" fill="#38bdf8" />
      <circle cx="15" cy="22" r="2.5" fill="#10b981" />
      <line x1="9" y1="12" x2="21" y2="12" stroke="#ffffff" opacity="0.7" />
      <line x1="9" y1="12" x2="15" y2="22" stroke="#ffffff" opacity="0.7" />
      <line x1="21" y1="12" x2="15" y2="22" stroke="#ffffff" opacity="0.7" />
    </g>

    {/* Floating particles */}
    <circle cx="90" cy="40" r="3" fill="#10b981" filter="url(#domain-glow)" />
    <circle cx="230" cy="45" r="3" fill="#f59e0b" filter="url(#domain-glow)" />
    <circle cx="70" cy="135" r="3" fill="#06b6d4" filter="url(#domain-glow)" />
    <circle cx="250" cy="130" r="3" fill="#818cf8" filter="url(#domain-glow)" />
  </svg>
);
