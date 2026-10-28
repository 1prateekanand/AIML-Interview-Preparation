import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  ChevronUp,
  ChevronDown,
  Mic,
  MicOff,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
} from 'lucide-react';

interface YourAnswerPanelProps {
  answerText: string;
  onChangeAnswer: (text: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const YourAnswerPanel: React.FC<YourAnswerPanelProps> = ({
  answerText,
  onChangeAnswer,
  isExpanded,
  onToggleExpand,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          onChangeAnswer(
            answerText ? `${answerText.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()
          );
        }
      };

      recog.onerror = (e: any) => {
        console.warn('Speech recognition notice/error:', e);
        setIsListening(false);
        setSpeechNotice('Microphone access is unavailable or denied. You can continue typing directly.');
        setTimeout(() => setSpeechNotice(null), 4000);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, [answerText, onChangeAnswer]);

  // Voice toggle
  const toggleSpeech = () => {
    if (!speechSupported) {
      setSpeechNotice('Voice speech input is not supported in this browser. Please type your answer directly.');
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        setSpeechNotice(null);
        recognitionRef.current?.start();
        setIsListening(true);
        if (!isExpanded) {
          onToggleExpand();
        }
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  // Helper for applying markdown formatting to selected text
  const applyFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = answerText.substring(start, end);
    const content = selected || placeholder;

    const updated =
      answerText.substring(0, start) +
      prefix +
      content +
      suffix +
      answerText.substring(end);

    onChangeAnswer(updated);

    setTimeout(() => {
      textarea.focus();
      const selectionStart = start + prefix.length;
      const selectionEnd = selectionStart + content.length;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }, 10);
  };

  return (
    <div
      className={`relative w-full rounded-2xl transition-all duration-300 border bg-[#06111f]/95 backdrop-blur-md overflow-hidden ${
        isExpanded
          ? 'border-[#00f2fe] shadow-[0_0_25px_rgba(0,242,254,0.22)]'
          : 'border-[#00f2fe]/70 shadow-[0_0_16px_rgba(0,242,254,0.14)] hover:border-[#00f2fe] hover:shadow-[0_0_22px_rgba(0,242,254,0.2)]'
      }`}
    >
      {/* COLLAPSED STATE: Full-width dark navy container with cyan border and subtle glow */}
      {!isExpanded ? (
        <div
          onClick={onToggleExpand}
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none gap-3"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleExpand();
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Small Document Icon on the left */}
            <div className="w-8 h-8 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#00f2fe]" />
            </div>

            {/* Placeholder / Snippet */}
            <div className="truncate">
              {answerText.trim() ? (
                <span className="text-sm text-slate-200 truncate block">
                  {answerText.length > 60 ? `${answerText.substring(0, 60)}...` : answerText}
                </span>
              ) : (
                <span className="text-sm text-slate-400 font-normal">
                  Type your answer here...
                </span>
              )}
            </div>
          </div>

          {/* Right Controls: Microphone & Expand */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSpeech();
              }}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-[#00f2fe] hover:border-[#00f2fe]/50'
              }`}
              title={isListening ? 'Stop recording' : 'Speak Answer'}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <div className="w-7 h-7 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
              <ChevronUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        /* EXPANDED STATE: Clean, compact multiline editor matching reference design */
        <div className="p-4 space-y-3 animate-in fade-in duration-150">
          {/* Header Row: Document icon + Title + Right controls (Mic, Collapse) */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/70 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5 text-[#00f2fe]" />
              </div>
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Your Answer
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Speak Answer Voice Button */}
              <button
                type="button"
                onClick={toggleSpeech}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-[#00f2fe]/10 border-[#00f2fe]/40 text-[#00f2fe] hover:bg-[#00f2fe]/20'
                }`}
                title={isListening ? 'Stop recording' : 'Speak Answer'}
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>{isListening ? 'Listening...' : 'Speak'}</span>
              </button>

              {/* Collapse Chevron Button */}
              <button
                type="button"
                onClick={onToggleExpand}
                className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Collapse editor"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {speechNotice && (
            <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5">
              {speechNotice}
            </div>
          )}

          {/* Multiline Textarea with placeholder: "Type your answer here..." */}
          <textarea
            ref={textareaRef}
            value={answerText}
            onChange={(e) => onChangeAnswer(e.target.value)}
            rows={7}
            placeholder="Type your answer here..."
            className="w-full bg-[#030914] border border-slate-800/80 focus:border-[#00f2fe]/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 font-sans leading-relaxed outline-none resize-none transition-colors"
          />

          {/* Compact Formatting Toolbar at the Bottom */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
            {/* Formatting Tools: Bold, Italic, Bulleted list, Numbered list, Insert link, Code */}
            <div className="flex items-center gap-1 text-slate-300">
              {/* Bold */}
              <button
                type="button"
                onClick={() => applyFormatting('**', '**', 'bold text')}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => applyFormatting('*', '*', 'italic text')}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>

              {/* Bulleted List */}
              <button
                type="button"
                onClick={() => applyFormatting('\n- ', '', 'list item')}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Bulleted List"
              >
                <List className="w-4 h-4" />
              </button>

              {/* Numbered List */}
              <button
                type="button"
                onClick={() => applyFormatting('\n1. ', '', 'list item')}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              {/* Insert Link */}
              <button
                type="button"
                onClick={() => applyFormatting('[', '](https://example.com)', 'link text')}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Insert Link"
              >
                <Link2 className="w-4 h-4" />
              </button>

              {/* Code */}
              <button
                type="button"
                onClick={() => applyFormatting('`', '`', 'code')}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Note showing user choice: Text or Diagram */}
            <div className="text-[11px] text-slate-400">
              {answerText.trim() ? (
                <span className="text-[#00f2fe]/80 font-medium">Text answer drafted</span>
              ) : (
                <span>Text or diagram — you can submit either or both</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
