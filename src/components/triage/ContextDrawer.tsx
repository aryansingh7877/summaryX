'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const ContextDrawer: React.FC = () => {
  const { rawMessages, selectedCard, selectCard, moveCard } = useTriageStore();
  const [copied, setCopied] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<'commit' | 'decline'>('commit');
  const [customReply, setCustomReply] = useState('');

  useEffect(() => {
    if (selectedCard) {
      setCustomReply(selectedCard.smartReplies?.commit || selectedCard.suggestedReply);
      setActiveStrategy('commit');
    }
  }, [selectedCard]);

  // Exact real slice of messages around that timestamp from rawMessages
  const contextSlice = useMemo(() => {
    if (!selectedCard || rawMessages.length === 0) return [];
    const idx = selectedCard.sourceMessageIndex;
    if (idx === -1) return [];

    const start = Math.max(0, idx - 2);
    const end = Math.min(rawMessages.length, idx + 3);
    return rawMessages.slice(start, end);
  }, [rawMessages, selectedCard]);

  if (!selectedCard) return null;

  const isResolved = selectedCard.category === 'resolved';

  const handleCopyReply = () => {
    navigator.clipboard.writeText(customReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = selectedCard.senderPhone
    ? `https://wa.me/${selectedCard.senderPhone}?text=${encodeURIComponent(customReply)}`
    : `https://wa.me/?text=${encodeURIComponent(customReply)}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none"
        onClick={() => selectCard(null)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg h-full border-l border-slate-200/80 shadow-2xl flex flex-col overflow-hidden font-sans bg-white/95 backdrop-blur-2xl text-[#0F172A]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    selectedCard.priorityBadge === 'P0'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : selectedCard.priorityBadge === 'P1'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {selectedCard.priorityBadge}
                </span>
                <h2 className="text-sm font-bold tracking-tight text-[#0F172A]">
                  {selectedCard.chatName}
                </h2>
              </div>
              <p className="text-[11px] font-mono mt-0.5 text-slate-500">
                Realtime Context Slice (Source Message #{selectedCard.sourceMessageIndex + 1})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  moveCard(selectedCard.id, isResolved ? 'urgent' : 'resolved')
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isResolved
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {isResolved ? 'Re-open' : 'Mark as Done'}
              </button>

              <button
                onClick={() => selectCard(null)}
                className="p-1.5 rounded-full text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* 1-Sentence Summary */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                Classified Summary
              </div>
              <p className="text-xs leading-relaxed font-medium text-[#0F172A]">
                {selectedCard.summary}
              </p>
            </div>

            {/* Action Tags */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider mb-2 font-bold text-slate-500">
                Detected Action Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCard.actionTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Context Ghostwriter Box in Drawer */}
            <div className="p-4 rounded-2xl border border-indigo-200/90 bg-indigo-50/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950 font-sans">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Context Ghostwriter
                </span>
                <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                  Direct Response
                </span>
              </div>

              {/* Strategy Selector Pills */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStrategy('commit');
                    setCustomReply(
                      selectedCard.smartReplies?.commit || selectedCard.suggestedReply
                    );
                  }}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                    activeStrategy === 'commit'
                      ? 'bg-white border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                      : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 w-fit">
                    COMMIT
                  </span>
                  <span className="text-[11px] leading-tight text-slate-800 line-clamp-2">
                    {selectedCard.smartReplies?.commit || selectedCard.suggestedReply}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStrategy('decline');
                    setCustomReply(
                      selectedCard.smartReplies?.decline ||
                        'Currently tied up with another priority; will follow up later.'
                    );
                  }}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                    activeStrategy === 'decline'
                      ? 'bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                      : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 w-fit">
                    PUSHBACK
                  </span>
                  <span className="text-[11px] leading-tight text-slate-800 line-clamp-2">
                    {selectedCard.smartReplies?.decline ||
                      'Currently tied up with another priority; will follow up later.'}
                  </span>
                </button>
              </div>

              {/* Editable Textarea */}
              <textarea
                rows={2}
                value={customReply}
                onChange={(e) => setCustomReply(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-sans text-[#0F172A] focus:outline-none focus:border-indigo-500 shadow-2xs leading-relaxed"
                placeholder="Customize your response message..."
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={handleCopyReply}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Reply</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all scale-100 hover:scale-102 active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Exact Slice of Surrounding Messages from rawMessages */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Surrounding Messages ({contextSlice.length} lines slice)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Total Chat: {rawMessages.length} lines
                </span>
              </div>

              <div className="space-y-2.5">
                {contextSlice.map((msg) => {
                  const isCurrent = msg.index === selectedCard.sourceMessageIndex;

                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${
                        isCurrent
                          ? 'bg-rose-50/60 border-rose-300 ring-1 ring-rose-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              isCurrent ? 'text-rose-700' : 'text-[#0F172A]'
                            }`}
                          >
                            {msg.sender}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold uppercase">
                              Target Event
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500">{msg.timestamp}</span>
                      </div>

                      <p
                        className={`leading-relaxed font-sans ${
                          isCurrent
                            ? 'text-[#0F172A] font-medium'
                            : 'text-slate-700'
                        }`}
                      >
                        {msg.messageBody}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Local Memory Guarantee */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Client-Side Slice
              </span>
              <span>0 Cloud Requests</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
