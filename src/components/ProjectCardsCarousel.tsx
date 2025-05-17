'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { IconArrowNarrowRight, IconArrowNarrowLeft } from "@tabler/icons-react";
import { projectsData } from '../data/projects';
import { HoverBorderGradient } from './ui/HoverBorderGradient';

interface ProjectCardProps {
  project: typeof projectsData[0];
  isActive: boolean;
  isMobile: boolean;
}

const ProjectCard = ({ project, isActive, isMobile }: ProjectCardProps) => {
  // Calculate font size based on title length
  const getTitleFontSize = () => {
    if (project.title.length > 25) {
      return 'text-lg';
    } else if (project.title.length > 20) {
      return 'text-xl';
    } else {
      return 'text-2xl';
    }
  };

  // Card dimensions based on screen size
  const cardWidth = isMobile ? 'w-[280px]' : 'w-[300px]';
  const cardHeight = isMobile ? 'h-[400px]' : 'h-[420px]';

  return (
    <CardContainer
      containerClassName={`w-full h-full ${isActive ? 'z-20' : 'z-10'}`}
      className={`${cardWidth} ${cardHeight} ${isActive ? 'scale-105' : 'scale-95'} transition-all duration-300`}
    >
      <CardBody className={`w-full h-full rounded-xl ${isActive ? 'opacity-100' : 'opacity-60'} transition-all duration-300`}>
        <HoverBorderGradient
          containerClassName="w-full h-full [transform-style:preserve-3d]"
          className="w-full h-full bg-black/90 p-0 flex flex-col [transform-style:preserve-3d]"
          duration={2}
        >
          <CardItem
            translateZ={20}
            className="w-full h-[160px] sm:h-[180px] overflow-hidden rounded-t-xl"
          >
            <Image 
              src={project.previewImage} 
              alt={project.title}
              width={300}
              height={180}
              className="object-cover w-full h-full"
            />
          </CardItem>
          
          <CardItem
            translateZ={40}
            className={`${getTitleFontSize()} font-bold text-white px-5 sm:px-7 mt-4`}
          >
            {project.title}
          </CardItem>

          <CardItem
            translateZ={30}
            className="text-xs text-white/80 px-5 sm:px-7 mt-3 mb-2 overflow-y-auto max-h-[80px] sm:max-h-[100px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {project.description}
          </CardItem>
          <div className="h-2 sm:h-2"></div>
          <CardItem
            translateZ={50}
            className="flex flex-wrap gap-1.5 px-5 sm:px-7 mt-2 mb-4"
          >
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/20"
              >
                {tech}
              </span>
            ))}
          </CardItem>
          <div className="h-2 sm:h-2"></div>
          <CardItem
  translateZ={60}
  className="px-5 sm:px-7 flex justify-center w-full"
>
  <a 
    href={project.link} 
    target="_blank" 
    rel="noopener noreferrer"
    className="px-8 py-2.5 rounded-lg bg-white/10 text-white text-sm text-center hover:bg-white/20 transition-colors duration-200 border border-white/20 mx-auto hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:border-white/40"
  >
    View Project
  </a>
</CardItem>



        </HoverBorderGradient>
      </CardBody>
    </CardContainer>
  );
};

export const ProjectCardsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const goToPrev = () => {
    setActiveIndex((prev) => 
      prev === 0 ? projectsData.length - 1 : prev - 1
    );
  };
  
  const goToNext = () => {
    setActiveIndex((prev) => 
      prev === projectsData.length - 1 ? 0 : prev + 1
    );
  };
  
  // Calculate the cards to show (active, previous, next)
  const getVisibleCards = () => {
    const cards = [];
    
    // On mobile, only show active card
    if (isMobile) {
      cards.push({
        project: projectsData[activeIndex],
        index: activeIndex,
        position: 'active'
      });
      return cards;
    }
    
    // On desktop, show prev, active, next
    // Previous card
    const prevIndex = activeIndex === 0 ? projectsData.length - 1 : activeIndex - 1;
    cards.push({
      project: projectsData[prevIndex],
      index: prevIndex,
      position: 'previous'
    });
    
    // Active card
    cards.push({
      project: projectsData[activeIndex],
      index: activeIndex,
      position: 'active'
    });
    
    // Next card
    const nextIndex = activeIndex === projectsData.length - 1 ? 0 : activeIndex + 1;
    cards.push({
      project: projectsData[nextIndex],
      index: nextIndex,
      position: 'next'
    });
    
    return cards;
  };
  
  // Calculate translation values for cards based on screen size
  const getCardPosition = (position: string) => {
    if (isMobile) return 'translate-x-0 opacity-100 z-30';
    
    switch(position) {
      case 'previous':
        return '-translate-x-[330px] opacity-70 scale-90';
      case 'next':
        return 'translate-x-[330px] opacity-70 scale-90';
      default:
        return 'translate-x-0 opacity-100 z-30';
    }
  };
  
  return (
    <div className="w-full py-8 md:py-12 relative">
      <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-6 md:mb-12">
        My Projects
      </h2>
      
      <div className="relative w-full max-w-[1200px] mx-auto h-[450px] sm:h-[500px]">
        {/* Carousel Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getVisibleCards().map((card) => (
            <div
              key={card.index}
              className={`absolute transition-all duration-700 ease-out ${getCardPosition(card.position)}`}
            >
              <ProjectCard 
                project={card.project} 
                isActive={card.position === 'active'}
                isMobile={isMobile}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Controls */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white z-40 ml-2 sm:ml-4"
          onClick={goToPrev}
        >
          <IconArrowNarrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white z-40 mr-2 sm:mr-4"
          onClick={goToNext}
        >
          <IconArrowNarrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {projectsData.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}; 