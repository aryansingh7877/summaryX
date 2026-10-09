'use client';

import React from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import {
  Search,
  Kanban,
  List,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    urgentActions,
    keyDecisions,
    resolvedOrNoise,
    activeTab,
    setTab,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    clearAll,
    setIngestionModalOpen,
    rawMessages,
  } = useTriageStore();

  const totalCards = urgentActions.length + keyDecisions.length + resolvedOrNoise.length;

  return (
    <header className="relative z-30 w-full px-6 py-3.5 select-none border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: macOS Traffic Lights + Brand Mark + Offline & Secure Pill */}
        <div className="flex items-center gap-4">
          {/* macOS Traffic Light Dots */}
          <div className="flex items-center gap-2 pr-1">
            <span
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-xs cursor-pointer hover:opacity-80 transition-opacity"
              title="Close"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-xs cursor-pointer hover:opacity-80 transition-opacity"
              title="Minimize"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-xs cursor-pointer hover:opacity-80 transition-opacity"
              title="Expand"
            />
          </div>

          <div className="h-4 w-[1px] bg-slate-300" />

          {/* Brand Mark */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight font-sans text-[#0F172A]">
                TRIAGE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                WHATSAPP
              </span>
            </div>
          </div>

          {/* Offline & Secure Pill */}
          <div
            title="100% on-device local parser. Zero network packets sent to cloud."
            className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border border-emerald-200/80 bg-emerald-50 text-emerald-800 shadow-2xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Offline & Secure (0 Cloud Bytes)</span>
          </div>
        </div>

        {/* Center: Frosted Search Bar Pill */}
        <div className="flex-1 max-w-md mx-2 relative hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parsed chat stream..."
              className="w-full pl-8 pr-24 py-1.5 rounded-full text-xs font-sans transition-all bg-slate-100/80 border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 shadow-2xs"
            />

            {/* Live indicator badge */}
            <div className="absolute right-2 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              <Sparkles className="w-2.5 h-2.5 animate-spin text-amber-500" />
              <span>{rawMessages.length > 0 ? 'Live Stream' : 'Ready'}</span>
            </div>
          </div>
        </div>

        {/* Right: View Toggle + Ingest File Button */}
        <div className="flex items-center gap-2.5">
          {/* View Toggle (Columns vs List) */}
          {totalCards > 0 && (
            <div className="flex items-center p-0.5 rounded-xl border border-slate-200 bg-slate-100/80 text-xs font-sans">
              <button
                onClick={() => setViewMode('columns')}
                title="3-Column Board"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'columns'
                    ? 'bg-white shadow-xs text-[#0F172A] font-bold'
                    : 'text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-xs text-[#0F172A] font-bold'
                    : 'text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reset Stream */}
          {totalCards > 0 && (
            <button
              onClick={clearAll}
              title="Reset dashboard to empty state"
              className="p-1.5 rounded-xl border border-slate-200 bg-slate-100/80 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Ingest WhatsApp Chat CTA: Vivid Coral/Orange Gradient */}
          <button
            onClick={() => setIngestionModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#F97316] hover:opacity-95 text-white font-semibold text-xs font-sans flex items-center gap-1.5 shadow-md shadow-rose-500/25 transition-all scale-100 active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Ingest WhatsApp Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
