'use client';

import React, { useState } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Clock, ShieldCheck, ChevronDown } from 'lucide-react';

export const GroupNoiseRadar: React.FC = () => {
  const { stats, suppressedNoiseCount, rawMessages, temporalFilter } = useTriageStore();
  const [isOpen, setIsOpen] = useState(false);

  const totalMessages = stats?.totalParsed ?? rawMessages.length;
  const noiseMessages = stats?.noiseFilteredCount ?? suppressedNoiseCount;
  const noisePercentage =
    stats?.noisePercentage ??
    (totalMessages > 0 ? Math.round((noiseMessages / totalMessages) * 100) : 0);
  const timeSavedMinutes =
    stats?.timeSavedMinutes ??
    (noiseMessages > 0 ? Math.max(1, Math.round((noiseMessages * 4) / 60)) : 0);

  const signalMessages = Math.max(0, totalMessages - noiseMessages);

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Sleek Frosted Pill Widget */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border border-indigo-200/90 bg-indigo-50/70 hover:bg-white text-slate-800 shadow-2xs backdrop-blur-xl transition-all"
        title="Group Noise Radar: Screen-time and focus saved by on-device noise suppression"
      >
        {/* Radar Icon with Micro Pulse Effect */}
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
        </span>

        <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />

        <span className="text-slate-600 font-sans font-medium text-[11px] hidden md:inline">
          Noise Filtered:
        </span>

        <motion.span
          key={noisePercentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="font-bold font-mono text-indigo-700"
        >
          {noisePercentage}%
        </motion.span>

        {/* Emerald Time-Saved Badge */}
        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] font-mono shrink-0 border border-emerald-200/60 hidden sm:inline">
          ~{timeSavedMinutes}m saved
        </span>

        <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover:rotate-180" />
      </button>

      {/* Hover / Tooltip Dropdown Breakdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 w-76 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl z-50 text-[#0F172A] font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-[#0F172A]">Group Noise Radar</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {temporalFilter.displayLabel}
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-2.5 text-xs">
              {/* Suppressed count */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">
                    {noiseMessages} noise lines suppressed
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Filtered out casual filler ('ok', 'lol', emojis, single-word banter).
                  </div>
                </div>
              </div>

              {/* Time saved */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-900">
                    ~{timeSavedMinutes} minutes saved
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                    Based on standard reading speed of 4 seconds per message.
                  </div>
                </div>
              </div>

              {/* Signal vs Noise Progress Bar */}
              <div className="pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>Signal: {signalMessages}</span>
                  <span>Suppressed: {noiseMessages}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${100 - noisePercentage}%` }}
                    title={`Signal: ${100 - noisePercentage}%`}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${noisePercentage}%` }}
                    title={`Noise: ${noisePercentage}%`}
                  />
                </div>
              </div>

              {/* Guarantee */}
              <div className="pt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Client-Side Scan
                </span>
                <span>Active Window</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
