'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '../components/LoadingScreen';

// Import components with dynamic import to prevent SSR issues
const Starfield = dynamic(() => import('react-starfield'), { ssr: false });
const Scene = dynamic(() => import('../components/Scene'), { ssr: false });

export default function Home() {
  return (
    <LoadingScreen>
      <div className="App" style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'black', position: 'relative' }}>
        <Starfield
          starCount={1000}
          starColor={[255, 255, 255]}
          speedFactor={0.05}
          backgroundColor="black"
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Suspense fallback={<div className="loading">Loading 3D Solar System...</div>}>
            <Scene />
          </Suspense>
        </div>
        
        {/* Instructions */}
        <div style={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 20, 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          padding: '10px', 
          maxWidth: '500px',
          fontSize: '14px',
          borderRadius: '5px'
        }}>
        </div>
      </div>
    </LoadingScreen>
  );
}