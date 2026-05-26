"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";

type GreyChickenProps = {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  glideSpeed?: number;
  glideRadius?: number;
  minStopSeconds?: number;
  maxStopSeconds?: number;
  minMoveSeconds?: number;
  maxMoveSeconds?: number;
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function GreyChicken({
  position = [0, 0, 0],
  scale = 0.02,
  rotation = [0, 0, 0],
  glideSpeed = 0.45,
  glideRadius = 0.75,
  minStopSeconds = 2,
  maxStopSeconds = 5,
  minMoveSeconds = 4,
  maxMoveSeconds = 8,
}: GreyChickenProps) {
  const group = useRef<THREE.Group>(null);

  const moving = useRef(true);
  const timer = useRef(0);
  const phase = useRef(Math.random() * Math.PI * 2);
  const currentRadius = useRef(glideRadius);
  const nextSwitchTime = useRef(
    randomBetween(minMoveSeconds, maxMoveSeconds),
  );

  const start = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position],
  );

  const { scene, animations } = useGLTF("/models/grey_chicken.glb");

  const clonedScene = useMemo(() => {
    return skeletonClone(scene) as THREE.Group;
  }, [scene]);

  const { actions, names, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const floatAnimation = names.length ? actions[names[0]] : null;

    if (!floatAnimation) {
      console.warn("No animations found in grey_chicken.glb");
      return;
    }

    floatAnimation
      .reset()
      .fadeIn(0.25)
      .setLoop(THREE.LoopRepeat, Infinity)
      .play();

    return () => {
      floatAnimation.fadeOut(0.25);
    };
  }, [actions, names]);

  useEffect(() => {
    if (!group.current) return;

    group.current.position.set(position[0], position[1], position[2]);
    group.current.rotation.set(rotation[0], rotation[1], rotation[2]);
  }, [position, rotation]);

  useFrame((state, delta) => {
    mixer.update(delta);

    if (!group.current) return;

    const chicken = group.current;
    const t = state.clock.elapsedTime;

    timer.current += delta;

    if (timer.current >= nextSwitchTime.current) {
      timer.current = 0;
      moving.current = !moving.current;

      if (moving.current) {
        nextSwitchTime.current = randomBetween(
          minMoveSeconds,
          maxMoveSeconds,
        );

        phase.current = Math.random() * Math.PI * 2;
        currentRadius.current = randomBetween(
          glideRadius * 0.45,
          glideRadius,
        );
      } else {
        nextSwitchTime.current = randomBetween(
          minStopSeconds,
          maxStopSeconds,
        );
      }
    }

    const floatY = Math.sin(t * 1.4 + phase.current) * 0.08;

    if (moving.current) {
      const glideX =
        Math.sin(t * glideSpeed + phase.current) *
        currentRadius.current;

      const glideZ =
        Math.cos(t * glideSpeed * 0.75 + phase.current) *
        currentRadius.current;

      chicken.position.x = THREE.MathUtils.lerp(
        chicken.position.x,
        start.x + glideX,
        delta * 1.8,
      );

      chicken.position.z = THREE.MathUtils.lerp(
        chicken.position.z,
        start.z + glideZ,
        delta * 1.8,
      );

      chicken.rotation.y =
        rotation[1] +
        Math.sin(t * 0.55 + phase.current) * 0.45;
    } else {
      chicken.position.x = THREE.MathUtils.lerp(
        chicken.position.x,
        chicken.position.x,
        delta,
      );

      chicken.position.z = THREE.MathUtils.lerp(
        chicken.position.z,
        chicken.position.z,
        delta,
      );

      chicken.rotation.y =
        rotation[1] +
        Math.sin(t * 0.25 + phase.current) * 0.12;
    }

    chicken.position.y = start.y + floatY;

    chicken.rotation.x =
      rotation[0] + Math.sin(t * 0.9 + phase.current) * 0.03;

    chicken.rotation.z =
      rotation[2] + Math.cos(t * 0.7 + phase.current) * 0.03;
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

useGLTF.preload("/models/grey_chicken.glb");