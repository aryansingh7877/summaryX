'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';

export const GsapEntrance: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.header-stagger', {
        y: -40,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          '.gsap-hud-element',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          '-=0.4'
        )
        .from(
          '.gsap-graph-canvas',
          {
            scale: 0.94,
            opacity: 0,
            duration: 1.0,
          },
          '-=0.6'
        );
    });

    return () => ctx.revert();
  }, []);

  return <div className="w-full h-full relative overflow-hidden">{children}</div>;
};
