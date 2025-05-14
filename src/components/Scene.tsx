'use client';

import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useThree } from '@react-three/fiber';
import { createPortal } from 'react-dom';

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

// Surface images for planets
const mercurySurface = '/surfaces/mercury.jpeg';
const venusSurface = '/surfaces/venus.jpg';
const earthSurface = '/surfaces/earth.jpeg';
const marsSurface = '/surfaces/mars.jpg';
const jupiterSurface = '/surfaces/jupiter.jpg';
const saturnSurface = '/surfaces/saturn.jpg';
const uranusSurface = '/surfaces/uranus.jpg';
const neptuneSurface = '/surfaces/neptune.jpg';

// Add landing alert styles
const landingAlertStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#ff0000',
  padding: '20px 40px',
  borderRadius: '5px',
  border: '2px solid #ff0000',
  fontFamily: "'Orbitron', sans-serif",
  fontSize: '24px',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  zIndex: 1000,
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  textShadow: '0 0 10px #ff0000',
  boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)'
} as const;

// Surface image styles
const surfaceImageStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 999,
  opacity: 0,
  transition: 'opacity 1s ease-in-out',
  objectFit: 'cover',
  animation: 'fadeIn 1s forwards'
} as const;

// Responsive scaling for planet sizes and positions
function useResponsiveSettings() {
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Scale factor based on viewport size - increased to make planets larger
  const scaleFactor = isMobile ? 0.8 : 1.0;
  
  // Adjusted position multiplier to spread planets out more
  const positionMultiplier = isMobile ? 0.7 : 1.0;
  
  return { scaleFactor, positionMultiplier, isMobile, viewport };
}

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
  isSelected,
  onSelect
}: PlanetProps & { isSelected: boolean; onSelect: () => void }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<[number, number, number]>(position);
  const time = useRef(Math.random() * 100);
  
  // Get responsive settings
  const { scaleFactor, positionMultiplier } = useResponsiveSettings();
  
  // Adjust position based on responsiveness
  const responsivePosition: [number, number, number] = [
    position[0] * positionMultiplier,
    position[1] * positionMultiplier,
    position[2] * positionMultiplier
  ];
  
  // Adjust size based on responsiveness
  const responsiveSize = size * scaleFactor;
  
  // Load texture properly - always call hook at the top level
  const planetTexture = useLoader(TextureLoader, texture);
  // Always call useLoader at the top level with a fallback texture
  const ringTextureObject = useLoader(TextureLoader, ringTexture || texture);
  
  useEffect(() => {
    // Update initial position when responsive values change
    initialPosition.current = responsivePosition;
  }, [responsivePosition]);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      // Self rotation
      planetRef.current.rotation.y += rotationSpeed;
      
      // Smooth scale transition
      const currentScale = planetRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, isSelected ? 1.5 : 1, 0.1);
      planetRef.current.scale.set(newScale, newScale, newScale);
    }
    
    if (ringsRef.current && hasRings) {
      // Rings rotation, slightly different speed
      ringsRef.current.rotation.z += rotationSpeed * 0.3;
    }
    
    if (groupRef.current) {
      // Orbit rotation
      time.current += delta;
      
      const x = Math.cos(time.current * orbitSpeed) * orbitRadius * positionMultiplier;
      const z = Math.sin(time.current * orbitSpeed) * orbitRadius * positionMultiplier;
      
      groupRef.current.position.x = initialPosition.current[0] + x;
      groupRef.current.position.z = initialPosition.current[2] + z;
    }
  });

  return (
    <group ref={groupRef} position={responsivePosition}>
      {/* Subtle glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[responsiveSize * 1.2, 32, 32]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent={true} 
          opacity={isSelected ? glowIntensity * 2 : glowIntensity}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet */}
      <mesh 
        ref={planetRef} 
        castShadow 
        receiveShadow
        onClick={onSelect}
      >
        <sphereGeometry args={[responsiveSize, 64, 64]} />
        <meshStandardMaterial 
          map={planetTexture} 
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      
      {/* Rings - for Saturn */}
      {hasRings && (
        <mesh 
          ref={ringsRef} 
          rotation={[Math.PI / 2.5, 0, 0]}
          position={[0, 0, 0]}
        >
          <ringGeometry args={[responsiveSize * ringSize[0], responsiveSize * ringSize[1], 128]} />
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

// Camera controller component
const CameraController = ({ 
  selectedPlanet, 
  onZoomComplete 
}: { 
  selectedPlanet: string | null; 
  onZoomComplete: (planet: string) => void 
}) => {
  const { camera } = useThree();
  const zoomingComplete = useRef(false);
  const zoomTimer = useRef<NodeJS.Timeout | null>(null);
  const { positionMultiplier, isMobile } = useResponsiveSettings();
  
  useEffect(() => {
    if (!selectedPlanet) {
      zoomingComplete.current = false;
      if (zoomTimer.current) {
        clearTimeout(zoomTimer.current);
        zoomTimer.current = null;
      }
    }
  }, [selectedPlanet]);
  
  useFrame(() => {
    if (selectedPlanet) {
      // Find the planet's position
      const basePlanetPositions: { [key: string]: [number, number, number] } = {
        'Mercury': [-75, 45, -10],
        'Venus': [70, 50, 0],
        'Earth': [-60, -10, 5],
        'Mars': [65, -15, -5],
        'Jupiter': [-20, -50, 0],
        'Saturn': [5, 0, 20],
        'Uranus': [15, 55, 5],
        'Neptune': [40, -45, -5]
      };
      
      // Apply responsive scaling to positions
      const planetPositions: { [key: string]: [number, number, number] } = Object.fromEntries(
        Object.entries(basePlanetPositions).map(([key, pos]) => [
          key,
          [pos[0] * positionMultiplier, pos[1] * positionMultiplier, pos[2] * positionMultiplier]
        ])
      );
      
      const targetPosition = planetPositions[selectedPlanet];
      if (targetPosition) {
        // Get closer to the planet but not too close
        // Adjust zoom distance for mobile
        const zoomDistance = isMobile ? 15 : 10;
        const targetX = targetPosition[0];
        const targetY = targetPosition[1];
        const targetZ = targetPosition[2] + zoomDistance;
        
        // Smoothly move camera to planet
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
        
        // Look at the planet
        camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2]);
        
        // Check if we're close enough to trigger surface view
        const distance = Math.sqrt(
          Math.pow(camera.position.x - targetX, 2) +
          Math.pow(camera.position.y - targetY, 2) +
          Math.pow(camera.position.z - targetZ, 2)
        );
        
        if (distance < 0.5 && !zoomingComplete.current) {
          zoomingComplete.current = true;
          // Wait a bit before showing surface to allow the camera to settle
          zoomTimer.current = setTimeout(() => {
            onZoomComplete(selectedPlanet);
          }, 500);
        }
      }
    } else {
      // Return to default position
      // Adjust default camera position for mobile
      const defaultZ = isMobile ? 200 : 160;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.02);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, defaultZ, 0.02);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// Landing alert component
const LandingAlert = ({ planet }: { planet: string | null }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    setIsMobile(window.innerWidth < 768);
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (planet) {
      // Show alert immediately
      setShowAlert(true);
      setMessage(`LANDING ON ${planet.toUpperCase()}`);
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // Hide alert immediately when planet is deselected
      setShowAlert(false);
    }
  }, [planet]);

  if (!showAlert) return null;

  // Adjust styles for mobile
  const mobileStyles = isMobile ? {
    fontSize: '16px',
    padding: '15px 25px'
  } : {};

  return createPortal(
    <div style={{
      ...landingAlertStyles,
      ...mobileStyles,
      opacity: showAlert ? 1 : 0,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      {message}
    </div>,
    document.body
  );
};

// Surface view component
const SurfaceView = ({ planet, onClose }: { planet: string | null; onClose: () => void }) => {
  const [surfaceImage, setSurfaceImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    setIsMobile(window.innerWidth < 768);
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (!planet) {
      setSurfaceImage(null);
      return;
    }
    
    // Map planet name to surface image
    const surfaceImages: Record<string, string> = {
      'Mercury': mercurySurface,
      'Venus': venusSurface,
      'Earth': earthSurface,
      'Mars': marsSurface,
      'Jupiter': jupiterSurface,
      'Saturn': saturnSurface,
      'Uranus': uranusSurface,
      'Neptune': neptuneSurface
    };
    
    setSurfaceImage(surfaceImages[planet] || null);
  }, [planet]);
  
  if (!surfaceImage || !planet) return null;
  
  // Adjust text size for mobile
  const fontSize = isMobile ? '12px' : '14px';
  const labelFontSize = isMobile ? '16px' : '18px';
  
  return createPortal(
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1000,
        backgroundColor: 'black',
        animation: 'fadeIn 1s forwards'
      }}
      onClick={onClose}
    >
      <img 
        src={surfaceImage} 
        alt={`${planet} surface`} 
        style={surfaceImageStyles}
      />
      
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        color: 'white',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: fontSize,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1001
      }}>
        Click anywhere to return
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: labelFontSize,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1001
      }}>
        {planet.toUpperCase()} SURFACE
      </div>
    </div>,
    document.body
  );
};

