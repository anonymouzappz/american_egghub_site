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

import BlackChicken from "./BlackChicken";
import BrownChicken from "./BrownChicken";
import GreyChicken from "./GreyChicken";
import WhiteChicken from "./WhiteChicken";

type Vec3 = [number, number, number];

function useIsMobileScene() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return mobile;
}

function CameraFlyIn({ mobile }: { mobile: boolean }) {
  const { camera } = useThree();
  const done = useRef(false);

  useFrame(({ clock }) => {
    if (done.current) return;

    const t = Math.min(clock.elapsedTime / 3.1, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    const start = mobile
      ? new THREE.Vector3(6.8, 4.6, 9.5)
      : new THREE.Vector3(9, 5.5, 11);

    const end = mobile
      ? new THREE.Vector3(4.8, 3.8, 8.4)
      : new THREE.Vector3(4.8, 3.3, 6.4);

    camera.position.lerpVectors(start, end, ease);
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
      windRef.current.volume = 0.18;
      chickenRef.current.volume = 0.26;

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
      className="rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[#2f6b3b] shadow-xl backdrop-blur transition hover:scale-105 sm:text-sm"
    >
      {started ? "Sound Off" : "Sound On"}
    </button>
  );
}

function Ground({ night }: { night: boolean }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={night ? "#102519" : "#92c984"} />
      </mesh>

      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6.8, 96]} />
        <meshStandardMaterial color={night ? "#61452b" : "#d8b982"} roughness={1} />
      </mesh>

      <mesh position={[0, 0.018, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.6, 8.2, 96]} />
        <meshStandardMaterial color={night ? "#1d3925" : "#86bf73"} roughness={1} />
      </mesh>
    </>
  );
}

function Coop({ night }: { night: boolean }) {
  return (
    <group position={[-3.15, 0, -1.25]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.35, 1.55, 1.75]} />
        <meshStandardMaterial color="#c45a16" roughness={0.75} />
      </mesh>

      <mesh position={[0, 1.9, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.82, 1.82, 2.05]} />
        <meshStandardMaterial color="#991b1b" roughness={0.6} />
      </mesh>

      <mesh position={[0.02, 0.53, 0.91]} castShadow>
        <boxGeometry args={[0.58, 0.86, 0.09]} />
        <meshStandardMaterial color="#3f2412" />
      </mesh>

      <mesh position={[-0.7, 1.08, 0.93]} castShadow>
        <boxGeometry args={[0.45, 0.38, 0.08]} />
        <meshStandardMaterial
          color={night ? "#ffd47a" : "#fef3c7"}
          emissive={night ? "#ffd47a" : "#000000"}
          emissiveIntensity={night ? 0.75 : 0}
        />
      </mesh>

      <pointLight
        position={[-0.72, 1.15, 1.2]}
        intensity={night ? 2.4 : 0}
        color="#ffd47a"
        distance={6}
      />
    </group>
  );
}

