'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DynamicTriageCard } from '@/types/triage';
import { useTriageStore } from '@/store/useTriageStore';
import {
  Clock,
  Check,
  Undo2,
  Copy,
  Eye,
  Tag,
} from 'lucide-react';

interface TriageCardItemProps {
  card: DynamicTriageCard;
}

export const TriageCardItem: React.FC<TriageCardItemProps> = ({ card }) => {
  const { selectCard, moveCard } = useTriageStore();
  const [copied, setCopied] = useState(false);

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
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
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

          <span className="text-xs font-semibold truncate font-sans text-[#0F172A]">
            {card.sender}
          </span>

          <span className="text-[10px] font-mono truncate text-slate-500">
            {card.chatName}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 shrink-0">
          <Clock className="w-3 h-3 opacity-70" />
          <span>{card.timestamp}</span>
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

      {/* Bottom Row: Quick Action Buttons */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          {/* View Context */}
          <button
            onClick={handleViewContext}
            className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] border border-slate-200/70 transition-colors"
          >
            <Eye className="w-3 h-3 text-slate-500" />
            <span>View Context</span>
          </button>

          {/* Copy Reply */}
          <button
            onClick={handleCopyReply}
            title={`Copy: "${card.suggestedReply}"`}
            className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] border border-slate-200/70 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy Reply</span>
              </>
            )}
          </button>
        </div>

        {/* Mark as Done / Undo */}
        <button
          onClick={handleDoneToggle}
          title={isResolved ? 'Re-open card' : 'Mark as Done'}
          className={`px-3 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1 transition-colors ${
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
              <span>Mark Done</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
