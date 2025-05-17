'use client';

import React from 'react';
import { MovingBorderCard } from './ui/moving-border';

export default function JupiterAchievements() {
  const achievements = [
    {
      title: "Stellar Coding Competition Winner",
      description: "First place in the Galactic Code Challenge, recognized for innovative algorithm design",
      year: "2023"
    },
    {
      title: "Open Source Contributor",
      description: "Top 1% contributor to Space Navigation frameworks with over 200 accepted PRs",
      year: "2022"
    },
    {
      title: "Hackathon Champion",
      description: "Led team to victory in NASA Space Apps Challenge with an orbital debris tracking solution",
      year: "2021"
    }
  ];

  const certifications = [
    {
      title: "AWS Cloud Architect",
      issuer: "Amazon Web Services",
      date: "2023"
    },
    {
      title: "Advanced React & Next.js",
      issuer: "Frontend Masters",
      date: "2022"
    },
    {
      title: "Three.js & WebGL Mastery",
      issuer: "Creative Coding Institute",
      date: "2021"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-8 sm:px-10 md:px-12 lg:px-16 py-12">
      {/* <h1 className="text-center text-4xl mb-12 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
        ACHIEVEMENTS & CERTIFICATIONS
      </h1> */}
      
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Achievements Card */}
        <MovingBorderCard 
          borderRadius="1rem" 
          className="bg-black text-white flex-1"
          borderColor="linear-gradient(to right, #ffd700, #ff4500, #ff8c00)"
          autoAnimate={true}
          duration={1500}
        >
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-white mb-8" style={{ fontFamily: 'var(--font-orbitron)' }}>
              ACHIEVEMENTS
            </h2>
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center px-4">
                  <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {achievement.title}
                  </h3>
                  <p className="text-gray-400 mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {achievement.description}
                  </p>
                  <p className="text-yellow-500 text-sm" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {achievement.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MovingBorderCard>

        {/* Certifications Card */}
        <MovingBorderCard 
          borderRadius="1rem" 
          className="bg-black text-white flex-1"
          borderColor="linear-gradient(to right, #00bfff, #4b0082, #9400d3)"
          autoAnimate={true}
          duration={1500}
        >
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-white mb-8" style={{ fontFamily: 'var(--font-orbitron)' }}>
              CERTIFICATIONS
            </h2>
            <div className="space-y-8">
              {certifications.map((certification, index) => (
                <div key={index} className="text-center px-4">
                  <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {certification.title}
                  </h3>
                  <p className="text-gray-400 mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    Issued by {certification.issuer}
                  </p>
                  <p className="text-cyan-500 text-sm" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {certification.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MovingBorderCard>
      </div>
    </div>
  );
} 