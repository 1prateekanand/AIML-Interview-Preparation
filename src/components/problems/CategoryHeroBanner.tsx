import React, { useEffect, useState } from 'react';
import type { AimCategory } from '../../data/categories';
import { useTheme } from '../../context/ThemeContext';

interface CategoryHeroBannerProps {
  categoryMeta?: AimCategory;
  solvedCount: number;
  totalCount: number;
  percent: number;
  accuracy: number | null;
  onResetCategory?: () => void;
}

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

  // Category information
  const title = categoryMeta?.name ?? 'All Problems';

  const description =
    categoryMeta?.description ??
    'Master AI/ML engineering interviews with our complete curriculum across all 11 core domains.';

  const accent =
    categoryMeta?.color ?? currentTheme.tokens.accent;

  // Use the image path directly from the category configuration.
  const bannerImage = categoryMeta?.bannerImage || null;

  // Reset image error when category changes.
  useEffect(() => {
    setImgError(false);
  }, [bannerImage]);

  // Safely calculate displayed values.
  const safePercent = Math.max(0, Math.min(percent || 0, 100));
  const safeSolved = Math.max(0, solvedCount || 0);
  const safeTotal = Math.max(0, totalCount || 0);

  const safeAccuracy =
    accuracy === null
      ? null
      : Math.max(0, Math.min(accuracy, 100));

  const showImage = Boolean(bannerImage && !imgError);

  // --------------------------------------------------
  // CATEGORY BANNER WITH DYNAMIC OVERLAY
  // --------------------------------------------------

  if (showImage && bannerImage) {
    return (
      <section
        className="category-hero relative isolate w-full overflow-hidden rounded-2xl"
        aria-label={`${title} category overview`}
      >
        {/* Original banner image */}
        <img
          key={bannerImage}
          src={bannerImage}
          alt={`${title} banner artwork`}
          className="block h-auto w-full"
          loading="eager"
          decoding="async"
          onError={() => setImgError(true)}
        />

        {/* Dynamic content blended into the image */}
        <div
          className="
            absolute inset-y-0 left-0 z-10
            flex w-[64%] flex-col justify-between
            overflow-hidden
            px-[3.5%] py-[2.5%]
            max-sm:w-[76%]
            max-sm:px-[3%]
            max-sm:py-[3%]
          "
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(3, 5, 12, 0.98) 0%,
                rgba(3, 5, 12, 0.96) 68%,
                rgba(3, 5, 12, 0.88) 84%,
                rgba(3, 5, 12, 0.48) 94%,
                rgba(3, 5, 12, 0) 100%
              )
            `,
          }}
        >
          {/* Breadcrumb and domain */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 text-[clamp(8px,0.85vw,13px)] font-medium text-slate-400">
              {onResetCategory ? (
                <button
                  type="button"
                  onClick={onResetCategory}
                  className="shrink-0 transition-colors hover:text-white"
                >
                  Problems
                </button>
              ) : (
                <span>Problems</span>
              )}

              <span className="text-slate-600">›</span>

              <span
                className="truncate font-semibold"
                style={{ color: accent }}
              >
                {title}
              </span>
            </div>

            {categoryMeta && (
              <span
                className="
                  shrink-0 rounded-full
                  border px-2 py-1
                  text-[clamp(7px,0.7vw,11px)]
                  font-bold
                "
                style={{
                  color: accent,
                  borderColor: `${accent}66`,
                  backgroundColor: `${accent}18`,
                }}
              >
                DOMAIN {categoryMeta.order} OF 11
              </span>
            )}
          </div>

          {/* Dynamic title and description */}
          <div className="min-w-0">
            <h1 className="text-[clamp(14px,2.1vw,32px)] font-extrabold leading-tight text-white">
              {title}
            </h1>

            <p className="mt-1 line-clamp-2 text-[clamp(8px,0.95vw,14px)] leading-relaxed text-slate-300">
              {description}
            </p>
          </div>

          {/* Dynamic statistics */}
          <div className="grid grid-cols-3 gap-[1.5%]">
            <StatCard
              label="Questions Solved"
              value={`${safeSolved} / ${safeTotal}`}
              accent={accent}
            />

            <StatCard
              label="Completion"
              value={`${Math.round(safePercent)}%`}
              accent={accent}
            />

            <StatCard
              label="Accuracy"
              value={
                safeAccuracy !== null
                  ? `${Math.round(safeAccuracy)}%`
                  : '—'
              }
              accent={accent}
            />
          </div>

          {/* Dynamic progress bar */}
          <div>
            <div className="mb-1 flex items-center justify-between text-[clamp(8px,0.85vw,13px)]">
              <span className="font-semibold text-white">
                Overall Progress
              </span>

              <span
                className="font-bold"
                style={{ color: accent }}
              >
                {Math.round(safePercent)}%
              </span>
            </div>

            <div className="h-[clamp(4px,0.65vw,9px)] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${safePercent}%`,
                  backgroundColor: accent,
                  boxShadow: `0 0 12px ${accent}88`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------
  // FALLBACK: ALL PROBLEMS OR IMAGE LOAD FAILURE
  // --------------------------------------------------

  return (
    <section
      className="category-hero w-full overflow-hidden rounded-2xl border p-5 sm:p-7"
      aria-label={`${title} overview`}
      style={{
        backgroundColor: '#0A0F1D',
        borderColor:
          currentTheme.tokens.borderAccent || `${accent}55`,
        boxShadow: `0 12px 35px -12px ${currentTheme.tokens.accentGlow}`,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {onResetCategory && (
            <button
              type="button"
              onClick={onResetCategory}
              className="mb-3 text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              ← Back to all problems
            </button>
          )}

          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            {description}
          </p>
        </div>

        {categoryMeta && (
          <span
            className="rounded-full border px-3 py-1 text-xs font-bold"
            style={{
              color: accent,
              borderColor: `${accent}66`,
              backgroundColor: `${accent}18`,
            }}
          >
            DOMAIN {categoryMeta.order} OF 11
          </span>
        )}
      </div>

      {/* Fallback statistics */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Questions Solved"
          value={`${safeSolved} / ${safeTotal}`}
          accent={accent}
        />

        <StatCard
          label="Completion"
          value={`${Math.round(safePercent)}%`}
          accent={accent}
        />

        <StatCard
          label="Accuracy"
          value={
            safeAccuracy !== null
              ? `${Math.round(safeAccuracy)}%`
              : '—'
          }
          accent={accent}
        />
      </div>

      {/* Fallback progress bar */}
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>Overall Progress</span>
          <span>{Math.round(safePercent)}%</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${safePercent}%`,
              backgroundColor: accent,
              boxShadow: `0 0 10px ${accent}`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

// --------------------------------------------------
// REUSABLE DYNAMIC STATISTIC CARD
// --------------------------------------------------

interface StatCardProps {
  label: string;
  value: string;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  accent,
}) => {
  return (
    <div
      className="
        flex min-w-0 flex-col justify-center
        rounded-lg
        border border-white/10
        bg-white/[0.07]
        px-2 py-2
        sm:px-3
      "
    >
      <div className="truncate text-[clamp(10px,1.25vw,19px)] font-bold text-white">
        {value}
      </div>

      <div
        className="mt-1 truncate text-[clamp(7px,0.75vw,11px)] font-medium"
        style={{ color: `${accent}DD` }}
      >
        {label}
      </div>
    </div>
  );
};