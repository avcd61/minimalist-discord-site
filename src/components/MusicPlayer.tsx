import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Minimize2,
  Maximize2
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const playlist = [
  {
    title: "Первый BulimPenis",
    artist: "БулимПенис",
    url: "/music/BulimPenis1.mp3"
  },
  {
    title: "Второй BulimPenis",
    artist: "95 Братух",
    url: "/music/BULIMPENIS PART2 (1).mp3"
  },
  {
    title: "Третий BulimPenis",
    artist: "БулимПенис",
    url: "/music/BULIMPENIS 3 (1).mp3"
  },
  {
    title: "БулимКиборг",
    artist: "БулимПенис",
    url: "/music/БулимКиборг-Т95.mp3"
  },
  {
    title: "Армянский закон (feat. Слава КПСС, Поп Жозя)",
    artist: "БулимПенис, Поп Жозя",
    url: "/music/Армянский закон(feat. Слава КПСС, Поп Жозя).MP3"
  },
  {
    title: "Базар держу (feat. Татарский Мишка Фредди, URA)",
    artist: "95 Братух",
    url: "/music/Базар держу (feat. Татарский Мишка Фредди, URA).mp3"
  },
  {
    title: "Бенито Бенито!",
    artist: "БулимПенис",
    url: "/music/Бенито Бенито!.mp3"
  },
  {
    title: "Братва из Крапоткина",
    artist: "Бон Даст",
    url: "/music/Братва из Крапоткина.mp3"
  },
  {
    title: "Бульминатор (моя судьба)",
    artist: "Бульминатор",
    url: "/music/Бульминатор (моя судьба).mp3"
  },
  {
    title: "Дьявол сбежал",
    artist: "Дьявол",
    url: "/music/Дьявол сбежал.MP3"
  },
  {
    title: "Живой, как Цой",
    artist: "БульПенцил",
    url: "/music/Живой, как Цой.mp3"
  },
  {
    title: "Кто тут главный?! (feat. Chief Keef)",
    artist: "БулимПенис, Chief Keef",
    url: "/music/Кто тут главный!.mp3"
  },
  {
    title: "Отцы и братва (feat. Саня Русов)",
    artist: "БулимПенис, Саня Русов",
    url: "/music/Отцы и братва (feat. Саня Русов).mp3"
  },
  {
    title: "Шаурма и закон",
    artist: "БулимПенис",
    url: "/music/Шаурма и закон.mp3"
  },
  {
    title: "Булимпэнис и Андрей БО СИН",
    artist: "БулимПенис, Андрей",
    url: "/music/Булимпэнис и Андрей БО СИН.mp3"
  }
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    const newTrack = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack(prev => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const savedVolume = localStorage.getItem('playerVolume');
    const initialVolume = savedVolume ? parseInt(savedVolume) : 50;
    setVolume(initialVolume);
    if (audioRef.current) {
      audioRef.current.volume = initialVolume / 100;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('playerVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = playlist[currentTrack].url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Ошибка воспроизведения:", err));
      }
    }
  }, [currentTrack, isPlaying]);

  const playerVariants = {
    open: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    minimized: { opacity: 0, scale: 0.5, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const buttonVariants = {
    open: { opacity: 0, scale: 0.5, transition: { duration: 0.3, ease: "easeInOut" } },
    minimized: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <>
      {!isVisible && (
        <Button
          className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white hover:bg-black/90 transition-all duration-200"
          onClick={() => setIsVisible(true)}
        >
          Открыть плеер
        </Button>
      )}

      {isVisible && (
        <>
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={false}
            animate={isMinimized ? "minimized" : "open"}
            variants={buttonVariants}
          >
            {isMinimized && (
              <Button
                className="bg-black/80 backdrop-blur-sm text-white hover:bg-black/90 transition-all duration-200 rounded-full h-12 w-12"
                onClick={toggleMinimize}
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            )}
          </motion.div>

          <motion.div
            className={cn(
              "fixed bottom-4 right-4 w-80 z-50",
              "bg-black/80 backdrop-blur-sm",
              "rounded-xl border border-gray-700/50 shadow-2xl select-none"
            )}
            initial={false}
            animate={isMinimized ? "minimized" : "open"}
            variants={playerVariants}
          >
            {!isMinimized && (
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{playlist[currentTrack].title}</h3>
                    <p className="text-xs text-gray-400">{playlist[currentTrack].artist}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                      onClick={toggleMinimize}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                      onClick={handleClose}
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-300 hover:text-white hover:bg-gray-700/50 h-9 w-9 transition-all duration-200"
                    onClick={handlePrevious}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white bg-gray-700/50 hover:bg-gray-600/70 h-10 w-10 rounded-full transition-all duration-200"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-300 hover:text-white hover:bg-gray-700/50 h-9 w-9 transition-all duration-200"
                    onClick={handleNext}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={1}
                    className="w-full [&>div]:bg-indigo-500 [&>div>div]:bg-indigo-400"
                    onValueChange={handleProgressChange}
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime((progress / 100) * duration)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className="w-20 [&>div]:bg-purple-500 [&>div>div]:bg-purple-400"
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      <audio
        ref={audioRef}
        src={playlist[currentTrack].url}
        onEnded={handleNext}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          setProgress((audio.currentTime / audio.duration) * 100 || 0);
        }}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
        }}
        onError={(e) => {
          console.error("Ошибка загрузки трека:", playlist[currentTrack].title);
          handleNext();
        }}
      />
    </>
  );
};

export default MusicPlayer;
