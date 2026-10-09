'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Inbox, Filter, ShieldCheck, Search, Tag, Eye } from 'lucide-react';
import { RawChatMessage } from '@/types';

export const RawInboxView: React.FC = () => {
  const { rawMessages, selectNode, nodes } = useAppStore();
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const channels = ['all', ...Array.from(new Set(rawMessages.map((m) => m.channel)))];

  // Noise detector function for visual labeling in inbox
  const isNoise = (content: string) => {
    const trimmed = content.trim();
    return (
      /^(ok|okay|k|cool|sure|yep|yeah|yes|no|nope|np|thx|thanks|ty|bump|done|will do|got it|ack|gm|good morning|morning|hey|hi|hello|see ya|lol)[\.!\?]*$/i.test(
        trimmed
      ) ||
      /^[\p{Emoji}\s]+$/u.test(trimmed) ||
      trimmed.length < 5
    );
  };

  const filteredMessages = rawMessages.filter((msg) => {
    if (channelFilter !== 'all' && msg.channel !== channelFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        msg.content.toLowerCase().includes(q) ||
        msg.sender.toLowerCase().includes(q) ||
        msg.channel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-background text-zinc-100 custom-scrollbar select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Inbox className="w-4 h-4" />
              Raw Chat Stream & Signal Inspector
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white">
              Raw Message Telemetry Feed
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Inspect how the Battery-Aware Engine evaluates each incoming message against Tier 1 noise rules, Tier 2 lexical entities, and Tier 3 SLM synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-surface-100/90 border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>
        </div>

        {/* Channel Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {channels.map((chan) => (
            <button
              key={chan}
              onClick={() => setChannelFilter(chan)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                channelFilter === chan
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                  : 'bg-surface-100/70 text-zinc-400 border border-white/5 hover:text-white'
              }`}
            >
              {chan === 'all' ? 'All Channels' : chan}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const noise = isNoise(msg.content);
            const matchingNode = nodes.find((n) => n.channel === msg.channel);

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-all ${
                  noise
                    ? 'bg-surface-200/40 border-white/5 opacity-55 hover:opacity-90'
                    : 'bg-surface-100/80 border-white/10 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-sans">
                          {msg.sender}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          ({msg.role})
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 border border-white/5 text-cyan-400">
                          {msg.channel}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Engine Classification Badge */}
                  <div className="flex items-center gap-2">
                    {noise ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Tier 1 Filtered (Zero-Cost Discard)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Tier 2 & 3 Processed
                      </span>
                    )}

                    {matchingNode && !noise && (
                      <button
                        onClick={() => selectNode(matchingNode.id)}
                        className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all"
                        title="View Action-Graph Node"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <p
                  className={`mt-3 text-xs leading-relaxed font-sans ${
                    noise ? 'text-zinc-500 line-through' : 'text-zinc-200'
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
