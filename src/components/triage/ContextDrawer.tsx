'use client';

import React, { useState, useMemo } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const ContextDrawer: React.FC = () => {
  const { rawMessages, selectedCard, selectCard, moveCard } = useTriageStore();
  const [copied, setCopied] = useState(false);

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
    navigator.clipboard.writeText(selectedCard.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
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

            {/* Suggested Reply */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-700 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Suggested Fast Reply
                </span>
                <button
                  onClick={handleCopyReply}
                  className="px-2 py-0.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-700 stroke-[2.5]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Reply</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2.5 rounded-xl text-xs font-mono leading-relaxed border border-slate-200 bg-white text-[#0F172A]">
                &quot;{selectedCard.suggestedReply}&quot;
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
