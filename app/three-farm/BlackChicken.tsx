"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type BlackChickenProps = {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  moveAmount?: number;
};

export default function BlackChicken({
  position = [0, 0, 0],
  scale = 0.02,
  rotation = [0, 0, 0],
  moveAmount = 0.25,
}: BlackChickenProps) {
  const group = useRef<THREE.Group>(null);
  const start = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position],
  );

  const { scene, animations } = useGLTF("/models/black_chicken.glb");

  const clonedScene = useMemo(() => {
    return skeletonClone(scene) as THREE.Group;
  }, [scene]);

  const { actions, names, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const feedAnimation = names.length ? actions[names[0]] : null;

    if (!feedAnimation) {
      console.warn("No animations found in black_chicken.glb");
      return;
    }

    feedAnimation.reset().fadeIn(0.25).setLoop(THREE.LoopRepeat, Infinity).play();

    return () => {
      feedAnimation.fadeOut(0.25);
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    mixer.update(delta);

    if (!group.current) return;

    const t = state.clock.elapsedTime;

    group.current.position.x =
      start.x + Math.sin(t * 0.8) * moveAmount;

    group.current.position.z =
      start.z + Math.cos(t * 0.65) * moveAmount;

    group.current.position.y =
      start.y + Math.abs(Math.sin(t * 5)) * 0.025;

    group.current.rotation.y =
      rotation[1] + Math.sin(t * 0.9) * 0.35;

    group.current.rotation.z =
      Math.sin(t * 4) * 0.025;
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

useGLTF.preload("/models/black_chicken.glb");