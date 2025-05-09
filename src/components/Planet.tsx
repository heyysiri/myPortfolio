'use client';

// This file is now a simpler version that matches what we're using in Scene.tsx
// It's kept here for reference but we're directly using the Planet component in Scene.tsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  rotationSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
}

const Planet = ({ 
  position, 
  size, 
  color, 
  rotationSpeed, 
  orbitRadius,
  orbitSpeed 
}: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<[number, number, number]>(position);
  const time = useRef(Math.random() * 100);

  useFrame((state, delta) => {
    if (planetRef.current) {
      // Self rotation
      planetRef.current.rotation.y += rotationSpeed;
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
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
};

export default Planet; 