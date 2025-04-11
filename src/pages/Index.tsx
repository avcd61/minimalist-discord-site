import { Button } from "@/components/ui/button";
import { ArrowRight, Waves, Sun } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { FaSteam, FaDiscord, FaTelegram } from 'react-icons/fa';
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
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
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

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const renderVideo = () => {
      ctx.filter = "blur(10px)"; // Размытие оставлено
      ctx.globalAlpha = 0.5;    // Прозрачность оставлена
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(renderVideo);
    };

    const handleCanPlay = () => {
      video
        .play()
        .then(() => {
          console.log("Новое видео воспроизводится");
          renderVideo(); 
          setIsLoaded(true); 
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения нового видео:", error);
        });
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      window.removeEventListener("resize", updateCanvasSize); 
    };
  }, []);

  // Варианты анимации для контейнера
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6, // Чуть дольше для плавности
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Варианты анимации для дочерних элементов
  const itemVariants = {
    hidden: { y: 30, opacity: 0 }, // Чуть больше сдвиг для эффекта "всплытия"
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } // Мягче пружина
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Изменяем путь к видео */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/lovable-uploads/455922_Venice Beach_Los Angeles_1920x1080.mp4" // Новый путь к видео
        onContextMenu={handleContextMenu}
        onError={(e) => console.error("Ошибка загрузки видео:", e)} 
        style={{ display: "none" }} 
      />

      {/* Canvas для рендеринга с параллакс-эффектом */}
      <motion.canvas
        ref={canvasRef}
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none select-none"
        onContextMenu={handleContextMenu}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-summer-sky-light/20 via-transparent to-transparent -z-10" />

      <motion.div 
        className="max-w-2xl text-center space-y-6 z-10"
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
          className="px-4 py-2 text-sm font-medium rounded-full bg-summer-sand/90 text-summer-text/90 inline-block backdrop-blur-sm shadow"
        >
          Время освежиться!
        </motion.span>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-montserrat font-bold tracking-tight summer-gradient-text bg-gradient-to-r from-summer-coral to-summer-sea [text-shadow:1px_1px_3px_rgba(0,0,0,0.2)]"
        >
          Летний Завоз 95 🌴 
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg text-white font-medium [text-shadow:0px_2px_4px_rgba(0,0,0,0.7)] bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2"
        >
          Залетай к солнцеликим! Отдыхаем, пьём пиво и участвуем в жарких паровозиках.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 pt-4"
        >
          {/* Discord кнопка в стиле Cyberpunk светящаяся */}
          <button
            onClick={() => window.open("https://discord.gg/PNnSKWNhYE", "_blank")}
            className="relative inline-block text-sm group px-8 py-3"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-purple-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-indigo-800 border-2 border-indigo-400 group-hover:bg-indigo-900"></span>
            <span className="relative text-white text-base font-bold flex items-center justify-center">
              <FaDiscord className="mr-2 h-5 w-5" />
              Discord
            </span>
          </button>

          {/* Steam кнопка в стиле Cyberpunk светящаяся */}
          <button
            onClick={() => window.open('https://steamcommunity.com/groups/FRSOOfficial', '_blank')}
            className="relative inline-block text-sm group px-8 py-3"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-blue-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-slate-800 border-2 border-blue-400 group-hover:bg-slate-900"></span>
            <span className="relative text-white text-base font-bold flex items-center justify-center">
              <FaSteam className="mr-2 h-5 w-5" />
              Steam
            </span>
          </button>

          {/* Telegram кнопка в стиле Cyberpunk светящаяся */}
          <button
            onClick={() => window.open('https://t.me/+abSXXaH4cf9hNTky', '_blank')}
            className="relative inline-block text-sm group px-8 py-3"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-cyan-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-sky-800 border-2 border-cyan-400 group-hover:bg-sky-900"></span>
            <span className="relative text-white text-base font-bold flex items-center justify-center">
              <FaTelegram className="mr-2 h-5 w-5" />
              Telegram
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;