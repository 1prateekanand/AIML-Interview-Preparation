import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ListOrdered,
  Heart,
  BarChart3,
  ChevronDown,
  Layers,
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
  // Problems dropdown is expanded by default or when on problems page
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
      {/* Brand Header */}
      <div className="p-4 md:p-5 border-b border-[var(--border-subtle)]/50 shrink-0">
        <div
          onClick={() => onSelectPage('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--active-nav-bg)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent)] font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-mono tracking-tighter">&lt;/&gt;</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[var(--text-primary)] block leading-none">
              CodeNexus
            </span>
            <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-medium">
              AI / ML Interview Prep
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-1.5 focus:outline-none custom-scrollbar">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => onSelectPage('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
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
        <div className="space-y-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
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
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer text-left relative ${
                  currentPage === 'problems' && !selectedCategory
                    ? 'text-[var(--accent)] bg-[var(--active-nav-bg)] font-semibold border-l-2 border-[var(--accent)] shadow-2xs'
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

              {/* 11 Categories in Exact Requested Order */}
              {CATEGORIES_LIST.map((cat) => {
                const isActive = currentPage === 'problems' && selectedCategory === cat.id;
                const catCount = problems.filter((p) => p.categorySlug === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectSubCategory(cat.id)}
                    title={cat.name}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer text-left relative ${
                      isActive
                        ? 'text-[var(--accent)] bg-[var(--active-nav-bg)] font-semibold border-l-2 border-[var(--accent)] shadow-2xs'
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
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
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
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
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

      {/* User / Pro Status Footer */}
      <div className="p-3 border-t border-[var(--border-subtle)] shrink-0">
        <div className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">Pro Active</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--accent)]">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
