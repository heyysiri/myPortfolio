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
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing my projects, skills, and experience with interactive 3D elements and space theme.",
    technologies: ["Next.js", "TypeScript", "Three.js", "TailwindCSS"],
    link: "https://siri-karra.vercel.app/",
    previewImage: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000",
    bgColor: "from-indigo-500 to-purple-600"
  },
  {
    title: "AR Interior Design App",
    description: "An augmented reality application that allows users to visualize furniture and décor in their space before purchasing.",
    technologies: ["React Native", "ARKit", "ARCore", "JavaScript"],
    link: "https://siri-karra.vercel.app/",
    previewImage: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=1000",
    bgColor: "from-blue-500 to-cyan-500"
  },
  {
    title: "Smart Home Dashboard",
    description: "A centralized dashboard to control smart home devices with beautiful UI and real-time monitoring capabilities.",
    technologies: ["React", "Redux", "Node.js", "WebSockets"],
    link: "https://siri-karra.vercel.app/",
    previewImage: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000",
    bgColor: "from-green-500 to-teal-500"
  },
  {
    title: "AI Content Generator",
    description: "An AI-powered tool that generates customized content for various platforms based on user preferences and trends.",
    technologies: ["Python", "TensorFlow", "FastAPI", "React"],
    link: "https://siri-karra.vercel.app/",
    previewImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000",
    bgColor: "from-rose-500 to-orange-500"
  }
]; 