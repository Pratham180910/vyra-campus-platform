import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// CENTRAL ATMOSPHERIC SPHERE (Single Focal 3D Visual Anchor)
// Increased ~12% from previous (radius 1.66), visually powerful & balanced
// -------------------------------------------------------------
const CentralAtmosphericSphere: React.FC<{
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: number;
}> = ({ mouse, scrollProgress }) => {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Swarm of atmospheric energy particles surrounding the central core
  const particles = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cPurple = new THREE.Color('#8B5CF6');
    const cLime = new THREE.Color('#C4FF3D');

    for (let i = 0; i < count; i++) {
      const radius = 1.9 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const isLime = Math.random() > 0.78;
      const col = isLime ? cLime : cPurple;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions: pos, colors };
  }, []);

  useFrame((state, delta) => {
    if (!sphereGroupRef.current) return;

    // Smooth cursor interpolation (lerping / damping)
    const targetRotX = mouse.current.y * 0.24 + scrollProgress * 0.38;
    const targetRotY = mouse.current.x * 0.32 + state.clock.elapsedTime * 0.14;

    sphereGroupRef.current.rotation.x = THREE.MathUtils.damp(
      sphereGroupRef.current.rotation.x,
      targetRotX,
      2.5,
      delta
    );
    sphereGroupRef.current.rotation.y = THREE.MathUtils.damp(
      sphereGroupRef.current.rotation.y,
      targetRotY,
      2.5,
      delta
    );

    // Subtle scale breathing & scroll transformation
    const baseScale = 1.0 - scrollProgress * 0.14;
    sphereGroupRef.current.scale.setScalar(baseScale);

    // Orbital rings independent rotation
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.24;
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.14;
    }

    // Inner core architectural counter-rotation
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group ref={sphereGroupRef} position={[0, 0, 0]}>
      {/* 1. Outer Holographic Glass Atmosphere Dome (Radius: 1.66) */}
      <mesh ref={outerSphereRef}>
        <sphereGeometry args={[1.66, 36, 36]} />
        <meshPhysicalMaterial
          color="#3A1C71"
          emissive="#23074D"
          emissiveIntensity={0.35}
          roughness={0.14}
          metalness={0.1}
          transmission={0.88}
          thickness={1.1}
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Outer Wireframe Hex Lattice Layer (Radius: 1.70) */}
      <mesh>
        <sphereGeometry args={[1.7, 20, 20]} />
        <meshBasicMaterial
          color="#8B5CF6"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* 2. Neon Orbital Energy Rings (Electric Violet + Acid Lime) */}
      <group ref={ringsRef}>
        {/* Main tilted electric purple ring */}
        <mesh rotation={[Math.PI / 3, 0.4, 0]}>
          <torusGeometry args={[2.08, 0.018, 16, 100]} />
          <meshBasicMaterial color="#8B5CF6" />
        </mesh>

        {/* Secondary tilted acid lime ring */}
        <mesh rotation={[-Math.PI / 4, -0.6, 0.5]}>
          <torusGeometry args={[1.9, 0.013, 16, 100]} />
          <meshBasicMaterial color="#C4FF3D" />
        </mesh>

        {/* Glowing orbital diode beads on rings */}
        <mesh position={[2.08 * Math.cos(1), 2.08 * Math.sin(1) * 0.5, 0.95]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color="#C4FF3D" />
        </mesh>
        <mesh position={[-1.9 * Math.cos(2), 1.9 * Math.sin(2) * 0.3, -0.8]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#8B5CF6" />
        </mesh>
      </group>

      {/* 3. Central Futuristic Campus Core (Architectural Monoliths) */}
      <group ref={innerCoreRef}>
        {/* Glowing Core Sphere */}
        <mesh>
          <sphereGeometry args={[0.58, 32, 32]} />
          <meshStandardMaterial
            color="#1E1035"
            emissive="#8B5CF6"
            emissiveIntensity={0.85}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Architectural tower clusters representing modern campus hub */}
        {[-0.28, 0, 0.28].map((x, i) =>
          [-0.28, 0, 0.28].map((z, j) => {
            const height = 0.4 + Math.sin(i * 3 + j * 2) * 0.22 + 0.2;
            return (
              <mesh key={`${i}-${j}`} position={[x, height / 2 - 0.16, z]}>
                <boxGeometry args={[0.16, height, 0.16]} />
                <meshStandardMaterial
                  color="#151722"
                  emissive={i === 1 && j === 1 ? '#C4FF3D' : '#8B5CF6'}
                  emissiveIntensity={i === 1 && j === 1 ? 0.9 : 0.45}
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            );
          })
        )}

        {/* Ambient Ground Disc inside Orb */}
        <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.18, 32]} />
          <meshStandardMaterial
            color="#0A0B12"
            emissive="#4C1D95"
            emissiveIntensity={0.3}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* 4. Ambient Particle Swarm */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// -------------------------------------------------------------
// MAIN HERO SCENE CONTAINER
// Focuses entirely on the central 3D visual sphere with zero cards.
// -------------------------------------------------------------
interface HeroSceneProps {
  scrollProgress?: number;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ scrollProgress = 0 }) => {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current = { x: x * 0.5, y: y * 0.5 };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.0], fov: 44 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        {/* Cinematic Stage Lighting */}
        <ambientLight intensity={0.6} />

        {/* Key Electric Violet Light */}
        <pointLight position={[5, 4, 4]} color="#8B5CF6" intensity={4.5} distance={15} />

        {/* Rim Acid Lime Accent Light */}
        <pointLight position={[-4, -3, 3]} color="#C4FF3D" intensity={2.8} distance={13} />

        {/* Fill Lights for Depth & Ambient Atmosphere */}
        <directionalLight position={[0, 4, 6]} color="#F1F5F9" intensity={0.85} />
        <directionalLight position={[0, -4, -3]} color="#3B82F6" intensity={1.1} />

        {/* Central Atmospheric Sphere (Sole 3D Focal Anchor) */}
        <CentralAtmosphericSphere mouse={mouseRef} scrollProgress={scrollProgress} />
      </Canvas>

      {/* Floating editorial badge matching reference: "SAME CAMPUS DIFFERENT STORIES" */}
      <div
        className="absolute top-8 right-6 md:right-10 pointer-events-none select-none hidden sm:flex flex-col items-end opacity-75"
        style={{
          transform: `translateY(${scrollProgress * 40}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <span className="font-display font-black tracking-widest text-xs text-text-muted rotate-6">
          SAME CAMPUS
        </span>
        <span className="font-display font-black tracking-widest text-xs text-secondary rotate-6">
          DIFFERENT STORIES
        </span>
      </div>
    </div>
  );
};
