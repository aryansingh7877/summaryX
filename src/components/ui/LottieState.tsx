'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LottieStateProps {
  type: 'loading' | 'empty' | 'secure' | 'audio';
  title: string;
  subtitle?: string;
  size?: number;
}

export const LottieState: React.FC<LottieStateProps> = ({
  type,
  title,
  subtitle,
  size = 140,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div
        className="relative flex items-center justify-center mb-4"
        style={{ width: size, height: size }}
      >
        {type === 'loading' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Concentric pulsing cyber rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border border-cyan-400/50 border-t-transparent"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-full bg-cyan-500/20 blur-md"
            />
            <motion.div
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-full bg-cyan-400 shadow-neon-cyan flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-white" />
            </motion.div>
          </div>
        )}

        {type === 'empty' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-neon-resolved"
            >
              <svg
                className="w-10 h-10 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-emerald-500/20"
            />
          </div>
        )}

        {type === 'secure' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-neon-cyan"
            >
              <svg
                className="w-10 h-10 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
          </div>
        )}

        {type === 'audio' && (
          <div className="flex items-center justify-center space-x-1.5 h-16">
            {[0.4, 0.8, 0.3, 1, 0.6, 0.9, 0.5, 0.7].map((height, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [height * 0.4, height * 1.5, height * 0.4],
                }}
                transition={{
                  duration: 0.8 + (i % 3) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-1.5 h-12 bg-gradient-to-t from-cyan-500 to-purple-400 rounded-full origin-center"
              />
            ))}
          </div>
        )}
      </div>

      <h4 className="text-base font-semibold text-white tracking-wide font-sans">{title}</h4>
      {subtitle && (
        <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed font-mono">
          {subtitle}
        </p>
      )}
    </div>
  );
};