// Scene wrapper component that provides responsive context
const ResponsiveCanvasWrapper = ({ children }: { children: React.ReactNode }) => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust field of view based on device type and aspect ratio
  const fov = isMobile ? 
    (aspectRatio < 1 ? 75 : 60) : // Portrait vs landscape on mobile
    45;                           // Desktop
  
  // Adjust camera z position based on device type
  const cameraZ = isMobile ? 200 : 160;
  
  return (
    <Canvas camera={{ position: [0, 0, cameraZ], fov: fov }}>
      {children}
    </Canvas>
  );
};

export default function Scene() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showSurface, setShowSurface] = useState(false);
  const [surfacePlanet, setSurfacePlanet] = useState<string | null>(null);

  const handleZoomComplete = (planet: string) => {
    setSurfacePlanet(planet);
    setShowSurface(true);
  };

  const handleCloseSurface = () => {
    setShowSurface(false);
    setSurfacePlanet(null);
    setSelectedPlanet(null);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Add Orbitron font */}
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Add keyframe animation for fade-in */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* Make the canvas container responsive */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          @media (max-width: 768px) {
            /* Mobile-specific styles */
            html, body {
              font-size: 14px;
            }
          }
        `}
      </style>
      
      <ResponsiveCanvasWrapper>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 60]} intensity={2.5} color="#f8f0dd" />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        
        <CameraController 
          selectedPlanet={selectedPlanet} 
          onZoomComplete={handleZoomComplete} 
        />
        
        <Suspense fallback={null}>
          {/* Mercury - decreased size from 3.0 to 2.5 */}
          <Planet 
            position={[-75, 45, -10]} 
            size={2.5} 
            texture={mercuryTexture}
            rotationSpeed={0.015} 
            orbitRadius={2}
            orbitSpeed={0.005}
            glowColor="#f5f5f5"
            isSelected={selectedPlanet === 'Mercury'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Mercury' ? null : 'Mercury')}
          />
          
          {/* Venus - decreased size from 3.6 to 2.8 */}
          <Planet 
            position={[70, 50, 0]} 
            size={2.8} 
            texture={venusTexture}
            rotationSpeed={0.012} 
            orbitRadius={2}
            orbitSpeed={0.004}
            glowColor="#f8e8d0"
            isSelected={selectedPlanet === 'Venus'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Venus' ? null : 'Venus')}
          />
          
          {/* Earth - decreased size from 3.8 to 3.0 */}
          <Planet 
            position={[-60, -10, 5]} 
            size={3.0} 
            texture={earthTexture}
            rotationSpeed={0.01} 
            orbitRadius={2}
            orbitSpeed={0.003}
            glowColor="#a7d9f3"
            isSelected={selectedPlanet === 'Earth'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Earth' ? null : 'Earth')}
          />
          
          {/* Mars - decreased size from 3.5 to 2.7 */}
          <Planet 
            position={[65, -15, -5]} 
            size={2.7} 
            texture={marsTexture}
            rotationSpeed={0.009} 
            orbitRadius={2}
            orbitSpeed={0.0025}
            glowColor="#f7a26c"
            isSelected={selectedPlanet === 'Mars'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Mars' ? null : 'Mars')}
          />
          
          {/* Jupiter - decreased size from 6.5 to 4.8 */}
          <Planet 
            position={[-20, -50, 0]} 
            size={4.8} 
            texture={jupiterTexture}
            rotationSpeed={0.007} 
            orbitRadius={2}
            orbitSpeed={0.0015}
            glowColor="#f3e6c4"
            isSelected={selectedPlanet === 'Jupiter'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Jupiter' ? null : 'Jupiter')}
          />
          
          {/* Saturn - decreased size from 6.0 to 4.5 */}
          <Planet 
            position={[5, 0, 20]} 
            size={4.5} 
            texture={saturnTexture}
            rotationSpeed={0.006} 
            orbitRadius={2}
            orbitSpeed={0.001}
            hasRings={true}
            ringTexture={saturnRingTexture}
            ringSize={[2.2, 4.0]}
            glowColor="#f8e8b0"
            isSelected={selectedPlanet === 'Saturn'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Saturn' ? null : 'Saturn')}
          />
          
          {/* Uranus - decreased size from 4.5 to 3.5 */}
          <Planet 
            position={[15, 55, 5]} 
            size={3.5} 
            texture={uranusTexture}
            rotationSpeed={0.005} 
            orbitRadius={2}
            orbitSpeed={0.0008}
            glowColor="#b0e8f0"
            isSelected={selectedPlanet === 'Uranus'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Uranus' ? null : 'Uranus')}
          />
          
          {/* Neptune - decreased size from 4.2 to 3.2 */}
          <Planet 
            position={[40, -45, -5]} 
            size={3.2} 
            texture={neptuneTexture}
            rotationSpeed={0.004} 
            orbitRadius={2}
            orbitSpeed={0.0006}
            glowColor="#8080f0"
            isSelected={selectedPlanet === 'Neptune'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Neptune' ? null : 'Neptune')}
          />
          
          <Stars radius={250} depth={60} count={8000} factor={4} saturation={0} fade />
        </Suspense>
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </ResponsiveCanvasWrapper>
      
      <LandingAlert planet={selectedPlanet} />
      
      {showSurface && surfacePlanet && (
        <SurfaceView 
          planet={surfacePlanet}
          onClose={handleCloseSurface}
        />
      )}
    </div>
  );
} 