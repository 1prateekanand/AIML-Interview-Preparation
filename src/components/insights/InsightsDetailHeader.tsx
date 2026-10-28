import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface InsightsDetailHeaderProps {
  badge: 'A' | 'B' | 'C' | 'D';
  title: string;
  subtitle: string;
  onBack: () => void;
  actions?: React.ReactNode;
}

export const InsightsDetailHeader: React.FC<InsightsDetailHeaderProps> = ({
  badge,
  title,
  subtitle,
  onBack,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
      {/* Breadcrumb & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Insights</span>
          </button>
          <span>/</span>
          <span className="text-[var(--text-secondary)] font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-[var(--active-nav-bg)] text-[var(--accent)] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[var(--border-accent)] shadow-xs">
            {badge}
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Actions & Back Button */}
      <div className="flex items-center gap-3 self-start sm:self-center">
        {actions}

        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Insights"
          title="Back to Insights"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--active-nav-bg)] text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Insights</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-black/20 text-[var(--text-muted)] border border-white/5">
            Esc
          </span>
        </button>
      </div>
    </div>
  );
};
