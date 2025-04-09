import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDialog } from "@/components/ProjectDialog";
import type { Project } from "@/lib/types";

// Define a proper type for particles to fix the TypeScript errors
interface Particle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  alpha: number;
  color: string;
  isTumbleweed?: boolean; // Make this property optional
}

const defaultProjects: Project[] = [
  {
    name: "ЗАТО 95",
    logo: "/projects avatars/zato95.jpg",
    link: "https://zato95.vercel.app/",
    description: "Касеты... много кассет... Хроники происшествий в ЗАТО 95.",
    images: [
      "/projects avatars/zato95.jpg",
      "/projects/95Fimoz.png",
    ],
    suit: "hearts",
    featured: true,
  },
  {
    name: "Наш Сервер",
    logo: "/projects avatars/3dc5e70a3781cd543b03aa4613d75269.png",
    link: "https://discord.gg/wAmP6pK5Zq",
    description: "Наш сервер, сервер который не пережил падения телефона на клавиатуру. Игровое сообщество с хаотичной историей.",
    images: [
      "/projects avatars/3dc5e70a3781cd543b03aa4613d75269.png",
    ],
    suit: "diamonds",
  },
  {
    name: "Erlandas.S",
    logo: "/projects avatars/Erlandozo BOzo.png",
    link: "https://sun9-37.userapi.com/impf/c837233/v837233270/2d424/iZXoi6pHVeo.jpg?size=807x454&quality=96&sign=1be2a3dcd4be008a8ddb3b4331b7cc0b&c_uniq_tag=cIpV38an0owEorso7qRKrMefiq-R4e5R8HmcLuSP-zY&type=album",
    description: "Экспериментальный конь, вышел из под контроля и стал русским националистом.",
    images: [
      "/projects/x_4c5ed5e8.jpg",
      "/projects/Erlandas.jpg",
    ],
    suit: "clubs",
  },
  {
    name: "Поп Жозя",
    logo: "/projects avatars/pop shoza.webp",
    link: "https://discord.gg/RJJxspj875",
    description: "Таинственная инициатива, скрытая за завесой загадок и минимализма.",
    images: [
      "/projects/sada.JPG",
      "/projects/SPOILER___online-video-cutter_com__AdobeExpress.gif",
    ],
    suit: "spades",
    featured: true,
  },
  {
    name: "ОПК",
    logo: "/projects avatars/OPK.png",
    link: "https://steamuserimages-a.akamaihd.net/ugc/2411202059291704385/99899F47A890224EB5782227AEA58AC814B27AE7/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    description: "Сервис для любителей оргий и сожения ковров.",
    images: [
      "/projects/maxresdefault (1).jpg",
      "/projects/2023-10-06_222958.png",
    ],
    suit: "hearts",
  },
  {
    name: "BULIMPENIS",
    logo: "/projects avatars/gtabulib.png",
    link: "/bl",
    description: "Великий и неповторимый певец.",
    images: [
      "/projects/bulimpenis/BulimPenis.mp4",
      "/projects/bulimpenis/0T6-XaLp8x-xtrfxssMixZYysWHQwmeNS9wывфвQyRhKYapxa8DLo-ybT59DJzoi4PLas1xiPDR2RshNSH4PMlyQ-XnC копия.jpg",
      "/projects/bulimpenis/70 квывопия.png",
      "/projects/bulimpenis/BULIMPENIS FINAL.mp4",
      "/projects/bulimpenis/byl posdter.png",
      "/projects/bulimpenis/slowed.png",
    ],
    suit: "diamonds",
    featured: true,
  },
];

