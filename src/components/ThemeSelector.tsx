import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectTheme = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Palette Trigger Button beside notification bell */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change theme"
        className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer ${
          isOpen
            ? 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-accent)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-transparent'
        }`}
      >
        <Palette className="w-5 h-5 transition-transform duration-200 hover:rotate-12" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-menu"
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl shadow-2xl z-50 p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          style={{
            boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--border-subtle)',
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Color Themes (10)
            </span>
            <span className="text-[11px] font-medium text-[var(--accent)]">
              {currentTheme.name}
            </span>
          </div>

          {/* Theme List */}
          <div className="max-h-80 overflow-y-auto py-1 space-y-1 pr-0.5">
            {themes.map((theme) => {
              const isActive = theme.id === currentTheme.id;
              return (
                <button
                  key={theme.id}
                  role="menuitem"
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-[var(--active-nav-bg)] border border-[var(--active-nav-border)] text-[var(--text-primary)] font-semibold'
                      : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 4 Swatches Preview */}
                    <div
                      className="grid grid-cols-2 grid-rows-2 w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/10 shadow-inner"
                      title={`1: ${theme.swatches.background}, 2: ${theme.swatches.surface}, 3: ${theme.swatches.accent}, 4: ${theme.swatches.secondaryAccent}`}
                    >
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: theme.swatches.background }}
                      />
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: theme.swatches.surface }}
                      />
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: theme.swatches.accent }}
                      />
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: theme.swatches.secondaryAccent }}
                      />
                    </div>

                    {/* Theme Name */}
                    <span className="truncate text-xs font-medium">
                      {theme.name}
                    </span>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--bg-main)] shrink-0 shadow-sm"
                      aria-label="Active theme"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-2 px-3 pb-1 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Swatches: Bg • Surface • Accents</span>
            <span>ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
