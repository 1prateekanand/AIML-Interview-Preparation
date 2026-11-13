import React from 'react';
import { DomainMetric } from '../../hooks/useSkillRadarData';
import { Brain, Layers, Bot, Code, ShieldCheck, Rocket } from 'lucide-react';

interface SkillRadarTooltipProps {
  domain: DomainMetric;
  accentColor: string;
}

export const SkillRadarTooltip: React.FC<SkillRadarTooltipProps> = ({
  domain,
  accentColor,
}) => {
  const renderIcon = () => {
    const props = { className: 'w-4 h-4', style: { color: accentColor } };
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
      className="p-3.5 rounded-xl border shadow-2xl backdrop-blur-md space-y-2.5 min-w-[240px] max-w-[280px] pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 text-left"
      style={{
        backgroundColor: 'rgba(8, 14, 26, 0.96)',
        borderColor: `${accentColor}55`,
        boxShadow: `0 12px 30px -8px rgba(0,0,0,0.8), 0 0 15px ${accentColor}25`,
      }}
    >
      {/* Header with Icon, Name, and Mastery Badge */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}40`,
            }}
          >
            {renderIcon()}
          </div>
          <span className="text-xs font-bold text-white truncate">
            {domain.name}
          </span>
        </div>

        <span
          className="text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0 border"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}40`,
          }}
        >
          {domain.hasSufficientData ? `${domain.proficiency}%` : 'No data'}
        </span>
      </div>

      {/* Domain Status */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Status</span>
        <span
          className={`font-semibold ${
            domain.status === 'Mastered'
              ? 'text-emerald-400'
              : domain.status === 'Proficient'
              ? 'text-sky-400'
              : domain.status === 'Developing'
              ? 'text-amber-400'
              : 'text-slate-400'
          }`}
        >
          {domain.status}
        </span>
      </div>

      {/* Category-by-Category Breakdown */}
      <div className="space-y-2 pt-1 border-t border-white/5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Underlying Categories:
        </span>
        {domain.categories.map((cat) => (
          <div key={cat.id} className="space-y-1">
            <div className="flex items-center justify-between text-[11px] leading-tight">
              <span className="text-slate-300 font-medium truncate max-w-[150px]">
                {cat.name}
              </span>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                {cat.hasData ? (
                  <span style={{ color: accentColor }}>
                    {cat.solvedCount}/{cat.totalCount} ({cat.mastery}%)
                  </span>
                ) : (
                  <span className="text-slate-500">0/{cat.totalCount}</span>
                )}
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${cat.mastery}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>

            {/* Accuracy label */}
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>Accuracy: {cat.accuracy !== null ? `${cat.accuracy}%` : '—'}</span>
              <span>Completion: {cat.completion}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1 text-[9px] text-center text-slate-500 font-mono border-t border-white/5">
        Click vertex to explore domain
      </div>
    </div>
  );
};
