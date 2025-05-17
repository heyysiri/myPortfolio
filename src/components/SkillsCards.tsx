import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export const SkillsCards = () => {
  const skills = [
    {
      title: "React.js",
      className: "absolute left-[10%] top-[15%] rotate-[-8deg]",
    },
    {
      title: "Next.js",
      className: "absolute left-[35%] top-[12%] rotate-[5deg]",
    },
    {
      title: "TypeScript",
      className: "absolute left-[60%] top-[18%] rotate-[-5deg]",
    },
    {
      title: "Python",
      className: "absolute left-[85%] top-[15%] rotate-[10deg]",
    },
    {
      title: "TailwindCSS",
      className: "absolute left-[15%] top-[35%] rotate-[-12deg]",
    },
    {
      title: "Flutter",
      className: "absolute left-[40%] top-[35%] rotate-[8deg]",
    },
    {
      title: "MySQL",
      className: "absolute left-[65%] top-[38%] rotate-[15deg]",
    },
    {
      title: "JavaScript",
      className: "absolute left-[88%] top-[35%] rotate-[-15deg]",
    },
    {
      title: "MongoDB",
      className: "absolute left-[12%] top-[55%] rotate-[4deg]",
    },
    {
      title: "SQLite",
      className: "absolute left-[37%] top-[58%] rotate-[-10deg]",
    },
    {
      title: "Node.js",
      className: "absolute left-[62%] top-[58%] rotate-[12deg]",
    },
    {
      title: "Java",
      className: "absolute left-[85%] top-[55%] rotate-[18deg]",
    },
    {
      title: "Express.js",
      className: "absolute left-[18%] top-[75%] rotate-[15deg]",
    },
    {
      title: "Flask",
      className: "absolute left-[45%] top-[78%] rotate-[7deg]",
    },
    {
      title: "Linux",
      className: "absolute left-[70%] top-[75%] rotate-[10deg]",
    },
    {
      title: "Windows",
      className: "absolute left-[10%] top-[90%] rotate-[-5deg]",
    },
    {
      title: "Git/Github",
      className: "absolute left-[35%] top-[90%] rotate-[-8deg]",
    },
    {
      title: "Docker",
      className: "absolute left-[60%] top-[90%] rotate-[10deg]",
    },
    {
      title: "AWS",
      className: "absolute left-[85%] top-[90%] rotate-[-12deg]",
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