const Projects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [projects] = useState(defaultProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("все");
  const [isLoaded, setIsLoaded] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Improved canvas animation with performance optimization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Optimized particle creation with less particles for better performance
    let particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      color: getParticleColor(),
    }));

    function getParticleColor() {
      const colors = ["#d3bc8d", "#a88e65", "#8c7851", "#594a32"];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Tumbleweed counter to limit the number of tumbleweeds
    let tumbleweedCount = 0;
    const MAX_TUMBLEWEEDS = 3;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw dust particles with optimized rendering
      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        
        // Update position with clamping to prevent excessive calculations
        particle.x += particle.dx;
        particle.y += particle.dy;
        
        // Improved boundary handling
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        
        // Remove tumbleweeds that have gone offscreen
        if (particle.isTumbleweed && particle.x > canvas.width + 50) {
          particles.splice(index, 1);
          tumbleweedCount--;
        }
      });

      // Occasionally create tumbleweeds, with a limit
      if (Math.random() < 0.002 && tumbleweedCount < MAX_TUMBLEWEEDS) {
        createTumbleweed();
        tumbleweedCount++;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    function createTumbleweed() {
      const size = Math.random() * 30 + 20;
      particles.push({
        x: -size,
        y: canvas.height - size/2 - (Math.random() * 50),
        radius: size,
        dx: Math.random() * 1 + 0.5,
        dy: 0,
        alpha: 0.3,
        color: "#a88e65",
        isTumbleweed: true
      });
    }

    animationFrameRef.current = requestAnimationFrame(animate);
    setIsLoaded(true);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Filter projects based on active tab
  const filteredProjects = activeTab === "все" 
    ? projects 
    : activeTab === "избранное" 
      ? projects.filter(p => p.featured) 
      : projects.filter(p => p.suit === activeTab);

  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-western-paper">
      {/* Background canvas with improved performance */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-30" />
      
      {/* Improved background texture with blending */}
      <div className="fixed inset-0 -z-20 bg-noise-pattern opacity-20 mix-blend-overlay" />
      
      {/* Decorative line with nails at top */}
      <div className="fixed top-8 left-10 right-10 h-px bg-western-brown/30 flex justify-between items-center">
        <div className="w-3 h-3 rounded-full bg-western-brown/70 -translate-y-[50%]"></div>
        <div className="w-3 h-3 rounded-full bg-western-brown/70 -translate-y-[50%]"></div>
      </div>
      
      {/* Decorative line with nails at bottom */}
      <div className="fixed bottom-8 left-10 right-10 h-px bg-western-brown/30 flex justify-between items-center">
        <div className="w-3 h-3 rounded-full bg-western-brown/70 -translate-y-[50%]"></div>
        <div className="w-3 h-3 rounded-full bg-western-brown/70 -translate-y-[50%]"></div>
      </div>
      
      <div className="container py-16 px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
        <motion.div
          className="text-center space-y-5 mb-14"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          <h1 className="text-4xl md:text-5xl font-western tracking-wide text-western-brown drop-shadow-md">
            Наши Козыри
          </h1>
          <p className="text-lg text-western-brown/80 font-western font-light max-w-xl mx-auto">
            Наши козырные карты!
          </p>
          
          <Tabs 
            defaultValue="все" 
            className="mt-8"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-western-paper border-2 border-western-border mx-auto shadow-md">
              <TabsTrigger 
                value="все" 
                className="data-[state=active]:bg-western-primary data-[state=active]:text-western-paper font-western"
              >
                Все проекты
              </TabsTrigger>
              <TabsTrigger 
                value="избранное" 
                className="data-[state=active]:bg-western-gold data-[state=active]:text-western-paper font-western"
              >
                Избранное
              </TabsTrigger>
              <TabsTrigger 
                value="hearts" 
                className="data-[state=active]:bg-western-hearts data-[state=active]:text-western-paper text-western-hearts"
              >
                {suitSymbols.hearts}
              </TabsTrigger>
              <TabsTrigger 
                value="diamonds" 
                className="data-[state=active]:bg-western-diamonds data-[state=active]:text-western-paper text-western-diamonds"
              >
                {suitSymbols.diamonds}
              </TabsTrigger>
              <TabsTrigger 
                value="clubs" 
                className="data-[state=active]:bg-western-clubs data-[state=active]:text-western-paper text-western-clubs"
              >
                {suitSymbols.clubs}
              </TabsTrigger>
              <TabsTrigger 
                value="spades" 
                className="data-[state=active]:bg-western-spades data-[state=active]:text-western-paper text-western-spades"
              >
                {suitSymbols.spades}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="closed"
          animate="open"
          variants={{
            open: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            },
            closed: {}
          }}
        >
          <AnimatePresence mode="sync">
            {isLoaded && filteredProjects.map((project, index) => (
              <ProjectCard 
                key={`${project.name}-${activeTab}`}
                project={project} 
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project dialog with improved animations */}
      <ProjectDialog 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default Projects;
