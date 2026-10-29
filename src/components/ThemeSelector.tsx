import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
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
      {/* Pill Button displaying active theme name + 2-color swatch + chevron */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Theme selector: current theme is ${currentTheme.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer border ${
          isOpen
            ? 'bg-[var(--active-nav-bg)] text-[var(--accent)] border-[var(--border-accent)] shadow-sm'
            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-accent)]'
        }`}
      >
        {/* 2-color split swatch circular pill */}
        <span
          className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 inline-flex shadow-xs border border-white/20"
          title={`${currentTheme.name} swatch`}
        >
          <span
            className="w-1/2 h-full"
            style={{ backgroundColor: currentTheme.swatches.background }}
          />
          <span
            className="w-1/2 h-full"
            style={{ backgroundColor: currentTheme.swatches.accent }}
          />
        </span>

        {/* Theme Name */}
        <span className="truncate max-w-[120px] sm:max-w-none">
          {currentTheme.name}
        </span>

        {/* Down Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[var(--accent)]' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown matching reference image */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-menu"
          className="absolute right-0 mt-2 w-64 sm:w-72 rounded-xl shadow-2xl z-50 p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          style={{
            boxShadow: '0 16px 40px -6px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--border-subtle)',
          }}
        >
          {/* Header titled "COLOR THEMES (8)" */}
          <div className="px-3 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              COLOR THEMES (8)
            </span>
            <span className="text-[10px] font-mono font-medium text-[var(--accent)]">
              {currentTheme.name}
            </span>
          </div>

          {/* Theme List */}
          <div className="py-1.5 space-y-1">
            {themes.map((theme) => {
              const isActive = theme.id === currentTheme.id;
              return (
                <button
                  key={theme.id}
                  role="menuitem"
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-[var(--active-nav-bg)] border border-[var(--active-nav-border)] text-[var(--text-primary)] font-semibold'
                      : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* 2-Color Swatch: Background on left, Accent on right */}
                    <div
                      className="w-4 h-4 rounded-full overflow-hidden shrink-0 flex border border-white/20 shadow-xs"
                      title={`${theme.name} colors`}
                    >
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: theme.swatches.background }}
                      />
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: theme.swatches.accent }}
                      />
                    </div>

                    {/* Theme Name */}
                    <span className="truncate text-xs font-medium">
                      {theme.name}
                    </span>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isActive && (
                    <span
                      className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--bg-main)] shrink-0 shadow-xs"
                      aria-label="Active theme"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 px-3 pb-1 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Instant preview</span>
            <span>ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
