import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/draggable-card";

export const SkillsCards = () => {
  const skills = [
    {
      title: "React",
      className: "absolute left-[20%] top-[30%] rotate-[-8deg]",
    },
    {
      title: "Next.js",
      className: "absolute left-[40%] top-[20%] rotate-[5deg]",
    },
    {
      title: "TypeScript",
      className: "absolute left-[60%] top-[35%] rotate-[-5deg]",
    },
    {
      title: "Three.js",
      className: "absolute left-[25%] top-[50%] rotate-[10deg]",
    },
    {
      title: "TailwindCSS",
      className: "absolute left-[65%] top-[65%] rotate-[-12deg]",
    },
    {
      title: "Node.js",
      className: "absolute left-[45%] top-[55%] rotate-[8deg]",
    },
    {
      title: "GraphQL",
      className: "absolute left-[15%] top-[70%] rotate-[15deg]",
    },
    {
      title: "JavaScript",
      className: "absolute left-[75%] top-[40%] rotate-[-15deg]",
    },
    {
      title: "MongoDB",
      className: "absolute left-[30%] top-[80%] rotate-[4deg]",
    },
    {
      title: "AWS",
      className: "absolute left-[80%] top-[25%] rotate-[-10deg]",
    },
  ];

  return (
    <DraggableCardContainer className="relative min-h-screen w-full">
      <p className="absolute top-[5%] left-0 right-0 mx-auto text-center text-3xl font-black text-white z-10">
        Explore My Technical Skills
      </p>
      <div className="absolute inset-0">
        {skills.map((skill, index) => (
          <DraggableCardBody 
            key={index} 
            className={`${skill.className} px-10 py-6 cursor-grab active:cursor-grabbing bg-black/70 backdrop-blur-sm border border-white/20 hover:border-white/80 transition-all duration-200 rounded-lg z-20 flex items-center justify-center min-w-36 min-h-16`}
          >
            <h3 className="text-center text-lg font-bold text-white whitespace-nowrap m-4">
              {skill.title}
            </h3>
          </DraggableCardBody>
        ))}
      </div>
    </DraggableCardContainer>
  );
} 