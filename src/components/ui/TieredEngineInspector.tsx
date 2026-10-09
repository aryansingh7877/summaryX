'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Layers,
  Zap,
  Cpu,
  ShieldCheck,
  Filter,
  Users,
  Sparkles,
  Battery,
  Clock,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TieredEngineInspector: React.FC = () => {
  const { stats, tierLogs, powerMode, batteryPct, isProcessing, processingStep } = useAppStore();

  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-background text-zinc-100 custom-scrollbar select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Architecture Inspector
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-sans tracking-tight text-white">
              Battery-Aware Tiered Processing Engine
            </h1>
            <p className="text-sm text-zinc-400 font-sans mt-1 max-w-2xl">
              Local-first hierarchical inference: filters 90% of chat noise with zero-cost regex before invoking lightweight entity models, reserving the local SLM only for high-entropy debates and decisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-surface-100/90 border border-white/10 text-right font-mono">
              <div className="text-[11px] text-zinc-400">CURRENT STATUS</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isProcessing ? processingStep : 'Engine Idle & Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/10 shadow-glass">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>Tier 1 Noise Eliminated</span>
              <Filter className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              {stats.noiseFilteredCount}{' '}
              <span className="text-xs text-zinc-500 font-normal">
                ({Math.round(stats.tier1FilterRatio * 100)}% of raw)
              </span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 mt-1">
              0.0001 J Zero-Cost Pruning
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/10 shadow-glass">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>Tier 2 Topic Clusters</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              {stats.tier2EntityCount}{' '}
              <span className="text-xs text-zinc-500 font-normal">threads mapped</span>
            </div>
            <div className="text-[11px] font-mono text-amber-400 mt-1">
              Who / What / When Extracted
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/10 shadow-glass">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>Tier 3 Action Nodes</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              {stats.tier3SynthesizedCount}{' '}
              <span className="text-xs text-zinc-500 font-normal">critical nodes</span>
            </div>
            <div className="text-[11px] font-mono text-purple-400 mt-1">
              Mode: {powerMode.toUpperCase()} Quantized
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/10 shadow-glass">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>Total Battery Saved</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
              +{stats.batteryJoulesSaved} J
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1">
              {stats.processingTimeMs}ms Total Inference Latency
            </div>
          </div>
        </div>

        {/* 3-Tier Step Breakdown Visual Pipeline */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Execution Stages & Battery Throttling Strategy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TIER 1 CARD */}
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-cyan-500/30 shadow-glass flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] rounded-bl-xl font-bold">
                TIER 1 • ZERO-COST
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Heuristic Noise Scanner
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">
                    Evaluates message entropy via compiled regular expressions. Discards social acknowledgments (&quot;ok&quot;, &quot;k&quot;, &quot;cool&quot;, &quot;gm&quot;) and emoji cascades without firing the GPU.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                  <div className="text-cyan-400 text-[11px]">Active Patterns:</div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    /^(ok|cool|sure|yep|thanks|gm)/i
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {"/^[\\p{Emoji}\\s]+$/u (Emoji cascades)"}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Power Draw:</span>
                <span className="text-cyan-300 font-bold">0.0001 J (Micro-Watt)</span>
              </div>
            </div>

            {/* TIER 2 CARD */}
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-amber-500/30 shadow-glass flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-[10px] rounded-bl-xl font-bold">
                TIER 2 • LOW-COST
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Entity & Signal Extractor
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">
                    Lightweight token scanner extracting Who (stakeholders, roles), What (action verbs, blockers), and When (deadlines, timestamps). Scores urgency (0-100).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                  <div className="text-amber-400 text-[11px]">Extraction Outputs:</div>
                  <div className="text-[10px] text-zinc-400">
                    • Identified 6 Channels / Clusters
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    • Urgency weighted from Sev1/Alert signals
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Power Draw:</span>
                <span className="text-amber-300 font-bold">0.006 J (Low-Power Core)</span>
              </div>
            </div>

            {/* TIER 3 CARD */}
            <div className="p-6 rounded-2xl bg-surface-100/90 border border-purple-500/30 shadow-glass flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-[10px] rounded-bl-xl font-bold">
                TIER 3 • HEAVY-COST (SLM)
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Battery-Aware Local SLM
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">
                    Executes small neural language model exclusively on high-priority threads. Quantizes dynamically based on simulated battery level ({batteryPct}%) to preserve device longevity.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                  <div className="text-purple-400 text-[11px]">Dynamic Throttling:</div>
                  <div className="text-[10px] text-zinc-400">
                    • Turbo: FP16 Unquantized Neural Model
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    • Eco: 2-bit quantization when &lt;20% battery
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Power Draw:</span>
                <span className="text-purple-300 font-bold">
                  {powerMode === 'turbo'
                    ? '1.45 mWh (Turbo)'
                    : powerMode === 'balanced'
                    ? '0.62 mWh (Balanced)'
                    : '0.11 mWh (Eco)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Execution Pipeline Logs */}
        <div className="p-6 rounded-2xl bg-surface-100/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Live Pipeline Telemetry Stream
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              {tierLogs.length} events logged
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-72 overflow-y-auto custom-scrollbar">
            {tierLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface-200/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start sm:items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.tier === 1
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : log.tier === 2
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    TIER {log.tier}
                  </span>
                  <div>
                    <span className="text-white font-medium">{log.action}: </span>
                    <span className="text-zinc-400">{log.detail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 whitespace-nowrap">
                  <span className="text-emerald-400 font-semibold">{log.cost}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
