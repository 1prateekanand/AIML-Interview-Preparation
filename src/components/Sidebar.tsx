
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  List,
  Heart,
  BarChart3,
  ChevronDown,
  Settings,
  HelpCircle,
  Brain,
  Layers,
  Cpu,
  Database,
  Bot,
  Activity,
  ShieldAlert,
  Terminal,
  Zap,
  Boxes,
  Code2,
  Network,
} from 'lucide-react';
import { PageId, Problem } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  problems?: Problem[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface CategoryDropdownItem {
  id: string | null;
  name: string;
  fallbackCount: number;
  icon: React.FC<{ className?: string }>;
}

// AI/ML Categories
const CATEGORY_DROPDOWN_ITEMS: CategoryDropdownItem[] = [
  { id: null, name: 'All Categories', fallbackCount: 6430, icon: Layers },
  { id: 'ml-fundamentals', name: 'ML Fundamentals', fallbackCount: 205, icon: Brain },
  { id: 'deep-learning', name: 'Deep Learning, NLP & Vision', fallbackCount: 426, icon: Network },
  { id: 'llm-foundations', name: 'LLM Foundations & Customization', fallbackCount: 1095, icon: Cpu },
  { id: 'rag-retrieval', name: 'RAG & Retrieval', fallbackCount: 1208, icon: Database },
  { id: 'ai-agents', name: 'AI Agents & Agentic AI', fallbackCount: 519, icon: Bot },
  { id: 'eval-metrics', name: 'Evaluation & Metrics', fallbackCount: 458, icon: Activity },
  { id: 'safety-governance', name: 'Safety, Guardrails & Governance', fallbackCount: 319, icon: ShieldAlert },
  { id: 'mlops-monitoring', name: 'MLOps, LLMOps & Monitoring', fallbackCount: 288, icon: Terminal },
  { id: 'inference-serving', name: 'Inference & Serving', fallbackCount: 581, icon: Zap },
  { id: 'system-design', name: 'System Design & Architecture', fallbackCount: 493, icon: Boxes },
  { id: 'coding-problems', name: 'Coding & Problem-Solving', fallbackCount: 250, icon: Code2 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  selectedCategory,
  onSelectCategory,
  problems = [],
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Problems expandable accordion state
  const [isProblemsOpen, setIsProblemsOpen] = useState<boolean>(() => {
    return currentPage === 'problems' || selectedCategory !== null;
  });

  // Keep dropdown open when navigating problems
  useEffect(() => {
    if (currentPage === 'problems' || selectedCategory !== null) {
      setIsProblemsOpen(true);
    }
  }, [currentPage, selectedCategory]);

  const handleNavClick = (page: PageId) => {
    onSelectPage(page);
    if (onCloseMobile) onCloseMobile();
  };

  const handleToggleProblems = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProblemsOpen((prev) => !prev);
  };

  const handleSelectSubCategory = (slug: string | null) => {
    onSelectCategory(slug);
    if (currentPage !== 'problems') {
      onSelectPage('problems');
    }
    if (onCloseMobile) onCloseMobile();
  };

  // Get dynamic category count
  const getCategoryCount = (item: CategoryDropdownItem): number => {
    if (item.id === null) {
      return problems.length > 0 ? problems.length : item.fallbackCount;
    }

    const matching = problems.filter((p) => {
      if (p.categorySlug === item.id) return true;

      if (p.category) {
        const cleanP = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanItem = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanP.includes(cleanItem) || cleanItem.includes(cleanP);
      }

      return false;
    }).length;

    return matching > 0 ? matching : item.fallbackCount;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 select-none z-40 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'max-md:-translate-x-full max-md:fixed max-md:inset-y-0 max-md:left-0 md:translate-x-0'
        }`}
      >
        {/* BRANDING SECTION */}
        <div className="p-4 md:px-5 md:py-5 shrink-0">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleNavClick('dashboard');
            }}
          >
            <div
              className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105"
              style={{
                borderColor: 'var(--theme-border, var(--border-accent))',
                borderWidth: '1.5px',
                borderStyle: 'solid',
                boxShadow: '0 0 14px -1px var(--theme-glow, var(--accent-glow)), inset 0 0 8px rgba(0,0,0,0.4)',
                backgroundColor: 'var(--theme-surface, var(--bg-surface))',
              }}
            >
              <img
                src="/assets/aistudio/sabevia_logo.png"
                alt="Sabevia Emblem"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_var(--theme-glow,var(--accent-glow))]"
              />
            </div>

            <div className="min-w-0">
              <span
                className="text-[22px] font-bold tracking-tight block leading-tight transition-colors duration-200"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  color: 'var(--theme-primary, var(--accent))',
                  textShadow: '0 0 16px var(--theme-glow, var(--accent-glow))',
                }}
              >
                Sabevia
              </span>

              <span
                className="text-[10px] tracking-wide font-normal block mt-0.5 opacity-90 transition-colors"
                style={{ color: 'var(--theme-nav-text-muted, var(--text-secondary))' }}
              >
                The path to knowledge.
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION SECTION */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1.5 focus:outline-none custom-scrollbar">

          {/* Dashboard */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all duration-200 cursor-pointer text-left relative ${
              currentPage === 'dashboard'
                ? 'glow-btn glow-btn-active font-semibold'
                : 'font-medium border border-transparent'
            }`}
            style={
              currentPage === 'dashboard'
                ? {}
                : { color: 'var(--theme-nav-text-muted, var(--text-secondary))' }
            }
          >
            <LayoutDashboard
              className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                currentPage === 'dashboard'
                  ? 'text-[var(--theme-primary)]'
                  : 'text-[var(--theme-nav-text-muted)]'
              }`}
            />
            <span className="truncate text-white sidebar-nav-label">Dashboard</span>
          </button>

          {/* Problems Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={handleToggleProblems}
              aria-expanded={isProblemsOpen}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all duration-200 cursor-pointer text-left relative ${
                currentPage === 'problems'
                  ? 'glow-btn glow-btn-active font-semibold'
                  : 'font-medium border border-transparent hover:bg-[var(--theme-nav-hover)]'
              }`}
              style={
                currentPage === 'problems'
                  ? {}
                  : { color: 'var(--theme-nav-text-muted, var(--text-secondary))' }
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <List
                  className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                    currentPage === 'problems'
                      ? 'text-[var(--theme-primary)]'
                      : 'text-[var(--theme-nav-text-muted)]'
                  }`}
                />
                <span className="truncate text-white sidebar-nav-label">Problems</span>
              </div>

              <div className="p-0.5 rounded text-[var(--theme-primary)]">
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                    isProblemsOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
            </button>

            {/* AI/ML Categories */}
            {isProblemsOpen && (
              <div className="ml-2 pl-2 border-l border-[var(--border-subtle)] space-y-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">

                <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white sidebar-dropdown-label border-b border-[var(--border-subtle)]/60 mb-1">
                  <span>AI/ML CATEGORIES</span>
                  <span className="text-[9px] font-mono opacity-80 text-[var(--theme-primary)] sidebar-question-count">
                    12 DOMAINS
                  </span>
                </div>

                <div className="max-h-[340px] overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                  {CATEGORY_DROPDOWN_ITEMS.map((catItem, idx) => {
                    const isSelected =
                      currentPage === 'problems' &&
                      (catItem.id === null
                        ? selectedCategory === null
                        : selectedCategory === catItem.id);

                    const count = getCategoryCount(catItem);
                    const IconComp = catItem.icon;

                    return (
                      <button
                        key={catItem.id ?? 'all-categories'}
                        type="button"
                        onClick={() => handleSelectSubCategory(catItem.id)}
                        title={catItem.name}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer text-left group ${
                          isSelected
                            ? 'glow-btn glow-btn-active font-semibold'
                            : 'border border-transparent hover:bg-[var(--theme-nav-hover)] hover:text-[var(--theme-primary)]'
                        }`}
                        style={
                          isSelected
                            ? {}
                            : { color: 'var(--theme-nav-text-muted, var(--text-secondary))' }
                        }
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <IconComp
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isSelected
                                ? 'text-[var(--theme-primary)]'
                                : 'text-[var(--theme-nav-text-muted)] group-hover:text-[var(--theme-primary)]'
                            }`}
                          />

                          <span className="truncate text-[11px] sm:text-xs text-white sidebar-category-name">
                            {idx === 0 ? catItem.name : `${idx}. ${catItem.name}`}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-mono tabular-nums px-1 rounded transition-colors sidebar-question-count ${
                            isSelected
                              ? 'text-[var(--theme-primary)] font-bold'
                              : 'opacity-70 group-hover:opacity-100 group-hover:text-[var(--theme-primary)]'
                          }`}
                        >
                          {count.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Favorites */}
          <button
            type="button"
            onClick={() => handleNavClick('favorites')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all duration-200 cursor-pointer text-left relative ${
              currentPage === 'favorites'
                ? 'glow-btn glow-btn-active font-semibold'
                : 'font-medium border border-transparent hover:bg-[var(--theme-nav-hover)]'
            }`}
            style={
              currentPage === 'favorites'
                ? {}
                : { color: 'var(--theme-nav-text-muted, var(--text-secondary))' }
            }
          >
            <Heart
              className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                currentPage === 'favorites'
                  ? 'text-[var(--theme-primary)]'
                  : 'text-[var(--theme-nav-text-muted)]'
              }`}
            />
            <span className="truncate text-white sidebar-nav-label">Favorites</span>
          </button>

          {/* Insights */}
          <button
            type="button"
            onClick={() => handleNavClick('insights')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all duration-200 cursor-pointer text-left relative ${
              currentPage === 'insights'
                ? 'glow-btn glow-btn-active font-semibold'
                : 'font-medium border border-transparent hover:bg-[var(--theme-nav-hover)]'
            }`}
            style={
              currentPage === 'insights'
                ? {}
                : { color: 'var(--theme-nav-text-muted, var(--text-secondary))' }
            }
          >
            <BarChart3
              className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                currentPage === 'insights'
                  ? 'text-[var(--theme-primary)]'
                  : 'text-[var(--theme-nav-text-muted)]'
              }`}
            />
            <span className="truncate text-white sidebar-nav-label">Insights</span>
          </button>
        </div>

        {/* BOTTOM SECTION */}
        <div className="p-3 border-t border-[var(--border-subtle)] shrink-0 space-y-1">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium hover:bg-[var(--theme-nav-hover)] transition-colors cursor-pointer text-left group"
            style={{ color: 'var(--theme-nav-text-muted, var(--text-secondary))' }}
            onClick={() => handleNavClick('dashboard')}
          >
            <Settings className="w-4 h-4 text-[var(--theme-nav-text-muted)] group-hover:text-[var(--theme-primary)] transition-colors" />
            <span className="text-white sidebar-nav-label transition-colors">Settings</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium hover:bg-[var(--theme-nav-hover)] transition-colors cursor-pointer text-left group"
            style={{ color: 'var(--theme-nav-text-muted, var(--text-secondary))' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <HelpCircle className="w-4 h-4 text-[var(--theme-nav-text-muted)] group-hover:text-[var(--theme-primary)] transition-colors" />
            <span className="text-white sidebar-nav-label transition-colors">Help & Support</span>
          </button>
        </div>
      </aside>
    </>
  );
};
