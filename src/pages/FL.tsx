import { useState, useEffect, useRef } from "react";
import { Info, Image, ChevronLeft, ChevronRight, X, Server, Users, Calendar, Code, Monitor, Star, Shield, Compass, Sparkles, Sun, Waves, Wind, Umbrella } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Правильный импорт медиафайлов
const mediaFiles = [
  '/screenshots FL/video0_-_2020-12-15T095904.234.mp4',
  '/screenshots FL/cheater.jpeg',
  '/screenshots FL/Снимок экрана 2021-04-10 130353.png'
];

// Данные о сервере в летнем стиле
const serverFeatures = [
  {
    icon: <Sun className="h-6 w-6 text-yellow-300" />,
    title: "Версия",
    value: "1.20.4",
    description: "Последняя версия Minecraft с полной поддержкой плагинов",
    color: "from-yellow-300 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-500/40 to-orange-500/30 bg-black/40"
  },
  {
    icon: <Users className="h-6 w-6 text-sky-300" />,
    title: "Сообщество",
    value: "Агресивное",
    description: "Только настоящие ценители боев лопатами",
    color: "from-sky-300 to-blue-500",
    bgColor: "bg-gradient-to-br from-sky-500/40 to-blue-500/30 bg-black/40"
  },
  {
    icon: <Calendar className="h-6 w-6 text-teal-300" />,
    title: "Активность",
    value: "Постройка писюнов",
    description: "Ежедневные мероприятия и грифферские рейды",
    color: "from-teal-300 to-emerald-500",
    bgColor: "bg-gradient-to-br from-teal-500/40 to-emerald-500/30 bg-black/40"
  },
  {
    icon: <Code className="h-6 w-6 text-pink-300" />,
    title: "Особенности",
    value: "Кастомные плагины",
    description: "Уникальные плагины для самого дикого геймплея",
    color: "from-pink-300 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-500/40 to-rose-500/30 bg-black/40"
  },
  {
    icon: <Star className="h-6 w-6 text-amber-300" />,
    title: "Экономика",
    value: "ВВП на уровне Венесуэлы",
    description: "Торгуй, воруй, грабь - никаких ограничений",
    color: "from-amber-300 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-500/40 to-orange-500/30 bg-black/40"
  },
  {
    icon: <Umbrella className="h-6 w-6 text-sky-300" />,
    title: "Правила",
    value: "Правил нет",
    description: "Только закон джунглей и власть сильнейшего",
    color: "from-sky-300 to-blue-500",
    bgColor: "bg-gradient-to-br from-sky-500/40 to-blue-500/30 bg-black/40"
  }
];

