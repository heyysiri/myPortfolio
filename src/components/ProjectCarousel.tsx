"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";
import { LinkPreview } from "./LinkPreview";
import { HoverBorderGradient } from "./ui/HoverBorderGradient";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  previewImage: string;
  bgColor: string;
}

interface ProjectSlideProps {
  project: ProjectData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const ProjectSlide = ({ project, index, current, handleSlideClick }: ProjectSlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      // Apply tilt effect to the card container
      if (cardRef.current) {
        const maxTilt = 10;
        const tiltX = (y / slideRef.current.clientHeight) * maxTilt;
        const tiltY = (x / slideRef.current.clientWidth) * -maxTilt;
        
        cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
    
    // Reset tilt on mouse leave
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  const { title, description, technologies, link, previewImage } = project;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[60vmin] h-[45vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.92) rotateX(12deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div 
          ref={cardRef} 
          className="w-full h-full [transform-style:preserve-3d] transition-transform duration-200"
        >
          <HoverBorderGradient
            containerClassName="w-full h-full [transform-style:preserve-3d]"
            className="w-full h-full bg-black p-6 flex flex-col justify-between [transform-style:preserve-3d]"
            duration={1.5}
          >
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none [transform-style:preserve-3d]">
              {/* Subtle sparkle effects */}
              <div className="absolute w-1 h-1 rounded-full bg-white/80 top-[20%] left-[10%] animate-pulse" style={{ animationDuration: '3s', transform: 'translateZ(5px)' }}></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-white/60 top-[70%] left-[80%] animate-pulse" style={{ animationDuration: '5s', transform: 'translateZ(5px)' }}></div>
              <div className="absolute w-0.5 h-0.5 rounded-full bg-white/70 top-[40%] left-[90%] animate-pulse" style={{ animationDuration: '4s', transform: 'translateZ(5px)' }}></div>
              <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[80%] left-[30%] animate-pulse" style={{ animationDuration: '6s', transform: 'translateZ(5px)' }}></div>
            </div>

            <article
              className={cn(
                "relative transition-all duration-700 ease-in-out h-full flex flex-col justify-between [transform-style:preserve-3d]",
                current === index
                  ? "opacity-100 visible scale-100"
                  : "opacity-0 invisible scale-95"
              )}
            >
              <div style={{ transform: 'translateZ(15px)' }}>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 relative bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  {title}
                </h2>
                <p className="text-sm md:text-base text-white/75 mb-6 max-w-[90%] mx-auto">
                  {description}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center relative" style={{ transform: 'translateZ(25px)' }}>
                <LinkPreview
                  imageSrc={previewImage}
                  width={400}
                  height={250}
                  className="group"
                >
                  <button className="mt-2 px-5 py-2.5 font-medium bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                    View Project
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      <IconArrowNarrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </LinkPreview>
              </div>
            </article>
          </HoverBorderGradient>
        </div>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "w-12 h-12 flex items-center mx-5 justify-center bg-black/80 backdrop-blur-md border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 hover:border-white/30 shadow-lg transition-all duration-200",
        type === "previous" ? "rotate-180" : ""
      )}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-white w-5 h-5" />
    </motion.button>
  );
};

interface ProjectCarouselProps {
  projects: ProjectData[];
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? projects.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === projects.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-[60vmin] h-[45vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / projects.length)}%)`,
        }}
      >
        {projects.map((project, index) => (
          <ProjectSlide
            key={index}
            project={project}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+2.5rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
} 