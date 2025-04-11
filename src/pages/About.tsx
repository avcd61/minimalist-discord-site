import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Waves, Shell, Leaf, Droplet, Citrus,TrainTrack } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import SeabedBackground from '@/components/effects/SeabedBackground'; // Импортируем новый компонент
import { motion } from "framer-motion"; // Убедимся, что импортирован

// import "../services/About.css"; // Оставляем закомментированным

const About = () => {
  const [loaded, setLoaded] = useState(false);

  // Ссылка для текста-губки
  const spongeTextRef = useRef(null);
  
  useEffect(() => {
    setLoaded(true);
    // Для строгого стиля не нужны частицы и сложные анимации
  }, []);

  // Эффект для создания капель на губке (после загрузки)
  useEffect(() => {
    if (spongeTextRef.current && loaded) {
      // Создаем случайные "поры" губки через некоторое время после загрузки
      const timer = setTimeout(() => {
        const element = spongeTextRef.current;
        if (!element) return;
        
        // Создаем "поры" губки (маленькие div элементы)
        for (let i = 0; i < 15; i++) {
          const pore = document.createElement('div');
          pore.className = 'sponge-pore';
          // Располагаем случайным образом
          pore.style.left = `${Math.random() * 100}%`;
          pore.style.top = `${Math.random() * 100}%`;
          // Размер пор
          pore.style.width = `${3 + Math.random() * 5}px`;
          pore.style.height = `${3 + Math.random() * 5}px`;
          // Задержка анимации
          pore.style.animationDelay = `${Math.random() * 2}s`;
          
          element.appendChild(pore);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  const team = [
    {
      name: "Андрей",
      role: "Ultimate",
      description: "Сигма в образе сигмы. Сигма даже когда какает. Создал 95 братух. Своей аурой заставил сушённую ягоду подписатся на него в тик-ток.",
      avatar: "/avatars/andry2.png",
      gradient: "linear-gradient(135deg, #FF8A65, #FFB74D)",
      icon: <Sun className="h-5 w-5 text-orange-400" />,
      delay: 100
    },
    {
      name: "Вован",
      role: "Бустер 95",
      description: "Создал сайт и ахуел в край. C каждым разом делает сайт всё хуже и хуже.",
      avatar: "/avatars/avcd.gif",
      gradient: "linear-gradient(135deg, #FFF9C4, #FFE082)",
      icon: <Shell className="h-5 w-5 text-amber-500" />,
      delay: 200
    },
    {
      name: "Семён",
      role: "Муж Андрея",
      description: "Стал свидетелем паровозика. Помогал Андрею во время запора в 1995 году.",
      avatar: "/avatars/paravozik_.gif",
      gradient: "linear-gradient(135deg, #87CEEB, #4DD0E1)",
      icon: <TrainTrack className="h-5 w-5 text-cyan-400" />,
      delay: 300
    },
    {
      name: "Михаил",
      role: "Дезигнер",
      description: "Создатель логотипа, аватарки сервера и анимации 95 coin! Очень хороший человек.",
      avatar: "/avatars/mihai.png",
      gradient: "linear-gradient(135deg, #81C784, #AED581)",
      icon: <Leaf className="h-5 w-5 text-green-400" />,
      delay: 400
    },
    {
      name: "Бо Даст",
      role: "Фотограф",
      description: "Устал создавать кассеты. Ушел в запой.",
      avatar: "/avatars/bodast.gif",
      gradient: "linear-gradient(135deg, #4FC3F7, #4DD0E1)",
      icon: <Droplet className="h-5 w-5 text-blue-400" />,
      delay: 500
    },
    {
      name: "БулимПенис",
      role: "Легенда",
      description: "Является офицальным музыкальным ботом.",
      avatar: "/avatars/Bul.png",
      gradient: "linear-gradient(135deg, #FFB74D, #FF7043)",
      icon: <Citrus className="h-5 w-5 text-orange-500" />,
      delay: 600
    }
  ];

  // Летние градиенты для фона карточек - более яркие и контрастные с морем
  const cardBackgrounds = [
    "linear-gradient(to bottom right, #FFEB3B, #FFA000)", // Солнечный желтый
    "linear-gradient(to bottom right, #FF8A65, #FF5722)", // Коралловый
    "linear-gradient(to bottom right, #E1F5FE, #B3E5FC)", // Светло-голубой
    "linear-gradient(to bottom right, #F8BBD0, #F48FB1)", // Розовый
    "linear-gradient(to bottom right, #DCEDC8, #AED581)", // Лаймовый
    "linear-gradient(to bottom right, #FFE0B2, #FFCC80)"  // Персиковый
  ];

  // Варианты анимации для заголовка (волнистое появление)
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  // Варианты анимации для буквы в заголовке
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 12 
      }
    }
  };

  // Варианты анимации для подзаголовка
  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.6, 
        duration: 0.6 
      }
    }
  };

  // Варианты анимации для сетки карточек
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.8
      } 
    }
  };

  // Варианты анимации для карточки - меняем поведение
  const cardVariants = {
    hidden: { 
      scale: 0.9, 
      y: 30, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 12 
      } 
    },
    // Убираем scale из hover эффекта карточки, 
    // чтобы он не искажал аватар
    hover: { 
      y: -10, 
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      } 
    },
    tap: { 
      scale: 0.98 
    }
  };

  // Функции для анимации иконок
  const handleIconHover = (event) => {
    const element = event.currentTarget;
    element.classList.add('animate-icon-float');
    setTimeout(() => {
      // Проверяем, существует ли еще элемент, перед удалением класса
      if (element && element.classList) {
        element.classList.remove('animate-icon-float');
      }
    }, 1000);  // Длительность анимации
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container max-w-5xl py-24 space-y-12 relative">
      <SeabedBackground 
        sandColor="#FFE082"
        waterColor="#26C6DA"
        seaweedColors={['#66BB6A', '#81C784', '#4CAF50']}
        showFish={false}
        showTreasure={true}
      />

      <div className="text-center space-y-6 relative z-10">
        <div className="sponge-text-container relative inline-block">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="relative text-5xl sm:text-6xl font-bold"
          >
            <motion.span
              variants={letterVariants}
              className="inline-block yellow-glow"
            >
              О
            </motion.span>
            <motion.span
              variants={letterVariants}
              className="inline-block mx-2"
            >
              н
            </motion.span>
            <motion.span
              variants={letterVariants}
              className="inline-block"
            >
              а
            </motion.span>
            <motion.span
              variants={letterVariants}
              className="inline-block"
            >
              с
            </motion.span>
          </motion.h1>
          
          <div className="sponge-shadow">О нас</div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
          className="relative"
        >
          <p className="text-lg text-white mt-4 [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)]">
            Познакомьтесь с основными 95 братухами, которые делают лютые завозы.
          </p>
          <div className="h-1 w-24 mx-auto mt-3 bg-gradient-to-r from-summer-coral to-summer-sea animate-wave-underline"></div>
        </motion.div>

        <div className="absolute -top-6 -left-4 w-6 h-6 rounded-full bg-white/30 animate-float-slow opacity-50"></div>
        <div className="absolute top-1/2 -right-8 w-4 h-4 rounded-full bg-white/20 animate-float-slower opacity-40"></div>
        <div className="absolute bottom-0 left-1/4 w-5 h-5 rounded-full bg-white/25 animate-float-medium opacity-60"></div>
      </div>

      <motion.div 
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            className="perspective swimming-card"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            style={{ 
              animationDelay: `${index * 0.3}s`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="group relative p-[3px] rounded-lg shadow-lg transform-gpu" 
              style={{ background: member.gradient }}
            >
              <Card 
                className="p-6 h-full backdrop-blur-sm rounded-md overflow-hidden relative 
                          group-hover:shadow-inner transition-all duration-500 border-0 transform-gpu will-change-transform" 
                style={{ 
                  background: cardBackgrounds[index % cardBackgrounds.length],
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/15 rounded-full blur-xl 
                              group-hover:bg-white/25 transition-all duration-700 animate-pulse-slow"></div>
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-white/10 rounded-full blur-xl 
                              group-hover:bg-white/20 transition-all duration-700 animate-pulse-slow-delayed"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <motion.div
                      // Удаляем эффекты scale/rotate при появлении
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.5, 
                        duration: 0.4
                      }}
                      // Добавляем собственный hover эффект для аватара
                      whileHover={{ 
                        scale: 1.08, 
                        transition: { duration: 0.2 } 
                      }}
                      className="transform-gpu will-change-transform"
                    >
                      <Avatar
                        className="h-20 w-20 ring-2 ring-white/50 select-none pointer-events-none 
                                shadow-md transition-shadow duration-300 group-hover:ring-white/70 transform-gpu" 
                        onContextMenu={handleContextMenu}
                      >
                        {member.avatar ? (
                          <AvatarImage
                            src={member.avatar}
                            alt={member.name}
                            className="select-none pointer-events-none object-cover transform-gpu"
                            onContextMenu={handleContextMenu}
                            onDragStart={(e) => e.preventDefault()}
                            style={{
                              imageRendering: 'auto', // Меняем 'high-quality' на 'auto'
                              transformStyle: 'preserve-3d'    // Сохраняет 3D-качество
                            }}
                          />
                        ) : (
                          <AvatarFallback>
                            <Sun className="h-8 w-8 text-gray-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </motion.div>
                    
                    <div 
                      className="p-2 bg-white/70 rounded-full shadow-md backdrop-blur-sm hover:bg-white/90 transition-all duration-300" 
                      onMouseEnter={handleIconHover}
                    > 
                      {member.icon}
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 0.4 }}
                  >
                    <h3 className="font-montserrat font-semibold text-xl text-gray-800 group-hover:translate-x-1 transition-transform duration-300">{member.name}</h3>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      {member.role}
                    </p>
                  </motion.div>

                  <motion.p 
                    className="text-sm text-gray-700 leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 1, duration: 0.5 }}
                  >
                    {member.description}
                  </motion.p>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(0.95); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.1; transform: scale(0.95); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        @keyframes wave-underline {
          0%, 100% { transform: scaleX(0.9); }
          50% { transform: scaleX(1.1); }
        }
        
        @keyframes icon-float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite 1s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 6s ease-in-out infinite 3s;
        }
        
        .animate-wave-underline {
          animation: wave-underline 3s ease-in-out infinite;
        }
        
        .animate-icon-float {
          animation: icon-float 1s ease-in-out;
        }
        
        .perspective {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .will-change-transform {
          will-change: transform;
        }
        
        .sponge-text-container {
          padding: 0.5rem;
          perspective: 1000px;
        }
        
        .yellow-glow {
          color: #FFEB3B;
          text-shadow: 
            0 0 10px rgba(255, 235, 59, 0.7),
            0 0 20px rgba(255, 235, 59, 0.5),
            0 0 30px rgba(255, 184, 0, 0.3);
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            color: #FFEB3B;
            text-shadow: 
              0 0 10px rgba(255, 235, 59, 0.7),
              0 0 20px rgba(255, 235, 59, 0.5),
              0 0 30px rgba(255, 184, 0, 0.3);
          }
          50% {
            color: #FFC107;
            text-shadow: 
              0 0 15px rgba(255, 193, 7, 0.8),
              0 0 25px rgba(255, 193, 7, 0.6),
              0 0 35px rgba(255, 152, 0, 0.4);
          }
        }
        
        .sponge-shadow {
          color: rgba(121, 85, 72, 0.3);
          text-align: center;
          font-size: 5rem;
          font-weight: bold;
          position: absolute;
          transform: translateY(0.2em);
          filter: blur(4px);
          width: 100%;
          z-index: -1;
          left: 0;
          top: 0.1em;
          animation: shadow-float 6s ease-in-out infinite;
        }
        
        @keyframes shadow-float {
          0%, 100% { 
            transform: translateY(0.2em) scale(1);
            filter: blur(4px);
          }
          50% { 
            transform: translateY(0.25em) scale(1.05);
            filter: blur(5px);
          }
        }
        
        /* Добавляем стили для отдельных букв */
        h1 span {
          color: #FFEB3B;
          display: inline-block;
          animation: letter-float 4s ease-in-out infinite;
        }
        
        h1 span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        h1 span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        h1 span:nth-child(4) {
          animation-delay: 0.6s;
        }
        
        @keyframes letter-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
          }
          33% { 
            transform: translateY(-5px) rotate(-2deg);
          }
          66% { 
            transform: translateY(2px) rotate(1deg);
          }
        }
        
        /* Анимация плавания для карточек */
        .swimming-card {
          animation: card-swim 7s ease-in-out infinite;
          transform-origin: center center;
        }
        
        @keyframes card-swim {
          0% { 
            transform: translateY(0) rotate(0deg) translateZ(0);
          }
          25% { 
            transform: translateY(-5px) rotate(0.8deg) translateZ(5px);
          }
          50% { 
            transform: translateY(0) rotate(0deg) translateZ(10px);
          }
          75% { 
            transform: translateY(5px) rotate(-0.8deg) translateZ(5px);
          }
          100% { 
            transform: translateY(0) rotate(0deg) translateZ(0);
          }
        }
        
        /* Добавляем воздушные пузыри у карточек */
        .swimming-card::before,
        .swimming-card::after {
          content: '';
          position: absolute;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0;
          z-index: 2;
          pointer-events: none;
          animation: bubble-rise 8s linear infinite;
        }
        
        .swimming-card::before {
          width: 8px;
          height: 8px;
          left: 10%;
          bottom: -5px;
        }
        
        .swimming-card::after {
          width: 6px;
          height: 6px;
          left: 25%;
          bottom: -5px;
          animation-delay: 2s;
        }
        
        /* Каждая вторая карточка имеет пузыри справа */
        .swimming-card:nth-child(even)::before {
          left: auto;
          right: 15%;
          animation-delay: 1s;
        }
        
        .swimming-card:nth-child(even)::after {
          left: auto;
          right: 30%;
          animation-delay: 3s;
        }
        
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-120px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
      
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="sponge-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="1" />
          <feDisplacementMap in="SourceGraphic" scale="6" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </svg>
    </div>
  );
};

export default About;
