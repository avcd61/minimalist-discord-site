import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Star, Award, Trophy, PawPrint, Accessibility, Camera, Baby } from "lucide-react";
import { useEffect, useState } from "react";
import "../services/About.css"; // Import the CSS file

const About = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    // Для строгого стиля не нужны частицы и сложные анимации
  }, []);

  const team = [
    {
      name: "Андрей",
      role: "Ultimate",
      description: "Создатель и идейный вдохновитель 95 движения. Чухает Семёна.",
      avatar: "/avatars/andry.png",
      gradient: "linear-gradient(to right, #2a1c5e 0%, #6b3fa0 50%, #e63946 100%)",
      icon: <PawPrint className="h-5 w-5 text-red-400" />,
      delay: 100
    },
    {
      name: "Вован",
      role: "Бустер 95",
      description: "Создатель сайта, срёт обложками к трекам. Друзей продал за 4070s.",
      avatar: "/avatars/Boban.gif",
      gradient: "linear-gradient(to right, rgb(238, 220, 54) 0%, #fff176 100%)",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
      delay: 200
    },
    {
      name: "Семён",
      role: "Муж Андрея",
      description: "Долбит Андрея в жопу. Помогал в создании сайта.",
      avatar: "/avatars/semen.png",
      gradient: "linear-gradient(to right, #ff9cee 0%, #ff6f91 100%)",
      icon: <Accessibility className="h-5 w-5 text-pink-400" />,
      delay: 300
    },
    {
      name: "Михаил",
      role: "Дезигнер",
      description: "Создатель логотипа, аватарки сервера и анимации 95 coin!",
      avatar: "/avatars/mihai.png",
      gradient: "linear-gradient(to bottom, #00ff99 0%, #ff0066 100%)",
      icon: <Award className="h-5 w-5 text-green-400" />,
      delay: 400
    },
    {
      "name": "Бо Даст",
      "role": "Фотограф",
      "description": "Нашел какие-то странные кассеты под подушкой.",
      "avatar": "/avatars/bodast.gif",
      "gradient": "linear-gradient(to right, #4a2c1a 0%, #8b5a2b 50%, rgb(146, 78, 23) 100%)",
      "icon": <Camera className="h-5 w-5" style={{ color: '#8b5a2b' }} />,
      "delay": 500
    },
    {
      name: "БулимПенис",
      role: "Легенда",
      description: "Настоящий герой, сатана от него сам не свой.",
      avatar: "/avatars/bul.gif",
      gradient: "linear-gradient(to top, #1a1a1a 0%, #5a5a5a 50%, #929292 100%)",
      icon: <Baby className="h-5 w-5 text-gray-300" />,
      delay: 600
    }
  ];

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container max-w-5xl py-24 space-y-12">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="about-title-3d-container">
          <div className="about-glow-background"></div>
          <h1 className="about-title-3d">
            <span className="about-title-text">О</span>
            <span className="about-title-text">нас</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-8">
          Познакомьтесь с основными 95 братухами, которые делают лютые завозы.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => (
          <div
            key={member.name}
            className={`${loaded ? "animate-reveal" : "opacity-0"} transform transition duration-500`}
            style={{
              animationDelay: `${member.delay}ms`,
            }}
          >
            <div 
              className="group relative p-[3px] rounded-lg transition-transform hover:scale-105 shadow-lg animate-float"
              style={{
                background: member.gradient,
                animationDelay: `${index * 0.2}s`, 
                animationDuration: "6s"
              }}
            >
              <Card className="p-6 h-full bg-background/95 backdrop-blur-sm rounded-lg overflow-hidden relative group-hover:shadow-inner">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-700"></div>
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-700"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <Avatar
                      className="h-20 w-20 ring-2 ring-primary/20 select-none pointer-events-none shadow-xl transition-all duration-300 group-hover:ring-primary/30 group-hover:scale-105"
                      onContextMenu={handleContextMenu}
                    >
                      {member.avatar ? (
                        <AvatarImage
                          src={member.avatar}
                          alt={member.name}
                          className="select-none pointer-events-none object-cover"
                          onContextMenu={handleContextMenu}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="p-2 bg-background/80 rounded-full shadow">
                      {member.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-xl">{member.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{member.description}</p>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed -z-10 top-1/4 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="fixed -z-10 bottom-1/4 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default About;
