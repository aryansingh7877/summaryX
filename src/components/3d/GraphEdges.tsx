'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ActionEdge, ActionNode } from '@/types';

interface GraphEdgesProps {
  edges: ActionEdge[];
  nodes: ActionNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
}

interface EdgePathData {
  edge: ActionEdge;
  points: THREE.Vector3[];
  color: THREE.Color;
  isHighlighted: boolean;
  curve: THREE.CatmullRomCurve3;
}

export const GraphEdges: React.FC<GraphEdgesProps> = ({
  edges,
  nodes,
  selectedNodeId,
  hoveredNodeId,
}) => {
  const nodeMap = useMemo(() => {
    const map = new Map<string, ActionNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const edgePaths = useMemo<EdgePathData[]>(() => {
    return edges
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);

        if (!sourceNode || !targetNode) return null;

        const p1 = new THREE.Vector3(...sourceNode.position);
        const p2 = new THREE.Vector3(...targetNode.position);

        // Calculate a gentle curved midpoint for a natural floating wire appearance
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const distance = p1.distanceTo(p2);
        mid.y += Math.min(0.8, distance * 0.18);
        mid.z += Math.sin(p1.x * p2.y) * 0.4;

        const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
        const points = curve.getPoints(24);

        const isHighlighted =
          selectedNodeId === edge.source ||
          selectedNodeId === edge.target ||
          hoveredNodeId === edge.source ||
          hoveredNodeId === edge.target;

        const hex =
          edge.type === 'urgent'
            ? '#ff3366'
            : edge.type === 'debate'
            ? '#ffb020'
            : '#00e599';

        return {
          edge,
          points,
          color: new THREE.Color(hex),
          isHighlighted,
          curve,
        };
      })
      .filter(Boolean) as EdgePathData[];
  }, [edges, nodeMap, selectedNodeId, hoveredNodeId]);

  return (
    <group>
      {edgePaths.map(({ edge, points, color, isHighlighted, curve }) => (
        <React.Fragment key={edge.id}>
          {/* Main glowing curved wire */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={isHighlighted ? 0.95 : 0.35}
              linewidth={isHighlighted ? 2.5 : 1}
            />
          </line>

          {/* Animated photon packet flowing along the edge */}
          <EdgePulse
            curve={curve}
            color={color}
            isHighlighted={isHighlighted}
            speed={edge.type === 'urgent' ? 0.8 : 0.5}
          />
        </React.Fragment>
      ))}
    </group>
  );
};

interface EdgePulseProps {
  curve: THREE.CatmullRomCurve3;
  color: THREE.Color;
  isHighlighted: boolean;
  speed: number;
}

const EdgePulse: React.FC<EdgePulseProps> = ({ curve, color, isHighlighted, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random());

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    progressRef.current = (progressRef.current + delta * speed * (isHighlighted ? 1.6 : 1.0)) % 1;
    const pt = curve.getPoint(progressRef.current);
    meshRef.current.position.copy(pt);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[isHighlighted ? 0.09 : 0.05, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};
