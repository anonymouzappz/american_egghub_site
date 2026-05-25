"use client";

import {
  Environment,
  Float,
  Html,
  OrbitControls,
  Sky,
  Sparkles,
  Stars,
  Text,
  useCursor,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import WhiteChicken from "./WhiteChicken";

type Vec3 = [number, number, number];

function CameraFlyIn() {
  const { camera } = useThree();
  const done = useRef(false);

  useFrame(({ clock }) => {
    if (done.current) return;

    const t = Math.min(clock.elapsedTime / 3.2, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    camera.position.lerpVectors(
      new THREE.Vector3(9, 5.5, 11),
      new THREE.Vector3(4.8, 3.3, 6.4),
      ease,
    );

    camera.lookAt(0, 1, 0);

    if (t >= 1) done.current = true;
  });

  return null;
}

function SoundLayer() {
  const [started, setStarted] = useState(false);
  const windRef = useRef<HTMLAudioElement | null>(null);
  const chickenRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      windRef.current?.pause();
      chickenRef.current?.pause();
    };
  }, []);

  function toggleSounds() {
    if (!started) {
      windRef.current = new Audio("/sounds/wind.mp3");
      chickenRef.current = new Audio("/sounds/chickens.mp3");

      windRef.current.loop = true;
      chickenRef.current.loop = true;
      windRef.current.volume = 0.22;
      chickenRef.current.volume = 0.32;

      windRef.current.play().catch(() => {});
      chickenRef.current.play().catch(() => {});
      setStarted(true);
      return;
    }

    windRef.current?.pause();
    chickenRef.current?.pause();
    setStarted(false);
  }

  return (
    <button
      onClick={toggleSounds}
      className="rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#2f6b3b] shadow-xl backdrop-blur transition hover:scale-105"
    >
      {started ? "Sound Off" : "Sound On"}
    </button>
  );
}

function Ground({ night }: { night: boolean }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color={night ? "#172f20" : "#6ab04c"} />
      </mesh>

      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.8, 64]} />
        <meshStandardMaterial
          color={night ? "#5a4024" : "#c9954f"}
          roughness={0.95}
        />
      </mesh>
    </>
  );
}

function Coop({ night }: { night: boolean }) {
  return (
    <group position={[-3.1, 0, -1.2]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.55, 1.7]} />
        <meshStandardMaterial color="#b45309" roughness={0.75} />
      </mesh>

      <mesh position={[0, 1.86, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.72, 1.72, 1.95]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.65} />
      </mesh>

      <mesh position={[0.02, 0.55, 0.89]} castShadow>
        <boxGeometry args={[0.56, 0.85, 0.08]} />
        <meshStandardMaterial color="#3f2412" />
      </mesh>

      <mesh position={[-0.68, 1.05, 0.91]} castShadow>
        <boxGeometry args={[0.42, 0.38, 0.08]} />
        <meshStandardMaterial
          color={night ? "#ffd47a" : "#fef3c7"}
          emissive={night ? "#ffd47a" : "#000000"}
          emissiveIntensity={night ? 0.7 : 0}
        />
      </mesh>

      <pointLight
        position={[-0.7, 1.1, 1.15]}
        intensity={night ? 2.2 : 0}
        color="#ffd47a"
        distance={5}
      />
    </group>
  );
}

