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
  isBubble?: boolean; // Изменено с isTumbleweed на isBubble
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

  // Устанавливаем isLoaded в true при монтировании компонента
  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

    // Создаем пузырьки вместо частиц пыли
    let particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 20,
      radius: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 1.5 + 0.5), // Движение вверх
      alpha: Math.random() * 0.5 + 0.3,
      color: getBubbleColor(),
    }));

    function getBubbleColor() {
      const colors = ["#03A9F4", "#00BCD4", "#4FC3F7", "#81D4FA", "#B3E5FC"];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Счетчик пузырьков для ограничения их количества
    let bubbleCount = 0;
    const MAX_BUBBLES = 5;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем пузырьки воздуха в воде
      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        
        // Добавляем блик на пузырьке
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.radius * 0.3, 
          particle.y - particle.radius * 0.3, 
          particle.radius * 0.3, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();
        
        // Обновляем позицию пузырька с легким покачиванием
        particle.x += particle.dx + Math.sin(Date.now() * 0.002 + index) * 0.3;
        particle.y += particle.dy;
        
        // Улучшенная обработка границ
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
        
        // Удаляем большие пузыри, которые вышли за экран
        if (particle.isBubble && particle.y < -30) {
          particles.splice(index, 1);
          bubbleCount--;
        }
      });

      // Иногда создаем большие пузыри
      if (Math.random() < 0.01 && bubbleCount < MAX_BUBBLES) {
        createBubble();
        bubbleCount++;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    function createBubble() {
      const size = Math.random() * 30 + 20;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + size,
        radius: size,
        dx: (Math.random() - 0.5) * 0.5,
        dy: -(Math.random() * 1 + 0.5),
        alpha: 0.3,
        color: "rgba(255, 255, 255, 0.4)",
        isBubble: true
      });
    }

    animationFrameRef.current = requestAnimationFrame(animate);

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

  // Летние имена для мастей
  const suitLabels = {
    hearts: "Морские",
    diamonds: "Солнечные",
    clubs: "Пляжные",
    spades: "Тропические",
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Минималистичный фон */}
      <div className="fixed inset-0 -z-30 minimal-sunset-background"></div>
      
      {/* Фон с пузырьками */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-20 opacity-40" />
      
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white drop-shadow-md bg-gradient-to-r from-summer-coral via-summer-gold to-summer-sea bg-clip-text text-transparent">
            Наши Проекты
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-md">
            Великолепная коллекция наших пляжных достижений
          </p>
          
          <Tabs 
            defaultValue="все" 
            className="mt-8"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-white/20 backdrop-blur-sm border border-white/30 mx-auto shadow-lg rounded-full">
              <TabsTrigger 
                value="все" 
                className="data-[state=active]:bg-summer-sea data-[state=active]:text-white text-white/80 rounded-full transition-all"
              >
                Все проекты
              </TabsTrigger>
              <TabsTrigger 
                value="избранное" 
                className="data-[state=active]:bg-summer-gold data-[state=active]:text-white text-white/80 rounded-full transition-all"
              >
                Избранное
              </TabsTrigger>
              <TabsTrigger 
                value="hearts" 
                className="data-[state=active]:bg-summer-coral data-[state=active]:text-white text-summer-coral"
                title={suitLabels.hearts}
              >
                {suitSymbols.hearts}
              </TabsTrigger>
              <TabsTrigger 
                value="diamonds" 
                className="data-[state=active]:bg-summer-gold data-[state=active]:text-white text-summer-gold"
                title={suitLabels.diamonds}
              >
                {suitSymbols.diamonds}
              </TabsTrigger>
              <TabsTrigger 
                value="clubs" 
                className="data-[state=active]:bg-summer-green data-[state=active]:text-white text-summer-green"
                title={suitLabels.clubs}
              >
                {suitSymbols.clubs}
              </TabsTrigger>
              <TabsTrigger 
                value="spades" 
                className="data-[state=active]:bg-summer-blue data-[state=active]:text-white text-summer-blue"
                title={suitLabels.spades}
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
                theme="summer" // Добавляем пропс для летней темы
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project dialog with improved animations */}
      <ProjectDialog 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)}
        theme="summer" // Добавляем пропс для летней темы
      />

      {/* Добавляем стили для пляжной темы */}
      <style>{`
        /* Летние цвета для мастей */
        .text-summer-coral {
          color: #FF5252;
        }
        
        .text-summer-gold {
          color: #FFB300;
        }
        
        .text-summer-green {
          color: #4CAF50;
        }
        
        .text-summer-blue {
          color: #03A9F4;
        }
        
        .bg-summer-coral {
          background-color: #FF5252;
        }
        
        .bg-summer-gold {
          background-color: #FFB300;
        }
        
        .bg-summer-green {
          background-color: #4CAF50;
        }
        
        .bg-summer-blue {
          background-color: #03A9F4;
        }

        /* Минималистичный фон заката */
        .minimal-sunset-background {
          background: linear-gradient(to bottom, 
            #E2B878 0%, /* Песочный цвет вверху */
            #FFD9A0 15%, 
            #FFBA56 30%,
            #F3904F 50%, 
            #3B4371 70%,
            #292F58 100%); /* Морской цвет внизу */
        }
      `}</style>
    </div>
  );
};

export default Projects;
