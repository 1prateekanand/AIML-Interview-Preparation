import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { CATEGORY_SKILLS } from '../../data/mockData';
import { CategorySkill } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { InsightsDetailHeader } from './InsightsDetailHeader';

interface SkillRadarDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (category?: string) => void;
}

export const SkillRadarDetail: React.FC<SkillRadarDetailProps> = ({
  onBack,
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const [filter, setFilter] = useState<string>('All Categories');
  const [selectedSkill, setSelectedSkill] = useState<CategorySkill | null>(CATEGORY_SKILLS[0]);
  const [hoveredSkill, setHoveredSkill] = useState<CategorySkill | null>(null);

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const accent = currentTheme.tokens.accent;
  const accentSecondary = currentTheme.tokens.accentSecondary;
  const accentGlow = currentTheme.tokens.accentGlow;

  const skills = CATEGORY_SKILLS;
  const numAxes = skills.length;
  const center = 220;
  const radius = 160;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = radius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = skills
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, skill.proficiency / 100);
      return `${x},${y}`;
    })
    .join(' ');

  const activeSkill = hoveredSkill || selectedSkill || skills[0];

  const totalSolved = skills.reduce((acc, s) => acc + s.solvedCount, 0);
  const totalQuestions = skills.reduce((acc, s) => acc + s.totalCount, 0);
  const averageProficiency = Math.round(
    skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length
  );
  const masteredCount = skills.filter((s) => s.status === 'Mastered').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Detail Header with Back Navigation */}
      <InsightsDetailHeader
        badge="A"
        title="Skill Radar Deep-Dive"
        subtitle="Comprehensive strength analysis across algorithmic topics and software architecture"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option>All Categories</option>
              <option>Data Structures</option>
              <option>Algorithms</option>
              <option>System Design</option>
            </select>
          </div>
        }
      />

      {/* Top High-Level Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Overall Proficiency</span>
            <TrendingUp className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {averageProficiency}%
            </span>
            <span
              className="inline-flex items-center gap-0.5 text-xs font-semibold font-mono"
              style={{ color: accent }}
            >
              <ArrowUp className="w-3.5 h-3.5" /> +12% MoM
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Top 18% percentile among interview candidates
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Problems Solved</span>
            <Target className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {totalSolved}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {totalQuestions}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {Math.round((totalSolved / totalQuestions) * 100)}% problem completion rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Domains Mastered</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {masteredCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {skills.length} domains
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Arrays & Hashing exceeds 85% mastery
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Primary Focus Area</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-bold text-base text-[var(--text-primary)] truncate">
            System Design
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Current proficiency at 40% (needs practice)
          </p>
        </div>
      </div>

      {/* Main Radar View & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Interactive Radar SVG Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Multi-Axis Radar Representation
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              Click any node to inspect details
            </span>
          </div>

          <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center py-4">
            <svg
              className="w-full h-full overflow-visible select-none"
              viewBox="0 0 440 440"
            >
              <defs>
                <radialGradient id="radarGlowDynamicLarge" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
                  <stop offset="55%" stopColor={accent} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>

                <filter id="glowFilterRadarLarge" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background ambient circular glow */}
              <circle cx={center} cy={center} r={radius * 1.05} fill="url(#radarGlowDynamicLarge)" />

              {/* Concentric Polygons */}
              {gridLevels.map((lvl, idx) => {
                const gridPoints = skills
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, lvl);
                    return `${x},${y}`;
                  })
                  .join(' ');
                const isOuterRing = idx === gridLevels.length - 1;
                return (
                  <g key={idx}>
                    <polygon
                      points={gridPoints}
                      fill="none"
                      stroke={isOuterRing ? accentSecondary : 'rgba(255, 255, 255, 0.08)'}
                      strokeOpacity={isOuterRing ? 0.45 : 0.8}
                      strokeWidth={isOuterRing ? 1.5 : 1}
                    />
                    {/* Ring percentage label on top axis */}
                    <text
                      x={center + 6}
                      y={center - radius * lvl + 10}
                      className="text-[9px] font-mono fill-slate-500"
                    >
                      {Math.round(lvl * 100)}%
                    </text>
                  </g>
                );
              })}

              {/* Radial Axes */}
              {skills.map((_, i) => {
                const { x, y } = getCoordinates(i, 1.0);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                );
              })}

              {/* User Data Polygon with Dynamic Theme Accent */}
              <polygon
                points={dataPoints}
                fill={accent}
                fillOpacity="0.25"
                stroke={accent}
                strokeWidth="3"
                filter="url(#glowFilterRadarLarge)"
                className="transition-all duration-300"
              />

              {/* Vertex Nodes */}
              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, skill.proficiency / 100);
                const isSelected = activeSkill.id === skill.id;

                return (
                  <g key={skill.id} className="cursor-pointer">
                    {/* Pulsing indicator ring */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke={accent}
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Outer vertex touch target */}
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="transparent"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(skill)}
                    />

                    {/* Core vertex */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? '#FFFFFF' : accent}
                      stroke="var(--bg-main)"
                      strokeWidth="2.5"
                      filter="url(#glowFilterRadarLarge)"
                      className="transition-all duration-150"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(skill)}
                    />
                  </g>
                );
              })}

              {/* Axis Labels & Values */}
              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, 1.25);
                const isSelected = activeSkill.id === skill.id;

                return (
                  <g
                    key={`lbl-large-${skill.id}`}
                    className="cursor-pointer select-none"
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-xs transition-colors duration-150 ${
                        isSelected ? 'font-bold' : 'font-semibold fill-slate-300'
                      }`}
                      style={{ fill: isSelected ? accentSecondary : undefined }}
                    >
                      {skill.shortName}
                    </text>
                    <text
                      x={x}
                      y={y + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-mono font-bold"
                      style={{ fill: isSelected ? '#FFFFFF' : accent }}
                    >
                      {skill.proficiency}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Topic Inspector & Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Active Skill Inspector Card */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-accent)] shadow-xl relative space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                  Inspecting Domain
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                  {activeSkill.name}
                </h3>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-bold border"
                style={{
                  backgroundColor: 'var(--active-nav-bg)',
                  borderColor: 'var(--border-accent)',
                  color: accent,
                }}
              >
                {activeSkill.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center">
              <div>
                <div className="text-[10px] text-[var(--text-muted)]">Proficiency</div>
                <div className="text-xl font-extrabold font-mono mt-0.5" style={{ color: accent }}>
                  {activeSkill.proficiency}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-muted)]">Solved</div>
                <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono mt-0.5">
                  {activeSkill.solvedCount} <span className="text-xs font-normal text-[var(--text-muted)]">/ {activeSkill.totalCount}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-muted)]">Accuracy</div>
                <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono mt-0.5">
                  {activeSkill.attemptRate}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1.5 font-medium">
                <span>Domain Mastery Completion</span>
                <span className="font-mono text-[var(--text-primary)]">
                  {Math.round((activeSkill.solvedCount / activeSkill.totalCount) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(activeSkill.solvedCount / activeSkill.totalCount) * 100}%`,
                    backgroundColor: accent,
                    boxShadow: `0 0 10px ${accentGlow}`,
                  }}
                />
              </div>
            </div>

            {/* Action CTA */}
            {onNavigateToProblems && (
              <button
                type="button"
                onClick={() => onNavigateToProblems(activeSkill.shortName)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group"
              >
                <span>Practice {activeSkill.shortName} Problems</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          {/* All Categories Compact Table */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
              All 6 Evaluation Axes
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {skills.map((skill) => {
                const isSelected = activeSkill.id === skill.id;
                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[var(--active-nav-bg)] border-[var(--border-accent)] text-[var(--text-primary)] font-semibold'
                        : 'hover:bg-[var(--bg-surface-elevated)] border-transparent text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: isSelected ? accent : accentSecondary }}
                      />
                      <span className="truncate">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {skill.solvedCount}/{skill.totalCount}
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: accent }}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
