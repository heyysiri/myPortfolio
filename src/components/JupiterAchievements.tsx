'use client';

import React from 'react';
import { MovingBorderCard } from './ui/moving-border';

export default function JupiterAchievements() {
  const achievements = [
    {
      title: "Semi-finalist in EY Techathon 5.0",
      description: "Got into the top 47 out of 10,000+ teams in EY Techathon 5.0",
      year: "Feb 2025"
    },
    {
      title: "National Hackathon Winner",
      description: "Got 1st prize (AI/ML domain) in “Hack Attack” national hackathon organized by Anurag University",
      year: "Dec 2024"
    },
    {
      title: "Won a track in “Hack Your Portfolio” international hackathon",
      description: "Got 1st prize of 'Best Beginner's' track in “Hack Your Portfolio” international hackathon hosted by MLH",
      year: "July 2024"
    }
  ];

  const certifications = [
    {
      title: "Google Cloud Computing Foundations and Generative AI certification",
      issuer: "Google Cloud",
      date: "2024"
    },
    {
      title: "JP. Morgan - Software Engineering Job Simulation",
      issuer: "Forage",
      date: "2024"
    },
    {
      title: "Certificate of Proficiency - Spanish",
      issuer: "English and Foreign Languages University (EFLU)",
      date: "2023"
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
            <h2 className="text-2xl font-bold text-center text-orange-500 mb-8" style={{ fontFamily: 'var(--font-orbitron)' }}>
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
            <h2 className="text-2xl font-bold text-center text-violet-500 mb-8" style={{ fontFamily: 'var(--font-orbitron)' }}>
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