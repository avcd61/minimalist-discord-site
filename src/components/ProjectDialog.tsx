import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Info, 
  ExternalLink, 
  Play, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Share2, 
  Copy, 
  Check,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Volume1,
  Download,
  RotateCw,
  Settings,
  ChevronDown,
  Zap,
  Image
} from "lucide-react";
import type { Project } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

// Пользовательский компонент DialogContent без кнопки закрытия
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {/* Убрана стандартная кнопка закрытия */}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDialog = ({ project, onClose }: ProjectDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Состояния для элементов управления видео
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // Новые состояния для расширенных манипуляций с видео
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  // Список доступных скоростей воспроизведения
  const playbackSpeeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  
  // Добавляем функцию для отлаживания состояния управления
  const logControlsState = useCallback((action: string) => {
    console.log(`Управление видео: ${action}, showControls = ${showControls}, isPlaying = ${isPlaying}`);
  }, [showControls, isPlaying]);
  
  // Объединяем все хуки useCallback и useEffect в начале компонента
  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Ошибка при входе в полноэкранный режим: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Ошибка при выходе из полноэкранного режима: ${err.message}`);
      });
    }
  }, []);
  
  // Объединим все эффекты в один для предотвращения ошибок с порядком хуков
  useEffect(() => {
    // Эффект для сброса индекса изображения и ошибки видео при изменении проекта
    if (project) {
    setCurrentImageIndex(0);
      setVideoError(false);
    }

    // Эффект для настройки слушателей событий видео
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoError(false);
    };
    const handleVolumeChanged = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('volumechange', handleVolumeChanged);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('volumechange', handleVolumeChanged);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [project, videoRef]);

  // Добавляем эффект, который будет загружать видео при смене currentImageIndex
  useEffect(() => {
    if (!project || !project.images) return;
    
    // Если текущий элемент - видео, загружаем его
    if (isVideo(project.images[currentImageIndex]) && videoRef.current) {
      // Сбрасываем ошибку видео, если она была
      setVideoError(false);
      
      // Сбрасываем текущее время
      setCurrentTime(0);
      
      // Останавливаем воспроизведение
      setIsPlaying(false);
      
      // Загружаем видео заново
      videoRef.current.load();
    }
  }, [currentImageIndex, project]);

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
    // Если выбрали тот же индекс и это видео, просто переключаем воспроизведение
    if (index === currentImageIndex && project.images && isVideo(project.images[index])) {
      handlePlayPause();
      return;
    }
    
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

  const isVideo = (src: string) => /\.(mp4|webm|ogg|mov|mkv|avi)$/i.test(src);

  const getVideoType = (src: string) => {
    const extension = src.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'ogg': return 'video/ogg';
      case 'mov': return 'video/quicktime';
      case 'mkv': return 'video/x-matroska';
      case 'avi': return 'video/x-msvideo';
      default: return '';
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Ошибка загрузки видео:", e);
    setVideoError(true);
    toast({
      title: "Ошибка воспроизведения",
      description: "Не удалось загрузить видео. Проверьте формат и URL.",
      variant: "destructive",
      duration: 3000
    });
  };

  const handleVideoSuccess = () => {
    setVideoError(false);
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const handleShare = () => {
    const url = project.link;
    
    // Если поддерживается Web Share API
    if (navigator.share) {
      navigator.share({
        title: project.name,
        text: project.description || `Проект: ${project.name}`,
        url: url
      })
      .then(() => {
        toast({
          title: "Успешно поделились",
          description: "Ссылка отправлена.",
          duration: 2000
        });
      })
      .catch((error) => {
        console.error("Ошибка при попытке поделиться:", error);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(project.link)
      .then(() => {
        setCopied(true);
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка на проект скопирована в буфер обмена.",
          duration: 2000
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Ошибка при копировании:", error);
        toast({
          title: "Ошибка копирования",
          description: "Не удалось скопировать ссылку.",
          variant: "destructive",
          duration: 2000
        });
      });
  };

  // Обработчики видео
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Ошибка воспроизведения:", err);
          setVideoError(true);
          toast({
            title: "Ошибка воспроизведения",
            description: "Не удалось запустить видео. Возможно, формат не поддерживается браузером.",
            variant: "destructive",
            duration: 3000
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoError(false);
      handleVideoSuccess();
    }
  };
  
  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };
  
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
      }
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
    }
  };
  
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };
  
  // Форматирование времени видео (мм:сс)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Добавляем функцию для изменения скорости воспроизведения
  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
      
      toast({
        title: "Скорость воспроизведения",
        description: `Установлена скорость: ${speed}x`,
        duration: 1500
      });
    }
  };
  
  // Функция для поворота видео
  const rotateVideo = () => {
    setRotation((prev) => (prev + 90) % 360);
    
    toast({
      title: "Поворот видео",
      description: `Видео повернуто на ${(rotation + 90) % 360}°`,
      duration: 1500
    });
  };
  
  // Функция для скачивания видео
  const downloadVideo = () => {
    if (!project.images || !isVideo(project.images[currentImageIndex])) return;
    
    const videoUrl = project.images[currentImageIndex];
    const link = document.createElement('a');
    link.href = videoUrl;
    
    // Извлекаем имя файла из URL или создаем имя на основе названия проекта
    const fileName = videoUrl.split('/').pop() || 
                    `${project.name.toLowerCase().replace(/\s+/g, '_')}_video.mp4`;
    
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Скачивание видео",
      description: "Видео загружается...",
      duration: 2000
    });
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
                  <motion.img 
                    src={project.logo} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.3 }}
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
              
              <Button
                onClick={() => onClose()}
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-western-brown/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <DialogDescription className="sr-only">
              {project.description || "Подробная информация о проекте"}
            </DialogDescription>
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
                    <AnimatePresence mode="wait">
                    {isVideo(project.images[currentImageIndex]) ? (
                        <motion.div
                          key={`video-container-${currentImageIndex}`}
                          className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        >
                          {!videoError ? (
                            <div 
                              className="relative w-full h-full flex flex-col"
                              onMouseEnter={() => {
                                setShowControls(true);
                                logControlsState('наведение');
                              }} 
                              onMouseLeave={() => {
                                setShowControls(false);
                                logControlsState('уход курсора');
                              }}
                              onMouseMove={() => {
                                if (!showControls) {
                                  setShowControls(true);
                                  logControlsState('движение мыши');
                                  // Автоматически скрывать управление через 3 секунды
                                  setTimeout(() => {
                                    if (isPlaying) {
                                      setShowControls(false);
                                      logControlsState('автоскрытие');
                                    }
                                  }, 3000);
                                }
                              }}
                              onTouchStart={() => {
                                setShowControls(true);
                                logControlsState('касание');
                              }}
                              onTouchEnd={() => {
                                // Задержка перед скрытием для возможности нажатия
                                setTimeout(() => {
                                  if (isPlaying) {
                                    setShowControls(false);
                                    logControlsState('конец касания');
                                  }
                                }, 3000);
                              }}
                            >
                              <video
                                ref={videoRef}
                                className="w-full h-full object-contain flex-1"
                                playsInline
                                preload="metadata"
                                onError={handleVideoError}
                                onLoadedMetadata={handleLoadedMetadata}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayPause();
                                  logControlsState('клик по видео');
                                }}
                                style={{ zIndex: 1 }}
                              >
                                <source 
                                  src={project.images[currentImageIndex]} 
                                  type={getVideoType(project.images[currentImageIndex])} 
                                />
                                Ваш браузер не поддерживает тег видео.
                              </video>
                              
                              {/* Большая кнопка воспроизведения по центру */}
                              {(!isPlaying || showControls) && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                  <motion.button
                                    onClick={handlePlayPause}
                                    className="h-16 w-16 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors duration-200 pointer-events-auto"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    {isPlaying ? 
                                      <Pause className="h-8 w-8 text-white" /> : 
                                      <Play className="h-8 w-8 text-white ml-1" />
                                    }
                                  </motion.button>
                                </div>
                              )}
                              
                              {/* Упрощенная панель управления в стиле YouTube */}
                              <div 
                                className={cn(
                                  "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent",
                                  "p-2 text-white transition-opacity duration-300 z-20 pointer-events-none",
                                  (showControls || !isPlaying) ? "opacity-100" : "opacity-0"
                                )}
                              >
                                {/* Прогресс-бар */}
                                <div className="w-full h-6 group mb-1 relative pointer-events-auto flex items-center">
                                  {/* Фоновая полоса прогресса */}
                                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-white/30 rounded-full">
                                    {/* Заполненная часть прогресса */}
                                    <div 
                                      className="h-full bg-red-500 rounded-full transition-all"
                                      style={{ width: `${(currentTime / duration) * 100}%` }}
                                    />
                                    
                                    {/* Ползунок, видимый при наведении */}
                                    <div 
                                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                    />
                                  </div>
                                  
                                  {/* Кликабельная область для перемотки */}
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max={duration || 100}
                                    step="0.01"
                                    value={currentTime}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleSeek(e);
                                      logControlsState('перемотка');
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer pointer-events-auto"
                                  />
                                  
                                  {/* Подсказка текущего времени при наведении */}
                                  <div className="absolute bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-1 py-0.5 rounded pointer-events-none"
                                       style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}>
                                    {formatTime(currentTime)}
                                  </div>
                                </div>
                                
                                {/* Кнопки управления */}
                                <div className="flex items-center justify-between pointer-events-auto">
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayPause();
                                        logControlsState('клик Play/Pause');
                                      }}
                                      className="text-white hover:text-white/80 transition-colors pointer-events-auto p-2"
                                      title={isPlaying ? "Пауза" : "Воспроизвести"}
                                    >
                                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                                    </button>
                                    
                                    <div className="flex items-center gap-2 group relative pointer-events-auto">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMuteToggle();
                                          logControlsState('клик Звук');
                                        }}
                                        className="text-white hover:text-white/80 transition-colors pointer-events-auto p-2"
                                        title={isMuted ? "Включить звук" : "Выключить звук"}
                                      >
                                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                      </button>
                                      
                                      <div className="w-16 h-4 flex items-center bg-transparent rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 origin-left transition-all duration-200 pointer-events-auto">
                                        <div className="w-full h-1 bg-white/30 rounded-full">
                                          <div 
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                          />
                                        </div>
                                        <input 
                                          type="range" 
                                          min="0" 
                                          max="1"
                                          step="0.05"
                                          value={isMuted ? 0 : volume}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            handleVolumeChange(parseFloat(e.target.value));
                                            logControlsState('изменение громкости');
                                          }}
                                          className="absolute top-0 left-0 w-16 h-4 opacity-0 cursor-pointer pointer-events-auto"
                                        />
                                      </div>
                                    </div>
                                    
                                    <span className="text-xs text-white font-medium">
                                      {formatTime(currentTime)} / {formatTime(duration || 0)}
                                    </span>
                                  </div>
                                  
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFullscreen();
                                      logControlsState('клик Полный экран');
                                    }}
                                    className="text-white hover:text-white/80 transition-colors pointer-events-auto p-2"
                                    title={isFullscreen ? "Выйти из полноэкранного режима" : "На весь экран"}
                                  >
                                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                              <span className="text-red-500 font-medium">Ошибка загрузки видео</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setVideoError(false);
                                  if (videoRef.current) {
                                    videoRef.current.load();
                                    videoRef.current.play().catch(err => console.error(err));
                                  }
                                }}
                              >
                                Попробовать снова
                              </Button>
                              <a 
                                href={project.images[currentImageIndex]} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs underline text-western-brown/70"
                              >
                                Открыть видео в новой вкладке
                              </a>
                            </div>
                          )}
                        </motion.div>
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
                    </AnimatePresence>
                    
                    {project.images.length > 1 && (
                      <div 
                        className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-vintage-paper/80 backdrop-blur-sm hover:bg-vintage-paper shadow-md border border-vintage-border/50"
                        >
                          <ChevronLeft className="h-6 w-6 text-vintage-text" />
                        </Button>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleNext(); }}
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-vintage-paper/80 backdrop-blur-sm hover:bg-vintage-paper shadow-md border border-vintage-border/50"
                        >
                          <ChevronRight className="h-6 w-6 text-vintage-text" />
                        </Button>
                      </motion.div>
                      </div>
                    )}
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
                <div className="flex items-center gap-2 mb-5 flex-wrap">
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
                  
                  <motion.div 
                    className="ml-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleShare}
                      variant="ghost"
                      size="sm"
                      className="flex gap-2 text-xs text-western-brown/80 hover:text-western-brown hover:bg-western-brown/10"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : (
                        navigator.share 
                          ? <Share2 className="h-3.5 w-3.5" /> 
                          : <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copied ? "Скопировано" : "Поделиться"}</span>
                    </Button>
                  </motion.div>
                </div>
                
                <div className="space-y-5">
                  <motion.div 
                    className="bg-western-paper p-4 rounded-lg border border-western-border/40 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-sm font-western text-western-brown flex items-center gap-1.5 mb-2">
                      <Info className="h-4 w-4" /> Описание
                    </h3>
                    <p className="font-serif text-western-brown leading-relaxed">
                      {project.description || "Описание отсутствует"}
                    </p>
                  </motion.div>
                  
                  {project.images && project.images.length > 1 && (
                    <motion.div 
                      className="bg-western-paper p-4 rounded-lg border border-western-border/40 shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-sm font-western text-western-brown flex items-center gap-1.5 mb-3">
                        <Play className="h-4 w-4" /> Медиа
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {project.images.map((media, index) => (
                          <motion.div
                            key={index}
                            className={cn(
                              "relative aspect-video rounded-md cursor-pointer overflow-hidden",
                              "border-2 shadow-sm transition-all duration-200",
                              currentImageIndex === index 
                                ? `border-western-${project.suit} ring-1 ring-western-${project.suit}/30 shadow-md` 
                                : "border-western-border hover:border-western-brown/30"
                            )}
                            onClick={() => handleImageSelect(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isVideo(media) ? (
                              <div className="w-full h-full bg-black/5 flex items-center justify-center relative">
                                <Play className="h-6 w-6 text-western-brown/70" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] py-0.5 text-center">
                                  ВИДЕО
                                </div>
                              </div>
                            ) : (
                              <img
                                src={media}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            
                            {currentImageIndex === index && (
                              <motion.div 
                                className="absolute inset-0 bg-western-gold/20 border-2 border-western-gold/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <motion.div 
                className="border-t border-western-border/40 pt-4 mt-6 flex flex-wrap gap-4 justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-western-brown/70 flex items-center gap-1 font-serif italic">
                  <Clock className="h-3.5 w-3.5" /> Последнее обновление: сегодня
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-western-paper",
                      "font-western tracking-wide shadow-western transition-all duration-300",
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
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {project.images && project.images.length > 1 && (
            <div className="p-4 border-t border-western-border/40 md:hidden bg-western-paper/90">
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x">
                {project.images.map((media, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "flex-shrink-0 w-16 h-12 rounded-md cursor-pointer overflow-hidden snap-center",
                      "border-2 shadow-sm",
                      currentImageIndex === index 
                        ? `border-western-${project.suit}` 
                        : "border-western-border"
                    )}
                    onClick={() => handleImageSelect(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isVideo(media) ? (
                      <div className="w-full h-full bg-black/5 flex items-center justify-center relative">
                        <Play className="h-4 w-4 text-western-brown/70" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] py-0.5 text-center">
                          ВИДЕО
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
