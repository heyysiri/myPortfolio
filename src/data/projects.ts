interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  previewImage: string;
  bgColor: string;
}

export const projectsData: ProjectData[] = [
  {
    title: "Forget-Me-Not - Smart Reminder plugin",
    description: "Developed a plugin within the Screenpipe ecosystem that tracks app usage and helps users stay on top of unfinished tasks with timely, intelligent reminders",
    technologies: ["Next.js", "Typescript", "TailwindCSS", "shadcn/ui"],
    link: "https://github.com/heyysiri/Forget-Me-Not",
    previewImage: "/project_images/FMN.jpg",
    bgColor: "from-indigo-500 to-purple-600"
  },
  {
    title: "GenAI Remote Sensing",
    description: "Created an AI-driven solution for environmental and agricultural challenges, using cutting-edge deep learning models to enhance crop classification, flood detection, and SAR image colorization. A game-changing approach for remote sensing!",
    technologies: ["Flutter", "Flask", "Deep Learning Models", "Docker"],
    link: "https://github.com/heyysiri/genai-remote-sensing",
    previewImage: "/project_images/SAR.png",
    bgColor: "from-indigo-500 to-purple-600"
  },
  {
    title: "SKANA - Skill Gap Analyzer and Upskill Recommendation Tool",
    description: "Developed a tool to connect job seekers' skills with market demands, offering personalized upskilling paths and seamless job placement support with a responsive frontend and scalable backend.",
    technologies: ["React.js", "TailwindCSS", "Flask", "MongoDB"],
    link: "https://github.com/heyysiri/SKANA",
    previewImage: "/project_images/SKANA.png",
    bgColor: "from-blue-500 to-cyan-500"
  },
  {
    title: "AI/ML powered chatbot for Namami Gange Programme",
    description: "Led the development of an AI-powered chatbot designed to inform and educate the public about the Namami Gange Programme, leveraging Rasa for NLP and enhancing response accuracy for a smoother user experience",
    technologies: ["React", "Rasa", "SQLite", "CSS"],
    link: "https://github.com/heyysiri/NamamiGange",
    previewImage: "/project_images/NG.png",
    bgColor: "from-green-500 to-teal-500"
  },
  {
    title: "Retro Harry Potter fansite",
    description: "Being the Potterhead that I am, I created a retro-inspired Harry Potter fan site featuring a mini-game, spell cards, and character cards, all wrapped in a nostalgic, magical vibe. A perfect treat for fellow wizards and witches!",
    technologies: ["React", "TailwindCSS"],
    link: "https://github.com/heyysiri/Arcade-Of-Azkaban",
    previewImage: "/project_images/HP.png",
    bgColor: "from-rose-500 to-orange-500"
  }
]; 