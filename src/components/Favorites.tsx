import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  GripVertical,
  Search,
  Lightbulb,
  X,
  Check,
} from 'lucide-react';
import { INITIAL_COLLECTIONS, PROBLEM_BANK } from '../data/mockData';
import { CollectionList } from '../types';

interface SavedProblemItem {
  id: number;
  number: number;
  title: string;
  statusText: string;
  categoryTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Solved' | 'Attempted';
}

export const Favorites: React.FC = () => {
  const [collections, setCollections] = useState<CollectionList[]>(INITIAL_COLLECTIONS);
  const [selectedListId, setSelectedListId] = useState<string>('list-1');
  const [bankSearch, setBankSearch] = useState<string>('');
  const [showAddListModal, setShowAddListModal] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [draggedItem, setDraggedItem] = useState<(typeof PROBLEM_BANK)[0] | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Active collection
  const activeCollection =
    collections.find((c) => c.id === selectedListId) || collections[0];

  // Saved items for List 1 as shown in screenshot
  const [savedItems, setSavedItems] = useState<SavedProblemItem[]>([
    {
      id: 1,
      number: 1,
      title: 'Two Sum',
      statusText: 'Solved 2 days ago • Easy',
      categoryTag: 'ARRAY',
      difficulty: 'Easy',
      status: 'Solved',
    },
    {
      id: 322,
      number: 322,
      title: 'Coin Change',
      statusText: 'Attempted 5h ago • Medium',
      categoryTag: 'DYNAMIC',
      difficulty: 'Medium',
      status: 'Attempted',
    },
  ]);

  // Remove problem from active list
  const handleRemoveProblem = (id: number) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    setCollections((prev) =>
      prev.map((c) =>
        c.id === selectedListId ? { ...c, count: Math.max(0, c.count - 1) } : c
      )
    );
  };

  // Add problem from bank to active list
  const handleAddProblem = (bankProblem: (typeof PROBLEM_BANK)[0]) => {
    if (savedItems.some((item) => item.id === bankProblem.id)) {
      return; // Already in list
    }
    const newItem: SavedProblemItem = {
      id: bankProblem.id,
      number: bankProblem.number,
      title: bankProblem.title,
      statusText: `Added just now • ${bankProblem.difficulty}`,
      categoryTag: bankProblem.tags.split('•')[0].trim(),
      difficulty: bankProblem.difficulty,
      status: 'Attempted',
    };
    setSavedItems((prev) => [...prev, newItem]);
    setCollections((prev) =>
      prev.map((c) =>
        c.id === selectedListId ? { ...c, count: c.count + 1 } : c
      )
    );
  };

  // Add new custom collection
  const handleCreateCollection = () => {
    if (!newListName.trim()) return;
    const newId = `list-${Date.now()}`;
    const newList: CollectionList = {
      id: newId,
      name: newListName.trim(),
      count: 0,
      problemIds: [],
    };
    setCollections((prev) => [...prev, newList]);
    setSelectedListId(newId);
    setNewListName('');
    setShowAddListModal(false);
  };

  // Filter bank items
  const filteredBank = PROBLEM_BANK.filter((item) => {
    if (!bankSearch.trim()) return true;
    const q = bankSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.tags.toLowerCase().includes(q) ||
      item.number.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-sidebar: My Collections (col-span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                My Collections
              </span>
              <button
                type="button"
                onClick={() => setShowAddListModal(true)}
                title="Add new collection"
                className="w-6 h-6 rounded-lg bg-[var(--active-nav-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-main)] transition-colors flex items-center justify-center cursor-pointer border border-[var(--border-accent)]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {collections.map((col) => {
                const isActive = col.id === selectedListId;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedListId(col.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[var(--active-nav-bg)] text-[var(--accent)] border border-[var(--active-nav-border)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Folder
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                        }`}
                      />
                      <span className="truncate">{col.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                      {col.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)] mb-1">
                Pro Tip
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Drag problems from the bank into your lists to organize your interview study plan effectively.
              </p>
            </div>
          </div>
        </div>

        {/* Center Panel: Active List Items & Dropzone (col-span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {activeCollection.name}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              {activeCollection.count} Problems Saved
            </span>
          </div>

          {/* Saved Problems List */}
          <div className="space-y-3">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-4 hover:border-[var(--border-accent)] transition-all duration-150 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface-elevated)] flex items-center justify-center shrink-0">
                    {item.status === 'Solved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {item.number}. {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {item.statusText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    {item.categoryTag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProblem(item.id)}
                    title="Remove from list"
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Drag & Drop Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (draggedItem) {
                  handleAddProblem(draggedItem);
                  setDraggedItem(null);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? 'border-[var(--accent)] bg-[var(--active-nav-bg)] scale-[1.01]'
                  : 'border-[var(--border-subtle)] hover:border-[var(--border-accent)] bg-[var(--bg-surface)]/40 hover:bg-[var(--bg-surface)]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-muted)] mb-3 group-hover:text-[var(--accent)]">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                Drag questions here from the bank to add to {activeCollection.name}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                or click any (+) button in the Problem Bank
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Problem Bank (col-span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">
              Problem Bank
            </h2>

            {/* Quick Search */}
            <div className="relative mb-4">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Quick search..."
                className="w-full bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-lg pl-8 pr-3 py-2 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Draggable Cards */}
            <div className="space-y-3">
              {filteredBank.map((item) => {
                const diffColor =
                  item.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : item.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                const alreadyAdded = savedItems.some((s) => s.id === item.id);

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedItem(item)}
                    onDragEnd={() => setDraggedItem(null)}
                    className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)]/60 hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing transition-colors duration-150 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${diffColor}`}
                        >
                          {item.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                        {item.number}. {item.title}
                      </h4>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5 truncate">
                        {item.tags}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAddProblem(item)}
                        disabled={alreadyAdded}
                        title={alreadyAdded ? 'Already in list' : 'Add to list'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          alreadyAdded
                            ? 'text-emerald-400 bg-emerald-500/10 opacity-70 cursor-default'
                            : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--active-nav-bg)]'
                        }`}
                      >
                        {alreadyAdded ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <GripVertical className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Collection Modal */}
      {showAddListModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Create Collection
              </h3>
              <button
                onClick={() => setShowAddListModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Collection Name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g. Graph Algorithms Sprint"
                className="w-full bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-primary)] rounded-xl px-3.5 py-2.5 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateCollection();
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddListModal(false)}
                className="py-2 px-4 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCollection}
                disabled={!newListName.trim()}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
