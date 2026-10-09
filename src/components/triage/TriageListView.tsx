'use client';

import React from 'react';
import { DynamicTriageCard } from '@/types/triage';
import { useTriageStore } from '@/store/useTriageStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Undo2,
  Tag,
} from 'lucide-react';

interface TriageListViewProps {
  cards: DynamicTriageCard[];
}

export const TriageListView: React.FC<TriageListViewProps> = ({ cards }) => {
  const { selectCard, moveCard } = useTriageStore();

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-4 custom-scrollbar select-none">
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <div className="col-span-3">Chat / Sender</div>
          <div className="col-span-5">Summary</div>
          <div className="col-span-3">Action Tags</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Rows */}
        <AnimatePresence mode="popLayout">
          {cards.map((card) => {
            const isUrgent = card.category === 'urgent';
            const isResolved = card.category === 'resolved';

            return (
              <motion.div
                layout
                key={card.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => selectCard(card)}
                className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                  isUrgent
                    ? 'bg-white border-rose-200/90 hover:border-rose-400 shadow-xs hover:shadow-card-hover'
                    : isResolved
                    ? 'bg-white/60 border-slate-200/60 opacity-60 hover:opacity-95 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-card-hover'
                }`}
              >
                {/* Chat Name Column */}
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      card.priorityBadge === 'P0'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : card.priorityBadge === 'P1'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {card.priorityBadge}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-[#0F172A]">
                      {card.sender}
                    </div>
                    <div className="text-[10px] font-mono truncate text-slate-500">
                      {card.chatName} • {card.timestamp}
                    </div>
                  </div>
                </div>

                {/* AI Summary Column */}
                <div className="col-span-5 min-w-0">
                  <p
                    className={`text-xs font-sans font-medium line-clamp-2 leading-relaxed ${
                      isResolved ? 'line-through text-slate-400' : 'text-[#334155]'
                    }`}
                  >
                    {card.summary}
                  </p>
                </div>

                {/* Tags Column */}
                <div className="col-span-3 flex flex-wrap items-center gap-1.5 min-w-0">
                  {card.actionTags.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium truncate bg-slate-100 text-slate-700 border border-slate-200/80"
                    >
                      <Tag className="w-2.5 h-2.5 shrink-0 opacity-60" />
                      <span className="truncate">{t}</span>
                    </span>
                  ))}
                </div>

                {/* Quick Action Column */}
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveCard(card.id, isResolved ? 'urgent' : 'resolved');
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                  >
                    {isResolved ? (
                      <Undo2 className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {cards.length === 0 && (
          <div className="py-16 text-center text-xs font-sans text-slate-500">
            No conversations matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};
