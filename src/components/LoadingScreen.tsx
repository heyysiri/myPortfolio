'use client';

import { useEffect, useState } from 'react';
import { Spiral } from 'ldrs/react';
import 'ldrs/react/Spiral.css';

interface LoadingScreenProps {
  children: React.ReactNode;
}

export default function LoadingScreen({ children }: LoadingScreenProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center w-full h-full z-50">
      <div 
        className="text-xl mb-10"
        style={{
          fontFamily: 'var(--font-orbitron)',
          background: 'linear-gradient(to right, #ff00cc, #3333ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}
      >
        Best viewed in landscape mode
      </div>
      <Spiral
        size="40"
        speed="0.9"
        color="white"
      />
    </div>
  );
} 