import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ListOrdered,
  Heart,
  BarChart3,
  ChevronDown,
  Layers,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { PageId, Problem } from '../types';
import { CATEGORIES_LIST } from '../data/categories';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  problems?: Problem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  selectedCategory,
  onSelectCategory,
  problems = [],
}) => {
  const [isProblemsExpanded, setIsProblemsExpanded] = useState<boolean>(true);

  // Auto-expand if navigating to problems or when a category is selected
  useEffect(() => {
    if (currentPage === 'problems' || selectedCategory) {
      setIsProblemsExpanded(true);
    }
  }, [currentPage, selectedCategory]);

  const handleProblemsClick = () => {
    if (currentPage !== 'problems') {
      onSelectPage('problems');
      setIsProblemsExpanded(true);
    } else {
      setIsProblemsExpanded((prev) => !prev);
    }
  };

  const handleSelectSubCategory = (slug: string | null) => {
    onSelectCategory(slug);
    if (currentPage !== 'problems') {
      onSelectPage('problems');
    }
  };

  return (
    <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col shrink-0 h-screen sticky top-0 transition-colors duration-200 select-none z-20">
      {/* Brand Header: Sabevia - The path to knowledge. */}
      <div className="p-4 md:p-5 border-b border-[var(--border-subtle)]/60 shrink-0">
        <div
          onClick={() => onSelectPage('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectPage('dashboard');
          }}
        >
          {/* Sabevia Logo Emblem (Golden Mountain + Star + Winding Path) */}
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-[#0E0E12] border border-[var(--border-accent)] flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/sabevia_logo.png"
              alt="Sabevia Emblem"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Inline SVG fallback if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0">
            <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)] block leading-tight">
              Sabevia
            </span>
            <span className="text-[10px] text-[var(--text-muted)] tracking-wide font-medium block">
              The path to knowledge.
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 focus:outline-none custom-scrollbar">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => onSelectPage('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
            currentPage === 'dashboard'
              ? 'bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--active-nav-border)] shadow-xs font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
          }`}
        >
          <LayoutDashboard
            className={`w-4 h-4 shrink-0 ${
              currentPage === 'dashboard' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
            }`}
          />
          <span className="truncate">Dashboard</span>
        </button>

        {/* Problems Group */}
        <div className="space-y-0.5">
          <div
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
              currentPage === 'problems'
                ? 'bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--active-nav-border)] shadow-xs font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
            }`}
            onClick={handleProblemsClick}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ListOrdered
                className={`w-4 h-4 shrink-0 ${
                  currentPage === 'problems' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                }`}
              />
              <span className="truncate">Problems</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsProblemsExpanded((prev) => !prev);
              }}
              aria-label="Toggle problems categories"
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isProblemsExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          </div>

          {/* Submenu Dropdown */}
          {isProblemsExpanded && (
            <div className="ml-3 pl-3 border-l border-[var(--border-subtle)] space-y-0.5 py-1">
              {/* All Problems */}
              <button
                type="button"
                onClick={() => handleSelectSubCategory(null)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer text-left relative ${
                  currentPage === 'problems' && !selectedCategory
                    ? 'text-[var(--accent)] bg-[var(--active-nav-bg)] font-semibold border-l-2 border-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/80'
                }`}
              >
                <Layers
                  className={`w-3 h-3 shrink-0 ${
                    currentPage === 'problems' && !selectedCategory
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-muted)]'
                  }`}
                />
                <span className="truncate flex-1">All Problems</span>
                {problems.length > 0 && (
                  <span
                    className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                      currentPage === 'problems' && !selectedCategory
                        ? 'text-[var(--accent)] font-bold bg-[var(--active-nav-bg)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {problems.length}
                  </span>
                )}
              </button>

              {/* 11 Categories */}
              {CATEGORIES_LIST.map((cat) => {
                const isActive = currentPage === 'problems' && selectedCategory === cat.id;
                const catCount = problems.filter((p) => p.categorySlug === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectSubCategory(cat.id)}
                    title={cat.name}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer text-left relative ${
                      isActive
                        ? 'text-[var(--accent)] bg-[var(--active-nav-bg)] font-semibold border-l-2 border-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/80'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                        isActive
                          ? 'bg-[var(--accent)] scale-125 shadow-[0_0_6px_var(--accent)]'
                          : 'bg-[var(--text-muted)]/50 group-hover:bg-[var(--text-secondary)]'
                      }`}
                    />
                    <span className="truncate flex-1">{cat.name}</span>
                    {catCount > 0 && (
                      <span
                        className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'text-[var(--accent)] font-bold bg-[var(--active-nav-bg)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {catCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorites */}
        <button
          type="button"
          onClick={() => onSelectPage('favorites')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
            currentPage === 'favorites'
              ? 'bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--active-nav-border)] shadow-xs font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
          }`}
        >
          <Heart
            className={`w-4 h-4 shrink-0 ${
              currentPage === 'favorites' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
            }`}
          />
          <span className="truncate">Favorites</span>
        </button>

        {/* Insights */}
        <button
          type="button"
          onClick={() => onSelectPage('insights')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
            currentPage === 'insights'
              ? 'bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--active-nav-border)] shadow-xs font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
          }`}
        >
          <BarChart3
            className={`w-4 h-4 shrink-0 ${
              currentPage === 'insights' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
            }`}
          />
          <span className="truncate">Insights</span>
        </button>
      </div>

      {/* Bottom Navigation Links: Settings & Help & Support (as in reference concept) */}
      <div className="p-3 border-t border-[var(--border-subtle)] shrink-0 space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer text-left"
          onClick={() => onSelectPage('dashboard')}
        >
          <Settings className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer text-left"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>Help & Support</span>
        </button>
      </div>
    </aside>
  );
};
