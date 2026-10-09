'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const BackgroundEffects: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 800 floating cyber dust particles
  const [particlesPos] = useMemo(() => {
    const count = 850;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return [pos];
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.025;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <>
      {/* Dynamic Dramatic Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-8, -5, -6]} intensity={3.5} color="#00f0ff" distance={25} />
      <pointLight position={[8, 6, -4]} intensity={3.5} color="#ff3366" distance={25} />
      <pointLight position={[0, 8, 8]} intensity={2.0} color="#8b5cf6" distance={20} />

      {/* Cyber Dust Starfield */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPos.length / 3}
            array={particlesPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Cyber Grid Floor */}
      <gridHelper
        args={[40, 40, '#00f0ff', '#1e293b']}
        position={[0, -5, 0]}
        material-transparent
        material-opacity={0.18}
      />
    </>
  );
};
