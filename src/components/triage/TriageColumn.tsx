'use client';

import React from 'react';
import { DynamicTriageCard, TriageCategory } from '@/types/triage';
import { TriageCardItem } from './TriageCardItem';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { useTriageStore } from '@/store/useTriageStore';

interface TriageColumnProps {
  category: TriageCategory;
  cards: DynamicTriageCard[];
}

export const TriageColumn: React.FC<TriageColumnProps> = ({ category, cards }) => {
  const { suppressedNoiseCount } = useTriageStore();

  const config = {
    urgent: {
      title: 'Urgent Actions',
      prioritySubtitle: 'P0 / P1 Blockers',
      subtitle: 'Upcoming deadlines, direct mentions, & approvals',
      badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200',
      dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      icon: AlertCircle,
      emptyTitle: 'Zero urgent actions',
      emptySubtitle: 'No high-priority blockers detected in this chat stream.',
    },
    fyi: {
      title: 'Key Decisions & FYI',
      prioritySubtitle: 'P2 Signal Threads',
      subtitle: 'Finalized updates, links, and important announcements',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      icon: Info,
      emptyTitle: 'No decisions / FYI',
      emptySubtitle: 'No general announcements or decision items detected.',
    },
    resolved: {
      title: 'Resolved / Noise Filtered',
      prioritySubtitle: 'Archived & Purged',
      subtitle: `${suppressedNoiseCount} noise messages suppressed ('ok', 'lol', sticker spam)`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      icon: CheckCircle2,
      emptyTitle: 'No archived threads',
      emptySubtitle: `${suppressedNoiseCount} casual messages filtered out on-device.`,
    },
  }[category];

  const IconComponent = config.icon;

  return (
    <div className="flex-1 flex flex-col min-w-[270px] sm:min-w-[290px] xl:min-w-[310px] max-w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-50/75 backdrop-blur-xl p-3 sm:p-4 select-none shadow-xs transition-all">
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 px-1 sm:px-2 py-1 mb-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 truncate">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dotClass}`} />
          <h3 className="text-xs font-bold font-sans tracking-tight text-[#0F172A] truncate">
            {config.title}
          </h3>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${config.badgeClass}`}
          >
            {cards.length}
          </span>
        </div>

        <span className="text-[10px] font-mono uppercase text-slate-500 font-medium shrink-0">
          {config.prioritySubtitle}
        </span>
      </div>

      {/* Subtitle / Noise counter */}
      <div className="px-1 sm:px-2 mb-3 flex items-center justify-between min-w-0">
        <p className="text-[11px] font-sans text-slate-600 leading-relaxed truncate" title={config.subtitle}>
          {config.subtitle}
        </p>
      </div>

      {/* Column Cards Container */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {cards.map((card) => (
            <TriageCardItem key={card.id} card={card} />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {cards.length === 0 && (
          <div className="py-14 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
            <IconComponent className="w-5 h-5 mx-auto mb-2 text-slate-400" />
            <div className="text-xs font-semibold font-sans text-[#0F172A]">
              {config.emptyTitle}
            </div>
            <div className="text-[11px] font-sans text-slate-500 mt-0.5 max-w-xs mx-auto">
              {config.emptySubtitle}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
