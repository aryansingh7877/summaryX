'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicTriageCard } from '@/types/triage';
import { useTriageStore } from '@/store/useTriageStore';
import {
  Clock,
  Check,
  Undo2,
  Copy,
  Eye,
  Tag,
  Sparkles,
  Send,
  CheckCircle2,
  X,
  MessageSquareReply,
} from 'lucide-react';

interface TriageCardItemProps {
  card: DynamicTriageCard;
}

export const TriageCardItem: React.FC<TriageCardItemProps> = ({ card }) => {
  const { selectCard, moveCard } = useTriageStore();
  const [copied, setCopied] = useState(false);
  const [isGhostwriterOpen, setIsGhostwriterOpen] = useState(false);

  const defaultReply = card.smartReplies?.commit || card.suggestedReply;
  const [replyText, setReplyText] = useState(defaultReply);
  const [selectedPill, setSelectedPill] = useState<'commit' | 'decline'>('commit');
  const [copiedGhostwriter, setCopiedGhostwriter] = useState(false);

  const isUrgent = card.category === 'urgent';
  const isResolved = card.category === 'resolved';

  const handleCopyReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDoneToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveCard(card.id, isResolved ? 'urgent' : 'resolved');
  };

  const handleViewContext = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCard(card);
  };

  const handleToggleGhostwriter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGhostwriterOpen((prev) => !prev);
  };

  const handleCopyGhostwriterReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(replyText);
    setCopiedGhostwriter(true);
    setTimeout(() => setCopiedGhostwriter(false), 2000);
  };

  const whatsappUrl = card.senderPhone
    ? `https://wa.me/${card.senderPhone}?text=${encodeURIComponent(replyText)}`
    : `https://wa.me/?text=${encodeURIComponent(replyText)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={() => selectCard(card)}
      className={`group relative p-4 rounded-2xl border transition-all duration-200 ease-out hover:scale-[1.015] select-none cursor-pointer ${
        isUrgent
          ? 'bg-white border-rose-200/90 hover:border-rose-400 shadow-xs hover:shadow-card-hover'
          : isResolved
          ? 'bg-white/60 border-slate-200/60 opacity-60 hover:opacity-95 shadow-xs'
          : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-card-hover'
      }`}
    >
      {/* Top Header: Sender / Group + Timestamp + Priority Badge */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          {/* Pastel Priority Pill */}
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
              card.priorityBadge === 'P0'
                ? 'bg-rose-50 text-rose-600 border border-rose-200/90'
                : card.priorityBadge === 'P1'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/90'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {card.priorityBadge}
          </span>

          <span className="text-xs font-semibold truncate font-sans text-[#0F172A] shrink min-w-0">
            {card.sender}
          </span>

          <span className="text-[10px] font-mono truncate text-slate-500 shrink min-w-0 hidden sm:inline">
            {card.chatName}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-slate-500 shrink-0 ml-1">
          <Clock className="w-3 h-3 opacity-70" />
          <span className="whitespace-nowrap">{card.timestamp}</span>
        </div>
      </div>

      {/* 1-Sentence Plain English Summary */}
      <p
        className={`text-xs leading-relaxed font-sans font-medium mb-3 ${
          isResolved ? 'line-through text-slate-400' : 'text-[#334155]'
        }`}
      >
        {card.summary}
      </p>

      {/* Action Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
        {card.actionTags.map((tag, idx) => {
          const isDue =
            tag.toLowerCase().includes('due') || tag.toLowerCase().includes('today');
          const isMention = tag.toLowerCase().includes('mention');

          return (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                isDue
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : isMention
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Tag className="w-2.5 h-2.5 opacity-60" />
              <span>{tag}</span>
            </span>
          );
        })}
      </div>

      {/* =========================================================================
          FEATURE 1: ONE-CLICK CONTEXT GHOSTWRITER (Inline Accordion)
         ========================================================================= */}
      <AnimatePresence>
        {isGhostwriterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="mb-3.5 overflow-hidden rounded-2xl border border-indigo-200/90 bg-indigo-50/50 p-3 text-[#0F172A] shadow-xs"
          >
            {/* Ghostwriter Title Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 mb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950 font-sans">
                  Context Ghostwriter
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Smart Intent
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleGhostwriter}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-indigo-100/60 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Context-Aware Smart Suggestions: 2 Concise Professional Pills */}
            <div className="space-y-1.5 mb-2.5">
              <div className="text-[10px] font-mono text-slate-500 font-semibold">
                Select Strategy:
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {/* Option A: Commit / Agree */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPill('commit');
                    setReplyText(card.smartReplies?.commit || card.suggestedReply);
                  }}
                  className={`p-2 rounded-xl text-left text-xs font-sans transition-all border flex items-start gap-2 ${
                    selectedPill === 'commit'
                      ? 'bg-white border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                      : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 mt-0.5">
                    COMMIT
                  </span>
                  <span className="text-[11px] leading-snug text-slate-800 font-medium line-clamp-2">
                    {card.smartReplies?.commit || card.suggestedReply}
                  </span>
                </button>

                {/* Option B: Decline / Pushback */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPill('decline');
                    setReplyText(
                      card.smartReplies?.decline ||
                        'Currently blocked on another priority; will follow up as soon as free.'
                    );
                  }}
                  className={`p-2 rounded-xl text-left text-xs font-sans transition-all border flex items-start gap-2 ${
                    selectedPill === 'decline'
                      ? 'bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                      : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0 mt-0.5">
                    PUSHBACK
                  </span>
                  <span className="text-[11px] leading-snug text-slate-800 font-medium line-clamp-2">
                    {card.smartReplies?.decline ||
                      'Currently blocked on another priority; will follow up as soon as free.'}
                  </span>
                </button>
              </div>
            </div>

            {/* Editable Customization Textarea */}
            <div className="mb-2.5">
              <label className="text-[10px] font-mono text-slate-500 font-semibold block mb-1">
                Customize / Edit Message:
              </label>
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-sans text-[#0F172A] focus:outline-none focus:border-indigo-500 shadow-2xs leading-relaxed"
                placeholder="Type or customize your direct reply..."
              />
            </div>

            {/* Instant Action Triggers: Copy Reply & Send via WhatsApp */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyGhostwriterReply}
                className="flex-1 min-w-[110px] px-3 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-colors shadow-2xs"
              >
                {copiedGhostwriter ? (
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
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-w-[130px] px-3 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xs transition-all scale-100 hover:scale-102 active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Row: Quick Action Buttons (Wrap-friendly, zero cutoff) */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          {/* Quick Reply (Context Ghostwriter Toggle) */}
          <button
            type="button"
            onClick={handleToggleGhostwriter}
            className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold flex items-center gap-1 transition-all ${
              isGhostwriterOpen
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Reply</span>
          </button>

          {/* View Context */}
          <button
            type="button"
            onClick={handleViewContext}
            className="px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] border border-slate-200/70 transition-colors"
          >
            <Eye className="w-3 h-3 text-slate-500" />
            <span>Context</span>
          </button>

          {/* Fast Copy Reply */}
          <button
            type="button"
            onClick={handleCopyReply}
            title={`Copy: "${card.suggestedReply}"`}
            className="px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] border border-slate-200/70 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Mark as Done / Undo */}
        <button
          type="button"
          onClick={handleDoneToggle}
          title={isResolved ? 'Re-open card' : 'Mark as Done'}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1 transition-colors shrink-0 ${
            isResolved
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold'
          }`}
        >
          {isResolved ? (
            <>
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
              <span>Done</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