function Fence() {
  const front = Array.from({ length: 17 }, (_, i) => -8 + i);
  const side = Array.from({ length: 9 }, (_, i) => -4 + i);

  return (
    <group>
      <group position={[0, 0, 3.35]}>
        {front.map((x) => (
          <mesh key={x} position={[x, 0.48, 0]} castShadow>
            <boxGeometry args={[0.14, 0.96, 0.14]} />
            <meshStandardMaterial color="#fff4d8" />
          </mesh>
        ))}

        {[0.68, 0.38].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[16.4, 0.11, 0.09]} />
            <meshStandardMaterial color="#fff4d8" />
          </mesh>
        ))}
      </group>

      {[-8, 8].map((x) => (
        <group key={x} position={[x, 0, -0.65]}>
          {side.map((z) => (
            <mesh key={z} position={[0, 0.48, z]} castShadow>
              <boxGeometry args={[0.14, 0.96, 0.14]} />
              <meshStandardMaterial color="#fff4d8" />
            </mesh>
          ))}

          {[0.68, 0.38].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[8.2, 0.11, 0.09]} />
              <meshStandardMaterial color="#fff4d8" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Grass({ mobile }: { mobile: boolean }) {
  const blades = useMemo(
    () =>
      Array.from({ length: mobile ? 430 : 950 }, () => ({
        x: THREE.MathUtils.randFloatSpread(21),
        z: THREE.MathUtils.randFloatSpread(16),
        h: THREE.MathUtils.randFloat(0.14, 0.5),
        r: Math.random() * Math.PI,
      })),
    [mobile],
  );

  return (
    <group>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.r, 0]}>
          <coneGeometry args={[0.026, b.h, 5]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#3f8f34" : "#56a747"} />
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
    ref.current.position.z = -5 + Math.cos(clock.elapsedTime * 0.05) * 0.7;
  });

  if (night) return null;

  return (
    <group ref={ref} position={[0, 5.4, -5]}>
      {[-4.5, -1.2, 2.7, 5.4].map((x, i) => (
        <group key={i} position={[x, Math.sin(i) * 0.3, 0]}>
          {[0, 0.42, -0.42].map((offset, j) => (
            <mesh key={j} position={[offset, j === 0 ? 0.1 : 0, 0]}>
              <sphereGeometry args={[j === 0 ? 0.58 : 0.43, 20, 20]} />
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
      Array.from({ length: 70 }, () => ({
        x: THREE.MathUtils.randFloatSpread(12),
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
      child.position.y = bug.y + Math.cos(clock.elapsedTime * bug.s + i) * 0.22;
      child.position.z = bug.z + Math.sin(clock.elapsedTime * 0.7 + i) * 0.25;
    });
  });

  if (!night) return null;

  return (
    <group ref={group}>
      {bugs.map((bug, i) => (
        <mesh key={i} position={[bug.x, bug.y, bug.z]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#fff7a8" emissive="#fff7a8" emissiveIntensity={2.4} />
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
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.025;
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
          <boxGeometry args={[0.86, 0.38, 0.6]} />
          <meshStandardMaterial color={hovered ? "#a16207" : "#8b5a2b"} />
        </mesh>

        {[
          [-0.24, 0.3, 0],
          [0, 0.34, 0.08],
          [0.24, 0.3, -0.05],
        ].map((p, i) => (
          <mesh key={i} position={p as Vec3} castShadow>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#fff3d1" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {open && (
        <Html position={[0, 0.98, 0]} center>
          <div className="w-52 rounded-2xl bg-white/95 p-4 text-center shadow-2xl">
            <p className="text-sm font-black text-[#2f6b3b]">{label}</p>
            <p className="mt-1 text-xs font-semibold text-[#5f4b32]">{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function FarmSign() {
  return (
    <group position={[0, 0, 3.55]}>
      <mesh position={[-0.82, 0.74, 0]} castShadow>
        <boxGeometry args={[0.1, 1.48, 0.1]} />
        <meshStandardMaterial color="#5b3417" />
      </mesh>

      <mesh position={[0.82, 0.74, 0]} castShadow>
        <boxGeometry args={[0.1, 1.48, 0.1]} />
        <meshStandardMaterial color="#5b3417" />
      </mesh>

      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[2.2, 0.68, 0.13]} />
        <meshStandardMaterial color="#a96a35" />
      </mesh>

      <Text position={[0, 1.33, 0.08]} fontSize={0.16} color="#fff7d6" anchorX="center" anchorY="middle">
        LOCAL FARM MARKET
      </Text>
    </group>
  );
}

function FarmWorld({ night, mobile }: { night: boolean; mobile: boolean }) {
  return (
    <>
      <CameraFlyIn mobile={mobile} />

      {night ? (
        <>
          <color attach="background" args={["#07111f"]} />
          <Stars radius={90} depth={45} count={2200} factor={4} fade />
        </>
      ) : (
        <Sky sunPosition={[100, 25, 100]} turbidity={8} rayleigh={2} />
      )}

      <ambientLight intensity={night ? 0.26 : 0.78} />

      <directionalLight
        position={[6, 8, 4]}
        intensity={night ? 0.38 : 1.85}
        castShadow
        shadow-mapSize-width={mobile ? 1024 : 2048}
        shadow-mapSize-height={mobile ? 1024 : 2048}
      />

      <Ground night={night} />
      <Grass mobile={mobile} />
      <Fence />
      <Coop night={night} />
      <FarmSign />
      <MovingClouds night={night} />
      <Fireflies night={night} />

      {night && (
        <Sparkles count={120} scale={[12, 4, 8]} size={2.4} speed={0.35} color="#fff7a8" />
      )}

      <WhiteChicken position={[-3.1, 0, -0.6]} scale={mobile ? 0.82 : 1} />
      <BrownChicken speed={0.9} scale={mobile ? 0.82 : 1} />
      <BrownChicken radius={1} speed={0.3} scale={mobile ? 0.82 : 1} />
      <BrownChicken center={[3, 0, 1]} radius={0.7} speed={0.5} scale={mobile ? 0.82 : 1} />
      <BrownChicken speed={0.6} center={[-2, 0, -4]} scale={mobile ? 0.82 : 1} radius={0.4} />

      <BlackChicken position={[-2.5, 0, 2.1]} scale={mobile ? 0.82 : 1} moveAmount={0.35} />
      <BlackChicken position={[2.5, 0, -2]} scale={mobile ? 0.82 : 1} moveAmount={0.15} />

      <GreyChicken
        position={[1, 0, -1]}
        scale={mobile ? 0.75 : 0.9}
        glideRadius={0.1}
        glideSpeed={0.1}
        minStopSeconds={3}
        maxStopSeconds={6}
      />

      <GreyChicken
        position={[1.6, 0, -2]}
        scale={mobile ? 0.75 : 0.9}
        glideRadius={0.5}
        glideSpeed={0.5}
        minStopSeconds={3}
        maxStopSeconds={6}
      />

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
          position={[mobile ? 0.4 : 0, mobile ? 3.25 : 3.55, -1.55]}
          fontSize={mobile ? 0.32 : 0.5}
          color={night ? "#fff4c2" : "#3f2a12"}
          anchorX="center"
          anchorY="middle"
        >
          American EggHub
        </Text>
      </Float>

      <Environment preset={night ? "night" : "sunset"} />

      <OrbitControls
        makeDefault
        enableZoom
        enableRotate
        enablePan={false}
        minDistance={mobile ? 4.5 : 3}
        maxDistance={mobile ? 16 : 14}
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2.05}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
    </>
  );
}

export default function FarmScene() {
  const [night, setNight] = useState(false);
  const router = useRouter();
  const mobile = useIsMobileScene();

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[#fff8e8]">
      <Canvas
        shadows
        dpr={mobile ? [1, 1.25] : [1, 1.7]}
        camera={{
          position: mobile ? [6.8, 4.6, 9.5] : [9, 5.5, 11],
          fov: mobile ? 56 : 45,
        }}
      >
        <Suspense fallback={null}>
          <FarmWorld night={night} mobile={mobile} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-0 top-0 z-20 w-full p-3 sm:p-5 md:p-6">
        <div className="pointer-events-auto max-w-[92vw] rounded-3xl bg-white/82 p-4 shadow-2xl backdrop-blur-xl sm:max-w-xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#2f6b3b] sm:text-sm">
              Coming Soon
            </p>

            <span className="rounded-full bg-[#2f6b3b]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#2f6b3b]">
              Beta Farm
            </span>
          </div>

          <h1 className="mt-2 max-w-md text-2xl font-black leading-[0.95] text-[#2b2115] sm:text-4xl md:text-5xl">
            Fresh eggs, local farms, smart selling.
          </h1>

          <p className="mt-3 max-w-md text-xs font-semibold leading-relaxed text-[#5f4b32] sm:text-sm md:text-base">
            Explore the farm, click the baskets, meet the chickens, then join the American EggHub waitlist.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={() => router.push("/landing")}
              className="rounded-full bg-[#2f6b3b] px-5 py-3 text-sm font-black text-white shadow-xl ring-4 ring-[#2f6b3b]/15 transition hover:scale-[1.03] hover:bg-[#24542e] sm:px-6"
            >
              Enter Landing Page →
            </button>

            <button
              onClick={() => setNight((v) => !v)}
              className="rounded-full bg-[#f8ead0] px-5 py-3 text-sm font-black text-[#5f4b32] shadow-lg transition hover:scale-[1.03]"
            >
              {night ? "Day Mode" : "Night Mode"}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-3 z-20 flex flex-wrap gap-2 sm:bottom-5 sm:left-5 sm:gap-3">
        <SoundLayer />
      </div>

      <div className="pointer-events-none absolute bottom-4 right-3 z-20 max-w-[190px] rounded-2xl bg-white/80 px-3 py-2 text-[10px] font-bold text-[#5f4b32] shadow-xl backdrop-blur sm:max-w-none sm:px-4 sm:py-3 sm:text-xs">
        Drag rotate • Pinch zoom • Click baskets
      </div>
    </main>
  );
}