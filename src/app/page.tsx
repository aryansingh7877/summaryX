'use client';

import React, { useMemo } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { Header } from '@/components/triage/Header';
import { TriageColumn } from '@/components/triage/TriageColumn';
import { TriageListView } from '@/components/triage/TriageListView';
import { TaskSidebar } from '@/components/triage/TaskSidebar';
import { UnderTheHoodStatusBar } from '@/components/triage/UnderTheHoodStatusBar';
import { ContextDrawer } from '@/components/triage/ContextDrawer';
import { ChatIngestionModal } from '@/components/modals/ChatIngestionModal';
import { motion } from 'framer-motion';
import {
  Upload,
  ShieldCheck,
  CheckCircle2,
  Filter,
  MessageSquare,
  Flame,
  Lightbulb,
  CheckCheck,
  Layers,
} from 'lucide-react';

export default function Home() {
  const {
    rawMessages,
    urgentActions,
    keyDecisions,
    resolvedOrNoise,
    activeTab,
    setTab,
    viewMode,
    searchQuery,
    setIngestionModalOpen,
  } = useTriageStore();

  const isInboxEmpty = rawMessages.length === 0;

  // Filter cards by search query
  const filterList = (list: typeof urgentActions) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.chatName.toLowerCase().includes(q) ||
        c.sender.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.actionTags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const filteredUrgent = useMemo(() => filterList(urgentActions), [urgentActions, searchQuery]);
  const filteredFyi = useMemo(() => filterList(keyDecisions), [keyDecisions, searchQuery]);
  const filteredResolved = useMemo(() => filterList(resolvedOrNoise), [resolvedOrNoise, searchQuery]);

  const allFiltered = useMemo(
    () => [...filteredUrgent, ...filteredFyi, ...filteredResolved],
    [filteredUrgent, filteredFyi, filteredResolved]
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col p-2.5 sm:p-4 md:p-6 lg:p-7 select-none font-sans antialiased text-[#0F172A]">
      {/* =========================================================================
          1. DYNAMIC COLORFUL BACKGROUND (macOS Sonoma / Aurora Multi-Colored Mesh)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#0A0D17]">
        {/* Blob 1: Electric Violet (#7C3AED) */}
        <div className="absolute -top-[15%] -left-[10%] w-[52vw] h-[52vw] rounded-full bg-[#7C3AED] opacity-75 blur-[125px] animate-aurora-1" />

        {/* Blob 2: Deep Coral Pink (#EC4899) */}
        <div className="absolute top-[0%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#EC4899] opacity-80 blur-[120px] animate-aurora-2" />

        {/* Blob 3: Azure Blue (#3B82F6) */}
        <div className="absolute -bottom-[20%] -left-[5%] w-[54vw] h-[54vw] rounded-full bg-[#3B82F6] opacity-75 blur-[135px] animate-aurora-3" />

        {/* Blob 4: Warm Lime/Emerald (#10B981) */}
        <div className="absolute -bottom-[15%] right-[10%] w-[46vw] h-[46vw] rounded-full bg-[#10B981] opacity-70 blur-[125px] animate-aurora-1" />

        {/* Glass veil over the wallpaper */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.04]" />
      </div>

      {/* =========================================================================
          2. FROSTED PILLS & DOCK CONTROLS (Arc Browser-style Floating Pills)
         ========================================================================= */}
      <div className="relative z-20 mb-3 flex items-center justify-between gap-3 px-2">
        {/* Left: Arc-style Category Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-pill-float">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-800 hover:text-black hover:bg-white/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            <span>All Cards</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/80 font-bold text-slate-800">
              {urgentActions.length + keyDecisions.length + resolvedOrNoise.length}
            </span>
          </button>

          <button
            onClick={() => setTab('urgent')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'urgent'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-800 hover:text-black hover:bg-white/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Urgent</span>
            {urgentActions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 font-bold text-rose-700">
                {urgentActions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('fyi')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'fyi'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-800 hover:text-black hover:bg-white/40'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Decisions</span>
            {keyDecisions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 font-bold text-amber-800">
                {keyDecisions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('resolved')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'resolved'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-800 hover:text-black hover:bg-white/40'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Resolved</span>
          </button>
        </div>

        {/* Right: Quick Arc-Style System Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-pill-float text-xs font-mono text-slate-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>macOS Sonoma Aurora Glass</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">Local-First Sandbox</span>
        </div>
      </div>

      {/* =========================================================================
          3. CRISP LIGHT FLOATING DASHBOARD WINDOW (Elevated OS Window)
         ========================================================================= */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-[1740px] mx-auto rounded-[28px] bg-white/92 backdrop-blur-3xl border border-white/60 shadow-window-float overflow-hidden transition-all">
        {/* Top Header inside the window */}
        <Header />

        {/* Main Content Area + Task Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Board Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]/60">
            {isInboxEmpty ? (
              /* --- CRISP WHITE EMPTY STATE CARD --- */
              <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl text-center space-y-6"
                >
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold tracking-tight text-[#0F172A] font-sans">
                      No WhatsApp Chat Ingested
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-sm mx-auto">
                      Upload an exported <code className="text-rose-600 font-mono font-semibold">_chat.txt</code> log or paste a live message stream. Messages will be sanitized, classified, and triaged 100% on-device.
                    </p>
                  </div>

                  {/* Vivid Coral/Orange Gradient CTA Button */}
                  <div className="relative inline-flex justify-center items-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-20"></span>
                    <button
                      onClick={() => setIngestionModalOpen(true)}
                      className="relative px-6 py-3 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#F97316] hover:opacity-95 text-white font-semibold text-xs font-sans flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all scale-100 hover:scale-102 active:scale-98"
                    >
                      <Upload className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Ingest WhatsApp Chat</span>
                    </button>
                  </div>

                  {/* Local-First Transparency Badges in Porcelain Pills */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-700">
                    <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>0 Cloud Bytes</span>
                    </div>
                    <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-blue-600" />
                      <span>Noise Filter</span>
                    </div>
                    <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Auto Tasks</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : viewMode === 'columns' ? (
              /* --- DYNAMIC 3-COLUMN TRIAGE BOARD --- */
              <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
                <div className="h-full flex gap-5 min-w-max">
                  {(activeTab === 'all' || activeTab === 'urgent') && (
                    <TriageColumn category="urgent" cards={filteredUrgent} />
                  )}
                  {(activeTab === 'all' || activeTab === 'fyi') && (
                    <TriageColumn category="fyi" cards={filteredFyi} />
                  )}
                  {(activeTab === 'all' || activeTab === 'resolved') && (
                    <TriageColumn category="resolved" cards={filteredResolved} />
                  )}
                </div>
              </div>
            ) : (
              /* --- COMPACT LIST VIEW --- */
              <div className="flex-1 overflow-hidden">
                <TriageListView cards={allFiltered} />
              </div>
            )}
          </main>

          {/* Auto-Extracted Task Checklist Sidebar + Integrated TimeScrubberClock */}
          <TaskSidebar />
        </div>

        {/* Under The Hood Status Bar */}
        <UnderTheHoodStatusBar />
      </div>

      {/* Realtime Context Slice Drawer */}
      <ContextDrawer />

      {/* Chat Ingestion Modal */}
      <ChatIngestionModal />
    </div>
  );
}
