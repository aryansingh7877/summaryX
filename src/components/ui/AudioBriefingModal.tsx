'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Radio,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AudioBriefingModal: React.FC = () => {
  const {
    isAudioPlaying,
    toggleAudioBriefing,
    audioProgress,
    nodes,
    selectNode,
    setActiveView,
  } = useAppStore();

  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.25x');

  const urgentNodes = nodes.filter((n) => n.type === 'urgent');
  const debateNodes = nodes.filter((n) => n.type === 'debate');
  const resolvedNodes = nodes.filter((n) => n.type === 'resolved');

  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-background text-zinc-100 custom-scrollbar select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              Executive Audio Briefing
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white">
              AI Voice Synthesis Briefing
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              On-device text-to-speech briefing summarizing critical missed deadlines, active architecture debates, and decisions.
            </p>
          </div>

          <button
            onClick={() => setActiveView('3d-graph')}
            className="px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white"
          >
            Back to 3D Graph
          </button>
        </div>

        {/* Player Visualizer Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-surface-100 to-surface-200 border border-purple-500/30 shadow-glass space-y-6">
          {/* Animated Frequency Spectrum Waves */}
          <div className="h-24 flex items-center justify-center gap-1.5 px-4 bg-black/40 rounded-2xl border border-white/5">
            {[45, 80, 30, 95, 60, 100, 75, 40, 85, 90, 50, 70, 95, 60, 40, 85, 30, 65, 90, 45].map(
              (val, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    height: isAudioPlaying
                      ? [`${Math.max(10, val * 0.2)}%`, `${val}%`, `${Math.max(10, val * 0.3)}%`]
                      : '15%',
                  }}
                  transition={{
                    duration: 0.6 + (idx % 4) * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`w-2 rounded-full transition-all ${
                    isAudioPlaying
                      ? 'bg-gradient-to-t from-purple-500 via-cyan-400 to-emerald-400 shadow-neon-cyan'
                      : 'bg-zinc-700'
                  }`}
                />
              )
            )}
          </div>

          {/* Progress Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>00:{Math.floor((audioProgress * 0.9) % 60).toString().padStart(2, '0')}</span>
              <span className="text-purple-300 font-semibold">
                {isAudioPlaying ? 'Streaming Briefing Audio...' : 'Audio Paused'}
              </span>
              <span>01:30</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {(['1.0x', '1.25x', '1.5x'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudioBriefing}
                className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-400 text-black flex items-center justify-center shadow-neon-cyan transition-all scale-100 hover:scale-105 active:scale-95"
              >
                {isAudioPlaying ? (
                  <Pause className="w-6 h-6 text-black fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-black fill-current ml-0.5" />
                )}
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Voice: Neural-Eva (Local)</span>
            </div>
          </div>
        </div>

        {/* Briefing Agenda Sections */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Audio Briefing Transcript Agenda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Urgent Topic */}
            <div className="p-4 rounded-2xl bg-surface-100/90 border border-rose-500/30 space-y-2">
              <div className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Section 1: Critical Alerts
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Database pool saturation at 98% and Redis JWT token revocation required by 2:00 PM today.
              </p>
              {urgentNodes[0] && (
                <button
                  onClick={() => {
                    selectNode(urgentNodes[0].id);
                    setActiveView('3d-graph');
                  }}
                  className="text-[11px] font-mono text-cyan-400 hover:underline pt-1 inline-block"
                >
                  Inspect Node →
                </button>
              )}
            </div>

            {/* Debate Topic */}
            <div className="p-4 rounded-2xl bg-surface-100/90 border border-amber-500/30 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Section 2: Architecture Debates
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Clerk vs Supabase Auth 2-day spike; Three.js mobile Mali GPU frame-rate benchmarks.
              </p>
              {debateNodes[0] && (
                <button
                  onClick={() => {
                    selectNode(debateNodes[0].id);
                    setActiveView('3d-graph');
                  }}
                  className="text-[11px] font-mono text-cyan-400 hover:underline pt-1 inline-block"
                >
                  Inspect Node →
                </button>
              )}
            </div>

            {/* Resolved Decisions */}
            <div className="p-4 rounded-2xl bg-surface-100/90 border border-emerald-500/30 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Section 3: Decisions Confirmed
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Carbon Dark 2.0 design tokens merged into main; AWS Compute Savings Plan approved saving $8.4k/mo.
              </p>
              {resolvedNodes[0] && (
                <button
                  onClick={() => {
                    selectNode(resolvedNodes[0].id);
                    setActiveView('3d-graph');
                  }}
                  className="text-[11px] font-mono text-cyan-400 hover:underline pt-1 inline-block"
                >
                  Inspect Node →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