function Fence() {
  const front = Array.from({ length: 15 }, (_, i) => -7 + i);
  const side = Array.from({ length: 8 }, (_, i) => -3.5 + i);

  return (
    <group>
      <group position={[0, 0, 2.85]}>
        {front.map((x) => (
          <mesh key={x} position={[x, 0.46, 0]} castShadow>
            <boxGeometry args={[0.13, 0.92, 0.13]} />
            <meshStandardMaterial color="#f5deb3" />
          </mesh>
        ))}

        {[0.66, 0.36].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[14.6, 0.1, 0.08]} />
            <meshStandardMaterial color="#f5deb3" />
          </mesh>
        ))}
      </group>

      {[-7, 7].map((x) => (
        <group key={x} position={[x, 0, -0.7]}>
          {side.map((z) => (
            <mesh key={z} position={[0, 0.46, z]} castShadow>
              <boxGeometry args={[0.13, 0.92, 0.13]} />
              <meshStandardMaterial color="#f5deb3" />
            </mesh>
          ))}

          {[0.66, 0.36].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[7.4, 0.1, 0.08]} />
              <meshStandardMaterial color="#f5deb3" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Grass() {
  const blades = useMemo(
    () =>
      Array.from({ length: 900 }, () => ({
        x: THREE.MathUtils.randFloatSpread(20),
        z: THREE.MathUtils.randFloatSpread(15),
        h: THREE.MathUtils.randFloat(0.16, 0.5),
        r: Math.random() * Math.PI,
      })),
    [],
  );

  return (
    <group>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.r, 0]}>
          <coneGeometry args={[0.025, b.h, 5]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#3f8f34" : "#4f9f39"} />
        </mesh>
      ))}
    </group>
  );
}

