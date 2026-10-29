import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, CheckCircle2, Award, X, ChevronDown } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateToProblems: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  searchQuery,
  onSearchChange,
  onNavigateToProblems,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaceholder =
    currentPage === 'problems'
      ? 'Search problems...'
      : currentPage === 'favorites'
      ? 'Search favorites & collections...'
      : 'Search problems, categories, or topics...';

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-200">
      {/* Search Input Area with Ctrl K badge */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentPage !== 'problems') {
                onNavigateToProblems();
              }
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl pl-10 pr-16 py-2 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded shadow-2xs">
                Ctrl K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls: Theme Selector, Notification Bell, User Profile Alex Brown */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Dynamic Theme Selector Pill */}
        <ThemeSelector />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-full relative transition-colors cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)] shadow-sm animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-bold text-[var(--text-primary)]">Notifications</span>
                <span className="text-[11px] text-[var(--accent)] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)]/60 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Streak Milestone!</p>
                    <p className="text-[var(--text-muted)] text-[11px]">You've reached a 12-day practice streak.</p>
                    <span className="text-[10px] text-[var(--text-muted)]">2h ago</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg hover:bg-[var(--bg-surface-elevated)]/40 flex items-start gap-2.5 transition-colors">
                  <Award className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">New Domain Mastered</p>
                    <p className="text-[var(--text-muted)] text-[11px]">Completed curated set in RAG & Retrieval.</p>
                    <span className="text-[10px] text-[var(--text-muted)]">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching reference: Alex Brown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 sm:pl-2 pr-2 py-1 rounded-full hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {/* Circular Avatar with Initial A or Photo */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] text-[var(--bg-main)] font-bold text-xs flex items-center justify-center shadow-xs">
              A
            </div>
            <div className="text-left hidden md:flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Alex Brown
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="p-2 border-b border-[var(--border-subtle)]">
                <p className="font-semibold text-[var(--text-primary)]">Alex Brown</p>
                <p className="text-[11px] text-[var(--text-muted)]">alex.brown@sabevia.com</p>
              </div>
              <div className="py-1">
                <div className="px-2 py-1.5 flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Sabevia Pro Pass</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--active-nav-bg)] text-[var(--accent)] font-semibold">
                    ACTIVE
                  </span>
                </div>
                <div className="px-2 py-1.5 flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Practice Progress</span>
                  <span className="font-mono text-[var(--text-primary)] font-semibold">124 questions</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
