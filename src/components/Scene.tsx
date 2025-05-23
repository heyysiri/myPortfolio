'use client';

import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useThree } from '@react-three/fiber';
import { createPortal } from 'react-dom';
import { ProjectCardsCarousel } from './ProjectCardsCarousel';
import AboutMe from './AboutMe';
import { SkillsCards } from './SkillsCards';
import JupiterAchievements from './JupiterAchievements';
import ContactForm from './ContactForm';

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

// Space facts for Saturn, Uranus and Neptune
const spaceFacts = {
  'Earth': [
    "Did you know? Earth is the only planet not named after a god. It comes from the Old English word 'ertha' meaning ground or soil!",
    "Earth is the densest planet in our solar system. That's heavy stuff!",
    "Our planet Earth is traveling through space at 67,000 mph. Yet somehow we're still late for meetings!"
  ],
  'Uranus': [
    "Fun fact: Uranus rotates sideways! It's basically rolling around the Sun like a cosmic bowling ball.",
    "Did you know? Scientists have only spent 2% of their research time explaining how to properly pronounce 'Uranus'.",
    "Uranus has 13 rings, but they're so dark and faint that most people forget to invite them to the planetary ring parties."
  ],
  'Neptune': [
    "Did you know? Neptune has the strongest winds in the solar system, reaching up to 1,200 mph. Your bad hair day could be MUCH worse!",
    "Neptune has only completed ONE orbit since its discovery in 1846. Talk about a long year!",
    "Neptune's moon Triton is slowly spiraling inward and will eventually be torn apart by gravity. Planetary scientists call this 'the ultimate breakup'."
  ]
};

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
  onSelect,
  onHover
}: PlanetProps & { isSelected: boolean; onSelect: () => void; onHover: (isHovered: boolean, worldPosition: THREE.Vector3) => void }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<[number, number, number]>(position);
  const time = useRef(Math.random() * 100);
  const [isHovered, setIsHovered] = useState(false);
  const planetNameRef = useRef('');
  
  // Get responsive settings
  const { scaleFactor, positionMultiplier } = useResponsiveSettings();
  
  // Load textures - always call hooks at the top level
  const planetTexture = useLoader(TextureLoader, texture);
  // Always load ringTexture (or fallback) to avoid conditional hook calls
  const ringTextureObject = useLoader(TextureLoader, ringTexture || texture);
  
  // Adjust position based on responsiveness
  const responsivePosition: [number, number, number] = [
    position[0] * positionMultiplier,
    position[1] * positionMultiplier,
    position[2] * positionMultiplier
  ];
  
  useEffect(() => {
    // Update initial position when responsive values change
    initialPosition.current = responsivePosition;
  }, [responsivePosition]);

  // Determine planet name based on its position
  useEffect(() => {
    // Map positions to planet names (using the initial, non-responsive positions)
    const positionMap: Record<string, string> = {
      '-75,45,-10': 'Mercury',
      '70,50,0': 'Venus',
      '-60,-10,5': 'Earth',
      '65,-15,-5': 'Mars',
      '-20,-50,0': 'Jupiter',
      '5,0,20': 'Saturn',
      '15,55,5': 'Uranus',
      '40,-45,-5': 'Neptune'
    };
    
    // Create position key
    const posKey = `${position[0]},${position[1]},${position[2]}`;
    planetNameRef.current = positionMap[posKey] || "";
  }, [position]);
  
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
        <sphereGeometry args={[size * scaleFactor * 1.2, 32, 32]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent={true} 
          opacity={isSelected ? glowIntensity * 2 : isHovered ? glowIntensity * 1.5 : glowIntensity}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet */}
      <mesh 
        ref={planetRef} 
        castShadow 
        receiveShadow
        onClick={onSelect}
        onPointerOver={(event) => {
          setIsHovered(true);
          onHover(true, event.point);
        }}
        onPointerOut={() => {
          setIsHovered(false);
          onHover(false, new THREE.Vector3());
        }}
      >
        <sphereGeometry args={[size * scaleFactor, 64, 64]} />
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
          <ringGeometry args={[size * scaleFactor * ringSize[0], size * scaleFactor * ringSize[1], 128]} />
          <meshStandardMaterial 
            color="#ffffff"
            map={ringTextureObject}
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

