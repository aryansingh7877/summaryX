'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '@/store/useAppStore';
import { GraphNodes } from './GraphNodes';
import { GraphEdges } from './GraphEdges';
import { CameraRig } from './CameraRig';
import { BackgroundEffects } from './BackgroundEffects';
import { ActionNode } from '@/types';
import { Eye, RotateCcw, Zap, Filter, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export const ActionGraphScene: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    hoveredNodeId,
    filterType,
    searchQuery,
    selectNode,
    setHoveredNode,
    setFilterType,
  } = useAppStore();

  // Filter nodes based on active filters and search query
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (filterType !== 'all' && node.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          node.label.toLowerCase().includes(q) ||
          node.channel.toLowerCase().includes(q) ||
          node.summary.toLowerCase().includes(q) ||
          node.metadata.participants.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [nodes, filterType, searchQuery]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 9.5], fov: 48 }}
        className="w-full h-full"
        onPointerMissed={() => {
          // Deselect when clicking empty space
          selectNode(null);
        }}
      >
        <Suspense fallback={null}>
          <BackgroundEffects />
          <CameraRig selectedNode={selectedNode} />
          <GraphEdges
            edges={edges}
            nodes={filteredNodes}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
          />
          <GraphNodes
            nodes={filteredNodes}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
            onSelectNode={selectNode}
            onHoverNode={setHoveredNode}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            panSpeed={0.5}
            maxDistance={22}
            minDistance={2.5}
          />
        </Suspense>
      </Canvas>

      {/* Floating HUD Controls Overlay */}
      <div className="absolute top-5 left-6 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Node Filters Pill Group */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-surface-100/80 backdrop-blur-xl border border-white/10 shadow-glass">
          <span className="text-[11px] font-mono text-zinc-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            FILTER:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({nodes.length})
          </button>
          <button
            onClick={() => setFilterType('urgent')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              filterType === 'urgent'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-neon-urgent'
                : 'text-zinc-400 hover:text-rose-300 hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Urgent ({nodes.filter((n) => n.type === 'urgent').length})
          </button>
          <button
            onClick={() => setFilterType('debate')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              filterType === 'debate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-neon-debate'
                : 'text-zinc-400 hover:text-amber-300 hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Debates ({nodes.filter((n) => n.type === 'debate').length})
          </button>
          <button
            onClick={() => setFilterType('resolved')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              filterType === 'resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-neon-resolved'
                : 'text-zinc-400 hover:text-emerald-300 hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Resolved ({nodes.filter((n) => n.type === 'resolved').length})
          </button>
        </div>

        {/* Legend / Quick Tip */}
        <div className="px-3 py-1.5 rounded-lg bg-surface-200/60 backdrop-blur-md border border-white/5 text-[11px] font-mono text-zinc-400 flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Click node to zoom & summarize
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Drag to rotate 3D space</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Scroll to zoom</span>
        </div>
      </div>

      {/* Floating Bottom Left Telemetry Badge */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <div className="p-3 rounded-xl bg-surface-100/80 backdrop-blur-xl border border-white/10 shadow-glass flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs font-mono">
            <div className="text-white font-medium flex items-center gap-1.5">
              <span>ACTION-GRAPH v2.4</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5">
              {filteredNodes.length} Nodes Rendered • {edges.length} Semantic Edges
            </div>
          </div>
        </div>
      </div>

      {/* Reset Camera button top right */}
      {selectedNodeId && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => selectNode(null)}
          className="absolute top-5 right-6 z-20 px-3 py-1.5 rounded-xl bg-surface-100/90 backdrop-blur-xl border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 shadow-neon-cyan hover:bg-white/10 transition-all pointer-events-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          Deselect & Recenter
        </motion.button>
      )}
    </div>
  );
};
