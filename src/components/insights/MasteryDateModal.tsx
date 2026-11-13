import React from 'react';
import { X, Calendar, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { MasteryDayData } from '../../hooks/useMasteryGridData';

interface MasteryDateModalProps {
  day: MasteryDayData | null;
  onClose: () => void;
  onNavigateToProblems?: (category?: string) => void;
}

export const MasteryDateModal: React.FC<MasteryDateModalProps> = ({
  day,
  onClose,
  onNavigateToProblems,
}) => {
  if (!day) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-5 sm:p-6 space-y-4 shadow-2xl relative"
        style={{
          backgroundColor: '#0D1117',
          borderColor: 'rgba(245, 158, 11, 0.35)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {day.displayDate}
              </h3>
              <p className="text-[11px] text-slate-400">
                {day.count === 0
                  ? 'No practice activity recorded'
                  : `${day.count} unique problem${day.count > 1 ? 's' : ''} solved`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs">
          <div>
            <div className="text-[10px] text-slate-400">Solved</div>
            <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">
              {day.count}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Accuracy</div>
            <div className="text-base font-extrabold text-white font-mono mt-0.5">
              {day.accuracy !== null ? `${day.accuracy}%` : '—'}
            </div>
          </div>
        </div>

        {/* Solved Questions List */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Problems Solved on this Day ({day.solvedQuestions.length})
          </span>

          {day.solvedQuestions.length > 0 ? (
            <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {day.solvedQuestions.map((q, idx) => (
                <div
                  key={`${q.id}-${idx}`}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-amber-400/30 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-white truncate">
                        {q.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                        {q.category}
                      </span>
                      {q.difficulty && (
                        <span
                          className={`font-mono ${
                            q.difficulty === 'Easy'
                              ? 'text-emerald-400'
                              : q.difficulty === 'Medium'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  {onNavigateToProblems && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToProblems(q.category);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 shrink-0 font-medium"
                    >
                      Practice
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              No problem completions recorded for this calendar date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
