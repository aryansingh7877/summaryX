'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  ShieldCheck,
  Battery,
  BatteryCharging,
  Zap,
  Volume2,
  VolumeX,
  PlusCircle,
  RefreshCw,
  Search,
  Activity,
  Layers,
  Inbox,
  Radio,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const {
    powerMode,
    setPowerMode,
    batteryPct,
    setBatteryPct,
    isProcessing,
    reprocessChats,
    isAudioPlaying,
    toggleAudioBriefing,
    audioProgress,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setIngestModalOpen,
  } = useAppStore();

  return (
    <header className="header-stagger relative z-30 w-full bg-surface-200/90 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex items-center justify-between shadow-glass select-none">
      {/* Left: Branding & Local-First Security Badge */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 shadow-neon-cyan">
            <Activity className="w-4 h-4 text-cyan-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-sans tracking-tight text-white">
                SUMMARY<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                PROTOTYPE
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 -mt-0.5 tracking-wider">
              ACTION-GRAPH ARCHITECTURE
            </div>
          </div>
        </div>

        {/* Glowing "Offline & Secure" Badge */}
        <div
          title="Strictly Local-First: Zero telemetry or chat content is transmitted to cloud servers. All models run in local WebAssembly/WebGPU."
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-neon-resolved cursor-default group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold tracking-wide">Offline & Secure</span>
          <span className="text-[10px] text-emerald-400/70 font-mono ml-0.5">0ms Cloud Latency</span>
        </div>
      </div>

      {/* Center: View Mode Nav Buttons & Search */}
      <div className="flex items-center gap-3">
        {/* View Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-surface-100/90 border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveView('3d-graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeView === '3d-graph'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            3D Graph
          </button>
          <button
            onClick={() => setActiveView('tiered-engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'tiered-engine'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glass'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Tiered Engine
          </button>
          <button
            onClick={() => setActiveView('raw-inbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'raw-inbox'
                ? 'bg-zinc-700/60 text-white border border-white/20 shadow-inner'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Raw Chats
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes, #channels..."
            className="w-48 xl:w-56 pl-8 pr-3 py-1.5 rounded-xl bg-surface-100/80 border border-white/10 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
        </div>
      </div>

      {/* Right: Audio Briefing, Battery Telemetry HUD & Ingest Button */}
      <div className="flex items-center gap-3">
        {/* Play Audio Briefing Button */}
        <button
          onClick={toggleAudioBriefing}
          className={`relative px-3 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-2 transition-all ${
            isAudioPlaying
              ? 'bg-purple-500/20 text-purple-200 border-purple-500/50 shadow-neon-cyan ring-1 ring-purple-400'
              : 'bg-surface-100/80 text-zinc-300 border-white/10 hover:border-purple-500/40 hover:text-white'
          }`}
        >
          {isAudioPlaying ? (
            <>
              <div className="flex items-center gap-0.5 h-3.5">
                <span className="w-1 h-3 bg-purple-400 rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
              <span className="text-purple-300 font-bold">Briefing Active ({audioProgress}%)</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio Briefing</span>
            </>
          )}
        </button>

        {/* Battery Telemetry & Power Mode Switcher */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-100/90 border border-white/10 font-mono text-xs">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
            title="Click to cycle simulated battery level"
            onClick={() => {
              const next = batteryPct > 70 ? 45 : batteryPct > 30 ? 15 : 92;
              setBatteryPct(next);
            }}
          >
            {batteryPct > 20 ? (
              <Battery className="w-4 h-4 text-emerald-400" />
            ) : (
              <BatteryCharging className="w-4 h-4 text-rose-400 animate-pulse" />
            )}
            <span
              className={`font-semibold ${
                batteryPct > 20 ? 'text-zinc-300' : 'text-rose-400 font-bold'
              }`}
            >
              {batteryPct}%
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/10" />

          {/* Power Mode Pills */}
          <div className="flex items-center gap-1">
            {(['eco', 'balanced', 'turbo'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPowerMode(mode)}
                disabled={isProcessing}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all ${
                  powerMode === mode
                    ? mode === 'turbo'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-neon-urgent'
                      : mode === 'balanced'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-neon-resolved'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Reprocess / Sync Trigger */}
        <button
          onClick={reprocessChats}
          disabled={isProcessing}
          title="Re-run 3-Tier processing pipeline on local chats"
          className="p-2 rounded-xl bg-surface-100/80 border border-white/10 text-zinc-400 hover:text-white hover:border-cyan-400/40 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Ingest Simulated Chat Modal Button */}
        <button
          onClick={() => setIngestModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shadow-neon-cyan hover:bg-cyan-400 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5 text-black" />
          <span>+ Ingest Chat</span>
        </button>
      </div>
    </header>
  );
};