function MovingClouds({ night }: { night: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = Math.sin(clock.elapsedTime * 0.07) * 5;
    ref.current.position.z = -5 + Math.cos(clock.elapsedTime * 0.05) * 0.6;
  });

  if (night) return null;

  return (
    <group ref={ref} position={[0, 5.4, -5]}>
      {[-4, -1, 2.8, 5].map((x, i) => (
        <group key={i} position={[x, Math.sin(i) * 0.25, 0]}>
          {[0, 0.42, -0.42].map((offset, j) => (
            <mesh key={j} position={[offset, j === 0 ? 0.1 : 0, 0]}>
              <sphereGeometry args={[j === 0 ? 0.55 : 0.42, 20, 20]} />
              <meshStandardMaterial color="#ffffff" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Fireflies({ night }: { night: boolean }) {
  const group = useRef<THREE.Group>(null);

  const bugs = useMemo(
    () =>
      Array.from({ length: 65 }, () => ({
        x: THREE.MathUtils.randFloatSpread(11),
        y: THREE.MathUtils.randFloat(0.6, 3),
        z: THREE.MathUtils.randFloatSpread(8),
        s: THREE.MathUtils.randFloat(0.5, 1.8),
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;

    group.current.children.forEach((child, i) => {
      const bug = bugs[i];
      child.position.x = bug.x + Math.sin(clock.elapsedTime * bug.s + i) * 0.45;
      child.position.y = bug.y + Math.cos(clock.elapsedTime * bug.s + i) * 0.2;
      child.position.z = bug.z + Math.sin(clock.elapsedTime * 0.7 + i) * 0.25;
    });
  });

  if (!night) return null;

  return (
    <group ref={group}>
      {bugs.map((bug, i) => (
        <mesh key={i} position={[bug.x, bug.y, bug.z]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial
            color="#fff7a8"
            emissive="#fff7a8"
            emissiveIntensity={2.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function EggBasket({
  position,
  label,
  description,
}: {
  position: Vec3;
  label: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);

  useCursor(hovered);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 1.5) * 0.06;
    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 2) * 0.025;
  });

  return (
    <group ref={ref} position={position}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.38, 0.58]} />
          <meshStandardMaterial color={hovered ? "#a16207" : "#8b5a2b"} />
        </mesh>

        {[
          [-0.24, 0.3, 0],
          [0, 0.33, 0.08],
          [0.24, 0.3, -0.05],
        ].map((p, i) => (
          <mesh key={i} position={p as Vec3} castShadow>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#fff3d1" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {open && (
        <Html position={[0, 0.95, 0]} center>
          <div className="w-52 rounded-2xl bg-white/95 p-4 text-center shadow-2xl">
            <p className="text-sm font-black text-[#2f6b3b]">{label}</p>
            <p className="mt-1 text-xs font-semibold text-[#5f4b32]">
              {description}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

function FarmSign() {
  return (
    <group position={[0, 0, 3.05]}>
      <mesh position={[-0.72, 0.72, 0]} castShadow>
        <boxGeometry args={[0.1, 1.4, 0.1]} />
        <meshStandardMaterial color="#5b3417" />
      </mesh>
      <mesh position={[0.72, 0.72, 0]} castShadow>
        <boxGeometry args={[0.1, 1.4, 0.1]} />
        <meshStandardMaterial color="#5b3417" />
      </mesh>
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[1.9, 0.65, 0.12]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <Text
        position={[0, 1.31, 0.08]}
        fontSize={0.15}
        color="#fff7d6"
        anchorX="center"
        anchorY="middle"
      >
        LOCAL FARM MARKET
      </Text>
    </group>
  );
}

function FarmWorld({ night }: { night: boolean }) {
  const router = useRouter();

  return (
    <>
      <CameraFlyIn />

      {night ? (
        <>
          <color attach="background" args={["#07111f"]} />
          <Stars radius={90} depth={45} count={2200} factor={4} fade />
        </>
      ) : (
        <Sky sunPosition={[100, 25, 100]} turbidity={8} rayleigh={2} />
      )}

      <ambientLight intensity={night ? 0.25 : 0.75} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={night ? 0.35 : 1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Ground night={night} />
      <Grass />
      <Fence />
      <Coop night={night} />
      <FarmSign />
      <MovingClouds night={night} />
      <Fireflies night={night} />

      {night && (
        <Sparkles
          count={120}
          scale={[12, 4, 8]}
          size={2.4}
          speed={0.35}
          color="#fff7a8"
        />
      )}

      <WhiteChicken position={[-3.1, 0, -0.6]} scale={0.9} />

      <EggBasket
        position={[-4.3, 0.28, 1.25]}
        label="For Sellers"
        description="Create a farm profile, list eggs, and connect with nearby buyers."
      />

      <EggBasket
        position={[4.3, 0.28, 1.25]}
        label="For Buyers"
        description="Find fresh local eggs, farm goods, pickup, delivery, and smart map results."
      />

      <Float speed={2} rotationIntensity={0.08} floatIntensity={0.35}>
        <Text
          position={[0, 3.55, -1.5]}
          fontSize={0.48}
          color={night ? "#fff4c2" : "#3f2a12"}
          anchorX="center"
          anchorY="middle"
        >
          American EggHub
        </Text>
      </Float>

      <Html position={[0, 1.95, 1.7]} center>
        <button
          onClick={() => router.push("/landing")}
          className="rounded-full bg-[#2f6b3b] px-8 py-4 text-lg font-black text-white shadow-2xl ring-4 ring-white/50 transition hover:scale-110 hover:bg-[#24542e]"
        >
         Click Here Enter American EggHub Landing Page→
        </button>
      </Html>

      <Environment preset={night ? "night" : "sunset"} />

      <OrbitControls
        makeDefault
        enableZoom
        enableRotate
        enablePan={false}
        minDistance={3}
        maxDistance={14}
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  );
}

export default function FarmScene() {
  const [night, setNight] = useState(false);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#fff8e8]">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{
          position: [9, 5.5, 11],
          fov: 45,
        }}
      >
        <Suspense fallback={null}>
          <FarmWorld night={night} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-0 top-0 w-full p-4 md:p-6">
        <div className="max-w-xl rounded-3xl bg-white/75 p-5 shadow-xl backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f6b3b]">
            Coming Soon
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#2b2115] md:text-5xl">
            Fresh eggs, local farms, smart selling.
          </h1>
          <p className="mt-3 text-sm font-semibold text-[#5f4b32] md:text-base">
            Explore the farm, click the baskets, meet the chickens, then join
            the American EggHub waitlist.
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 flex flex-wrap gap-3">
        <SoundLayer />

        <button
          onClick={() => setNight((v) => !v)}
          className="rounded-full bg-[#2f6b3b] px-4 py-2 text-sm font-black text-white shadow-xl transition hover:scale-105"
        >
          {night ? "Day Mode" : "Night Mode"}
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-5 right-5 hidden rounded-2xl bg-white/80 px-4 py-3 text-xs font-bold text-[#5f4b32] shadow-xl backdrop-blur md:block">
        Drag to rotate • Scroll to zoom • Click baskets
      </div>
    </main>
  );
}
