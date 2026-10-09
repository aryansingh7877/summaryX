'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ClaudeTextReveal } from './ClaudeTextReveal';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Cpu,
  Zap,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const SidePanel: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    isSidePanelOpen,
    closeSidePanel,
    toggleActionItem,
    rawMessages,
  } = useAppStore();

  const [isRawExpanded, setIsRawExpanded] = useState(false);

  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!isSidePanelOpen || !node) {
    return null;
  }

  const handleActionToggle = (actionId: string, willBeCompleted: boolean) => {
    toggleActionItem(node.id, actionId);
    if (willBeCompleted) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7, x: 0.8 },
        colors: ['#00e599', '#00f0ff', '#a855f7'],
      });
    }
  };

  const associatedRawMsgs = rawMessages.filter((m) =>
    node.metadata.rawMessageIds.includes(m.id)
  );

  const typeConfig = {
    urgent: {
      badgeText: 'CRITICAL / URGENT',
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      glow: 'shadow-neon-urgent',
      icon: AlertTriangle,
    },
    debate: {
      badgeText: 'UNRESOLVED DEBATE',
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      glow: 'shadow-neon-debate',
      icon: HelpCircle,
    },
    resolved: {
      badgeText: 'DECISION RESOLVED',
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-neon-resolved',
      icon: CheckCircle2,
    },
  }[node.type];

  const IconComponent = typeConfig.icon;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 280,
          mass: 0.8,
        }}
        className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-surface-100/95 backdrop-blur-2xl border-l border-white/10 z-40 shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-surface-200/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 border ${typeConfig.bg} ${typeConfig.border} ${typeConfig.color} ${typeConfig.glow}`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{typeConfig.badgeText}</span>
            </div>
            <span className="text-xs font-mono text-zinc-400">{node.channel}</span>
          </div>

          <button
            onClick={closeSidePanel}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Main Title & Deadline */}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white font-sans leading-snug">
              {node.label}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Updated: {node.timestamp}
              </span>
              {node.metadata.deadline && (
                <span className="flex items-center gap-1 text-rose-300 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  ⏳ Deadline: {node.metadata.deadline}
                </span>
              )}
            </div>
          </div>

          {/* Urgency Score Visualizer */}
          <div className="p-3.5 rounded-xl bg-surface-200/80 border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Priority & Urgency Index</span>
              <span
                className={`font-bold ${
                  node.urgencyScore >= 75
                    ? 'text-rose-400'
                    : node.urgencyScore >= 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {node.urgencyScore}/100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${node.urgencyScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  node.urgencyScore >= 75
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : node.urgencyScore >= 50
                    ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                    : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                }`}
              />
            </div>
          </div>

          {/* Claude-Style Streaming Executive Summary */}
          <div className="p-4 rounded-xl bg-surface-200/90 border border-cyan-500/20 shadow-neon-cyan/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                LOCAL SLM EXECUTIVE SYNTHESIS
              </span>
              <span className="text-[10px] text-zinc-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                Confidence: {Math.round(node.metadata.confidence * 100)}%
              </span>
            </div>
            <div className="text-sm font-sans text-zinc-200 leading-relaxed pt-1">
              <ClaudeTextReveal text={node.summary} speed={20} />
            </div>
          </div>

          {/* Key Debate Arguments (If debate type) */}
          {node.metadata.keyArguments && node.metadata.keyArguments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Key Tradeoffs & Diverging Positions
              </h3>
              <div className="space-y-2">
                {node.metadata.keyArguments.map((arg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-surface-200/60 border border-amber-500/20 text-xs text-zinc-300 leading-relaxed"
                  >
                    <span className="text-amber-400 font-mono font-bold mr-1.5">
                      0{idx + 1}.
                    </span>
                    {arg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items Interactive Checklist */}
          {node.metadata.actionItems && node.metadata.actionItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Action Items (
                  {node.metadata.actionItems.filter((a) => a.completed).length}/
                  {node.metadata.actionItems.length})
                </h3>
              </div>

              <div className="space-y-2">
                {node.metadata.actionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleActionToggle(item.id, !item.completed)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      item.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70'
                        : 'bg-surface-200/80 border-white/10 hover:border-cyan-400/40 hover:bg-surface-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-600 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-surface-50 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-sans font-medium leading-snug ${
                          item.completed
                            ? 'line-through text-zinc-400'
                            : 'text-zinc-200'
                        }`}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono">
                        <span className="text-zinc-400">@{item.assignee}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                            item.priority === 'p0'
                              ? 'bg-rose-500/20 text-rose-300'
                              : item.priority === 'p1'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Participants */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Identified Stakeholders ({node.metadata.participants.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {node.metadata.participants.map((person, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface-200/70 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {person}
                </div>
              ))}
            </div>
          </div>

          {/* Raw Chat Accordion */}
          <div className="rounded-xl border border-white/10 bg-surface-200/50 overflow-hidden">
            <button
              onClick={() => setIsRawExpanded(!isRawExpanded)}
              className="w-full p-3.5 flex items-center justify-between text-xs font-mono text-zinc-300 hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Raw Chat Logs ({associatedRawMsgs.length} messages)
              </span>
              {isRawExpanded ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            <AnimatePresence>
              {isRawExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3 border-t border-white/10 space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  {associatedRawMsgs.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2.5 rounded-lg bg-surface-100/80 border border-white/5 text-xs space-y-1 font-sans"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="font-semibold text-zinc-300">
                          {msg.sender} <span className="text-zinc-500">({msg.role})</span>
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Engine Processing Footprint Metadata */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 space-y-1.5">
            <div className="text-zinc-300 font-semibold flex items-center gap-1.5 text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Tiered Engine Telemetry
            </div>
            <div className="flex justify-between">
              <span>Tier Synthesis:</span>
              <span className="text-cyan-400">Tier 3 (Local-First SLM)</span>
            </div>
            <div className="flex justify-between">
              <span>Battery Energy Used:</span>
              <span className="text-emerald-400">{node.metadata.batteryImpact}</span>
            </div>
            <div className="flex justify-between">
              <span>Privacy Guarantee:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 100% On-Device
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
