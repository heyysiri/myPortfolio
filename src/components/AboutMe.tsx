'use client';

import { useRef, useState, useEffect } from 'react';
import VariableProximity from './VariableProximity';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const bio1ContainerRef = useRef<HTMLDivElement>(null);
  const bio2ContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFindCamelPopup, setShowFindCamelPopup] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [isCamelClicked, setIsCamelClicked] = useState(false);

  useEffect(() => {
    // Animation on mount
    setIsVisible(true);

    // Show find camel popup after 4 seconds
    const popupTimer = setTimeout(() => {
      setShowFindCamelPopup(true);
    }, 4000);

    return () => {
      clearTimeout(popupTimer);
    };
  }, []);

  const handleCamelClick = () => {
    setIsCamelClicked(true);
    setShowFindCamelPopup(false);
    setShowThankYouPopup(true);

    // Hide thank you popup after 4 seconds
    setTimeout(() => {
      setShowThankYouPopup(false);
    }, 4000);
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } }
  };

  // Popup animation variants
  const popupVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  // Camel animation variants
  const camelContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  };

  const camelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };

  // Frame-by-frame camel walking animation
  const legFrames = [
    { rotate: 0 },
    { rotate: 15 },
    { rotate: 30 },
    { rotate: 15 },
    { rotate: 0 },
    { rotate: -15 },
    { rotate: -30 },
    { rotate: -15 },
    { rotate: 0 }
  ];

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-4xl px-6 py-12 mx-auto relative"
    >
      {/* Popup Messages */}
      <AnimatePresence>
        {showFindCamelPopup && (
          <motion.div
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-amber-800/90 text-white py-4 px-6 rounded-lg shadow-lg z-50 text-center max-w-md"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
          >
            <p style={{ fontFamily: 'var(--font-orbitron)' }} className="text-lg">My camel has run away! Can you spot it in this vast desert?</p>
          </motion.div>
        )}

        {showThankYouPopup && (
          <motion.div
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-600/90 text-white py-4 px-6 rounded-lg shadow-lg z-50 text-center max-w-md"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
          >
            <p style={{ fontFamily: 'var(--font-orbitron)' }} className="text-lg">Thank you, I&apos;ll be coming to get it!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={headingVariants}
        className="mb-16 text-center"
      >
        <div
          ref={nameContainerRef}
          className="relative inline-block"
        >
          <VariableProximity
            label="Siri Karra"
            className="text-4xl md:text-6xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-orbitron)' }}
            fromFontVariationSettings="'wght' 400, 'opsz' 14"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={nameContainerRef}
            radius={200}
            falloff="exponential"
          />
        </div>
        <h2 className="text-xl md:text-2xl mt-4 text-blue-300" style={{ fontFamily: 'var(--font-orbitron)' }}>Full-Stack Developer & Space Enthusiast</h2>
      </motion.div>

      <motion.div 
        variants={contentVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="mb-16 text-white/90 text-lg leading-relaxed space-y-8"
      >
        <div
          ref={bio1ContainerRef}
          className="relative"
        >
          <VariableProximity
            label="Welcome to my cosmic portfolio! I'm a passionate developer with expertise in creating immersive web experiences. My journey in the digital universe revolves around building innovative applications that combine cutting-edge technology with intuitive design."
            className="text-xl text-white/90"
            style={{ fontFamily: 'var(--font-orbitron)' }}
            fromFontVariationSettings="'wght' 300, 'opsz' 12"
            toFontVariationSettings="'wght' 800, 'opsz' 32"
            containerRef={bio1ContainerRef}
            radius={150}
            falloff="exponential"
          />
        </div>
        
        <div
          ref={bio2ContainerRef}
          className="relative"
        >
          <VariableProximity
            label="When I'm not coding, you can find me stargazing, exploring the latest in astrophysics, or diving into science fiction that expands the imagination about what's possible in our universe."
            className="text-xl text-white/90"
            style={{ fontFamily: 'var(--font-orbitron)' }}
            fromFontVariationSettings="'wght' 300, 'opsz' 12"
            toFontVariationSettings="'wght' 800, 'opsz' 32"
            containerRef={bio2ContainerRef}
            radius={150}
            falloff="exponential"
          />
        </div>
      </motion.div>

      {/* Camel Animation */}
      <motion.div
        className="fixed bottom-4 w-full left-0 flex justify-center pointer-events-none"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={camelContainerVariants}
      >
        <motion.div
          className="relative h-24 mb-0 pointer-events-auto cursor-pointer"
          variants={camelVariants}
          animate={!isCamelClicked ? {
            x: [0, window.innerWidth * 0.8],
            transition: {
              x: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 18,
                ease: "linear"
              }
            }
          } : { x: isCamelClicked ? window.innerWidth * 0.5 - 50 : 0 }}
          onClick={handleCamelClick}
        >
          {/* Camel Body */}
          <motion.div
            className="w-28 h-16 bg-amber-700 rounded-t-3xl relative z-20"
            animate={!isCamelClicked ? { y: [0, -2, 0, -2, 0], rotate: [0, 1, 0, -1, 0] } : { y: 0, rotate: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            {/* Shadow beneath camel */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-black/40 rounded-full blur-sm z-10"></div>
            
            {/* Camel Head */}
            <motion.div
              className="absolute -left-9 top-1 w-12 h-7 bg-amber-700 rounded-l-full z-20"
              animate={!isCamelClicked ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <div className="absolute right-2 top-1 w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="absolute right-2 top-4 w-6 h-1 bg-amber-900 rounded-full"></div>
            </motion.div>
            
            {/* Camel Humps */}
            <motion.div 
              className="absolute left-4 -top-4 w-8 h-6 bg-amber-700 rounded-t-full z-30"
              animate={!isCamelClicked ? { y: [0, -1, 0, -1, 0] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="absolute right-6 -top-3 w-8 h-5 bg-amber-700 rounded-t-full z-30"
              animate={!isCamelClicked ? { y: [0, -1, 0, -1, 0] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.3 }}
            ></motion.div>
            
            {/* Camel Legs - Front */}
            <motion.div 
              className="absolute left-5 bottom-0 w-2 h-8 bg-amber-700 origin-top z-10"
              animate={!isCamelClicked ? { rotate: legFrames.map(f => f.rotate) } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <div className="absolute bottom-0 left-0 w-2 h-1 bg-amber-900 rounded"></div>
            </motion.div>
            <motion.div 
              className="absolute left-12 bottom-0 w-2 h-8 bg-amber-700 origin-top z-10"
              animate={!isCamelClicked ? { rotate: legFrames.map(f => f.rotate) } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }}
            >
              <div className="absolute bottom-0 left-0 w-2 h-1 bg-amber-900 rounded"></div>
            </motion.div>
            
            {/* Camel Legs - Back */}
            <motion.div 
              className="absolute right-12 bottom-0 w-2 h-8 bg-amber-700 origin-top z-30"
              animate={!isCamelClicked ? { rotate: legFrames.map(f => f.rotate) } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.375 }}
            >
              <div className="absolute bottom-0 left-0 w-2 h-1 bg-amber-900 rounded"></div>
            </motion.div>
            <motion.div 
              className="absolute right-5 bottom-0 w-2 h-8 bg-amber-700 origin-top z-30"
              animate={!isCamelClicked ? { rotate: legFrames.map(f => f.rotate) } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 1.125 }}
            >
              <div className="absolute bottom-0 left-0 w-2 h-1 bg-amber-900 rounded"></div>
            </motion.div>
            
            {/* Camel Tail */}
            <motion.div 
              className="absolute -right-5 top-6 w-6 h-1.5 bg-amber-800 origin-left"
              animate={!isCamelClicked ? { rotate: [0, 10, 20, 10, 0, -10, -20, -10, 0] } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="text-center"
      >
        <div className="flex justify-center items-center gap-20">
          {/* GitHub Icon */}
          <a 
            href="https://google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors duration-300"
            aria-label="GitHub"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          
          {/* LinkedIn Icon */}
          <a 
            href="https://google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
} 