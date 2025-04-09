
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, ExternalLink, Play, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDialog = ({ project, onClose }: ProjectDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  if (!project) return null;

  // Card suit symbol and color mapping
  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const suitColors = {
    hearts: "text-vintage-hearts",
    diamonds: "text-vintage-diamonds",
    clubs: "text-vintage-clubs",
    spades: "text-vintage-spades",
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleNext = () => {
    if (!project.images) return;
    setCurrentImageIndex((prev) => 
      prev === project.images!.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    if (!project.images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images!.length - 1 : prev - 1
    );
  };

  const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden border-0 shadow-2xl",
          "bg-vintage-paper max-w-4xl max-h-[90vh] rounded-xl"
        )}
      >
        <motion.div
          className="flex flex-col overflow-auto max-h-[calc(90vh-2rem)]"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dialogVariants}
        >
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-vintage-border/50 bg-gradient-to-b from-western-paper to-western-sand/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-western-border shadow-md bg-white">
                  <img 
                    src={project.logo} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <DialogTitle className={cn(
                  "text-2xl font-western tracking-wider text-shadow",
                  project.suit === "hearts" && "text-western-hearts",
                  project.suit === "diamonds" && "text-western-diamonds", 
                  project.suit === "clubs" && "text-western-clubs",
                  project.suit === "spades" && "text-western-spades"
                )}>
                  {project.name}
                  <span className={`ml-2 ${suitColors[project.suit]}`}>
                    {suitSymbols[project.suit]}
                  </span>
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row gap-0 text-vintage-text flex-1 overflow-hidden">
            <div className={cn(
              "md:w-1/2 flex flex-col relative bg-black/5 border-r border-vintage-border/50",
              "h-[380px]"
            )}>
              {project.appUrl ? (
                <motion.iframe
                  src={project.appUrl}
                  className="w-full h-full border-0"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  title={`${project.name} App`}
                  allow="fullscreen"
                />
              ) : project.images && project.images.length > 0 ? (
                <>
                  <div className="relative w-full h-full">
                    {isVideo(project.images[currentImageIndex]) ? (
                      <motion.video
                        key={`video-${currentImageIndex}`}
                        src={project.images[currentImageIndex]}
                        controls
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div
                        key={`image-${currentImageIndex}`}
                        className="w-full h-full bg-western-paper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={project.images[currentImageIndex]}
                          alt={`${project.name} image ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    )}
                    
                    <AnimatePresence>
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Button
                          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-vintage-paper/80 backdrop-blur-sm hover:bg-vintage-paper shadow-md border border-vintage-border/50"
                        >
                          <ChevronLeft className="h-6 w-6 text-vintage-text" />
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleNext(); }}
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-vintage-paper/80 backdrop-blur-sm hover:bg-vintage-paper shadow-md border border-vintage-border/50"
                        >
                          <ChevronRight className="h-6 w-6 text-vintage-text" />
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  {project.images.length > 1 && (
                    <div className="h-1 bg-vintage-border/30">
                      <motion.div
                        className="h-full bg-vintage-text/40"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentImageIndex + 1) / project.images.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-western-paper">
                  <span className="text-vintage-text/60 italic font-serif">Медиа нет</span>
                </div>
              )}
            </div>

            <div className="md:w-1/2 flex flex-col p-6 overflow-auto bg-gradient-to-b from-western-paper/80 to-western-paper">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <Badge className={cn(
                    "bg-western-paper border-2 border-western-border/60 font-western",
                    project.suit === "hearts" && "border-western-hearts/40 text-western-hearts",
                    project.suit === "diamonds" && "border-western-diamonds/40 text-western-diamonds",
                    project.suit === "clubs" && "border-western-clubs/40 text-western-clubs",
                    project.suit === "spades" && "border-western-spades/40 text-western-spades"
                  )}>
                    {suitSymbols[project.suit]} {project.suit}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-western-gold/20 border-2 border-western-gold/40 text-western-gold font-western">
                      ★ Избранное
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-5">
                  <div className="bg-western-paper p-4 rounded-lg border border-western-border/40 shadow-sm">
                    <h3 className="text-sm font-western text-western-brown flex items-center gap-1.5 mb-2">
                      <Info className="h-4 w-4" /> Описание
                    </h3>
                    <p className="font-serif text-western-brown leading-relaxed">
                      {project.description || "Описание отсутствует"}
                    </p>
                  </div>
                  
                  {project.images && project.images.length > 1 && (
                    <div className="bg-western-paper p-4 rounded-lg border border-western-border/40 shadow-sm">
                      <h3 className="text-sm font-western text-western-brown flex items-center gap-1.5 mb-3">
                        <Play className="h-4 w-4" /> Медиа
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {project.images.map((media, index) => (
                          <div
                            key={index}
                            className={cn(
                              "relative aspect-video rounded-md cursor-pointer overflow-hidden",
                              "border-2 shadow-sm transition-all duration-200",
                              currentImageIndex === index 
                                ? `border-western-${project.suit} ring-1 ring-western-${project.suit}/30 shadow-md` 
                                : "border-western-border hover:border-western-brown/30"
                            )}
                            onClick={() => handleImageSelect(index)}
                          >
                            {isVideo(media) ? (
                              <div className="w-full h-full bg-black/5 flex items-center justify-center">
                                <Play className="h-6 w-6 text-western-brown/70" />
                              </div>
                            ) : (
                              <img
                                src={media}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-western-border/40 pt-4 mt-6 flex flex-wrap gap-4 justify-between items-center">
                <div className="text-xs text-western-brown/70 flex items-center gap-1 font-serif italic">
                  <Clock className="h-3.5 w-3.5" /> Последнее обновление: сегодня
                </div>
                
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-western-paper",
                    "font-western tracking-wide shadow-western transition-all duration-300 hover:scale-105",
                    "bg-gradient-to-r",
                    project.suit === "hearts" && "from-western-hearts to-rose-700",
                    project.suit === "diamonds" && "from-western-diamonds to-red-700", 
                    project.suit === "clubs" && "from-western-clubs to-slate-700",
                    project.suit === "spades" && "from-western-spades to-gray-700"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Открыть проект</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          {project.images && project.images.length > 1 && (
            <div className="p-4 border-t border-western-border/40 md:hidden bg-western-paper/90">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {project.images.map((media, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-shrink-0 w-16 h-12 rounded-md cursor-pointer overflow-hidden",
                      "border-2 shadow-sm",
                      currentImageIndex === index 
                        ? `border-western-${project.suit}` 
                        : "border-western-border"
                    )}
                    onClick={() => handleImageSelect(index)}
                  >
                    {isVideo(media) ? (
                      <div className="w-full h-full bg-black/5 flex items-center justify-center">
                        <Play className="h-4 w-4 text-western-brown/70" />
                      </div>
                    ) : (
                      <img
                        src={media}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
