import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, Flame, MessageSquare, ShieldAlert, X, Check, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { RippleButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Rules = () => {
  const [expanded, setExpanded] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Слежение за движением мыши для интерактивного фона
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    setIsLoaded(true);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rules = [
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-400" />,
      title: "Живите дружно",
      description:
        "Старайтесь избегать конфликтов, а если они возникают — решайте их мирно. Не стесняйтесь общаться!",
      gradient: "from-blue-500 via-blue-400 to-blue-600",
      color: "blue",
      borderColor: "border-blue-400/30"
    },
    {
      icon: <Flame className="h-6 w-6 text-orange-400" />,
      title: "Споры решаются честно",
      description:
        "Любые разногласия устраняются в честном поединке в Roblox 1 на 1 в любом режиме.",
      gradient: "from-orange-500 via-orange-400 to-orange-600",
      color: "orange",
      borderColor: "border-orange-400/30"
    },
    {
      icon: <Book className="h-6 w-6 text-green-400" />,
      title: "Мат разрешён",
      description:
        "Можна матюкатся пока мама не видит.",
      gradient: "from-green-500 via-green-400 to-green-600",
      color: "green",
      borderColor: "border-green-400/30"
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
      title: "Порно запрещено",
      description: "Никаких NSFW-каналов. Держим братух в рамках приличия.",
      gradient: "from-red-500 via-red-400 to-red-600",
      color: "red",
      borderColor: "border-red-400/30"
    },
  ];

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };
  
  // Анимация для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };
  
  // Анимация для заголовка
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen py-24 px-4 relative"
    >
      {/* Динамический градиентный фон, реагирующий на движение мыши */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-pink-900/20 opacity-50"
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), rgba(217, 70, 239, 0.05) 25%, transparent 50%)`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Декоративный патерн */}
      <div className="absolute inset-0 -z-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0icmdiYSgxNTMsIDI3LCAyNDcsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGN4PSIxMCIgY3k9IjEwIiByPSIzIiAvPjwvZz48L3N2Zz4=')] opacity-20" />
      
      <div className="container max-w-4xl mx-auto space-y-16">
        <motion.div 
          className="text-center space-y-8"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden"
            initial={{ scale: 0, borderRadius: "16px" }}
            animate={{ 
              scale: 1,
              borderRadius: ["16px", "32px", "50%", "32px", "16px"],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative z-10">
              <Book className="h-12 w-12 text-white drop-shadow-glow" />
            </div>
            
            {/* Декоративные элементы вокруг иконки */}
            <div className="absolute w-full h-full">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                  initial={{ 
                    x: 0, y: 0, 
                    opacity: 0.5 
                  }}
                  animate={{ 
                    x: [0, (i % 2 ? 1 : -1) * 30 * Math.cos(i * Math.PI/2)],
                    y: [0, (i % 2 ? -1 : 1) * 30 * Math.sin(i * Math.PI/2)],
                    opacity: [0.5, 0]
                  }}
                  transition={{ 
                    duration: 1.5 + i * 0.2, 
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl font-montserrat font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Правила сервера
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Ознакомьтесь с основными правилами нашего сервера.
              Соблюдение этих правил заставляет Андрея пукать звонко.
            </motion.p>
          </div>
        </motion.div>

        <div className="relative">
          {/* Вертикальная декоративная линия */}
          <motion.div 
            className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
          
          <div className="grid gap-8 relative">
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                whileHover="hover"
                whileTap="tap"
                className="will-change-transform relative"
              >
                {/* Позиционные метки на вертикальной линии */}
                <motion.div 
                  className={cn(
                    "absolute left-[calc(50%-8px)] -top-4 w-4 h-4 rounded-full z-10 shadow-lg",
                    `bg-${rule.color}-500`,
                    `shadow-${rule.color}-500/20`
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 1, type: "spring" }}
                />
                
                {/* Правило */}
                <div className={`relative overflow-hidden rounded-2xl shadow-lg ${index % 2 === 0 ? 'mr-[5%] ml-[10%]' : 'ml-[5%] mr-[10%]'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background"></div>
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${rule.gradient}`}></div>
                  
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, delay: index * 0.2 + 1, ease: "linear" }}
                  />
                  
                  <div 
                    className="relative p-6 flex flex-col cursor-pointer"
                    onClick={() => handleToggle(index)}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className={cn(
                          "rounded-xl p-3 shadow-sm flex items-center justify-center",
                          `bg-${rule.color}-500/10`,
                          `border border-${rule.color}-500/20`
                        )}
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {rule.icon}
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-montserrat font-semibold text-xl">
                            {rule.title}
                          </h3>
                          <motion.div
                            animate={{ 
                              rotate: expanded === index ? 45 : 0,
                              backgroundColor: expanded === index 
                                ? rule.color === "blue" 
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : rule.color === "orange" 
                                  ? 'rgba(249, 115, 22, 0.2)'
                                  : rule.color === "green" 
                                  ? 'rgba(34, 197, 94, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(150, 150, 150, 0.2)'
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-8 w-8 flex items-center justify-center rounded-full"
                          >
                            {expanded === index ? 
                              <X className={cn(`text-${rule.color}-500`, "h-4 w-4")} /> : 
                              <PanelLeft className="h-4 w-4" />
                            }
                          </motion.div>
                        </div>
                        
                        <AnimatePresence>
                          {expanded === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-muted/30">
                                <p className="text-muted-foreground leading-relaxed">
                                  {rule.description}
                                </p>
                                <motion.div 
                                  className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <Check className={cn(`text-${rule.color}-500`, "h-4 w-4")} />
                                  <span>Обязательно к соблюдению</span>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="text-center mt-16 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="relative inline-block">
            <RippleButton 
              variant="secondary" 
              className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 py-6 px-8 rounded-xl text-lg font-medium shadow-xl"
              onClick={() => window.open('https://youtu.be/1A_QYQmbPY0', '_blank')}
            >
              Принять 95
            </RippleButton>
            <motion.div 
              className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-40"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;
