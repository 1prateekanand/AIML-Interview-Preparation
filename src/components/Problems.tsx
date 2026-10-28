import React, { useState, useMemo } from 'react';
import {
  Shuffle,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Eye,
} from 'lucide-react';
import { TARGET_COMPANIES } from '../data/mockData';
import { Problem, Difficulty, ProblemStatus } from '../types';
import { CATEGORIES_LIST, AimCategory } from '../data/categories';
import { CategoryHeroBanner } from './problems/CategoryHeroBanner';

interface ProblemsProps {
  problems: Problem[];
  searchQuery: string;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  onOpenProblem: (problem: Problem) => void;
  onToggleStatus: (problemId: number) => void;
  isLoading?: boolean;
}

type SortField = 'number' | 'title' | 'difficulty' | 'successRate';
type SortDirection = 'asc' | 'desc';

export const Problems: React.FC<ProblemsProps> = ({
  problems,
  searchQuery: parentSearchQuery,
  selectedCategory,
  onSelectCategory,
  onOpenProblem,
  onToggleStatus,
  isLoading = false,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All'); // 'All' | 'Unattempted' | 'In Progress' | 'Solved'
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Combined search query (from header or local search input)
  const effectiveSearchQuery = (localSearchQuery || parentSearchQuery).trim().toLowerCase();

  // Find active category metadata if one is selected
  const activeCategoryMeta: AimCategory | undefined = useMemo(() => {
    if (!selectedCategory) return undefined;
    return CATEGORIES_LIST.find((cat) => cat.id === selectedCategory);
  }, [selectedCategory]);

  // Compute category-specific real statistics
  const categoryStats = useMemo(() => {
    const relevantProblems = selectedCategory
      ? problems.filter((p) => p.categorySlug === selectedCategory)
      : problems;

    const total = relevantProblems.length;
    const solved = relevantProblems.filter((p) => p.status === 'Solved').length;
    const attempted = relevantProblems.filter((p) => p.status === 'Attempted').length;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Accuracy: only computed when user has actual attempt data (solved / total attempts)
    const totalAttempts = solved + attempted;
    const accuracy = totalAttempts > 0 ? Math.round((solved / totalAttempts) * 100) : null;

    return {
      total,
      solved,
      attempted,
      percent,
      accuracy,
    };
  }, [problems, selectedCategory]);

  // Filter problems based on category, search, difficulty, status, and company
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // 1. Category Filter (via sidebar navigation)
      if (selectedCategory && problem.categorySlug !== selectedCategory) {
        return false;
      }
      // 2. Search
      if (effectiveSearchQuery) {
        const matchesTitle = problem.title.toLowerCase().includes(effectiveSearchQuery);
        const matchesCat = problem.category.toLowerCase().includes(effectiveSearchQuery);
        const matchesNum = problem.number.toString().includes(effectiveSearchQuery);
        const matchesTags = problem.tags?.some((t) => t.toLowerCase().includes(effectiveSearchQuery));
        if (!matchesTitle && !matchesCat && !matchesNum && !matchesTags) return false;
      }
      // 3. Difficulty
      if (selectedDifficulty !== 'All' && problem.difficulty !== selectedDifficulty) {
        return false;
      }
      // 4. Status Filter (All, Unattempted, In Progress, Solved)
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Unattempted' && problem.status !== 'Todo') return false;
        if (selectedStatus === 'In Progress' && problem.status !== 'Attempted') return false;
        if (selectedStatus === 'Solved' && problem.status !== 'Solved') return false;
      }
      // 5. Company
      if (selectedCompany && !problem.companies?.includes(selectedCompany)) {
        return false;
      }
      return true;
    });
  }, [problems, selectedCategory, effectiveSearchQuery, selectedDifficulty, selectedStatus, selectedCompany]);

  // Sort filtered problems
  const sortedProblems = useMemo(() => {
    const list = [...filteredProblems];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'number') {
        comparison = a.number - b.number;
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'difficulty') {
        const diffRank: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
        comparison = diffRank[a.difficulty] - diffRank[b.difficulty];
      } else if (sortField === 'successRate') {
        const rateA = parseFloat(a.successRate) || 0;
        const rateB = parseFloat(b.successRate) || 0;
        comparison = rateA - rateB;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return list;
  }, [filteredProblems, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Pick One action: randomly select from the currently filtered results
  const handlePickOne = () => {
    if (sortedProblems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * sortedProblems.length);
    const chosen = sortedProblems[randomIndex];
    setHighlightedId(chosen.id);
    onOpenProblem(chosen);
    setTimeout(() => setHighlightedId(null), 3000);
  };

  const resetFilters = () => {
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSelectedCompany(null);
    setLocalSearchQuery('');
  };

  const hasActiveFilters =
    selectedDifficulty !== 'All' ||
    selectedStatus !== 'All' ||
    selectedCompany !== null ||
    effectiveSearchQuery.length > 0;

  // Pagination parameters
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(sortedProblems.length / itemsPerPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProblems.slice(start, start + itemsPerPage);
  }, [sortedProblems, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Rich Category Hero Banner matching image_1414be9d.png reference */}
      <CategoryHeroBanner
        categoryMeta={activeCategoryMeta}
        solvedCount={categoryStats.solved}
        totalCount={categoryStats.total}
        percent={categoryStats.percent}
        accuracy={categoryStats.accuracy}
        onResetCategory={() => onSelectCategory(null)}
      />

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input field */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search problems, topics, keywords..."
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3.5 py-2 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Filters Row: Difficulty, Status, Reset, Pick One */}
        <div className="flex flex-wrap items-center gap-2.5">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer mr-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:border-[var(--accent)] cursor-pointer hover:bg-[var(--bg-surface-elevated)] transition-colors"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter (All, Unattempted, In Progress, Solved) */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:border-[var(--accent)] cursor-pointer hover:bg-[var(--bg-surface-elevated)] transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="Unattempted">Unattempted</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Pick One Action Button */}
          <button
            type="button"
            onClick={handlePickOne}
            className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Pick One</span>
          </button>
        </div>
      </div>

      {/* 3. Question Table */}
      <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider text-[11px] font-semibold bg-[var(--bg-surface-elevated)]/30">
                <th className="py-3.5 px-4 w-16 text-center">Status</th>

                {/* Sortable: Title */}
                <th
                  onClick={() => handleSort('title')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Title</span>
                    {sortField === 'title' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-[var(--accent)]" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-[var(--accent)]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>

                {/* Sortable: Difficulty */}
                <th
                  onClick={() => handleSort('difficulty')}
                  className="py-3.5 px-4 w-28 cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Difficulty</span>
                    {sortField === 'difficulty' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-[var(--accent)]" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-[var(--accent)]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>

                <th className="py-3.5 px-4">Category</th>

                {/* Sortable: Success Rate */}
                <th
                  onClick={() => handleSort('successRate')}
                  className="py-3.5 px-4 w-28 cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Success Rate</span>
                    {sortField === 'successRate' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-[var(--accent)]" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-[var(--accent)]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>

                <th className="py-3.5 px-4 w-32 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {isLoading && problems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Loading problems...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-[var(--text-muted)]">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">No problems found</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {hasActiveFilters
                          ? 'No questions match the selected filters or search terms.'
                          : 'No questions are currently available in this category.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((problem) => {
                  const isHighlighted = highlightedId === problem.id;

                  // Status Icon & Label
                  let StatusIcon = Circle;
                  let statusColor = 'text-[var(--text-muted)]';
                  if (problem.status === 'Solved') {
                    StatusIcon = CheckCircle2;
                    statusColor = 'text-emerald-400';
                  } else if (problem.status === 'Attempted') {
                    StatusIcon = Clock;
                    statusColor = 'text-sky-400';
                  }

                  // Strict semantic difficulty styling:
                  // Easy: green (#10B981)
                  // Medium: amber/yellow (#F59E0B)
                  // Hard: red (#F43F5E)
                  const diffBadge =
                    problem.difficulty === 'Easy'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : problem.difficulty === 'Medium'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                  return (
                    <tr
                      key={problem.id}
                      className={`hover:bg-[var(--bg-surface-elevated)]/60 transition-colors duration-150 cursor-pointer group ${
                        isHighlighted
                          ? 'bg-[var(--active-nav-bg)] ring-1 ring-[var(--accent)]'
                          : ''
                      }`}
                      onClick={() => onOpenProblem(problem)}
                    >
                      {/* Status indicator button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(problem.id);
                          }}
                          title={`Status: ${problem.status}. Click to cycle.`}
                          className="hover:scale-110 transition-transform cursor-pointer p-1"
                        >
                          <StatusIcon className={`w-4 h-4 mx-auto ${statusColor}`} />
                        </button>
                      </td>

                      {/* Title & Tags */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                            {problem.number}. {problem.title}
                          </span>
                          {problem.subcategory && (
                            <span className="text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded border border-[var(--border-accent)]">
                              {problem.subcategory}
                            </span>
                          )}
                        </div>
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {problem.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-main)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded border ${diffBadge}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[var(--text-secondary)]">
                        <span className="truncate max-w-[200px] block">
                          {problem.categoryName || problem.category}
                        </span>
                      </td>

                      {/* Success Rate */}
                      <td className="py-3 px-4 font-mono tabular-nums text-[var(--text-secondary)]">
                        {problem.successRate ? problem.successRate : '—'}
                      </td>

                      {/* Contextual Action Button (Start / Continue / View Solution) */}
                      <td className="py-3 px-4 text-center">
                        {problem.status === 'Solved' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenProblem(problem);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Solution</span>
                          </button>
                        ) : problem.status === 'Attempted' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenProblem(problem);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 transition-all cursor-pointer shadow-2xs"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Continue</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenProblem(problem);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-all cursor-pointer shadow-2xs"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Start</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Real Results count & Pagination */}
        <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div>
            Showing {sortedProblems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedProblems.length)} of {sortedProblems.length} problems
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === page
                    ? 'bg-[var(--accent)] text-[var(--bg-main)]'
                    : 'border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Target Companies Section */}
      <div className="space-y-3.5">
        <h2 className="text-base font-bold text-[var(--text-primary)]">
          Target Companies
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {TARGET_COMPANIES.map((company) => {
            const isSelected = selectedCompany === company.tag;
            return (
              <button
                key={company.name}
                type="button"
                onClick={() => {
                  setSelectedCompany(isSelected ? null : company.tag);
                  setCurrentPage(1);
                }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 group ${
                  isSelected
                    ? 'bg-[var(--active-nav-bg)] border-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <span
                  className={`text-2xl font-bold font-mono transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {company.symbol}
                </span>
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {company.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
