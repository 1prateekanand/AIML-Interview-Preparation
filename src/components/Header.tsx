import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, CheckCircle2, Award, Sparkles, X } from 'lucide-react';
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
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-200">
      {/* Search Input Area */}
      <div className="flex-1 max-w-md">
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
            className="w-full bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-lg pl-10 pr-8 py-2 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Theme Selector, Notification Bell, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme Selector - placed directly beside notification button */}
        <ThemeSelector />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg relative transition-colors cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <Bell className="w-5 h-5" />
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
                    <p className="text-[var(--text-muted)] text-[11px]">You've reached a 12-day coding streak.</p>
                    <span className="text-[10px] text-[var(--text-muted)]">2h ago</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg hover:bg-[var(--bg-surface-elevated)]/40 flex items-start gap-2.5 transition-colors">
                  <Award className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Badge Unlocked: Algorithm Novice</p>
                    <p className="text-[var(--text-muted)] text-[11px]">Completed 50 problems in Algorithms.</p>
                    <span className="text-[10px] text-[var(--text-muted)]">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-full hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                Alex Rivera
              </div>
              <div className="text-[10px] font-medium text-[var(--text-muted)]">
                Level 24 • <span className="text-[var(--accent)] font-semibold">Pro</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces"
                alt="Alex Rivera"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--border-subtle)]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-main)]" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="p-2 border-b border-[var(--border-subtle)]">
                <p className="font-semibold text-[var(--text-primary)]">Alex Rivera</p>
                <p className="text-[11px] text-[var(--text-muted)]">alex.rivera@codenexus.dev</p>
              </div>
              <div className="py-1">
                <div className="px-2 py-1.5 flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Nexus Pro Plan</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--active-nav-bg)] text-[var(--accent)] font-semibold">
                    ACTIVE
                  </span>
                </div>
                <div className="px-2 py-1.5 flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Solved Problems</span>
                  <span className="font-mono text-[var(--text-primary)] font-semibold">100 / 245</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
