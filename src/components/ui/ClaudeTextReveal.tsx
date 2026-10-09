'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ClaudeTextRevealProps {
  text: string;
  speed?: number; // ms per token
  onComplete?: () => void;
  className?: string;
}

export const ClaudeTextReveal: React.FC<ClaudeTextRevealProps> = ({
  text,
  speed = 22,
  onComplete,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const textRef = useRef(text);

  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
    textRef.current = text;

    if (!text) return;

    // Split text into words and punctuation tokens to simulate natural SLM token streaming
    const tokens = text.match(/\S+|\s+/g) || [];
    let currentIndex = 0;
    let accumulated = '';

    const interval = setInterval(() => {
      if (currentIndex < tokens.length) {
        accumulated += tokens[currentIndex];
        setDisplayedText(accumulated);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const handleSkip = () => {
    setDisplayedText(text);
    setIsDone(true);
    onComplete?.();
  };

  return (
    <div
      onClick={handleSkip}
      title="Click to reveal all instantly"
      className={`relative cursor-pointer group ${className}`}
    >
      <span className="leading-relaxed whitespace-pre-wrap">{displayedText}</span>
      
      {!isDone && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block w-2 h-4 ml-1 bg-cyan-400 rounded-sm align-middle shadow-neon-cyan"
        />
      )}

      {!isDone && (
        <span className="block mt-2 text-[10px] text-zinc-500 font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          [Click text to instant-complete stream]
        </span>
      )}
    </div>
  );
};
