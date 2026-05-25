"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type WhiteChickenProps = {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
};

export default function WhiteChicken({
  position = [0, 0, 0],
  scale = 0.02,
  rotation = [0, 0, 0],
}: WhiteChickenProps) {
  const group = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF("/models/white_chicken.glb");

  const clonedScene = useMemo(() => {
    return skeletonClone(scene) as THREE.Group;
  }, [scene]);

  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (!names.length) {
      console.warn("No animations found in white_chicken.glb");
      return;
    }

    const action = actions[names[0]];
    action?.reset().fadeIn(0.2).play();

    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, names]);

  useFrame((_, delta) => {
    if (!group.current) return;

    group.current.position.y =
      position[1] + Math.sin(performance.now() * 0.004) * 0.015;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/white_chicken.glb");