const FL = () => {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const mediaRef = useRef(null);
  
  // Эффект параллакса при прокрутке
  const { scrollY } = useScroll();
  const cloud1Y = useTransform(scrollY, [0, 1000], [0, -150]);
  const cloud2Y = useTransform(scrollY, [0, 1000], [0, -80]);
  const cloud3Y = useTransform(scrollY, [0, 1000], [0, -200]);
  const bubblesY = useTransform(scrollY, [0, 1000], [0, -100]);
  const bgWavesY = useTransform(scrollY, [0, 1000], [0, -50]);
  const midWavesY = useTransform(scrollY, [0, 1000], [0, -120]);
  const frontWavesY = useTransform(scrollY, [0, 1000], [0, -180]);
  
  // Отслеживание позиции мыши
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Настройка Intersection Observer для анимации при прокрутке
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Сбрасываем состояние загрузки при смене медиа
    setMediaLoaded(false);
    setMediaDimensions({ width: 0, height: 0 });
  }, [currentMedia]);

  const nextMedia = () => setCurrentMedia((prev) => (prev + 1) % mediaFiles.length);
  const prevMedia = () => setCurrentMedia((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const isVideo = (file) => file.endsWith('.mp4');

  const renderMedia = (file, isModal = false) => {
    const onLoadHandler = (e) => {
      setMediaLoaded(true);
      // Сохраняем пропорции для дальнейшего использования
      if (e.target) {
        const { naturalWidth, naturalHeight, videoWidth, videoHeight } = e.target;
        const width = naturalWidth || videoWidth || 16;
        const height = naturalHeight || videoHeight || 9;
        setMediaDimensions({ width, height });
      }
    };

    if (isVideo(file)) {
      return (
        <video
          ref={mediaRef}
          src={file}
          controls
          className={`${isModal ? 'max-h-[80vh] object-contain' : 'object-contain'} rounded-xl animate-reveal mx-auto`}
          style={{ width: '100%', height: isModal ? 'auto' : '100%', display: 'block' }}
          playsInline
          preload="metadata"
          onLoadedMetadata={onLoadHandler}
        />
      );
    }
    return (
      <img
        ref={mediaRef}
        src={file}
        alt={`Медиа ${currentMedia + 1}`}
        className={`${isModal ? 'max-h-[80vh] object-contain' : 'object-contain'} rounded-xl animate-reveal mx-auto`}
        style={{ width: '100%', height: isModal ? 'auto' : '100%', display: 'block' }}
        loading="lazy"
        onLoad={onLoadHandler}
      />
    );
  };

  // Получить тип и название медиафайла
  const getMediaInfo = (file) => {
    if (isVideo(file)) {
      return { type: 'Видео', description: 'Нажмите для просмотра' };
    }
    return { type: 'Скриншот', description: 'Нажмите для увеличения' };
  };

  // Варианты анимации для различных элементов
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-hidden relative"
    >
      {/* Красивый градиентный фон с анимированными элементами */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-500 via-blue-400 to-cyan-300 -z-50"></div>
      
      {/* Анимированные волнистые линии с параллаксом */}
      <motion.div 
        className="fixed inset-0 -z-40 opacity-70 overflow-hidden"
        style={{ y: bgWavesY }}
      >
        <svg className="absolute w-full min-w-[1000px]" viewBox="0 0 1200 280" preserveAspectRatio="none">
          <motion.path 
            d="M0,160 C300,300 600,100 1200,180 L1200,280 L0,280 Z" 
            fill="rgba(255, 255, 255, 0.2)"
            animate={{ 
              d: [
                "M0,160 C300,300 600,100 1200,180 L1200,280 L0,280 Z",
                "M0,180 C300,100 600,200 1200,160 L1200,280 L0,280 Z",
                "M0,160 C300,300 600,100 1200,180 L1200,280 L0,280 Z"
              ]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </svg>
      </motion.div>
      
      <motion.div 
        className="fixed inset-0 -z-39 opacity-70 overflow-hidden"
        style={{ y: midWavesY }}
      >
        <svg className="absolute w-full min-w-[1000px] top-[10%]" viewBox="0 0 1200 280" preserveAspectRatio="none">
          <motion.path 
            d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 L1200,280 L0,280 Z" 
            fill="rgba(255, 255, 255, 0.3)"
            animate={{ 
              d: [
                "M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 L1200,280 L0,280 Z",
                "M0,50 C200,100 400,150 600,50 C800,100 1000,150 1200,50 L1200,280 L0,280 Z",
                "M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 L1200,280 L0,280 Z"
              ]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </svg>
      </motion.div>
      
      <motion.div 
        className="fixed inset-0 -z-38 opacity-70 overflow-hidden"
        style={{ y: frontWavesY }}
      >
        <svg className="absolute w-full min-w-[1000px] top-[20%]" viewBox="0 0 1200 280" preserveAspectRatio="none">
          <motion.path 
            d="M0,50 C150,100 300,20 450,50 C600,80 750,20 900,50 C1050,80 1200,20 1200,50 L1200,280 L0,280 Z" 
            fill="rgba(255, 255, 255, 0.2)"
            animate={{ 
              d: [
                "M0,50 C150,100 300,20 450,50 C600,80 750,20 900,50 C1050,80 1200,20 1200,50 L1200,280 L0,280 Z",
                "M0,20 C150,50 300,100 450,20 C600,50 750,100 900,20 C1050,50 1200,100 1200,20 L1200,280 L0,280 Z",
                "M0,50 C150,100 300,20 450,50 C600,80 750,20 900,50 C1050,80 1200,20 1200,50 L1200,280 L0,280 Z"
              ]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </svg>
      </motion.div>
      
      {/* Круглые блики */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute top-[20%] right-[20%] w-64 h-64 rounded-full bg-yellow-300/20 blur-3xl"></div>
        <div className="absolute top-[50%] left-[10%] w-96 h-96 rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[30%] w-80 h-80 rounded-full bg-teal-300/20 blur-3xl"></div>
        
        <motion.div 
          className="absolute top-[15%] left-[25%] w-48 h-48 rounded-full bg-purple-300/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[30%] left-[40%] w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        </div>

      {/* Облака с анимацией */}
      <motion.div 
        className="fixed top-[15%] left-[10%] w-40 h-16 opacity-80 -z-15"
        animate={{ 
          x: [0, 20, 0],
          opacity: [0.7, 0.9, 0.7] 
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <motion.div 
          className="absolute rounded-full bg-white w-16 h-16 left-0 top-0"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
            <motion.div
          className="absolute rounded-full bg-white w-20 h-20 left-10 top-0"
          animate={{ scale: [1, 0.95, 1] }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute rounded-full bg-white w-16 h-16 left-24 top-0"
          animate={{ scale: [1, 1.05, 1] }}
              transition={{
            duration: 7,
                repeat: Infinity,
            ease: "easeInOut",
            delay: 2
              }}
            />
      </motion.div>
          
            <motion.div
        className="fixed top-[25%] right-[30%] w-48 h-16 opacity-80 -z-15"
              animate={{
          x: [0, -30, 0],
          opacity: [0.8, 0.95, 0.8] 
              }}
              transition={{
          duration: 20,
                repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <motion.div 
          className="absolute rounded-full bg-white w-16 h-16 left-0 top-0"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
                  }}
                />
                <motion.div 
          className="absolute rounded-full bg-white w-24 h-20 left-12 top-0"
          animate={{ scale: [1, 0.92, 1] }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute rounded-full bg-white w-16 h-16 left-32 top-0"
          animate={{ scale: [1, 1.1, 1] }}
                  transition={{
            duration: 7.5,
                    repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
                  }}
                />
            </motion.div>
      
      <motion.div 
        className="fixed bottom-[45%] left-[20%] w-64 h-20 opacity-70 -z-15"
        animate={{ 
          x: [0, 40, 0],
          opacity: [0.7, 0.85, 0.7] 
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <motion.div 
          className="absolute rounded-full bg-white w-20 h-20 left-0 top-0"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute rounded-full bg-white w-28 h-24 left-14 top-0"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ 
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute rounded-full bg-white w-24 h-20 left-38 top-0"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Солнце */}
      <motion.div 
        className="fixed top-[10%] right-[15%] w-32 h-32 rounded-full bg-yellow-300 shadow-[0_0_100px_rgba(250,204,21,0.5)] -z-10"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.8, 0.9, 0.8]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      {/* Анимированные рыбки, появляющиеся и исчезающие */}
      <div className="fixed inset-0 -z-15 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`fish-${i}`}
            className={`absolute ${i % 2 === 0 ? 'text-amber-300/60' : 'text-cyan-300/60'}`}
            style={{
              width: Math.random() * 30 + 15,
              height: Math.random() * 30 + 15,
              left: `-5%`,
              top: `${Math.random() * 60 + 20}%`,
            }}
            animate={{ 
              x: ['0%', '110%'], 
              y: [0, Math.random() * 30 - 15, 0],
              rotateY: i % 2 === 0 ? 0 : 180
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,20l-3.5-6.5C7.61,12.58,7,11.34,7,10c0-3.31,2.69-6,6-6s6,2.69,6,6c0,1.34-0.62,2.58-1.5,3.5L12,20z M12,5.84 C10.58,5.84,9.42,6.99,9.42,8.42c0,1.42,1.16,2.58,2.58,2.58c1.42,0,2.58-1.16,2.58-2.58C14.58,6.99,13.42,5.84,12,5.84z"/>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Основной контент */}
      <div className="relative z-20 pt-16 pb-24 space-y-20 backdrop-blur-[1px]">
        {/* Героическая секция */}
        <section ref={heroRef} className="container px-4 mx-auto mb-16">
          <motion.div 
            className="text-center space-y-6"
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div 
              className="relative inline-block mb-4"
              variants={fadeInUp}
              custom={0}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 blur-xl opacity-60 rounded-full animate-pulse" />
              <Waves className="w-16 h-16 mx-auto text-white relative z-10" />
            </motion.div>
            
            <motion.h1 
              className="text-6xl sm:text-7xl font-bold font-montserrat tracking-tighter"
              variants={fadeInUp}
              custom={1}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 inline-block">Frontier</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 inline-block">Land</span>
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-3 my-6"
              variants={fadeInUp}
              custom={2}
            >
              <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 border-none py-1.5 px-3 text-sm font-medium">Minecraft</Badge>
              <Badge className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-600 border-none py-1.5 px-3 text-sm font-medium">1.20.4</Badge>
              <Badge className="bg-gradient-to-r from-teal-400 to-teal-500 text-white hover:from-teal-500 hover:to-teal-600 border-none py-1.5 px-3 text-sm font-medium">Зига на спавне</Badge>
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 border-none py-1.5 px-3 text-sm font-medium">Кастомные фермы железа</Badge>
            </motion.div>
            
            <motion.p 
              className="text-xl text-purple-100/90 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
              custom={3}
            >
              Добро пожаловать на сервер где админ может своим пердежом крашнуть сервер! Где всё время 3 Tps! Дальше только хуже!
            </motion.p>
            
            <motion.div 
              className="pt-6 flex flex-wrap gap-4 justify-center"
              variants={fadeInUp}
              custom={4}
            >
              <Button 
                className="bg-gradient-to-r from-purple-600 to-purple-900 border-none text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 px-6 py-6 rounded-xl text-lg relative overflow-hidden group"
                onClick={() => {
                  // IP и порт сервера
                  const serverIP = "play.project95.ru";
                  const serverPort = "25565";
                  
                  // Создаем URL для подключения к серверу
                  const minecraftURL = `minecraft://?addExternalServer=Project%2095|${serverIP}:${serverPort}`;
                  
                  // Открываем ссылку в новом окне
                  window.open(minecraftURL, '_blank');
                }}
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-500 scale-x-0 group-hover:scale-x-100 group-hover:bg-purple-700/50 origin-left"></div>
                <Sparkles className="w-5 h-5 mr-2 relative z-10" /> 
                <span className="relative z-10">Присоединиться к серверу</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-purple-500/30 text-purple-100 hover:border-purple-500/60 hover:bg-purple-500/10 px-6 py-6 rounded-xl text-lg"
                onClick={() => window.scrollTo({
                  top: document.querySelector('#features')?.getBoundingClientRect().top + window.scrollY,
                  behavior: 'smooth'
                })}
              >
                <Info className="w-5 h-5 mr-2" /> 
                Узнать больше
              </Button>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Галерея */}
        <section className="container px-4 mx-auto">
          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="absolute inset-x-0 -top-5 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
            
            <h2 className="text-3xl font-bold text-center mb-10 text-white">
              <Image className="inline-block w-6 h-6 mr-2 text-purple-400 mb-1" />
              Галерея сервера
            </h2>
            
            <motion.div 
              className="relative min-h-[300px] max-h-[500px] overflow-hidden rounded-xl cursor-pointer shadow-2xl group"
              style={{
                aspectRatio: mediaDimensions.width && mediaDimensions.height 
                  ? `${mediaDimensions.width} / ${mediaDimensions.height}` 
                  : '16 / 9',
                maxWidth: '100%',
                margin: '0 auto',
              }}
              whileHover={{ scale: 1.01 }}
              onClick={openModal}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
              
              <div className="relative h-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
                {!mediaLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-purple-500 animate-spin"></div>
                  </div>
                )}
                <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  {renderMedia(mediaFiles[currentMedia])}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                
                {/* Контроллеры медиа */}
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); prevMedia(); }} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-purple-800/60 p-3 rounded-full hover:bg-purple-700 transition-all hover:scale-110 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </motion.button>
                
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); nextMedia(); }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-800/60 p-3 rounded-full hover:bg-purple-700 transition-all hover:scale-110 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </motion.button>
                
                <div className="absolute bottom-4 right-4 bg-purple-900/80 px-3 py-1.5 rounded-full text-sm text-white font-medium">
                  {currentMedia + 1} / {mediaFiles.length}
                </div>
                
                <div className="absolute left-0 right-0 bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getMediaInfo(mediaFiles[currentMedia]).type} сервера
                  </h3>
                  <p className="text-purple-200 text-sm">
                    {getMediaInfo(mediaFiles[currentMedia]).description}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center gap-3 mt-6">
                {mediaFiles.map((_, index) => (
                <motion.button
                    key={index}
                    onClick={() => setCurrentMedia(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 relative`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: currentMedia === index ? 1 : 0.5,
                    scale: currentMedia === index ? 1.2 : 1
                  }}
                >
                  <span className={`absolute inset-0 rounded-full ${
                    currentMedia === index ? 'bg-purple-400' : 'bg-purple-800'
                  }`}></span>
                  {currentMedia === index && (
                    <motion.span 
                      className="absolute inset-0 rounded-full bg-purple-400"
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{ opacity: 0, scale: 2 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    ></motion.span>
                  )}
                </motion.button>
                ))}
              </div>
          </motion.div>
        </section>
        
        {/* Особенности сервера */}
        <section id="features" className="container px-4 mx-auto">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              viewport={{ once: true, amount: 0.1 }}
            />
            
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              <Info className="inline-block w-6 h-6 mr-2 text-purple-400 mb-1" />
              Особенности сервера
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serverFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="relative rounded-xl overflow-hidden group isolate"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-xl blur-sm opacity-50 group-hover:opacity-80 group-hover:blur transition duration-300 group-hover:duration-200 z-0`}></div>
                  
                  <Card className={`border-0 ${feature.bgColor} backdrop-blur-sm relative h-full z-10 shadow-xl overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 rounded-xl"></div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
                    
                    <CardHeader>
                      <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl w-fit mb-3 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-white text-xl transition-all duration-300 group-hover:text-white group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className={`bg-clip-text text-transparent bg-gradient-to-r ${feature.color} text-lg font-bold transition-all duration-300 group-hover:font-extrabold group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]`}>
                        {feature.value}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sky-100 text-sm transition-all duration-300 group-hover:text-white group-hover:font-medium group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <Button className="bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:from-purple-600 hover:to-pink-600 border-none px-8 py-6 rounded-xl text-lg relative overflow-hidden group">
                <div className="absolute inset-0 w-full h-full transition-all duration-500 scale-x-0 group-hover:scale-x-100 group-hover:bg-white/10 origin-left"></div>
                <Monitor className="w-5 h-5 mr-2 relative z-10" /> 
                <span className="relative z-10">Хуй тебе! У админа нету денег на хост.</span>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Модальное окно галереи */}
      <AnimatePresence>
      {isModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="relative max-w-5xl w-full" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative rounded-lg overflow-hidden backdrop-blur-sm bg-black/30 flex items-center justify-center min-h-[300px]">
                {!mediaLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-16 h-16 rounded-full border-t-2 border-l-2 border-purple-500 animate-spin"></div>
                  </div>
                )}
                <div className={`w-full flex items-center justify-center transition-opacity duration-500 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                     style={{ 
                       maxHeight: '80vh', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center' 
                     }}>
                  {renderMedia(mediaFiles[currentMedia], true)}
                </div>
              </div>
              
              <motion.button 
                onClick={closeModal} 
                className="absolute top-4 right-4 bg-purple-800/80 p-3 rounded-full hover:bg-purple-700 transition-all z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>

              <motion.button 
                onClick={prevMedia} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-purple-800/80 p-3 rounded-full hover:bg-purple-700 transition-all z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </motion.button>
              
              <motion.button 
                onClick={nextMedia} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-800/80 p-3 rounded-full hover:bg-purple-700 transition-all z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </motion.button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-10">
                <h3 className="text-xl font-bold text-white">
                  {getMediaInfo(mediaFiles[currentMedia]).type} {currentMedia + 1} из {mediaFiles.length}
                </h3>
                <div className="flex gap-3 mt-4">
                  {mediaFiles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMedia(index)}
                      className={`w-10 h-1.5 rounded-full transition-all duration-300 ${
                        currentMedia === index ? 'bg-purple-500' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FL;
