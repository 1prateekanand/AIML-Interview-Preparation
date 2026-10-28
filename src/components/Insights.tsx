import React, { useState } from 'react';
import { SkillRadar } from './insights/SkillRadar';
import { ProgressRings } from './insights/ProgressRings';
import { AlgorithmConstellation } from './insights/AlgorithmConstellation';
import { MasteryGrid } from './insights/MasteryGrid';
import { SkillRadarDetail } from './insights/SkillRadarDetail';
import { ProgressRingsDetail } from './insights/ProgressRingsDetail';
import { AlgorithmConstellationDetail } from './insights/AlgorithmConstellationDetail';
import { MasteryGridDetail } from './insights/MasteryGridDetail';
import { InsightViewId } from '../types';

interface InsightsProps {
  activeView?: InsightViewId | null;
  onViewChange?: (view: InsightViewId | null) => void;
  onNavigateToProblems?: (tag?: string) => void;
}

export const Insights: React.FC<InsightsProps> = ({
  activeView: controlledActiveView,
  onViewChange,
  onNavigateToProblems,
}) => {
  const [internalView, setInternalView] = useState<InsightViewId | null>(null);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'all'>('90d');

  // Support controlled or uncontrolled view state
  const currentView =
    controlledActiveView !== undefined ? controlledActiveView : internalView;

  const handleSelectView = (view: InsightViewId | null) => {
    if (onViewChange) {
      onViewChange(view);
    }
    setInternalView(view);
  };

  // Full-page detailed analytics view A: Skill Radar
  if (currentView === 'skill-radar') {
    return (
      <SkillRadarDetail
        onBack={() => handleSelectView(null)}
        onNavigateToProblems={onNavigateToProblems}
      />
    );
  }

  // Full-page detailed analytics view B: Progress Rings
  if (currentView === 'progress-rings') {
    return (
      <ProgressRingsDetail
        onBack={() => handleSelectView(null)}
        onNavigateToProblems={onNavigateToProblems}
      />
    );
  }

  // Full-page detailed analytics view C: Algorithm Constellation
  if (currentView === 'algorithm-constellation') {
    return (
      <AlgorithmConstellationDetail
        onBack={() => handleSelectView(null)}
        onNavigateToProblems={onNavigateToProblems}
      />
    );
  }

  // Full-page detailed analytics view D: Mastery Grid
  if (currentView === 'mastery-grid') {
    return (
      <MasteryGridDetail
        onBack={() => handleSelectView(null)}
        onNavigateToProblems={() => onNavigateToProblems?.()}
      />
    );
  }

  // Default: Four-Card Insights Overview
  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Insights
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--border-accent)] uppercase tracking-wider">
              Live Analytics
            </span>
          </div>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Understand your strengths, track your consistency, and discover what to improve next. Click any card to open full-page analytics.
          </p>
        </div>

        {/* Global Time Range Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '30d'
                ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '90d'
                ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
          >
            90 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === 'all'
                ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 2x2 Visualizations Grid — each card clickable across its entire surface */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* Visualization A — Skill Radar */}
        <SkillRadar
          onOpenDetail={() => handleSelectView('skill-radar')}
          onSelectCategory={(cat) => {
            if (onNavigateToProblems) onNavigateToProblems(cat);
          }}
        />

        {/* Visualization B — Progress Rings */}
        <ProgressRings
          onOpenDetail={() => handleSelectView('progress-rings')}
        />

        {/* Visualization C — Algorithm Constellation */}
        <AlgorithmConstellation
          onOpenDetail={() => handleSelectView('algorithm-constellation')}
          onNavigateToProblems={(tag) => {
            if (onNavigateToProblems) onNavigateToProblems(tag);
          }}
        />

        {/* Visualization D — Mastery Grid */}
        <MasteryGrid
          onOpenDetail={() => handleSelectView('mastery-grid')}
        />
      </div>
    </div>
  );
};
