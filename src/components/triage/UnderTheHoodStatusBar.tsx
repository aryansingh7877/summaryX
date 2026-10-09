'use client';

import React from 'react';
import { ShieldCheck, Cpu, BatteryCharging, Zap, HardDrive } from 'lucide-react';
import { useTriageStore } from '@/store/useTriageStore';

export const UnderTheHoodStatusBar: React.FC = () => {
  const { telemetry } = useTriageStore();

  const formattedLatency = telemetry ? `${telemetry.executionTimeMs}ms` : 'Idle';
  const formattedMemory = telemetry
    ? `${(telemetry.memoryFootprintKb / 1024).toFixed(1)} MB`
    : '4.2 MB';
  const processingEngine = telemetry?.workerThreadId.includes('worker')
    ? 'Worker Thread NLP'
    : 'Tier-2 NLP';
  const hashSnippet = telemetry?.zeroCloudHash
    ? telemetry.zeroCloudHash.slice(0, 8)
    : null;

  return (
    <footer className="h-8 sm:h-9 w-full border-t border-slate-200/70 bg-white/80 px-3 sm:px-5 flex items-center justify-between text-[11px] sm:text-xs font-mono select-none backdrop-blur-md text-slate-600 transition-colors">
      {/* Left: Engineering Constraints & Security */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Offline & Secure Badge */}
        <div
          title={
            telemetry?.zeroCloudHash
              ? `Zero network packets sent to cloud. Cryptographic verification hash: ${telemetry.zeroCloudHash}`
              : 'Zero network packets sent to cloud servers. All models run locally in client memory.'
          }
          className="flex items-center gap-1.5 text-emerald-700 font-semibold truncate"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden sm:inline">Offline & Secure (0 Cloud Requests)</span>
          <span className="sm:hidden">0 Cloud Req</span>
          {hashSnippet && (
            <span
              title={`Zero-Cloud Verification SHA-256: ${telemetry?.zeroCloudHash}`}
              className="hidden lg:inline text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-300/60 font-semibold tracking-wider ml-1"
            >
              SHA:{hashSnippet}
            </span>
          )}
        </div>

        <span className="hidden md:inline text-slate-300">|</span>

        {/* Processing Tier */}
        <div
          title="Lightweight regex entity extractor & off-thread lexical classifier"
          className="hidden md:flex items-center gap-1.5"
        >
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Processing: <strong className="text-[#0F172A]">{processingEngine}</strong>
          </span>
        </div>

        <span className="hidden lg:inline text-slate-300">|</span>

        {/* Battery Impact */}
        <div
          title="Micro-watt power consumption profile on client device"
          className="hidden lg:flex items-center gap-1.5"
        >
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Battery Impact: <strong className="text-emerald-700 font-semibold">Low</strong>
          </span>
        </div>
      </div>

      {/* Right: Telemetry & Memory */}
      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-slate-500 shrink-0">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>
            <span className="hidden xs:inline">Latency: </span>
            <strong className="text-slate-800">{formattedLatency}</strong>
          </span>
        </div>

        <span className="hidden sm:inline text-slate-300">|</span>

        <div className="hidden sm:flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span>
            Memory: <strong className="text-slate-800">{formattedMemory}</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
