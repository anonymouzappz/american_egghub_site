"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type BrownChickenProps = {
  center?: [number, number, number];
  radius?: number;
  speed?: number;
  scale?: number;
  heightOffset?: number;
};

export default function BrownChicken({
  center = [0, 0, 0],
  radius = 2,
  speed = 0.45,
  scale = 0.02,
  heightOffset = 0,
}: BrownChickenProps) {
  const group = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF(
    "/models/brown_chicken.glb",
  );

  const clonedScene = useMemo(() => {
    return skeletonClone(scene) as THREE.Group;
  }, [scene]);

  const { actions, names, mixer } = useAnimations(
    animations,
    group,
  );

  useEffect(() => {
    if (!names.length) {
      console.warn(
        "No animations found in brown_chicken.glb",
      );
      return;
    }

    const walkAnimation = actions[names[0]];

    walkAnimation?.reset();
    walkAnimation?.fadeIn(0.25);
    walkAnimation?.setLoop(THREE.LoopRepeat, Infinity);
    walkAnimation?.play();

    return () => {
      walkAnimation?.fadeOut(0.25);
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    mixer.update(delta);

    if (!group.current) return;

    const t = state.clock.elapsedTime * speed;

    const x = center[0] + Math.sin(t) * radius;
    const z = center[2] + Math.cos(t) * radius;

    group.current.position.x = x;
    group.current.position.z = z;

    group.current.position.y =
      center[1] +
      heightOffset +
      Math.abs(Math.sin(t * 8)) * 0.015;

    const lookAheadX =
      center[0] + Math.sin(t + 0.01) * radius;

    const lookAheadZ =
      center[2] + Math.cos(t + 0.01) * radius;

    group.current.lookAt(
      lookAheadX,
      group.current.position.y,
      lookAheadZ,
    );
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/brown_chicken.glb");