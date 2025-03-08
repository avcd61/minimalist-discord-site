
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  // Card suit symbol and color mapping
  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const suitColors = {
    hearts: "text-western-hearts",
    diamonds: "text-western-diamonds",
    clubs: "text-western-clubs",
    spades: "text-western-spades",
  };

  const rankNames = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const rank = rankNames[index % rankNames.length];

  // Improved mouse movement tracking with debounce
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Smoothing the values to prevent jitter
      setMousePosition(prev => ({
        x: prev.x + (x - prev.x) * 0.3,
        y: prev.y + (y - prev.y) * 0.3
      }));
    };

    const card = cardRef.current;
    if (card) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered]);

  // Calculate the rotation based on mouse position with limits to prevent extreme angles
  const rotateX = isHovered ? Math.max(-5, Math.min(5, (mousePosition.y - 0.5) * 10)) : 0;
  const rotateY = isHovered ? Math.max(-5, Math.min(5, (mousePosition.x - 0.5) * -10)) : 0;

  return (
    <motion.div
      className="perspective group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <motion.div
        ref={cardRef}
        className={cn(
          "western-card western-card-stain preserve-3d cursor-pointer",
          "w-full rounded-md overflow-hidden select-none relative", // Added relative positioning
          "border-2 border-western-border",
          "transition-all duration-300 ease-out"
        )}
        style={{ height: "420px" }} // Fixed height to match screenshot
        animate={{
          rotateX,
          rotateY,
          boxShadow: isHovered 
            ? "0 22px 40px rgba(0, 0, 0, 0.2), 0 10px 16px rgba(0, 0, 0, 0.1)"
            : "0 8px 16px rgba(0, 0, 0, 0.1)"
        }}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card rank and suit in corners - Fixed positioning to be relative to card */}
        <div className={`absolute top-3 left-3 ${suitColors[project.suit]} font-western font-bold z-10 select-none`}>
          <div className="flex flex-col items-center">
            <span className="text-xl">{rank}</span>
            <span className="text-2xl leading-none">{suitSymbols[project.suit]}</span>
          </div>
        </div>
        
        <div className={`absolute bottom-3 right-3 ${suitColors[project.suit]} font-western font-bold z-10 rotate-180 select-none`}>
          <div className="flex flex-col items-center">
            <span className="text-xl">{rank}</span>
            <span className="text-2xl leading-none">{suitSymbols[project.suit]}</span>
          </div>
        </div>

        {/* Burn marks on edges - improved with subtle gradient */}
        <div className="absolute inset-0 pointer-events-none opacity-30 rounded-md">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-amber-800/40 to-transparent"></div>
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-amber-800/40 to-transparent"></div>
        </div>

        {/* Add card overlay for texture */}
        <div className="card-overlay"></div>

        {/* Card content */}
        <div className="flex flex-col h-full p-4 pt-16 pb-16 z-20 items-center justify-between relative">
          {/* Project logo/image */}
          <motion.div 
            className="w-32 h-32 mx-auto relative mb-4 z-10 rounded-md overflow-hidden shadow-md border-2 border-western-border bg-western-paper/50"
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 border-[3px] border-western-border/30 pointer-events-none z-20"></div>
            <img 
              src={project.logo} 
              alt={project.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Subtle shadow */}
            <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
          </motion.div>
          
          {/* Project name */}
          <div className="text-center px-3 z-10">
            <motion.h3 
              className={cn(
                "text-xl uppercase tracking-wider font-western font-medium text-balance mb-2",
                "text-western-brown text-shadow"
              )}
              animate={{ 
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 0.4 }}
            >
              {project.name}
            </motion.h3>
            
            {/* Project description (truncated) */}
            {project.description && (
              <p className="text-xs text-western-brown/80 mt-1 max-w-[90%] mx-auto overflow-hidden line-clamp-2 italic">
                "{project.description}"
              </p>
            )}
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute bottom-12 transform translate-y-1/2 z-30">
              <motion.div
                className="bg-western-paper border border-western-gold/50 rounded-full px-3 py-1 shadow-md"
                animate={{ y: isHovered ? -3 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-western-gold text-xs font-western flex items-center">
                  <span className="mr-1">★</span> Избранное
                </span>
              </motion.div>
            </div>
          )}

          {/* Large suit symbol background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
            <span className={`text-[200px] ${suitColors[project.suit]}`}>
              {suitSymbols[project.suit]}
            </span>
          </div>
        </div>

        {/* Card edge lines */}
        <div className="absolute top-10 left-10 right-10 h-px bg-western-brown/30 flex justify-between items-center">
          <div className="w-2 h-2 rounded-full bg-western-brown/50 -translate-y-[3px]"></div>
          <div className="w-2 h-2 rounded-full bg-western-brown/50 -translate-y-[3px]"></div>
        </div>
        <div className="absolute bottom-10 left-10 right-10 h-px bg-western-brown/30 flex justify-between items-center">
          <div className="w-2 h-2 rounded-full bg-western-brown/50 -translate-y-[3px]"></div>
          <div className="w-2 h-2 rounded-full bg-western-brown/50 -translate-y-[3px]"></div>
        </div>

        {/* Wood grain effect on edge */}
        <div className="absolute left-0 right-0 bottom-0 h-[8px] wood-grain"></div>

        {/* Hover effects */}
        <motion.div 
          className="absolute inset-0 bg-black pointer-events-none z-0"
          animate={{ 
            opacity: isHovered ? 0.03 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-amber-800/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </motion.div>
    </motion.div>
  );
};
