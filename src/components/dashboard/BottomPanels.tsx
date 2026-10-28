import React from 'react';
import {
  FileText,
  Star,
  Clock,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Code2,
  Bookmark,
} from 'lucide-react';
import { Problem } from '../../types';

interface BottomPanelsProps {
  onOpenProblem: (problem: Problem) => void;
  onNavigateToProblems: () => void;
}

export const BottomPanels: React.FC<BottomPanelsProps> = ({
  onOpenProblem,
  onNavigateToProblems,
}) => {
  // Panel A: Most recent attempted problem
  const continueProblem: Problem = {
    id: 139,
    number: 139,
    title: 'Word Break',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Trie', 'Memoization'],
    successRate: '46.1%',
    status: 'Attempted',
    solvedAgo: '2 hours ago',
    description:
      'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
  };

  // Panel B: Recommended questions
  const recommendedQuestions: Problem[] = [
    {
      id: 210,
      number: 210,
      title: 'Course Schedule II',
      difficulty: 'Medium',
      category: 'Graphs',
      tags: ['Graph', 'BFS', 'Topological Sort'],
      successRate: '47.5%',
      status: 'Todo',
      description:
        'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Return the ordering of courses you should take to finish all courses.',
    },
    {
      id: 14,
      number: 14,
      title: 'Longest Common Prefix',
      difficulty: 'Easy',
      category: 'Strings',
      tags: ['String', 'Trie'],
      successRate: '41.8%',
      status: 'Solved',
      description:
        'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    },
    {
      id: 124,
      number: 124,
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      category: 'Trees',
      tags: ['Tree', 'DFS', 'Dynamic Programming'],
      successRate: '38.2%',
      status: 'Todo',
      description:
        'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.',
    },
  ];

  // Panel C: Recent activity entries
  const recentActivities = [
    {
      id: 'act-merge',
      type: 'solved',
      title: 'Merge Intervals',
      problem: {
        id: 56,
        number: 56,
        title: 'Merge Intervals',
        difficulty: 'Medium' as const,
        category: 'Arrays & Sorting',
        successRate: '46.8%',
        status: 'Solved' as const,
      },
      time: '2 hours ago',
    },
    {
      id: 'act-lru',
      type: 'attempted',
      title: 'LRU Cache',
      problem: {
        id: 146,
        number: 146,
        title: 'LRU Cache',
        difficulty: 'Medium' as const,
        category: 'Design & Linked List',
        successRate: '41.5%',
        status: 'Attempted' as const,
      },
      time: '5 hours ago',
    },
    {
      id: 'act-valid-paren',
      type: 'solved',
      title: 'Valid Parentheses',
      problem: {
        id: 20,
        number: 20,
        title: 'Valid Parentheses',
        difficulty: 'Easy' as const,
        category: 'Stack',
        successRate: '40.3%',
        status: 'Solved' as const,
      },
      time: '1 day ago',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch pt-1">
      {/* Panel A: Continue Learning */}
      <div className="rounded-2xl p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-accent)] transition-all duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-[var(--text-primary)]">
                Continue Learning
              </h3>
            </div>
            <button
              type="button"
              onClick={onNavigateToProblems}
              className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Continue Card */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {continueProblem.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {continueProblem.category}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-amber-400 bg-amber-500/10 border-amber-500/20 shrink-0">
                {continueProblem.difficulty}
              </span>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-muted)]">
                Last attempted 2 hours ago • 3 test cases passed
              </span>
              <button
                type="button"
                onClick={() => onOpenProblem(continueProblem)}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <span>Resume</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel B: Recommended for You */}
      <div className="rounded-2xl p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-accent)] transition-all duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-[var(--text-primary)]">
                Recommended for You
              </h3>
            </div>
            <button
              type="button"
              onClick={onNavigateToProblems}
              className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* List of 3 Recommendations */}
          <div className="space-y-2">
            {recommendedQuestions.map((q) => {
              const diffColor =
                q.difficulty === 'Easy'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : q.difficulty === 'Medium'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

              return (
                <div
                  key={q.id}
                  onClick={() => onOpenProblem(q)}
                  className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/60 hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Bookmark className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                        {q.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">
                        {q.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${diffColor}`}
                    >
                      {q.difficulty}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel C: Recent Activity */}
      <div className="rounded-2xl p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-accent)] transition-all duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-[var(--text-primary)]">
                Recent Activity
              </h3>
            </div>
            <button
              type="button"
              onClick={onNavigateToProblems}
              className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* List of Recent Activities matching screenshot */}
          <div className="space-y-2.5">
            {recentActivities.map((act) => {
              const isSolved = act.type === 'solved';

              return (
                <div
                  key={act.id}
                  onClick={() => onOpenProblem(act.problem)}
                  className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/40 hover:bg-[var(--bg-surface-elevated)] border border-transparent hover:border-[var(--border-subtle)] flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <span className="text-xs text-[var(--text-secondary)] truncate">
                      {isSolved ? 'Solved:' : 'Attempted:'}{' '}
                      <strong className="text-[var(--text-primary)] font-semibold group-hover:text-[var(--accent)] transition-colors">
                        {act.title}
                      </strong>
                    </span>
                  </div>

                  <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                    {act.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
