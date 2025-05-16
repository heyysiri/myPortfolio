"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  borderColor?: string;
  autoAnimate?: boolean;
}

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  borderColor = "linear-gradient(to right, #FFC0CB, #8A2BE2)",
  autoAnimate = true,
}: MovingBorderProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isHovering = useRef(false);

  // Auto animation function
  useEffect(() => {
    if (!autoAnimate) return;

    const startTime = Date.now();
    
    const animate = () => {
      if (isHovering.current) return;
      
      const elapsed = Date.now() - startTime;
      const angle = (elapsed * 0.0005) % (Math.PI * 2); // Complete rotation every ~12.5 seconds
      
      // Calculate position based on sine and cosine to create circular motion
      const x = (Math.sin(angle) + 1) / 2;
      const y = (Math.cos(angle) + 1) / 2;
      
      setPosition({ x, y });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoAnimate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    isHovering.current = true;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center",
        containerClassName
      )}
    >
      <div
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: borderRadius,
          background: borderColor,
          padding: "2px",
          WebkitMask: `radial-gradient(
            40% 40% at ${position.x * 100}% ${position.y * 100}%,
            black 30%,
            transparent 80%
          )`,
          mask: `radial-gradient(
            40% 40% at ${position.x * 100}% ${position.y * 100}%,
            black 30%,
            transparent 80%
          )`,
          opacity: 0.8,
          transition: `mask ${duration}ms ease, WebkitMask ${duration}ms ease`,
        }}
        className="z-[-1] pointer-events-none"
      />
      <div
        className={cn(
          "flex items-center justify-center bg-black rounded-[calc(1.75rem-2px)]",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - 2px)`,
          width: "100%",
          height: "100%"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Button = ({
  children,
  className,
  containerClassName,
  borderRadius,
  duration,
  borderColor,
  autoAnimate = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  duration?: number;
  borderColor?: string;
  autoAnimate?: boolean;
  [key: string]: any;
}) => {
  return (
    <MovingBorder
      borderRadius={borderRadius}
      duration={duration}
      borderColor={borderColor}
      autoAnimate={autoAnimate}
      containerClassName={cn("w-fit p-0.5", containerClassName)}
      className={cn("px-6 py-2", className)}
    >
      <button {...props}>{children}</button>
    </MovingBorder>
  );
};

export function MovingBorderCard({
  children,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  duration,
  borderColor = "linear-gradient(to right, #FFC0CB, #8A2BE2)",
  autoAnimate = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  duration?: number;
  borderColor?: string;
  autoAnimate?: boolean;
  [key: string]: any;
}) {
  return (
    <MovingBorder
      borderRadius={borderRadius}
      duration={duration}
      borderColor={borderColor}
      autoAnimate={autoAnimate}
      containerClassName={cn("w-full", containerClassName)}
      className={cn("p-8 w-full h-full", className)}
    >
      <div {...props}>{children}</div>
    </MovingBorder>
  );
} 