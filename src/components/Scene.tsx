'use client';

import { Canvas, useLoader, useFrame as useThreeFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Billboard } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// Create textures for different planets
const mercuryTexture = '/textures/mercury.jpg';
const venusTexture = '/textures/venus.jpg';
const earthTexture = '/textures/earth.jpg';
const marsTexture = '/textures/mars.jpg';
const jupiterTexture = '/textures/jupiter.jpg';
const saturnTexture = '/textures/saturn.jpg';
const saturnRingTexture = '/textures/saturn_ring.png';
const uranusTexture = '/textures/uranus.jpg';
const neptuneTexture = '/textures/neptune.jpg';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  texture: string;
  rotationSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
  hasRings?: boolean;
  ringTexture?: string;
  ringSize?: [number, number];
  glowColor?: string;
  glowIntensity?: number;
  name: string;
}

const Planet = ({ 
  position, 
  size, 
  texture, 
  rotationSpeed, 
  orbitRadius,
  orbitSpeed,
  hasRings = false,
  ringTexture,
  ringSize = [1.3, 2],
  glowColor = "#ffffff",
  glowIntensity = 0.15,
  name
}: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<[number, number, number]>(position);
  const time = useRef(Math.random() * 100);
  const [hovered, setHovered] = useState(false);
  const [textOpacity, setTextOpacity] = useState(0);
  const [textScale, setTextScale] = useState(0);
  
  // Load texture properly - always call hook at the top level
  const planetTexture = useLoader(TextureLoader, texture);
  // Always call useLoader at the top level with a fallback texture
  const ringTextureObject = useLoader(TextureLoader, ringTexture || texture);
  
  // Animation for label
  useThreeFrame(({ clock }) => {
    if (textRef.current) {
      // Floating animation
      textRef.current.position.y = size * 1.8 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      
      // Fade in/out
      if (hovered) {
        setTextOpacity(Math.min(textOpacity + 0.05, 1));
        setTextScale(Math.min(textScale + 0.05, 1));
      } else {
        setTextOpacity(Math.max(textOpacity - 0.05, 0));
        setTextScale(Math.max(textScale - 0.05, 0));
      }
    }
  });
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      // Self rotation
      planetRef.current.rotation.y += rotationSpeed;
    }
    
    if (ringsRef.current && hasRings) {
      // Rings rotation, slightly different speed
      ringsRef.current.rotation.z += rotationSpeed * 0.3;
    }
    
    if (groupRef.current) {
      // Orbit rotation
      time.current += delta;
      
      const x = Math.cos(time.current * orbitSpeed) * orbitRadius;
      const z = Math.sin(time.current * orbitSpeed) * orbitRadius;
      
      groupRef.current.position.x = initialPosition.current[0] + x;
      groupRef.current.position.z = initialPosition.current[2] + z;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Subtle glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.2, 32, 32]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent={true} 
          opacity={glowIntensity}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet */}
      <mesh 
        ref={planetRef} 
        castShadow 
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={planetTexture} 
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      
      {/* Planet name label */}
      <Billboard
        ref={textRef}
        position={[0, size * 1.8, 0]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group scale={[textScale, textScale, textScale]}>
          <Text
            fontSize={size * 0.8}
            color={glowColor}
            outlineWidth={0.05}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            material-opacity={textOpacity}
          >
            {name}
          </Text>
        </group>
      </Billboard>
      
      {/* Rings - for Saturn */}
      {hasRings && (
        <mesh 
          ref={ringsRef} 
          rotation={[Math.PI / 2.5, 0, 0]}
          position={[0, 0, 0]}
        >
          <ringGeometry args={[size * ringSize[0], size * ringSize[1], 128]} />
          <meshStandardMaterial 
            color="#ffffff"
            map={ringTexture ? ringTextureObject : null}
            side={THREE.DoubleSide} 
            transparent={true}
            opacity={1}
            alphaTest={0.1}
            metalness={0.4}
            roughness={0.6}
            emissive={glowColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  );
};

export default function Scene() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 160], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 60]} intensity={2.5} color="#f8f0dd" />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        
        <Suspense fallback={null}>
          {/* Mercury */}
          <Planet 
            position={[-75, 45, -10]} 
            size={2.0} 
            texture={mercuryTexture}
            rotationSpeed={0.015} 
            orbitRadius={2}
            orbitSpeed={0.005}
            glowColor="#f5f5f5"
            name="Mercury"
          />
          
          {/* Venus */}
          <Planet 
            position={[70, 50, 0]} 
            size={2.4} 
            texture={venusTexture}
            rotationSpeed={0.012} 
            orbitRadius={2}
            orbitSpeed={0.004}
            glowColor="#f8e8d0"
            name="Venus"
          />
          
          {/* Earth */}
          <Planet 
            position={[-60, -10, 5]} 
            size={2.5} 
            texture={earthTexture}
            rotationSpeed={0.01} 
            orbitRadius={2}
            orbitSpeed={0.003}
            glowColor="#a7d9f3"
            name="Earth"
          />
          
          {/* Mars */}
          <Planet 
            position={[65, -15, -5]} 
            size={2.3} 
            texture={marsTexture}
            rotationSpeed={0.009} 
            orbitRadius={2}
            orbitSpeed={0.0025}
            glowColor="#f7a26c"
            name="Mars"
          />
          
          {/* Jupiter */}
          <Planet 
            position={[-20, -50, 0]} 
            size={4.5} 
            texture={jupiterTexture}
            rotationSpeed={0.007} 
            orbitRadius={2}
            orbitSpeed={0.0015}
            glowColor="#f3e6c4"
            name="Jupiter"
          />
          
          {/* Saturn */}
          <Planet 
            position={[5, 0, 20]} 
            size={4.0} 
            texture={saturnTexture}
            rotationSpeed={0.006} 
            orbitRadius={2}
            orbitSpeed={0.001}
            hasRings={true}
            ringTexture={saturnRingTexture}
            ringSize={[2.2, 4.0]}
            glowColor="#f8e8b0"
            name="Saturn"
          />
          
          {/* Uranus */}
          <Planet 
            position={[15, 55, 5]} 
            size={3.0} 
            texture={uranusTexture}
            rotationSpeed={0.005} 
            orbitRadius={2}
            orbitSpeed={0.0008}
            glowColor="#b0e8f0"
            name="Uranus"
          />
          
          {/* Neptune */}
          <Planet 
            position={[40, -45, -5]} 
            size={2.8} 
            texture={neptuneTexture}
            rotationSpeed={0.004} 
            orbitRadius={2}
            orbitSpeed={0.0006}
            glowColor="#8080f0"
            name="Neptune"
          />
          
          <Stars radius={250} depth={60} count={8000} factor={4} saturation={0} fade />
        </Suspense>
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
} 