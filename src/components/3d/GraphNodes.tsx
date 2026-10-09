'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ActionNode } from '@/types';

interface GraphNodesProps {
  nodes: ActionNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (id: string) => void;
  onHoverNode: (id: string | null) => void;
}

export const GraphNodes: React.FC<GraphNodesProps> = ({
  nodes,
  selectedNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
}) => {
  return (
    <group>
      {nodes.map((node) => (
        <SingleNode
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          isHovered={hoveredNodeId === node.id}
          onSelect={() => onSelectNode(node.id)}
          onHover={(hover) => onHoverNode(hover ? node.id : null)}
        />
      ))}
    </group>
  );
};

interface SingleNodeProps {
  node: ActionNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
}

const SingleNode: React.FC<SingleNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Palette definition
  const config = {
    urgent: {
      color: '#ff3366',
      emissive: '#ff0044',
      glowClass: 'shadow-neon-urgent border-cyber-urgent text-cyber-urgent',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      radius: 0.48,
    },
    debate: {
      color: '#ffb020',
      emissive: '#ff8800',
      glowClass: 'shadow-neon-debate border-cyber-debate text-cyber-debate',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      radius: 0.42,
    },
    resolved: {
      color: '#00e599',
      emissive: '#00bb77',
      glowClass: 'shadow-neon-resolved border-cyber-resolved text-cyber-resolved',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      radius: 0.40,
    },
  }[node.type];

  // Subtle floating ambient oscillation + pulse animations
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Organic hover bounce
    const t = state.clock.getElapsedTime() + node.position[0];
    meshRef.current.position.y = node.position[1] + Math.sin(t * 1.5) * 0.08;

    // Pulse outer halo
    if (haloRef.current) {
      const pulseRate = node.type === 'urgent' ? 3.5 : 2.0;
      const scale = (isSelected ? 1.5 : isHovered ? 1.35 : 1.15) + Math.sin(t * pulseRate) * 0.08;
      haloRef.current.scale.set(scale, scale, scale);
    }

    // Rotate debate/urgent rings
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.8;
      ringRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={node.position}>
      {/* Interactive Main Orb Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          onHover(false);
        }}
      >
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={isSelected ? 1.8 : isHovered ? 1.4 : 0.8}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Outer Holographic Glow Shell */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[config.radius * 1.25, 20, 20]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
          wireframe={node.type === 'urgent' || isSelected}
        />
      </mesh>

      {/* Orbiting Orbital Ring for Debates and Urgent items */}
      {(node.type === 'debate' || node.type === 'urgent' || isSelected) && (
        <mesh ref={ringRef}>
          <torusGeometry args={[config.radius * 1.5, 0.02, 16, 48]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={isSelected ? 0.7 : 0.4}
          />
        </mesh>
      )}

      {/* Crisp 3D HTML Floating Card */}
      <Html
        position={[0, config.radius + 0.35, 0]}
        center
        distanceFactor={12}
        className="pointer-events-none select-none transition-transform duration-200"
      >
        <div
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isSelected
              ? 'scale-110 opacity-100 z-50'
              : isHovered
              ? 'scale-105 opacity-100 z-40'
              : 'opacity-85 hover:opacity-100'
          }`}
        >
          {/* Header pill with channel & urgency badge */}
          <div
            className={`px-2.5 py-1 rounded-full backdrop-blur-md bg-surface-100/90 border text-[11px] font-mono tracking-wider flex items-center gap-1.5 shadow-lg ${
              isSelected ? config.glowClass : 'border-white/10 text-zinc-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                node.type === 'urgent'
                  ? 'bg-rose-500 animate-pulse'
                  : node.type === 'debate'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="font-semibold text-white">{node.channel}</span>
            {node.type === 'urgent' && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 font-bold tracking-widest uppercase">
                URGENT
              </span>
            )}
          </div>

          {/* Node Summary Title card */}
          <div
            className={`px-3 py-1.5 rounded-lg backdrop-blur-md bg-surface-200/95 border text-center max-w-[210px] shadow-xl ${
              isSelected
                ? 'border-cyan-400/80 shadow-neon-cyan ring-1 ring-cyan-400/50'
                : 'border-white/10'
            }`}
          >
            <div className="text-[12px] font-semibold text-white leading-tight font-sans truncate">
              {node.label}
            </div>
            {node.metadata.deadline && (
              <div className="text-[10px] text-rose-300 font-mono mt-0.5 truncate">
                ⏳ {node.metadata.deadline}
              </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
