import React, { useState, useMemo } from 'react';
import {
  Brain,
  Layers,
  Bot,
  Code,
  ShieldCheck,
  Rocket,
  Maximize2,
  ChevronDown,
  Info,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import { useSkillRadarData, DomainMetric } from '../../hooks/useSkillRadarData';
import { SkillRadarTooltip } from './SkillRadarTooltip';
import { SkillDomainDetails } from './SkillDomainDetails';

interface SkillRadarProps {
  problems?: Problem[];
  onSelectCategory?: (category: string) => void;
  onOpenDetail?: () => void;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({
  problems,
  onSelectCategory,
  onOpenDetail,
}) => {
  const { currentTheme } = useTheme();
  const { domains, overall, insufficientDataNotice } = useSkillRadarData(problems);

  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Active theme accent & glows
  const accent = currentTheme.tokens.accent || '#F59E0B';
  const accentSecondary = currentTheme.tokens.accentSecondary || '#FFC247';
  const accentGlow = currentTheme.tokens.accentGlow || 'rgba(245, 158, 11, 0.35)';

  // Radar chart geometry parameters
  const viewBoxWidth = 560;
  const viewBoxHeight = 440;
  const center = { x: 280, y: 220 };
  const radius = 130;
  const numAxes = 6;

  // Concentric hexagonal grid rings (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Axis angles (starting top-left at -120° and rotating clockwise)
  // 0: -120° (Top-Left - ML & DL)
  // 1: -60°  (Top-Right - LLM & Retrieval)
  // 2: 0°    (Right - Agentic AI)
  // 3: 60°   (Bottom-Right - AI Engineering)
  // 4: 120°  (Bottom-Left - Eval & Responsible AI)
  // 5: 180°  (Left - Production & Deployment)
  const getAngle = (index: number) => {
    return (index * (2 * Math.PI)) / numAxes - (2 * Math.PI) / 3;
  };

  const getCoordinates = (index: number, valueRatio: number, rOffset = 0) => {
    const angle = getAngle(index);
    const r = radius * Math.max(0.08, Math.min(1.0, valueRatio)) + rOffset;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    };
  };

  // Coordinates for the 6 outer vertices (100% boundary)
  const outerVertices = useMemo(() => {
    return domains.map((_, i) => getCoordinates(i, 1.0));
  }, [domains]);

  // Coordinates for user data polygon based on proficiency (0-100%)
  // If no data, use a subtle 15% inner baseline polygon
  const userPolygonPoints = useMemo(() => {
    return domains
      .map((d, i) => {
        const ratio = d.hasSufficientData ? d.proficiency / 100 : 0.12;
        const coords = getCoordinates(i, ratio);
        return `${coords.x},${coords.y}`;
      })
      .join(' ');
  }, [domains]);

  const hoveredDomain = domains.find((d) => d.id === hoveredDomainId) || null;
  const selectedDomain = domains.find((d) => d.id === selectedDomainId) || null;

  const handleVertexClick = (domain: DomainMetric) => {
    if (selectedDomainId === domain.id) {
      setSelectedDomainId(null);
    } else {
      setSelectedDomainId(domain.id);
    }
  };

  const renderIcon = (iconName: string, className = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'Brain':
        return <Brain className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Rocket':
        return <Rocket className={className} />;
      default:
        return <Brain className={className} />;
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 sm:p-6 transition-all duration-300 relative overflow-hidden shadow-xl space-y-6">
      {/* 1. Header with Title & Detail Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border transition-colors shadow-xs"
            style={{
              backgroundColor: 'var(--active-nav-bg)',
              borderColor: 'var(--border-accent)',
              color: 'var(--accent)',
            }}
          >
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-wide">
                SKILL RADAR
              </h2>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono transition-colors"
                style={{
                  backgroundColor: 'var(--active-nav-bg)',
                  borderColor: 'var(--border-accent)',
                  color: 'var(--accent)',
                }}
              >
                6 Domains
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Live algorithmic and AI engineering mastery across all 11 core categories
            </p>
          </div>
        </div>

        {/* Action Button: Full-page deep dive */}
        {onOpenDetail && (
          <button
            type="button"
            onClick={onOpenDetail}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface-elevated)] hover:bg-[var(--active-nav-bg)] text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Deep-Dive Analytics</span>
          </button>
        )}
      </div>

      {/* 2. Main Radar Chart Card Container */}
      <div className="relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] rounded-2xl bg-[#070B14] border border-white/5 p-2 sm:p-4 overflow-hidden">
        {/* Subtle Ambient Tech Glow */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15 transition-all duration-500"
          style={{ backgroundColor: accentSecondary }}
        />

        {/* SVG Hexagonal Radar Canvas */}
        <div className="relative w-full max-w-[560px] aspect-[560/440] flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible select-none"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          >
            <defs>
              {/* Radar theme glow filter */}
              <filter id="radarThemeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Central radial background glow */}
              <radialGradient id="radarCenterAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
                <stop offset="50%" stopColor={accent} stopOpacity="0.06" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </radialGradient>

              {/* Radar Polygon Theme Gradient Fill */}
              <linearGradient id="radarPolygonFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
                <stop offset="50%" stopColor={accent} stopOpacity="0.25" />
                <stop offset="100%" stopColor={accentSecondary} stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Central Glow Disc */}
            <circle cx={center.x} cy={center.y} r={radius * 1.15} fill="url(#radarCenterAura)" />

            {/* Concentric Hexagonal Gridlines (20%, 40%, 60%, 80%, 100%) */}
            {gridLevels.map((lvl, idx) => {
              const gridPoints = domains
                .map((_, i) => {
                  const pt = getCoordinates(i, lvl);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ');
              const isOuter = idx === gridLevels.length - 1;

              return (
                <polygon
                  key={idx}
                  points={gridPoints}
                  fill="none"
                  stroke={isOuter ? `${accent}88` : 'rgba(255, 255, 255, 0.08)'}
                  strokeWidth={isOuter ? 1.5 : 0.8}
                  strokeDasharray={isOuter ? undefined : '3 3'}
                />
              );
            })}

            {/* Dashed Radial Lines from Center to each outer vertex */}
            {outerVertices.map((v, i) => (
              <line
                key={`axis-${i}`}
                x1={center.x}
                y1={center.y}
                x2={v.x}
                y2={v.y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {/* 3. Dynamic Theme Radar Polygon */}
            <polygon
              points={userPolygonPoints}
              fill="url(#radarPolygonFill)"
              stroke={accent}
              strokeWidth={2.5}
              filter="url(#radarThemeGlow)"
              className="transition-all duration-700 ease-out"
            />

            {/* 4. Six Circular Data-point Markers */}
            {domains.map((domain, i) => {
              const ratio = domain.hasSufficientData ? domain.proficiency / 100 : 0.12;
              const pt = getCoordinates(i, ratio);
              const isHovered = hoveredDomainId === domain.id;
              const isSelected = selectedDomainId === domain.id;

              return (
                <g
                  key={`marker-${domain.id}`}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={(e) => {
                    setHoveredDomainId(domain.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({ x: rect.left, y: rect.top });
                  }}
                  onMouseLeave={() => setHoveredDomainId(null)}
                  onClick={() => handleVertexClick(domain)}
                >
                  {/* Outer pulse aura on hover or selection */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={14}
                      fill={accent}
                      fillOpacity={0.25}
                      className="animate-ping"
                    />
                  )}

                  {/* Marker glow ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered || isSelected ? 8 : 5.5}
                    fill="#0A0F1D"
                    stroke={accent}
                    strokeWidth={isHovered || isSelected ? 2.5 : 2}
                    filter="url(#radarThemeGlow)"
                  />

                  {/* Inner theme dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered || isSelected ? 3.5 : 2.5}
                    fill={accent}
                  />
                </g>
              );
            })}

            {/* 5. Center Information Hub */}
            <g
              transform={`translate(${center.x}, ${center.y})`}
              className="select-none pointer-events-none"
            >
              {/* Compact center disc */}
              <circle
                r={36}
                fill="#0A0F1D"
                stroke={`${accent}88`}
                strokeWidth={1.5}
                filter="url(#radarThemeGlow)"
              />
              <text
                textAnchor="middle"
                dy="-4"
                className="font-mono font-black text-sm"
                fill={accent}
              >
                {overall.hasAnyData ? `${overall.overallMastery}%` : '—'}
              </text>
              <text
                textAnchor="middle"
                dy="12"
                className="text-[9px] font-bold uppercase tracking-wider"
                fill="rgba(255, 255, 255, 0.7)"
              >
                Mastery
              </text>
            </g>

            {/* 6. Surrounding Domain Labels (Positioned next to each vertex) */}
            {domains.map((domain, i) => {
              const outerPt = outerVertices[i];
              const isHovered = hoveredDomainId === domain.id;
              const isSelected = selectedDomainId === domain.id;

              // Compute offset for label placement outside the hexagon
              const angle = getAngle(i);
              const labelDistance = 38;
              const lx = outerPt.x + labelDistance * Math.cos(angle);
              const ly = outerPt.y + labelDistance * Math.sin(angle);

              // Text anchor: right side anchors start, left side anchors end, center anchors middle
              let anchor: 'start' | 'middle' | 'end' = 'middle';
              if (Math.cos(angle) > 0.25) anchor = 'start';
              else if (Math.cos(angle) < -0.25) anchor = 'end';

              return (
                <g
                  key={`label-${domain.id}`}
                  className="cursor-pointer group/label"
                  onMouseEnter={() => setHoveredDomainId(domain.id)}
                  onMouseLeave={() => setHoveredDomainId(null)}
                  onClick={() => handleVertexClick(domain)}
                >
                  {/* Subtle connection line to vertex */}
                  <line
                    x1={outerPt.x}
                    y1={outerPt.y}
                    x2={lx}
                    y2={ly}
                    stroke={isHovered || isSelected ? accent : 'rgba(255, 255, 255, 0.15)'}
                    strokeWidth={1}
                  />

                  {/* Domain Name */}
                  <text
                    x={lx}
                    y={ly - 4}
                    textAnchor={anchor}
                    className="font-bold text-[11px] sm:text-xs transition-colors"
                    fill={isHovered || isSelected ? accent : '#FFFFFF'}
                  >
                    {domain.name}
                  </text>

                  {/* Mastery Percentage & Status */}
                  <text
                    x={lx}
                    y={ly + 11}
                    textAnchor={anchor}
                    className="font-mono text-[10px] sm:text-[11px] font-semibold"
                    fill={domain.hasSufficientData ? accent : 'rgba(148, 163, 184, 0.8)'}
                  >
                    {domain.hasSufficientData ? `${domain.proficiency}%` : 'No data'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Tooltip during vertex hover */}
        {hoveredDomain && (
          <div className="absolute top-4 right-4 z-20 hidden md:block">
            <SkillRadarTooltip domain={hoveredDomain} accentColor={accent} />
          </div>
        )}
      </div>

      {/* 3. Click-based Detailed Domain Breakdown */}
      {selectedDomain && (
        <SkillDomainDetails
          domain={selectedDomain}
          accentColor={accent}
          onNavigateToCategory={(catSlug) => {
            if (onSelectCategory) {
              onSelectCategory(catSlug);
            }
          }}
          onClose={() => setSelectedDomainId(null)}
        />
      )}

      {/* 4. Responsive Six-Domain Quick Selector Cards (Mobile & Desktop) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-primary)]">
            Explore All 6 AI Competency Axes
          </span>
          <span className="text-[11px]">
            {overall.hasAnyData ? `${overall.totalSolved} solved across ${overall.totalQuestions} questions` : 'Practice questions to unlock analytics'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {domains.map((domain) => {
            const isSelected = selectedDomainId === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => handleVertexClick(domain)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-[var(--active-nav-bg)] border-[var(--accent)] shadow-md'
                    : 'bg-[var(--bg-surface-elevated)]/40 hover:bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors"
                    style={{
                      backgroundColor: 'var(--active-nav-bg)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border-accent)',
                      color: 'var(--accent)',
                    }}
                  >
                    {renderIcon(domain.iconName, 'w-4 h-4')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                      {domain.name}
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      {domain.categories.map((c) => c.name).join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className="text-sm font-mono font-bold block"
                    style={{ color: 'var(--accent)' }}
                  >
                    {domain.hasSufficientData ? `${domain.proficiency}%` : '—'}
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)] font-medium">
                    {domain.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

