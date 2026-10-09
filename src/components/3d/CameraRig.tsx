'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ActionNode } from '@/types';

interface CameraRigProps {
  selectedNode: ActionNode | null;
}

export const CameraRig: React.FC<CameraRigProps> = ({ selectedNode }) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const defaultCamPos = useRef(new THREE.Vector3(0, 1.5, 9.5));

  useFrame((_, delta) => {
    // Lerp speed
    const step = Math.min(delta * 2.8, 1);

    if (selectedNode) {
      // Offset slightly to the left so the 3D node isn't blocked by the right-hand side-panel!
      const nodePos = new THREE.Vector3(...selectedNode.position);
      const desiredPos = new THREE.Vector3(
        nodePos.x + 1.8,
        nodePos.y + 0.8,
        nodePos.z + 4.2
      );

      camera.position.lerp(desiredPos, step);
      targetLookAt.current.lerp(nodePos, step);
    } else {
      camera.position.lerp(defaultCamPos.current, step * 0.8);
      targetLookAt.current.lerp(new THREE.Vector3(0, 0, 0), step * 0.8);
    }

    camera.lookAt(targetLookAt.current);
  });

  return null;
};
