import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-black/40 via-black/20 to-transparent">
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

      {/* Canvas для рендеринга */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none select-none"
        onContextMenu={handleContextMenu}
      />

      <div className="absolute inset-0 bg-background/50 -z-10" />

      <div className="max-w-2xl text-center space-y-6 animate-fadeIn">
        <img
          src="/95_2.gif"
          alt="Community Logo"
          className="h-48 w-auto mb-2 dark:invert animate-levitate select-none pointer-events-none"
          style={{ marginLeft: "185px", marginTop: "-140px", position: "absolute" }}
          loading="lazy"
          onContextMenu={handleContextMenu}
          onDragStart={(e) => e.preventDefault()}
        />

        <span className="px-3 py-1 text-sm font-medium rounded-full glass inline-block">
          Присоединяйтесь к нашим братухам
        </span>

        <h1 className="text-4xl sm:text-5xl font-montserrat font-bold tracking-tight">
          Сигма тот кто 95!
        </h1>

        <p className="text-lg text-muted-foreground">
          Присоединяйтесь к нашему дружному сообществу. Общайтесь, находите новых 95 братух и участвуйте в завозах.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => window.open("https://discord.gg/PNnSKWNhYE", "_blank")}
            className="group relative overflow-hidden px-6 py-3 text-lg font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-md hover:shadow-xl hover:from-purple-500 hover:to-blue-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="transition-transform group-hover:-translate-x-1">Присоединиться к Discord</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2" />
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open("https://steamcommunity.com/groups/FRSOOfficial", "_blank")}
            className="relative px-6 py-3 text-lg font-semibold text-white transition-all duration-300 ease-in-out border-2 border-white rounded-xl group hover:bg-white hover:text-black hover:shadow-lg before:absolute before:inset-0 before:border before:border-transparent before:rounded-xl before:transition-all before:duration-500 before:opacity-0 hover:before:opacity-100 hover:before:border-white"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="transition-transform group-hover:-translate-x-1">Steam группа 95 братух</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;