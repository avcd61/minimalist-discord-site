import { useState, useEffect, useRef } from "react";
import { 
  Skull, 
  Flame, 
  Music, 
  Album, 
  Disc, 
  Bookmark, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Headphones,
  Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Album {
  id: number;
  title: string;
  year: string;
  cover: string;
  description: string;
  tracks: {
    title: string;
    file?: string;
  }[];
}

const BL = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flameRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    
    // Animate flame tongue
    const flameTongue = document.getElementById('flame-tongue');
    if (flameTongue) {
      const animate = () => {
        flameTongue.style.opacity = Math.random() > 0.5 ? '0.8' : '1';
        flameTongue.style.transform = `scale(${0.9 + Math.random() * 0.2})`;
        setTimeout(animate, 100 + Math.random() * 200);
      };
      animate();
    }
    
    // Create random flame animations
    flameRefs.current.forEach((flame) => {
      if (flame) {
        const animateFlame = () => {
          const randomScale = 0.8 + Math.random() * 0.5;
          const randomOpacity = 0.6 + Math.random() * 0.4;
          const randomX = Math.random() * 10 - 5;
          
          flame.style.transform = `translateX(${randomX}px) scale(${randomScale})`;
          flame.style.opacity = randomOpacity.toString();
          
          setTimeout(animateFlame, 150 + Math.random() * 350);
        };
        animateFlame();
      }
    });
    
    // Create heat haze effect
    const createHeatHaze = () => {
      const heatHaze = document.getElementById('heat-haze');
      if (heatHaze) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        heatHaze.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let time = 0;
        
        const animate = () => {
          time += 0.01;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw heat waves
          for (let y = 0; y < canvas.height; y += 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x < canvas.width; x += 10) {
              const wave = Math.sin(x * 0.02 + time + y * 0.01) * 3;
              ctx.lineTo(x, y + wave);
            }
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.015 - y / canvas.height * 0.015})`;
            ctx.stroke();
          }
          
          requestAnimationFrame(animate);
        };
        
        animate();
      }
    };
    
    createHeatHaze();
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const albums: Album[] = [
    {
      id: 1,
      title: "BulimPenis",
      year: "2095",
      cover: "/music/Album1/BulimPenis.png",
      description: "Первый эпический альбом BulimPenis, где исполнитель впервые сталкивается с тёмными силами и начинает свой путь борьбы с Сатаной.",
      tracks: [
        { title: "BulimPenis part 1", file: "/music/BulimPenis1.mp3" },
        { title: "BulimPenis part 2", file: "/music/Album1/2.mp3" },
        { title: "BulimPenis part 3", file: "/music/Album1/3.mp3" },
      ]
    },
    {
      id: 2,
      title: "БулимХач",
      year: "2025",
      cover: "/music/Album2/4.jpg",
      description: "Жизнь БулимПениса",
      tracks: [
        { title: "Взрыв Бани", file: "/music/Album2/1.mp3" },
        { title: "Взрыв Бани v2", file: "/music/Album2/2.mp3" },
        { title: "БулимКиборг-Т95", file: "/music/БулимКиборг-Т95.mp3" },
        { title: "Булимпэнис и Андрей БО СИН", file: "/music/Булимпэнис и Андрей БО СИН.mp3" },
      ]
    },
    {
      id: 3,
      title: "Бульменизм",
      year: "2025",
      cover: "/music/Album3/gtabulib.png",
      description: "Ода величию Булимпэниса, который превратил свою жизнь в легенду!.",
      tracks: [
        { title: "Братва из Крапоткина", file: "/music/Братва из Крапоткина.mp3" },
        { title: "Бульменизм", file: "/music/Album3/Бульменизм.MP3" },
        { title: "Армянский закон (feat. Слава КПСС)", file: "/music/Армянский закон(feat. Слава КПСС, Поп Жозя).MP3" },
        { title: "Бульминатор (моя судьба)", file: "/music/Бульминатор (моя судьба).mp3" },
        { title: "Базар держу (feat. Татарский Мишка Фредди, URA)", file: "/music/Базар держу (feat. Татарский Мишка Фредди, URA).MP3" },
        { title: "Интро Бульминатор грядет…", file: "/music/Album3/Интро Бульминатор грядет….mp3" },
        { title: "Дьявол сбежал", file: "/music/Дьявол сбежал.MP3" },
        { title: "Живой, как Цой", file: "/music/Живой, как Цой.mp3" },
        { title: "Отцы и братва (feat. Саня Русов)", file: "/music/Отцы и братва (feat. Саня Русов).mp3" },
        { title: "Шаурма и закон…", file: "/music/Шаурма и закон.mp3" },
        { title: "Бенито Бенито!", file: "/music/Бенито Бенито!.mp3" },
        { title: "Кто тут главный!", file: "/music/Кто тут главный!.mp3" },
      ]
    },
    {
      id: 4,
      title: "Мартовский Разнос 95",
      year: "2025",
      cover: "/music/Album4/1.png",
      description: "Первый весенний альбом!.",
      tracks: [
        { title: "Прогноз Погоды", file: "/music/Album4/Прогноз Погоды95.mp3" },
        { title: "Любовь по понятиям (ft. ChozaMaestro, El Morgan)", file: "/music/Album4/Любовь по понятиям (ft. ChozaMaestro, El Morgan).mp3" },
        { title: "Много любви (feat. Татарский Мишка Фредди)", file: "/music/Album4/3.mp3" },
        { title: "Любовь враг? (featt. rostikfacekid)", file: "/music/Album4/12.mp3" },
        { title: "Много лиц (feat. Playboi Carti)", file: "/music/Album4/Много лиц (feat. Playboi Carti).mp3" },
        { title: "Весна (feat. URA, Татарский Мишка Фредди, Поп Жозя)", file: "/music/Album4/2.mp3" },
        { title: "U luv", file: "/music/Album4/5.mp3" },
        { title: "НАСТЯ", file: "/music/Album4/НАСТЯ.mp3" },
        { title: "День как финал (feat. 5opka, Chief Keef)", file: "/music/Album4/День как финал (feat. 5opka, Chief Keef).mp3" },
        { title: "Бандосы Тюльпановы (feat. Walter White, Мориарти)", file: "/music/Album4/Бандосы Тюльпановы (feat. Walter White, Мориарти).mp3" }
      ]
    }
  ];

  const handlePlayTrack = (albumId: number, trackIndex: number) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    
    const track = album.tracks[trackIndex];
    if (!track.file) return;
    
    if (currentTrack === trackIndex && selectedAlbum?.id === albumId && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.file;
        audioRef.current.play().catch(err => console.error("Error playing audio:", err));
        setCurrentTrack(trackIndex);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Heat haze effect */}
      <div id="heat-haze" className="fixed inset-0 pointer-events-none z-10"></div>
      
      {/* Background flames */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            ref={el => flameRefs.current[i] = el}
            className="absolute bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full opacity-30 blur-xl"
            style={{
              width: 50 + Math.random() * 200,
              height: 150 + Math.random() * 300,
              left: `${Math.random() * 100}%`,
              bottom: -20,
              transformOrigin: 'bottom center',
              filter: 'blur(20px)'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Rising heat particles */}
      <div className="fixed inset-0 z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute bg-white rounded-full w-1 h-1 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -10,
            }}
            animate={{
              y: [0, -window.innerHeight],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [0.5, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>
      
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/projects/bulimpenis/0T6-XaLp8x-xtrfxssMixZYysWHQwmeNS9wывфвQyRhKYapxa8DLo-ybT59DJzoi4PLas1xiPDR2RshNSH4PMlyQ-XnC копия.jpg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-[#300]"></div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full h-60 z-0 opacity-60">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#f00] via-[#900] to-transparent"></div>
        <div id="flame-tongue" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-full bg-gradient-to-t from-[#f00] via-[#f50] to-transparent rounded-t-full transition-all duration-100 ease-in-out"></div>
        
        {/* Multiple flame tongues */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`flame-${i}`}
            className="absolute bottom-0 bg-gradient-to-t from-red-600 via-orange-500 to-transparent rounded-t-full"
            style={{
              left: `${10 + (i * 8)}%`,
              width: `${2 + Math.random() * 4}%`,
              height: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              height: [`${30 + Math.random() * 40}%`, `${50 + Math.random() * 50}%`, `${30 + Math.random() * 40}%`],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className={`container relative z-10 py-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-16 relative">
          <h1 className="text-6xl font-bold mb-4 gothic-text relative inline-block">
            <span className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">BULIM</span>
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">PENIS</span>
            <Skull className="absolute -top-12 right-0 w-16 h-16 text-red-600 rotate-12 animate-pulse" />
          </h1>
          <div className="flex justify-center">
            <div className="h-0.5 w-40 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          </div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            История музыканта, который бросил вызов самому Сатане и вышел победителем в этой эпической битве добра и зла
          </p>
          
          {/* Animated flames at title */}
          <motion.div 
            className="absolute top-0 left-[calc(50%-150px)] text-orange-500 opacity-80"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Flame className="h-8 w-8" />
          </motion.div>
          
          <motion.div 
            className="absolute top-0 right-[calc(50%-150px)] text-orange-500 opacity-80"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Flame className="h-8 w-8" />
          </motion.div>
        </div>

        <div className="mb-16 bg-black/40 border border-red-900/50 rounded-lg p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
          <h2 className="text-3xl font-bold mb-4 flex items-center text-red-600">
            <Bookmark className="mr-2 h-6 w-6" />
            Биография
          </h2>
          <div className="prose prose-invert max-w-none relative z-10">
            <p className="text-gray-300">
            Булимпэнис – парень непростой, армяно-еврейской крови, родился и живёт в Крапоткине, что само по себе уже как анекдот. Музыкальный герой, говорят, с гитарой своей и голосом хриплым всех местных до белого каления довёл – даже дьявол, и тот, говорят, от него сбежал, проклиная день, когда впервые услышал его шансон про шашлыки. А всё потому, что Булимпэнис не просто поёт – он ещё и шашлычно-шаурмячный мафиозник, крутит дела с мясом на углях и лепёшках, держит в страхе всех, кто осмелится взять шаурму без соуса или пожаловаться на пережаренный кусок. Живёт шумно, ярко, и, видать, не успокоится, пока весь Крапоткин не станцует под его мотивы или не задохнётся от запаха его гриля.
            </p>
            <p className="text-gray-300 mt-4">
            Булимпэнис, этот чертяка, через свою музыку разоблачал всякие тёмные замыслы, что плели силы зла. Пел он так, что аж волосы дыбом вставали, да только за это ему не раз доставалось – мистические напасти, преследования, всё как в дурном сне. Но он не из тех, кто сдаётся: взял да выдал трилогию альбомов, прям летопись свою выложил, как с самим Князем Тьмы воевал, ни шагу назад не отступая.
            </p>
            <p className="text-gray-300 mt-4">
            Последний его альбом – это про финальную заварушку, где свет с тьмой схлестнулся. Булимпэнис, хитрец, музыкой своей так жахнул, что Сатану взашей выгнал из нашего мира, да ещё и дверь за ним захлопнул. Теперь он живая легенда для тех, кто в курсе, что к чему, – мужик, что дьявола на шашлык пустил и песню об этом спел.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center text-red-600">
            <Album className="mr-2 h-6 w-6" />
            Дискография
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card key={album.id} className="bg-black/80 border-red-900/50 text-white hover:border-red-600/50 transition-all duration-300 hover:translate-y-[-5px] overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                <CardHeader className="relative z-10">
                  <div className="relative overflow-hidden aspect-square rounded-md mb-2">
                    <img 
                      src={album.cover} 
                      alt={album.title} 
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full" 
                        size="icon"
                        onClick={() => setSelectedAlbum(album)}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white">{album.title}</CardTitle>
                  <CardDescription className="text-gray-400 flex items-center">
                    <Disc className="inline-block mr-1 h-4 w-4" />
                    {album.year}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-300 text-sm line-clamp-3">{album.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-red-900/30 pt-4 relative z-10">
                  <Badge className="bg-red-900 hover:bg-red-800">
                    <Music className="mr-1 h-3 w-3" />
                    {album.tracks.length} треков
                  </Badge>
                  <Button 
                    variant="outline" 
                    className="border-red-900 text-red-500 hover:text-white hover:bg-red-900"
                    onClick={() => setSelectedAlbum(album)}
                  >
                    Подробнее
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 transition-all duration-300 opacity-100 backdrop-blur-md" onClick={() => setSelectedAlbum(null)}>
          <div 
            className="max-w-4xl w-full bg-black/80 border border-red-900 rounded-lg overflow-hidden relative animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 rounded-full p-1 z-10"
              onClick={() => setSelectedAlbum(null)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={selectedAlbum.cover} 
                    alt={selectedAlbum.title} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">{selectedAlbum.title}</h3>
                <p className="text-gray-400 mb-4">{selectedAlbum.year}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-red-500 mb-2">О альбоме</h4>
                  <p className="text-gray-300">{selectedAlbum.description}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-red-500 mb-2 flex items-center">
                    <Headphones className="h-4 w-4 mr-1" />
                    Треклист
                  </h4>
                  <ul className="space-y-3">
                    {selectedAlbum.tracks.map((track, index) => (
                      <li key={index} className="flex items-center border-b border-red-900/30 pb-2">
                        <span className="text-red-700 font-mono mr-3">{(index + 1).toString().padStart(2, '0')}</span>
                        <span className="text-gray-300">{track.title}</span>
                        {track.file && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-auto text-gray-500 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayTrack(selectedAlbum.id, index);
                            }}
                          >
                            {currentTrack === index && selectedAlbum.id === selectedAlbum.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <style>
        {`
        .gothic-text {
          font-family: 'Cinzel Decorative', 'Times New Roman', serif;
          letter-spacing: 0.1em;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-flicker {
          animation: flicker 3s infinite;
        }

        @keyframes float-upward {
          from { transform: translateY(0); opacity: 0.8; }
          to { transform: translateY(-100px); opacity: 0; }
        }

        .float-particle {
          animation: float-upward 5s infinite linear;
        }
        `}
      </style>
    </div>
  );
};

export default BL;
