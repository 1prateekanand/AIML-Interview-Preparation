import React, { useState } from 'react';
import { ChevronDown, ArrowUp, Maximize2 } from 'lucide-react';
import { CATEGORY_SKILLS } from '../../data/mockData';
import { CategorySkill } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SkillRadarProps {
  onSelectCategory?: (category: string) => void;
  onOpenDetail?: () => void;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({
  onSelectCategory,
  onOpenDetail,
}) => {
  const { currentTheme } = useTheme();
  const [filter, setFilter] = useState<string>('All Categories');
  const [hoveredSkill, setHoveredSkill] = useState<CategorySkill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<CategorySkill | null>(null);

  // Dynamic theme colors
  const accent = currentTheme.tokens.accent;
  const accentSecondary = currentTheme.tokens.accentSecondary;
  const accentGlow = currentTheme.tokens.accentGlow;

  // Six axes for radar
  const skills = CATEGORY_SKILLS;
  const numAxes = skills.length;
  const center = 150;
  const radius = 100;

  // Calculate polygon coordinates based on proficiency % (0 - 100)
  // Angles start at -90deg (top: Arrays)
  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = radius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Concentric polygon background grid rings (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Polygon points string for the user data
  const dataPoints = skills
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, skill.proficiency / 100);
      return `${x},${y}`;
    })
    .join(' ');

  const activeInspectSkill = hoveredSkill || selectedSkill;

  return (
    <div
      onClick={onOpenDetail}
      className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 md:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-[var(--border-accent)] hover:shadow-lg cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-lg bg-[var(--active-nav-bg)] text-[var(--accent)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--border-accent)]">
            A
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent)] transition-colors">
                SKILL RADAR
              </h2>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-[var(--accent)]">
                View Full Analytics →
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Your strength across key problem categories
            </p>
          </div>
        </div>

        {/* Category Filter & Full View Action */}
        <div className="flex items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option>All Categories</option>
              <option>Core Data Structures</option>
              <option>Algorithms & DP</option>
              <option>Applied Systems</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetail) onOpenDetail();
            }}
            title="Open Full Analytics View"
            aria-label="Open Full Analytics View"
            className="p-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] text-[var(--text-muted)] group-hover:text-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar Chart (Left / Center) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 300 300"
            >
              <defs>
                {/* Dynamic radial gradient using active theme accent */}
                <radialGradient id="radarGlowDynamic" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
                  <stop offset="60%" stopColor={accent} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>

                <filter id="glowFilterRadar" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background circular glow */}
              <circle cx={center} cy={center} r={radius * 1.05} fill="url(#radarGlowDynamic)" />

              {/* Concentric Hexagonal Grid Lines */}
              {gridLevels.map((lvl, idx) => {
                const gridPoints = skills
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, lvl);
                    return `${x},${y}`;
                  })
                  .join(' ');
                const isOuterRing = idx === gridLevels.length - 1;
                return (
                  <polygon
                    key={idx}
                    points={gridPoints}
                    fill="none"
                    stroke={isOuterRing ? accentSecondary : 'rgba(255, 255, 255, 0.08)'}
                    strokeOpacity={isOuterRing ? 0.35 : 0.8}
                    strokeWidth={isOuterRing ? 1.5 : 1}
                  />
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
                    strokeDasharray="2 3"
                  />
                );
              })}

              {/* User Data Polygon — dynamic theme primary accent and fill */}
              <polygon
                points={dataPoints}
                fill={accent}
                fillOpacity="0.22"
                stroke={accent}
                strokeWidth="2.5"
                filter="url(#glowFilterRadar)"
                className="transition-all duration-300"
              />

              {/* Vertex Nodes and Interactive Hitboxes */}
              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, skill.proficiency / 100);
                const isHovered = activeInspectSkill?.id === skill.id;

                return (
                  <g key={skill.id} className="cursor-pointer">
                    {/* Pulsing ring on hover */}
                    {isHovered && (
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="none"
                        stroke={accent}
                        strokeWidth="1.5"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Point vertex */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#FFFFFF' : accent}
                      stroke="var(--bg-main)"
                      strokeWidth="2"
                      className="transition-all duration-200"
                      filter="url(#glowFilterRadar)"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => {
                        setSelectedSkill(selectedSkill?.id === skill.id ? null : skill);
                        if (onSelectCategory) onSelectCategory(skill.shortName);
                      }}
                    />
                  </g>
                );
              })}

              {/* Axis Labels — dynamic secondary accent on hover */}
              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, 1.24);
                const isHovered = activeInspectSkill?.id === skill.id;

                return (
                  <g
                    key={`lbl-${skill.id}`}
                    className="cursor-pointer select-none"
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => {
                      setSelectedSkill(selectedSkill?.id === skill.id ? null : skill);
                      if (onSelectCategory) onSelectCategory(skill.shortName);
                    }}
                  >
                    <text
                      x={x}
                      y={y - 7}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[11px] font-semibold transition-colors duration-150 ${
                        isHovered ? 'font-bold' : 'fill-slate-300'
                      }`}
                      style={{ fill: isHovered ? accentSecondary : undefined }}
                    >
                      {skill.shortName}
                    </text>
                    <text
                      x={x}
                      y={y + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-mono font-bold transition-colors duration-150"
                      style={{ fill: accent }}
                    >
                      {skill.proficiency}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <span className="text-[10px] text-[var(--text-muted)] mt-1">
            Hover or click any vertex to inspect underlying topic metrics
          </span>
        </div>

        {/* Right Summary & Category List */}
        <div className="md:col-span-5 space-y-4">
          {/* Overall Proficiency Card */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Overall Proficiency
            </span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
                63%
              </span>
              <span
                className="inline-flex items-center gap-0.5 text-xs font-semibold font-mono"
                style={{ color: accent }}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                12% vs last month
              </span>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-1.5">
            {skills.map((skill) => {
              const isSelected = activeInspectSkill?.id === skill.id;

              return (
                <div
                  key={skill.id}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => {
                    setSelectedSkill(selectedSkill?.id === skill.id ? null : skill);
                    if (onSelectCategory) onSelectCategory(skill.shortName);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--active-nav-bg)] border-[var(--border-accent)] text-[var(--text-primary)] font-semibold shadow-sm'
                      : 'hover:bg-[var(--bg-surface-elevated)]/70 border-transparent text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: isSelected ? accent : accentSecondary }}
                    />
                    <span className="truncate">{skill.shortName}</span>
                  </div>

                  <span
                    className="font-mono font-bold tabular-nums"
                    style={{ color: accent }}
                  >
                    {skill.proficiency}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detail popover if category is selected/hovered */}
          {activeInspectSkill && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-accent)] animate-in fade-in duration-150 text-xs space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">
                  {activeInspectSkill.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--border-accent)]">
                  {activeInspectSkill.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>Solved: {activeInspectSkill.solvedCount} / {activeInspectSkill.totalCount} problems</span>
                <span>Accuracy: {activeInspectSkill.attemptRate}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