// Add FunFactCard component
const FunFactCard = ({ planet }: { planet: string }) => {
  const [currentFact, setCurrentFact] = useState(0);
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
    // Rotate through facts every 10 seconds
    const interval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % spaceFacts[planet as keyof typeof spaceFacts].length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [planet]);

  // If there are no facts for this planet, don't show anything
  if (!spaceFacts[planet as keyof typeof spaceFacts]) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-[1005]">
      <div 
        style={{
          maxWidth: isMobile ? '90%' : '70%',
          padding: '2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontFamily: "'Space Mono', 'Orbitron', monospace",
          textAlign: 'center',
          textShadow: '0 0 10px rgba(128, 230, 255, 0.8)',
          fontSize: isMobile ? '1.2rem' : '1.8rem',
          animation: 'pulse 2s infinite ease-in-out',
          boxShadow: '0 0 50px rgba(100, 200, 255, 0.3)',
          transition: 'all 0.5s ease'
        }}
      >
        {spaceFacts[planet as keyof typeof spaceFacts][currentFact]}
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @font-face {
          font-family: 'Space Mono';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/spacemono/v12/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2) format('woff2');
        }
        
        @font-face {
          font-family: 'Orbitron';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmIyXjU1pg.woff2) format('woff2');
        }
      `}</style>
    </div>
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
      onClick={planet !== 'Mars' && planet !== 'Saturn' && planet !== 'Venus' && planet !== 'Jupiter' && planet !== 'Mercury' ? onClose : undefined}
    >
      <img 
        src={surfaceImage} 
        alt={`${planet} surface`} 
        style={{
          ...surfaceImageStyles,
          filter: planet === 'Mars' ? 'none' : 'brightness(0.7)',
          opacity: planet === 'Saturn' || planet === 'Mars' || planet === 'Venus' || planet === 'Mercury' ? 0.6 : 1
        }}
      />
      
      {/* Dark overlay for Saturn, Mars and Venus */}
      {(planet === 'Saturn' || planet === 'Mars' || planet === 'Venus' || planet === 'Mercury') && (
        <div className="absolute inset-0 bg-black/50 z-[1001]"></div>
      )}
      
      {/* Show project carousel only on Mars */}
      {planet === 'Mars' && (
        <div className="absolute inset-0 flex items-center justify-center z-[1005]">
          <ProjectCardsCarousel />
        </div>
      )}
      
      {/* Show AboutMe component on Saturn */}
      {planet === 'Saturn' && (
        <div className="absolute inset-0 flex items-center justify-center z-[1005]">
          <AboutMe />
        </div>
      )}
      
      {/* Show SkillsCards component on Venus */}
      {planet === 'Venus' && (
        <div className="absolute inset-0 flex items-center justify-center z-[1005]">
          <SkillsCards />
        </div>
      )}
      
      {/* Show JupiterAchievements component on Jupiter */}
      {planet === 'Jupiter' && (
        <div className="absolute inset-0 flex items-center justify-center z-[1005]">
          <JupiterAchievements />
        </div>
      )}
      
      {/* Show ContactForm component on Mercury */}
      {planet === 'Mercury' && (
        <div className="absolute inset-0 flex items-center justify-center z-[1005] px-4 sm:px-6 py-8">
          <ContactForm />
        </div>
      )}
      
      {/* Show FunFactCard on Earth, Uranus, and Neptune */}
      {(planet === 'Earth' || planet === 'Uranus' || planet === 'Neptune') && planet && (
        <FunFactCard planet={planet} />
      )}
      
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
        zIndex: 1010
      }} onClick={onClose}>
        {planet === 'Mars' ? 'Exit' : 
         planet === 'Earth' ? 'Exit' : 
         planet === 'Venus' ? 'Exit' : 
         planet === 'Jupiter' ? 'Exit' : 
         planet === 'Mercury' ? 'Exit' : 
         planet === 'Uranus' ? 'Exit' : 
         planet === 'Neptune' ? 'Exit' : 
         planet === 'Saturn' ? 'Exit' : 'Exit'}
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
        zIndex: 1010
      }}>
        {planet === 'Mars' ? 'Mars' : 
         planet === 'Earth' ? 'Earth' : 
         planet === 'Venus' ? 'Venus' : 
         planet === 'Jupiter' ? 'Jupiter' : 
         planet === 'Mercury' ? 'Mercury' : 
         planet === 'Saturn' ? 'Saturn' : 
         planet === 'Uranus' ? 'Uranus' : 
         planet === 'Neptune' ? 'Neptune' : 
         `${planet.toUpperCase()} SURFACE`}
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

// Planet click popup notification
const PlanetClickPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure the page has fully loaded
    const timer = setTimeout(() => {
      setShowPopup(true);
      
      // Hide after 3 seconds
      const hideTimer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      
      return () => clearTimeout(hideTimer);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!showPopup) return null;
  
  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '5px',
      border: '2px solid rgba(100, 200, 255, 0.5)',
      fontFamily: "'Orbitron', sans-serif",
      fontSize: '25px',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-in-out, fadeOut 0.3s ease-in-out 2.7s',
      boxShadow: '0 0 20px rgba(100, 200, 255, 0.3)',
      textShadow: '0 0 10px rgba(100, 200, 255, 0.8)',
    }}>
      Click on any planet!
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default function Scene() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showSurface, setShowSurface] = useState(false);
  const [surfacePlanet, setSurfacePlanet] = useState<string | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<{ name: string; position: { x: number, y: number } } | null>(null);

  const handleZoomComplete = (planet: string) => {
    setSurfacePlanet(planet);
    setShowSurface(true);
  };

  const handleCloseSurface = () => {
    setShowSurface(false);
    setSurfacePlanet(null);
    setSelectedPlanet(null);
  };
  
  // Function to handle planet hover
  const handlePlanetHover = (isHovered: boolean, worldPosition: THREE.Vector3, planetName: string) => {
    if (isHovered && !selectedPlanet) {
      // Use the current mouse position
      const mousePosition = {
        x: (window.event as MouseEvent)?.clientX || window.innerWidth / 2,
        y: (window.event as MouseEvent)?.clientY || window.innerHeight / 2
      };
      setHoveredPlanet({ name: planetName, position: mousePosition });
    } else if (!isHovered && hoveredPlanet?.name === planetName) {
      setHoveredPlanet(null);
    }
  };
  
  // Get planet hover label content
  const getTooltipContent = (planetName: string) => {
    switch (planetName) {
      case 'Mars':
        return 'Projects';
      case 'Venus':
        return 'Skills';
      case 'Jupiter':
        return '🏆 🎓'; // Trophy and certificate emojis
      case 'Mercury':
        return 'Contact';
      case 'Saturn':
        return 'About Me';
      default:
        return 'Hello!'; // For Uranus, Neptune
    }
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Mercury');
            }}
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Venus');
            }}
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Earth');
            }}
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
            glowIntensity={0.25} // Make Mars glow a bit more to highlight it
            isSelected={selectedPlanet === 'Mars'}
            onSelect={() => setSelectedPlanet(selectedPlanet === 'Mars' ? null : 'Mars')}
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Mars');
            }}
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Jupiter');
            }}
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Saturn');
            }}
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Uranus');
            }}
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
            onHover={(isHovered, worldPosition) => {
              handlePlanetHover(isHovered, worldPosition, 'Neptune');
            }}
          />
          
          <Stars radius={250} depth={60} count={8000} factor={4} saturation={0} fade />
        </Suspense>
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </ResponsiveCanvasWrapper>
      
      <LandingAlert planet={selectedPlanet} />
      <PlanetClickPopup />
      
      {/* Planet Hover Label - outside of Canvas context */}
      {hoveredPlanet && !selectedPlanet && (
        <div
          style={{
            position: 'absolute',
            left: `${hoveredPlanet.position.x}px`,
            top: `${hoveredPlanet.position.y - 30}px`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontFamily: 'var(--font-orbitron)',
            fontSize: '14px',
            zIndex: 1000,
            pointerEvents: 'none',
            textShadow: '0 0 10px rgba(100, 200, 255, 0.8)',
            boxShadow: '0 0 15px rgba(100, 200, 255, 0.3)',
            border: '1px solid rgba(100, 200, 255, 0.5)',
            opacity: 0.9,
          }}
        >
          {getTooltipContent(hoveredPlanet.name)}
        </div>
      )}
      
      {showSurface && surfacePlanet && surfacePlanet !== 'Mars' && (
        <SurfaceView 
          planet={surfacePlanet}
          onClose={handleCloseSurface}
        />
      )}
      
      {/* Special handling for Mars */}
      {showSurface && surfacePlanet === 'Mars' && (
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
        >
          <img 
            src={marsSurface} 
            alt="Mars surface" 
            style={{
              ...surfaceImageStyles,
              opacity: 0.5,
              filter: 'brightness(0.6) contrast(1.2) saturate(1.2)'
            }}
          />
          
          {/* Dark overlay for better contrast with projects */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1001]"></div>
          
          <div className="absolute inset-0 flex items-center justify-center z-[1005]">
            <div className="w-full max-w-[1200px] mx-auto">
              <ProjectCardsCarousel />
            </div>
          </div>
          
          <button
            onClick={handleCloseSurface}
            className="fixed top-4 right-4 bg-black/60 hover:bg-black/80 text-white px-5 py-2.5 rounded-full z-[1010] font-['Orbitron'] text-sm border-none transition-all duration-300"
          >
            Exit
          </button>
          
          <div className="fixed bottom-4 left-4 bg-black/60 text-white px-5 py-2.5 rounded-full z-[1010] font-['Orbitron'] border border-white/20">
            MY PROJECTS
          </div>
        </div>
      )}
    </div>
  );
} 