import React from 'react';
import { DomainMetric } from '../../hooks/useSkillRadarData';
import {
  Brain,
  Layers,
  Bot,
  Code,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';

interface SkillDomainDetailsProps {
  domain: DomainMetric;
  accentColor: string;
  onNavigateToCategory?: (categorySlug: string) => void;
  onClose?: () => void;
}

export const SkillDomainDetails: React.FC<SkillDomainDetailsProps> = ({
  domain,
  accentColor,
  onNavigateToCategory,
  onClose,
}) => {
  const renderIcon = () => {
    const props = { className: 'w-5 h-5', style: { color: accentColor } };
    switch (domain.iconName) {
      case 'Brain':
        return <Brain {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Bot':
        return <Bot {...props} />;
      case 'Code':
        return <Code {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Rocket':
        return <Rocket {...props} />;
      default:
        return <Brain {...props} />;
    }
  };

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6 backdrop-blur-md transition-all duration-300 shadow-xl space-y-5 animate-in fade-in duration-200"
      style={{
        backgroundColor: 'rgba(10, 15, 29, 0.95)',
        borderColor: `${accentColor}44`,
        boxShadow: `0 16px 36px -12px rgba(0,0,0,0.7), 0 0 20px ${accentColor}18`,
      }}
    >
      {/* Header: Domain Title, Icon, Mastery Badge & Close */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}55`,
              boxShadow: `0 0 14px ${accentColor}30`,
            }}
          >
            {renderIcon()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {domain.name}
              </h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  domain.status === 'Mastered'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : domain.status === 'Proficient'
                    ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                    : domain.status === 'Developing'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-slate-500/40 bg-slate-500/10 text-slate-400'
                }`}
              >
                {domain.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {domain.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div
              className="text-2xl font-extrabold font-mono tabular-nums leading-none"
              style={{ color: accentColor }}
            >
              {domain.hasSufficientData ? `${domain.proficiency}%` : '—'}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
              Mastery Score
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close domain details"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Domain Overall Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Solved</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {domain.solvedCount}{' '}
            <span className="text-xs font-normal text-slate-500">/ {domain.totalQuestions}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Attempted</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {domain.attemptedCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Accuracy</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {domain.accuracy !== null ? `${domain.accuracy}%` : '—'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Completion</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {domain.completionRate}%
          </div>
        </div>
      </div>

      {/* Categories in this Domain */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Constituent Categories ({domain.categories.length})
          </span>
          <span className="text-slate-400 text-[11px]">
            Click category to practice questions
          </span>
        </div>

        <div className="space-y-3">
          {domain.categories.map((category) => (
            <div
              key={category.id}
              className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[var(--accent)] transition-colors truncate">
                    {category.name}
                  </h4>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                    style={{
                      color: accentColor,
                      backgroundColor: `${accentColor}10`,
                      borderColor: `${accentColor}33`,
                    }}
                  >
                    {category.hasData ? `${category.mastery}% Mastery` : 'No Activity'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden max-w-md">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${category.mastery}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>

                {/* Stats line */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>Solved: {category.solvedCount} / {category.totalCount}</span>
                  <span>•</span>
                  <span>Accuracy: {category.accuracy !== null ? `${category.accuracy}%` : '—'}</span>
                  <span>•</span>
                  <span>Completion: {category.completion}%</span>
                </div>
              </div>

              {/* Action Button: Navigate to Category */}
              {onNavigateToCategory && (
                <button
                  type="button"
                  onClick={() => onNavigateToCategory(category.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all cursor-pointer shrink-0 self-start sm:self-center shadow-xs"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
