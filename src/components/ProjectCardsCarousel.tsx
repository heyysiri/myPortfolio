'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from './3d-card';
import { IconArrowNarrowRight, IconArrowNarrowLeft } from "@tabler/icons-react";
import { projectsData } from '../data/projects';
import { HoverBorderGradient } from './HoverBorderGradient';

interface ProjectCardProps {
  project: typeof projectsData[0];
  isActive: boolean;
}

const ProjectCard = ({ project, isActive }: ProjectCardProps) => {
  return (
    <CardContainer
      containerClassName={`w-full h-full ${isActive ? 'z-20' : 'z-10'}`}
      className={`w-[300px] h-[450px] ${isActive ? 'scale-105' : 'scale-95'} transition-all duration-300`}
    >
      <CardBody className={`w-full h-full rounded-xl ${isActive ? 'opacity-100' : 'opacity-60'} transition-all duration-300`}>
        <HoverBorderGradient
          containerClassName="w-full h-full [transform-style:preserve-3d]"
          className="w-full h-full bg-black/90 p-0 flex flex-col [transform-style:preserve-3d]"
          duration={2}
        >
          <CardItem
            translateZ={20}
            className="w-full h-[200px] overflow-hidden rounded-t-xl"
          >
            <Image 
              src={project.previewImage} 
              alt={project.title}
              width={300}
              height={200}
              className="object-cover w-full h-full"
            />
          </CardItem>
          
          <CardItem
            translateZ={40}
            className="text-2xl font-bold text-white px-7 mt-7"
          >
            {project.title}
          </CardItem>
          
          <CardItem
            translateZ={30}
            className="text-sm text-white/80 px-7 mt-3"
          >
            {project.description.length > 80 
              ? project.description.substring(0, 80) + '...' 
              : project.description}
          </CardItem>
          
          <CardItem
            translateZ={50}
            className="flex flex-wrap gap-2 px-7 mt-5"
          >
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20"
              >
                {tech}
              </span>
            ))}
          </CardItem>
          
          <CardItem
            translateZ={60}
            className="mt-auto mb-7 px-7"
          >
            <button className="px-5 py-2.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors duration-200 border border-white/20 w-full hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:border-white/40">
              View Project
            </button>
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
  
  return (
    <div className="w-full py-8 md:py-12 relative">
      <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-6 md:mb-12">
        Projects on Mars
      </h2>
      
      <div className="relative w-full max-w-[1200px] mx-auto h-[500px]">
        {/* Carousel Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getVisibleCards().map((card) => (
            <div
              key={card.index}
              className={`absolute transition-all duration-700 ease-out ${
                card.position === 'previous' 
                  ? '-translate-x-[330px] opacity-70 scale-90'
                  : card.position === 'next'
                  ? 'translate-x-[330px] opacity-70 scale-90'
                  : 'translate-x-0 opacity-100 z-30'
              }`}
            >
              <ProjectCard 
                project={card.project} 
                isActive={card.position === 'active'}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Controls */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white z-40 ml-4"
          onClick={goToPrev}
        >
          <IconArrowNarrowLeft className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white z-40 mr-4"
          onClick={goToNext}
        >
          <IconArrowNarrowRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {projectsData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}; 