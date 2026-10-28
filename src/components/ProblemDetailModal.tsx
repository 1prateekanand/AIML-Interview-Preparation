import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Clock,
  Circle,
  Copy,
  Check,
  Building,
  Sparkles,
} from 'lucide-react';
import { Problem, ProblemStatus } from '../types';

interface ProblemDetailModalProps {
  problem: Problem;
  onClose: () => void;
  onStatusChange: (problemId: number, newStatus: ProblemStatus) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  onClose,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [copied, setCopied] = useState(false);

  const samplePythonCode = `class Solution:
    def ${problem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}(self, nums: List[int], target: int) -> List[int]:
        lookup = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in lookup:
                return [lookup[complement], i]
            lookup[num] = i
        return []
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(samplePythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const diffColor =
    problem.difficulty === 'Easy'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : problem.difficulty === 'Medium'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${diffColor}`}
            >
              {problem.difficulty}
            </span>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {problem.number}. {problem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Category Bar */}
        <div className="px-5 py-3 bg-[var(--bg-surface-elevated)]/40 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-muted)]">Category:</span>
            <span className="font-semibold text-[var(--text-secondary)]">
              {problem.category}
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)]">Success Rate:</span>
            <span className="font-mono text-[var(--text-primary)] font-semibold">
              {problem.successRate}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-muted)] mr-1">Status:</span>
            {(['Todo', 'Attempted', 'Solved'] as ProblemStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onStatusChange(problem.id, st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  problem.status === st
                    ? 'bg-[var(--accent)] text-[var(--bg-main)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-[var(--border-subtle)] px-5">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'description'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'solution'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Python3 Workspace
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-[var(--text-secondary)]">
          {activeTab === 'description' ? (
            <>
              <p className="text-[var(--text-primary)] text-sm">
                {problem.description ||
                  `Given the constraints of problem #${problem.number}, optimize the time complexity and handle edge cases gracefully.`}
              </p>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Example 1:</p>
                <div className="font-mono text-[11px] text-[var(--text-muted)] space-y-1">
                  <p>Input: nums = [2, 7, 11, 15], target = 9</p>
                  <p>Output: [0, 1]</p>
                  <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                </div>
              </div>

              {problem.companies && problem.companies.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                    <Building className="w-3.5 h-3.5" />
                    <span>Frequently Asked By:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.companies.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)] font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  solution.py
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/60 border border-[var(--border-subtle)] font-mono text-xs text-emerald-400 overflow-x-auto leading-normal">
                {samplePythonCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Optimal Time: O(N) • Space: O(N)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onStatusChange(problem.id, 'Solved');
                onClose();
              }}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              Mark as Solved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
