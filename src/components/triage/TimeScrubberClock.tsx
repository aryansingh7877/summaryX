'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { Clock } from 'lucide-react';
import { TemporalPreset } from '@/types/triage';

export const TimeScrubberClock: React.FC = () => {
  const {
    temporalFilter,
    setTemporalPreset,
    setDialAngle,
    rawMessages,
  } = useTriageStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  // Live system clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isLiveMode = temporalFilter.preset === 'all' && !temporalFilter.isScrubbing;

  // Compute hand rotations
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const liveHourAngle = ((hours % 12) + minutes / 60) * 30;
  const liveMinuteAngle = (minutes + seconds / 60) * 6;
  const liveSecondAngle = seconds * 6;

  // Active angle on clock
  const displayHourAngle = isLiveMode ? liveHourAngle : temporalFilter.dialAngle;
  const displayMinuteAngle = isLiveMode ? liveMinuteAngle : (temporalFilter.dialAngle * 12) % 360;

  // Drag interaction handler
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateAngleFromEvent(e);
  };

  const updateAngleFromEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    setDialAngle(deg);
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        updateAngleFromEvent(e);
      }
    };
    const onPointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging]);

  const presets: { id: TemporalPreset; label: string }[] = [
    { id: 'all', label: 'All Day' },
    { id: '1h', label: 'Last 1h' },
    { id: '3h', label: 'Last 3h' },
    { id: '6h', label: 'Last 6h' },
  ];

  return (
    <div className="relative p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-[#0F172A] select-none backdrop-blur-md">
      {/* Top Header: Widget Title & Live Indicator */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-tight font-sans text-[#0F172A]">
          <Clock className="w-3.5 h-3.5 text-slate-700" />
          <span>Temporal Scrubber</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {isLiveMode ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-bold">
              SCRUBBING
            </span>
          )}
        </div>
      </div>

      {/* Main Analog Clock Face */}
      <div className="flex flex-col items-center">
        <div
          ref={clockRef}
          onPointerDown={handlePointerDown}
          className="relative w-28 h-28 rounded-full bg-[#F8FAFC] border-2 border-slate-200 shadow-inner cursor-grab active:cursor-grabbing flex items-center justify-center transition-all touch-none"
          title="Click and drag dial to rewind chat messages in real time"
        >
          {/* 12 Hour Subtle Ticks */}
          {[...Array(12)].map((_, i) => {
            const rot = i * 30;
            return (
              <div
                key={i}
                className="absolute w-full h-full pointer-events-none flex justify-center"
                style={{ transform: `rotate(${rot}deg)` }}
              >
                <div
                  className={`w-0.5 mt-1 rounded-full ${
                    i % 3 === 0 ? 'h-2 bg-slate-700' : 'h-1 bg-slate-300'
                  }`}
                />
              </div>
            );
          })}

          {/* Hour Hand: Dark Minimalist */}
          <div
            className="absolute w-1 rounded-full origin-bottom pointer-events-none transition-transform duration-75 bg-[#0F172A]"
            style={{
              height: '28px',
              bottom: '50%',
              transform: `rotate(${displayHourAngle}deg)`,
            }}
          />

          {/* Minute Hand: Dark Slate */}
          <div
            className="absolute w-0.5 rounded-full origin-bottom pointer-events-none transition-transform duration-75 bg-slate-600"
            style={{
              height: '38px',
              bottom: '50%',
              transform: `rotate(${displayMinuteAngle}deg)`,
            }}
          />

          {/* Live Second Hand: Electric Coral Pink */}
          {isLiveMode && (
            <div
              className="absolute w-[1px] bg-[#EC4899] rounded-full origin-bottom pointer-events-none"
              style={{
                height: '42px',
                bottom: '50%',
                transform: `rotate(${liveSecondAngle}deg)`,
              }}
            />
          )}

          {/* Center Pivot Nut */}
          <div className="w-2.5 h-2.5 rounded-full z-10 bg-[#0F172A] border-2 border-white shadow-xs" />
        </div>

        {/* Digital Readout */}
        <div className="mt-2 text-center">
          <div className="text-[11px] font-mono font-semibold text-[#0F172A]">
            {temporalFilter.displayLabel}
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-0.5">
            {rawMessages.length > 0
              ? `${rawMessages.length} total messages in memory`
              : 'Upload a chat to enable scrubbing'}
          </div>
        </div>

        {/* Quick Presets: Crisp White Pills with Subtle Drop Shadows */}
        <div className="flex items-center gap-1 mt-2.5 w-full bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
          {presets.map((p) => {
            const isActive = temporalFilter.preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setTemporalPreset(p.id)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-mono transition-all text-center ${
                  isActive
                    ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-[#0F172A] font-medium'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
