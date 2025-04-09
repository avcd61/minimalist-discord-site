import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { FaSteam } from 'react-icons/fa';
import { motion, useScroll, useTransform } from "framer-motion";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Параллакс-эффект при скролле
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Обработчик для предотвращения контекстного меню
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Настройка видео
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    // Установка размеров canvas
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Рендеринг видео на canvas с увеличенным размытием
    const renderVideo = () => {
      ctx.filter = "blur(10px)"; // Увеличили размытие с 4px до 10px
      ctx.globalAlpha = 0.5; // Прозрачность остаётся прежней
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(renderVideo);
    };

    // Старт воспроизведения
    const handleCanPlay = () => {
      video
        .play()
        .then(() => {
          console.log("Видео воспроизводится");
          renderVideo(); // Начинаем рендеринг
          setIsLoaded(true); // Устанавливаем флаг загрузки
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения:", error);
        });
    };

    video.addEventListener("canplay", handleCanPlay);

    // Очистка
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      window.addEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Варианты анимации для контейнера
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Варианты анимации для дочерних элементов
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Скрытое видео */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/01119 (1).mp4"
        onContextMenu={handleContextMenu}
        onError={(e) => console.error("Ошибка загрузки видео:", e)}
        style={{ display: "none" }} // Скрываем видео
      />

      {/* Canvas для рендеринга с параллакс-эффектом */}
      <motion.canvas
        ref={canvasRef}
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none select-none"
        onContextMenu={handleContextMenu}
      />

      <div className="absolute inset-0 bg-background/50 -z-10" />

      <motion.div 
        className="max-w-2xl text-center space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.img
          variants={itemVariants}
          src="/95_2.gif"
          alt="Community Logo"
          className="h-48 w-auto mb-2 dark:invert select-none pointer-events-none"
          style={{ marginLeft: "185px", marginTop: "-140px", position: "absolute" }}
          loading="lazy"
          onContextMenu={handleContextMenu}
          onDragStart={(e) => e.preventDefault()}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />

        <motion.span 
          variants={itemVariants}
          className="px-3 py-1 text-sm font-medium rounded-full glass inline-block"
        >
          Присоединяйтесь к нашим братухам
        </motion.span>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-montserrat font-bold tracking-tight"
        >
          Сигма тот кто 95!
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg text-muted-foreground"
        >
          Присоединяйтесь к нашему дружному сообществу. Общайтесь, находите новых 95 братух и участвуйте в завозах.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8"
        >
          {/* Discord кнопка с улучшенным эффектом */}
          <motion.button
            onClick={() => window.open("https://discord.gg/PNnSKWNhYE", "_blank")}
            className="cyber-button relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="cyber-button-glitch" />
            <div className="cyber-button-content">
              <svg 
                className="cyber-button-icon"
                viewBox="0 0 127.14 96.36"
                style={{ fill: '#ffffff' }}
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              <span className="cyber-button-text">
                Присоединиться к Discord
              </span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-white/10"
              initial={{ x: "-100%", opacity: 0.5 }}
              whileHover={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          {/* Steam кнопка с улучшенным эффектом */}
          <motion.button
            className="neon-button"
            onClick={() => window.open('https://steamcommunity.com/groups/FRSOOfficial', '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="neon-border" />
            <div className="neon-button-content">
              <FaSteam className="cyber-button-icon" style={{ 
                marginRight: "32px", // Уменьшенный отступ справа (было 16px в стилях)
                marginLeft: "8px",  // Добавленный отступ слева
                position: "relative", // Позиционирование
                top: "0px"        // Вертикальное смещение (можно менять для перемещения вверх/вниз)
              }} />
              <span>Steam</span>
            </div>
            <div className="neon-lines">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="neon-line"
                  style={{
                    top: `${25 + i * 25}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;