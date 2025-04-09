
import { useState, useEffect } from "react";
import { Info, Image, ChevronLeft, ChevronRight, X, Server, Users, Calendar, Code, Monitor } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Правильный импорт медиафайлов
const mediaFiles = [
  '/screenshots FL/video0_-_2020-12-15T095904.234.mp4',
  '/screenshots FL/cheater.jpeg',
  '/screenshots FL/Снимок экрана 2021-04-10 130353.png'
];

const FL = () => {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextMedia = () => setCurrentMedia((prev) => (prev + 1) % mediaFiles.length);
  const prevMedia = () => setCurrentMedia((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const isVideo = (file) => file.endsWith('.mp4');

  const renderMedia = (file, isModal = false) => {
    if (isVideo(file)) {
      return (
        <video
          src={file}
          controls
          className={`w-full ${isModal ? 'h-auto' : 'h-full'} object-cover rounded-lg animate-reveal`}
        />
      );
    }
    return (
      <img
        src={file}
        alt={`Медиа ${currentMedia + 1}`}
        className={`w-full ${isModal ? 'h-auto' : 'h-full'} object-cover rounded-lg animate-reveal`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Основной контент */}
      <div className={`container relative z-20 py-16 space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="text-center space-y-4 animate-slide-up">
          <h1 className="text-6xl font-bold font-montserrat mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">Frontier</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500">Land</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-purple-100 mb-8">
            <Badge className="bg-purple-700 text-white hover:bg-purple-800">Minecraft</Badge>
            <Badge className="bg-purple-700 text-white hover:bg-purple-800">1.20.4</Badge>
            <Badge className="bg-purple-700 text-white hover:bg-purple-800">Зига на спавне</Badge>
            <Badge className="bg-purple-700 text-white hover:bg-purple-800">Кастомные фермы железа</Badge>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Добро пожаловать на сервер где админ может своим пердежом крашнуть сервер! Где всё время 3 Tps! Дальше только хуже!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-black/80 border-purple-300/20 animate-slide-up delay-100 hover:bg-black/90 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl hover:shadow-purple-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="h-5 w-5 text-purple-300" />
                О сервере
              </CardTitle>
              <CardDescription className="text-purple-200">
                Основная информация о Frontier Land
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 text-purple-100">
                  <Server className="h-5 w-5 text-purple-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Версия</h4>
                    <p className="text-sm text-purple-200">1.20.4</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-purple-100">
                  <Users className="h-5 w-5 text-purple-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Сообщество</h4>
                    <p className="text-sm text-purple-200">Агресивное</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-purple-100">
                  <Calendar className="h-5 w-5 text-purple-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Активность</h4>
                    <p className="text-sm text-purple-200">Постройка писюнов</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-purple-100">
                  <Code className="h-5 w-5 text-purple-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Особенности</h4>
                    <p className="text-sm text-purple-200">Кастомные плагины</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-800 text-white group relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-x-0 group-hover:scale-x-100 group-hover:bg-purple-600 origin-left"></div>
                <Monitor className="w-4 h-4 mr-2 relative z-10" /> 
                <span className="relative z-10">Хуй тебе! У админа нету денег на хост.</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-purple-300/20 animate-slide-up delay-200 hover:bg-black/90 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl hover:shadow-purple-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Image className="h-5 w-5 text-purple-300" />
                Галерея
              </CardTitle>
              <CardDescription className="text-purple-200">
                Скриншоты и видео с сервера
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="relative aspect-video overflow-hidden rounded-lg cursor-pointer shadow-lg group" onClick={openModal}>
                {renderMedia(mediaFiles[currentMedia])}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button onClick={(e) => { e.stopPropagation(); prevMedia(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-700/60 p-2 rounded-full hover:bg-purple-700/80 transition-all hover:scale-110 z-10">
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextMedia(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-700/60 p-2 rounded-full hover:bg-purple-700/80 transition-all hover:scale-110 z-10">
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
                <div className="absolute bottom-2 right-2 bg-purple-800/80 px-2 py-1 rounded text-xs text-white">
                  {currentMedia + 1} / {mediaFiles.length}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {mediaFiles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMedia(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentMedia === index ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-modal-in" onClick={closeModal}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {renderMedia(mediaFiles[currentMedia], true)}
            <button onClick={closeModal} className="absolute top-2 right-2 bg-purple-700/60 p-2 rounded-full hover:bg-purple-700/80 transition-all hover:scale-110">
              <X className="h-6 w-6 text-white" />
            </button>
            <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-700/60 p-2 rounded-full hover:bg-purple-700/80 transition-all hover:scale-110">
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-700/60 p-2 rounded-full hover:bg-purple-700/80 transition-all hover:scale-110">
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-modal-in {
          animation: modal-in 0.3s ease-out forwards;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .animate-reveal {
          animation: reveal 0.5s ease-out forwards;
        }

        @keyframes reveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default FL;
