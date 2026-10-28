import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  MousePointer2,
  Square,
  Diamond,
  Circle,
  MoveRight,
  Minus,
  Type,
  Pencil,
  Eraser,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Trash2,
  Cloud,
  Check,
  X,
} from 'lucide-react';
import { ARCHITECTURE_STAMPS, ArchitectureComponentStamp } from '../../utils/problemWorkspaceUtils';

export type ToolType =
  | 'select'
  | 'rect'
  | 'diamond'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'text'
  | 'pencil'
  | 'eraser'
  | 'stamp';

export interface CanvasElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  text?: string;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  label?: string;
  stampType?: string;
}

interface WhiteboardCanvasProps {
  problemId: number;
  onExportReady?: (exportFn: () => string | null) => void;
  onElementsChange?: (count: number) => void;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  problemId,
  onExportReady,
  onElementsChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [elements, setElements] = useState<CanvasElement[]>(() => {
    try {
      const saved = localStorage.getItem(`codenexus-canvas-${problemId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [previewElement, setPreviewElement] = useState<CanvasElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textInputVal, setTextInputVal] = useState<string>('');
  const [textInputPos, setTextInputPos] = useState<{ x: number; y: number } | null>(null);
  const [showStampPicker, setShowStampPicker] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Track if any element was erased during the current click/drag gesture
  const erasedInCurrentGestureRef = useRef(false);

  // Push to history
  const pushToHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      return [...nextHistory, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Persist to local storage
  useEffect(() => {
    try {
      setSaveStatus('saving');
      localStorage.setItem(`codenexus-canvas-${problemId}`, JSON.stringify(elements));
      const timer = setTimeout(() => setSaveStatus('saved'), 350);
      return () => clearTimeout(timer);
    } catch {
      setSaveStatus('saved');
    }
    onElementsChange?.(elements.length);
  }, [elements, problemId, onElementsChange]);

  // Export as PNG function
  useEffect(() => {
    if (onExportReady && canvasRef.current) {
      onExportReady(() => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.toDataURL('image/png');
      });
    }
  }, [onExportReady]);

  // Redraw canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allElements = previewElement ? [...elements, previewElement] : elements;

    // Draw all elements
    allElements.forEach((el) => {
      ctx.save();
      const isSelected = el.id === selectedId;

      ctx.strokeStyle = isSelected ? '#0284c7' : el.strokeColor;
      ctx.lineWidth = isSelected ? el.strokeWidth + 1.5 : el.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'pencil' && el.points && el.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      } else if (el.type === 'rect') {
        const x = el.x;
        const y = el.y;
        const w = el.width || 0;
        const h = el.height || 0;
        const r = 8; // rounded corner

        ctx.fillStyle = el.fillColor || '#ffffff';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.stroke();

        // Render user-entered label only if present
        if (el.label) {
          ctx.fillStyle = '#0f172a';
          ctx.font = '600 13px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.label, x + w / 2, y + h / 2);
        }
      } else if (el.type === 'diamond') {
        const cx = el.x + (el.width || 0) / 2;
        const cy = el.y + (el.height || 0) / 2;
        const hw = (el.width || 0) / 2;
        const hh = (el.height || 0) / 2;

        ctx.fillStyle = el.fillColor || '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx, cy - hh);
        ctx.lineTo(cx + hw, cy);
        ctx.lineTo(cx, cy + hh);
        ctx.lineTo(cx - hw, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Render user-entered label only if present
        if (el.label) {
          ctx.fillStyle = '#0f172a';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.label, cx, cy);
        }
      } else if (el.type === 'circle') {
        const cx = el.x + (el.width || 0) / 2;
        const cy = el.y + (el.height || 0) / 2;
        const rx = Math.abs((el.width || 0) / 2);
        const ry = Math.abs((el.height || 0) / 2);

        ctx.fillStyle = el.fillColor || '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Render user-entered label only if present
        if (el.label) {
          ctx.fillStyle = '#0f172a';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.label, cx, cy);
        }
      } else if (el.type === 'line' || el.type === 'arrow') {
        const x2 = el.x + (el.width || 0);
        const y2 = el.y + (el.height || 0);

        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (el.type === 'arrow') {
          // Arrow head
          const angle = Math.atan2(y2 - el.y, x2 - el.x);
          const headLen = 14;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(
            x2 - headLen * Math.cos(angle - Math.PI / 6),
            y2 - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            x2 - headLen * Math.cos(angle + Math.PI / 6),
            y2 - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      } else if (el.type === 'text') {
        ctx.fillStyle = el.strokeColor || '#0f172a';
        ctx.font = '500 15px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(el.text || '', el.x, el.y);
      } else if (el.type === 'stamp') {
        // Component Stencil Card
        const x = el.x;
        const y = el.y;
        const w = el.width || 140;
        const h = el.height || 70;
        const r = 10;

        ctx.fillStyle = el.fillColor || '#ffffff';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.stroke();

        // Accent top bar
        ctx.fillStyle = el.strokeColor;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, w, 6, [r, r, 0, 0]) : ctx.fillRect(x, y, w, 6);
        ctx.fill();

        // Title & subtitle
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(el.label || 'Component', x + w / 2, y + 32);

        if (el.text) {
          ctx.fillStyle = '#64748b';
          ctx.font = '10px system-ui, sans-serif';
          ctx.fillText(el.text, x + w / 2, y + 48);
        }
      }

      // Draw bounding box if selected
      if (isSelected && el.type !== 'pencil') {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        const pad = 6;
        const minX = Math.min(el.x, el.x + (el.width || 0)) - pad;
        const minY = Math.min(el.y, el.y + (el.height || 0)) - pad;
        const bw = Math.abs(el.width || 40) + pad * 2;
        const bh = Math.abs(el.height || 30) + pad * 2;
        ctx.strokeRect(minX, minY, bw, bh);
        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  }, [elements, previewElement, selectedId]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      render();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  // Coordinates helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  function distToSegment(
    p: { x: number; y: number },
    v: { x: number; y: number },
    w: { x: number; y: number }
  ) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  // Find element at coordinates (supports all object types: shapes, lines, text, freehand strokes)
  const hitTest = (x: number, y: number): CanvasElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (
        el.type === 'rect' ||
        el.type === 'diamond' ||
        el.type === 'circle' ||
        el.type === 'stamp'
      ) {
        const minX = Math.min(el.x, el.x + (el.width || 0));
        const maxX = Math.max(el.x, el.x + (el.width || 0));
        const minY = Math.min(el.y, el.y + (el.height || 0));
        const maxY = Math.max(el.y, el.y + (el.height || 0));
        if (x >= minX - 4 && x <= maxX + 4 && y >= minY - 4 && y <= maxY + 4) {
          return el;
        }
      } else if (el.type === 'text') {
        const textWidth = Math.max(80, (el.text || '').length * 10);
        if (x >= el.x - 4 && x <= el.x + textWidth && y >= el.y - 4 && y <= el.y + 30) {
          return el;
        }
      } else if (el.type === 'line' || el.type === 'arrow') {
        const x2 = el.x + (el.width || 0);
        const y2 = el.y + (el.height || 0);
        const dist = distToSegment({ x, y }, { x: el.x, y: el.y }, { x: x2, y: y2 });
        if (dist <= 12) return el;
      } else if (el.type === 'pencil' && el.points && el.points.length > 0) {
        if (el.points.length === 1) {
          const p = el.points[0];
          if (Math.hypot(p.x - x, p.y - y) <= 14) return el;
        } else {
          for (let j = 0; j < el.points.length - 1; j++) {
            const dist = distToSegment({ x, y }, el.points[j], el.points[j + 1]);
            if (dist <= 14) return el;
          }
        }
      }
    }
    return null;
  };

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (activeTool === 'select') {
      const hit = hitTest(coords.x, coords.y);
      if (hit) {
        setSelectedId(hit.id);
        setDragStart(coords);
        setDragOffset({ x: coords.x - hit.x, y: coords.y - hit.y });
        setIsDrawing(true);
      } else {
        setSelectedId(null);
      }
      return;
    }

    if (activeTool === 'eraser') {
      setIsDrawing(true);
      erasedInCurrentGestureRef.current = false;
      const hit = hitTest(coords.x, coords.y);
      if (hit) {
        setElements((prev) => prev.filter((el) => el.id !== hit.id));
        if (selectedId === hit.id) setSelectedId(null);
        erasedInCurrentGestureRef.current = true;
      }
      return;
    }

    if (activeTool === 'text') {
      setTextInputPos(coords);
      setTextInputVal('');
      setEditingTextId(null);
      return;
    }

    setIsDrawing(true);
    setDragStart(coords);

    if (activeTool === 'pencil') {
      setCurrentStroke([coords]);
      setPreviewElement({
        id: `el-${Date.now()}`,
        type: 'pencil',
        x: coords.x,
        y: coords.y,
        points: [coords],
        strokeColor: '#0f172a',
        strokeWidth: 2.5,
      });
    }
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);

    // Eraser dragging: continuously remove objects that the cursor touches
    if (activeTool === 'eraser') {
      const hit = hitTest(coords.x, coords.y);
      if (hit) {
        setElements((prev) => prev.filter((el) => el.id !== hit.id));
        if (selectedId === hit.id) setSelectedId(null);
        erasedInCurrentGestureRef.current = true;
      }
      return;
    }

    if (activeTool === 'select' && selectedId && dragOffset) {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id === selectedId) {
            return {
              ...el,
              x: coords.x - dragOffset.x,
              y: coords.y - dragOffset.y,
            };
          }
          return el;
        })
      );
      return;
    }

    if (!dragStart) return;

    if (activeTool === 'pencil') {
      const newPoints = [...currentStroke, coords];
      setCurrentStroke(newPoints);
      setPreviewElement((prev) =>
        prev ? { ...prev, points: newPoints } : null
      );
      return;
    }

    const w = coords.x - dragStart.x;
    const h = coords.y - dragStart.y;

    // SHAPE DRAWING PREVIEWS: Pure geometric shapes with NO default labels/text
    if (activeTool === 'rect') {
      setPreviewElement({
        id: 'preview',
        type: 'rect',
        x: w < 0 ? coords.x : dragStart.x,
        y: h < 0 ? coords.y : dragStart.y,
        width: Math.abs(w),
        height: Math.abs(h),
        strokeColor: '#0f172a',
        fillColor: '#ffffff',
        strokeWidth: 2,
      });
    } else if (activeTool === 'diamond') {
      setPreviewElement({
        id: 'preview',
        type: 'diamond',
        x: w < 0 ? coords.x : dragStart.x,
        y: h < 0 ? coords.y : dragStart.y,
        width: Math.abs(w),
        height: Math.abs(h),
        strokeColor: '#0f172a',
        fillColor: '#ffffff',
        strokeWidth: 2,
      });
    } else if (activeTool === 'circle') {
      setPreviewElement({
        id: 'preview',
        type: 'circle',
        x: w < 0 ? coords.x : dragStart.x,
        y: h < 0 ? coords.y : dragStart.y,
        width: Math.abs(w),
        height: Math.abs(h),
        strokeColor: '#0f172a',
        fillColor: '#ffffff',
        strokeWidth: 2,
      });
    } else if (activeTool === 'arrow') {
      setPreviewElement({
        id: 'preview',
        type: 'arrow',
        x: dragStart.x,
        y: dragStart.y,
        width: w,
        height: h,
        strokeColor: '#0284c7',
        strokeWidth: 2,
      });
    } else if (activeTool === 'line') {
      setPreviewElement({
        id: 'preview',
        type: 'line',
        x: dragStart.x,
        y: dragStart.y,
        width: w,
        height: h,
        strokeColor: '#475569',
        strokeWidth: 2,
      });
    }
  };

  // Mouse Up
  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeTool === 'eraser') {
      if (erasedInCurrentGestureRef.current) {
        pushToHistory(elements);
        erasedInCurrentGestureRef.current = false;
      }
      return;
    }

    if (activeTool === 'select') {
      if (selectedId) {
        pushToHistory(elements);
      }
      setDragStart(null);
      setDragOffset(null);
      return;
    }

    if (previewElement) {
      const minSize = previewElement.type === 'pencil' ? 1 : 12;
      const isTooSmall =
        previewElement.type !== 'pencil' &&
        (previewElement.width || 0) < minSize &&
        (previewElement.height || 0) < minSize;

      if (!isTooSmall) {
        const newEl: CanvasElement = {
          ...previewElement,
          id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        const nextElements = [...elements, newEl];
        setElements(nextElements);
        pushToHistory(nextElements);
        setSelectedId(newEl.id);
      }
      setPreviewElement(null);
    }

    setDragStart(null);
    setCurrentStroke([]);
  };

  // Double click on element to edit its label
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'eraser') return;
    const coords = getCanvasCoords(e);
    const hit = hitTest(coords.x, coords.y);
    if (hit) {
      setEditingTextId(hit.id);
      setTextInputVal(hit.label || hit.text || '');
      setTextInputPos({ x: hit.x + 10, y: hit.y + 10 });
    }
  };

  // Save text input
  const handleSaveText = () => {
    if (!textInputVal.trim()) {
      setTextInputPos(null);
      setEditingTextId(null);
      return;
    }

    if (editingTextId) {
      const newEls = elements.map((el) => {
        if (el.id === editingTextId) {
          return {
            ...el,
            label: el.type !== 'text' ? textInputVal : undefined,
            text: el.type === 'text' ? textInputVal : el.text,
          };
        }
        return el;
      });
      setElements(newEls);
      pushToHistory(newEls);
    } else if (textInputPos) {
      const newEl: CanvasElement = {
        id: `el-${Date.now()}`,
        type: 'text',
        x: textInputPos.x,
        y: textInputPos.y,
        text: textInputVal,
        strokeColor: '#0f172a',
        strokeWidth: 1,
      };
      const nextElements = [...elements, newEl];
      setElements(nextElements);
      pushToHistory(nextElements);
      setSelectedId(newEl.id);
    }

    setTextInputPos(null);
    setEditingTextId(null);
    setTextInputVal('');
  };

  // Add component stamp
  const handleAddStamp = (stamp: ArchitectureComponentStamp) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: 'stamp',
      x: 180 + (elements.length % 5) * 30,
      y: 120 + (elements.length % 5) * 30,
      width: 148,
      height: 68,
      strokeColor: stamp.border,
      fillColor: stamp.fill,
      strokeWidth: 2,
      label: stamp.name,
      text: stamp.subtitle,
      stampType: stamp.id,
    };
    const nextElements = [...elements, newEl];
    setElements(nextElements);
    pushToHistory(nextElements);
    setSelectedId(newEl.id);
    setShowStampPicker(false);
    setActiveTool('select');
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(prev);
      setHistoryIndex(historyIndex - 1);
      setSelectedId(null);
    } else if (historyIndex === 0) {
      setElements([]);
      setHistoryIndex(-1);
      setSelectedId(null);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setElements(next);
      setHistoryIndex(historyIndex + 1);
      setSelectedId(null);
    }
  };

  // Clear Canvas
  const handleClear = () => {
    if (elements.length === 0) return;
    if (window.confirm('Clear all drawings and architecture components from the canvas?')) {
      pushToHistory([]);
      setElements([]);
      setSelectedId(null);
      localStorage.removeItem(`codenexus-canvas-${problemId}`);
    }
  };

  // Empty state condition
  const isEmpty = elements.length === 0 && !isDrawing;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] lg:h-[580px] rounded-2xl overflow-hidden shadow-2xl border border-[#2a384e] bg-[#FEFDF6]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #EAE5D8 1px, transparent 1px),
          linear-gradient(to bottom, #EAE5D8 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Top-Left Instruction Pill (matches Image 1: "Click here to draw") */}
      <div className="absolute top-4 left-4 z-20">
        <button
          type="button"
          onClick={() => setActiveTool('pencil')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/40 text-emerald-800 text-xs font-semibold shadow-sm hover:bg-emerald-500/20 transition-all cursor-pointer backdrop-blur-sm"
        >
          <Pencil className="w-3.5 h-3.5 text-emerald-600" />
          <span>Click here to draw</span>
        </button>
      </div>

      {/* Top-Right Canvas Controls: Auto-save & Clear canvas */}
      <div className="absolute top-4 right-16 sm:right-20 z-20 flex items-center gap-2">
        {/* Auto-save Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/40 text-emerald-800 text-xs font-medium shadow-sm backdrop-blur-sm">
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          <span>{saveStatus === 'saving' ? 'Saving...' : 'Auto-save'}</span>
          {saveStatus === 'saved' && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
        </div>

        {/* Clear Canvas */}
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-rose-600 text-xs font-medium shadow-sm transition-colors cursor-pointer backdrop-blur-sm"
          title="Clear Canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear canvas</span>
        </button>
      </div>

      {/* HTML5 Interactive Drawing Surface */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className="absolute inset-0 w-full h-full z-10"
        style={{
          cursor:
            activeTool === 'select'
              ? 'default'
              : activeTool === 'eraser'
              ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'%23fecdd3\' stroke=\'%23e11d48\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21\'/><path d=\'M22 21H7\'/><path d=\'m5 11 9 9\'/></svg>") 4 20, pointer'
              : activeTool === 'text'
              ? 'text'
              : 'crosshair',
        }}
      />

      {/* Centered Empty State (disappears automatically once user draws) */}
      {isEmpty && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="border border-dashed border-indigo-300/80 bg-white/75 backdrop-blur-sm px-8 py-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm text-center">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
              <Pencil className="w-4 h-4 text-indigo-600" />
              <span>Click here to draw</span>
            </div>
            <p className="text-slate-500 text-xs">
              Use the tools on the right to create your architecture
            </p>
          </div>
        </div>
      )}

      {/* Floating Vertical Right Toolbar Dock */}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-1.5 gap-1">
        {/* 1. Select / Pointer */}
        <button
          type="button"
          onClick={() => setActiveTool('select')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'select'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Select and Move"
        >
          <MousePointer2 className="w-4 h-4" />
        </button>

        {/* 2. Rectangle */}
        <button
          type="button"
          onClick={() => setActiveTool('rect')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'rect'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Rectangle (Empty)"
        >
          <Square className="w-4 h-4" />
        </button>

        {/* 3. Diamond */}
        <button
          type="button"
          onClick={() => setActiveTool('diamond')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'diamond'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Diamond (Empty)"
        >
          <Diamond className="w-4 h-4" />
        </button>

        {/* 4. Circle / Ellipse */}
        <button
          type="button"
          onClick={() => setActiveTool('circle')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'circle'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Circle / Ellipse (Empty)"
        >
          <Circle className="w-4 h-4" />
        </button>

        {/* 5. Arrow */}
        <button
          type="button"
          onClick={() => setActiveTool('arrow')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'arrow'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Connection Arrow"
        >
          <MoveRight className="w-4 h-4" />
        </button>

        {/* 6. Straight Line */}
        <button
          type="button"
          onClick={() => setActiveTool('line')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'line'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Straight Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* 7. Text Tool */}
        <button
          type="button"
          onClick={() => setActiveTool('text')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'text'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Text Label (Click on canvas to add text)"
        >
          <Type className="w-4 h-4" />
        </button>

        {/* 8. Freehand Pencil */}
        <button
          type="button"
          onClick={() => setActiveTool('pencil')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'pencil'
              ? 'bg-sky-100 text-sky-600 shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Freehand Pencil"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* 9. Eraser Tool (Near Pencil in toolbar with visible active state) */}
        <button
          type="button"
          onClick={() => setActiveTool('eraser')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'eraser'
              ? 'bg-rose-100 text-rose-600 shadow-inner ring-2 ring-rose-400/50'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Eraser (Click or drag across shapes, lines, text, or freehand strokes to remove)"
        >
          <Eraser className="w-4 h-4" />
        </button>

        {/* 10. Architectural Component Stencils / Stencil Card Stamping */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStampPicker((prev) => !prev)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              showStampPicker
                ? 'bg-purple-100 text-purple-600 shadow-inner'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="System Component Stencils"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Stencil Component Popup */}
          {showStampPicker && (
            <div className="absolute right-full mr-2 bottom-0 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-30 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Architecture Stencils</span>
                <button
                  type="button"
                  onClick={() => setShowStampPicker(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {ARCHITECTURE_STAMPS.map((stamp) => (
                  <button
                    key={stamp.id}
                    type="button"
                    onClick={() => handleAddStamp(stamp)}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{stamp.name}</div>
                      <div className="text-[10px] text-slate-500">{stamp.subtitle}</div>
                    </div>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stamp.border }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 11. Undo */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyIndex < 0}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* 12. Redo */}
        <button
          type="button"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Text Input Overlay */}
      {textInputPos && (
        <div
          className="absolute z-30 bg-white border-2 border-sky-500 rounded-lg shadow-xl p-2 flex items-center gap-2"
          style={{ left: Math.min(textInputPos.x, 600), top: Math.min(textInputPos.y, 420) }}
        >
          <input
            type="text"
            autoFocus
            value={textInputVal}
            onChange={(e) => setTextInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveText();
              if (e.key === 'Escape') {
                setTextInputPos(null);
                setEditingTextId(null);
              }
            }}
            placeholder="Enter text..."
            className="text-xs text-slate-900 font-medium px-2 py-1 outline-none border border-slate-200 rounded w-48"
          />
          <button
            type="button"
            onClick={handleSaveText}
            className="px-2.5 py-1 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 cursor-pointer"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => {
              setTextInputPos(null);
              setEditingTextId(null);
            }}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
