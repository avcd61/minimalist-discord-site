import React, { useRef, useEffect, useState } from 'react';

interface SeabedBackgroundProps {
  sandColor?: string;
  waterColor?: string;
  bubbleColor?: string;
  seaweedColors?: string[];
  className?: string;
  showFish?: boolean; // Новый параметр для включения/отключения рыбок
  showTreasure?: boolean; // Новый параметр для отображения сокровищ
}

const SeabedBackground: React.FC<SeabedBackgroundProps> = ({
  sandColor = '#FFE082',  // Песочный цвет
  waterColor = '#26C6DA', // Цвет воды 
  bubbleColor = '#FFFFFF', // Цвет пузырьков
  seaweedColors = ['#66BB6A', '#81C784', '#4CAF50'], // Цвета водорослей
  className = '',
  showFish = true,
  showTreasure = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  
  // Состояния для анимируемых элементов
  const bubblesRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    speed: number;
    opacity: number;
  }>>([]);
  
  const seaweedsRef = useRef<Array<{
    x: number;
    height: number;
    width: number;
    segments: number;
    color: string;
    phase: number;
    speed: number;
  }>>([]);
  
  const lightraysRef = useRef<Array<{
    x: number;
    width: number;
    opacity: number;
    speed: number;
  }>>([]);
  
  // Новый ref для рыб
  const fishRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
    direction: number; // 1 = вправо, -1 = влево
    oscillationSpeed: number;
    oscillationAmplitude: number;
    phase: number;
  }>>([]);
  
  // Новый ref для сокровищ на дне
  const treasureRef = useRef<Array<{
    x: number;
    y: number;
    type: 'chest' | 'coin' | 'pearl';
    size: number;
    rotation: number;
    glowIntensity: number;
  }>>([]);
  
  // Время для анимаций
  const timeRef = useRef<number>(0);
  
  // Инициализация элементов
  const initializeElements = (width: number, height: number) => {
    // Инициализация пузырьков
    bubblesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100, // Начинают чуть ниже canvas
      radius: 2 + Math.random() * 4,
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.5
    }));
    
    // Инициализация водорослей
    seaweedsRef.current = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      height: 50 + Math.random() * 150,
      width: 10 + Math.random() * 20,
      segments: 5 + Math.floor(Math.random() * 7),
      color: seaweedColors[Math.floor(Math.random() * seaweedColors.length)],
      phase: Math.random() * Math.PI * 2,
      speed: 0.001 + Math.random() * 0.002
    }));
    
    // Инициализация лучей света
    lightraysRef.current = Array.from({ length: 8 }, () => ({
      x: Math.random() * width,
      width: 30 + Math.random() * 60,
      opacity: 0.1 + Math.random() * 0.2,
      speed: 0.0005 + Math.random() * 0.001
    }));
    
    // Инициализация рыб
    if (showFish) {
      const fishColors = [
        '#FF9800', // оранжевая
        '#FFEB3B', // желтая
        '#E91E63', // розовая
        '#9C27B0', // фиолетовая
        '#2196F3', // синяя
        '#FF5722'  // красная
      ];
      
      fishRef.current = Array.from({ length: 12 }, () => {
        const direction = Math.random() > 0.5 ? 1 : -1;
        return {
          x: direction === 1 ? -50 : width + 50, // Начальная позиция за пределами экрана
          y: 50 + Math.random() * (height * 0.7), // В верхней 70% части экрана
          size: 15 + Math.random() * 25,
          speed: 0.5 + Math.random() * 2,
          color: fishColors[Math.floor(Math.random() * fishColors.length)],
          direction: direction,
          oscillationSpeed: 0.05 + Math.random() * 0.1,
          oscillationAmplitude: 3 + Math.random() * 7,
          phase: Math.random() * Math.PI * 2
        };
      });
    }
    
    // Инициализация сокровищ
    if (showTreasure) {
      treasureRef.current = Array.from({ length: 6 }, () => {
        const types = ['chest', 'coin', 'pearl'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        // Размещаем сокровища в нижней части экрана (на песчаном дне)
        const bottomY = height - (height * 0.2) - 10;
        return {
          x: Math.random() * width,
          y: bottomY + Math.random() * 20, // Немного варьируем по высоте
          type: type,
          size: type === 'chest' ? 30 + Math.random() * 15 : 5 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 0.2 - Math.PI * 0.1, // Небольшой наклон
          glowIntensity: 0.3 + Math.random() * 0.4
        };
      });
    }
  };
  
  // Обработка изменения размеров окна
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize(); // Инициализация
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Эффект для инициализации элементов при изменении размеров
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeElements(dimensions.width, dimensions.height);
    }
  }, [dimensions]);
  
  // Основной эффект для рисования и анимации
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Установка размеров canvas
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Основная функция анимации
    const animate = (time: number) => {
      // Увеличиваем время для волнистых эффектов
      timeRef.current += 0.01;
      
      if (!ctx) return;
      
      // Очищаем canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем градиент воды
      const waterGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      waterGradient.addColorStop(0, '#0097A7'); // Темнее вверху
      waterGradient.addColorStop(0.7, waterColor); // Светлее к низу
      waterGradient.addColorStop(1, '#B2EBF2'); // Еще светлее у самого дна
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем лучи света
      drawLightRays(ctx, timeRef.current);
      
      // Рисуем песчаное дно
      drawSandyBottom(ctx, timeRef.current);
      
      // Рисуем сокровища если нужно
      if (showTreasure) {
        drawTreasures(ctx, timeRef.current);
      }
      
      // Рисуем водоросли
      drawSeaweeds(ctx, timeRef.current);
      
      // Рисуем рыб если нужно
      if (showFish) {
        drawFish(ctx, timeRef.current);
      }
      
      // Рисуем пузырьки
      drawBubbles(ctx, timeRef.current);
      
      // Следующий кадр
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Функция рисования песчаного дна
    const drawSandyBottom = (ctx: CanvasRenderingContext2D, time: number) => {
      const bottomHeight = canvas.height * 0.2; // 20% высоты снизу - песчаное дно
      const y = canvas.height - bottomHeight;
      
      // Градиент песка
      const sandGradient = ctx.createLinearGradient(0, y, 0, canvas.height);
      sandGradient.addColorStop(0, 'rgba(255, 224, 130, 0.8)'); // Светлее сверху
      sandGradient.addColorStop(1, sandColor); // Темнее снизу
      
      // Рисуем статичную слегка волнистую верхнюю границу песка
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      // Создаем волнистую линию
      for (let x = 0; x <= canvas.width; x += 20) {
        // Теперь используем time для легкой анимации песчаного дна
        const waveHeight = 4 * Math.sin(x * 0.05 + time * 0.2) + 2 * Math.cos(x * 0.03 - time * 0.1);
        ctx.lineTo(x, y + waveHeight);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      ctx.fillStyle = sandGradient;
      ctx.fill();
      
      // Добавляем "рябь" на песке - мелкие детали
      for (let x = 0; x < canvas.width; x += 30) {
        for (let yOffset = 10; yOffset < bottomHeight - 5; yOffset += 15) {
          const rippleY = y + yOffset + Math.sin(x * 0.1 + time * 0.3) * 2;
          const rippleLength = 15 + Math.cos(x * 0.2 + time * 0.2) * 5;
          
          ctx.beginPath();
          ctx.moveTo(x, rippleY);
          ctx.lineTo(x + rippleLength, rippleY);
          ctx.strokeStyle = 'rgba(232, 190, 120, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };
    
    // Функция рисования водорослей
    const drawSeaweeds = (ctx: CanvasRenderingContext2D, time: number) => {
      seaweedsRef.current.forEach(seaweed => {
        const { x, height, width, segments, color, phase, speed } = seaweed;
        
        // Основание водоросли
        const baseY = canvas.height - (canvas.height * 0.2) + 5;
        
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        
        // Рисуем сегменты водоросли
        const segmentHeight = height / segments;
        
        for (let i = 1; i <= segments; i++) {
          // Волнистое движение, усиливающееся к верхушке водоросли
          const waveOffset = Math.sin(time * speed * 10 + phase) * (i * 2);
          const segmentX = x + waveOffset;
          const segmentY = baseY - i * segmentHeight;
          
          ctx.quadraticCurveTo(
            x + waveOffset * 0.5, baseY - (i - 0.5) * segmentHeight,
            segmentX, segmentY
          );
        }
        
        // Рисуем вторую сторону водоросли
        for (let i = segments; i >= 0; i--) {
          const waveOffset = Math.sin(time * speed * 10 + phase) * (i * 2);
          const segmentX = x + waveOffset + width * 0.5;
          const segmentY = baseY - i * segmentHeight;
          
          ctx.quadraticCurveTo(
            x + waveOffset * 0.5 + width, baseY - (i - 0.5) * segmentHeight,
            segmentX, segmentY
          );
        }
        
        ctx.closePath();
        
        // Градиент для водоросли
        const gradient = ctx.createLinearGradient(x, baseY, x, baseY - height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#AED581'); // Светлее к верхушке
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };
    
    // Функция рисования пузырьков
    const drawBubbles = (ctx: CanvasRenderingContext2D, time: number) => {
      bubblesRef.current.forEach(bubble => {
        // Обновляем положение пузырька
        bubble.y -= bubble.speed;
        
        // Добавляем легкое покачивание
        const wobble = Math.sin(time + bubble.x * 0.1) * 0.5;
        
        // Рисуем пузырек
        ctx.beginPath();
        ctx.arc(bubble.x + wobble, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
        ctx.fill();
        
        // Добавляем блик
        ctx.beginPath();
        ctx.arc(
          bubble.x + wobble - bubble.radius * 0.3, 
          bubble.y - bubble.radius * 0.3, 
          bubble.radius * 0.3, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        
        // Если пузырек вышел за верхнюю границу, перемещаем его вниз
        if (bubble.y < -bubble.radius) {
          bubble.y = canvas.height + bubble.radius;
          bubble.x = Math.random() * canvas.width;
        }
      });
    };
    
    // Функция рисования лучей света
    const drawLightRays = (ctx: CanvasRenderingContext2D, time: number) => {
      lightraysRef.current.forEach(ray => {
        // Обновляем положение луча, создавая эффект волнистого движения
        const x = ray.x + Math.sin(time * ray.speed * 10) * 50;
        
        // Создаем градиент для луча света
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.height);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ray.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Рисуем луч света
        ctx.beginPath();
        ctx.moveTo(x - ray.width/2, 0);
        ctx.lineTo(x + ray.width/2, 0);
        ctx.lineTo(x + ray.width, canvas.height);
        ctx.lineTo(x - ray.width, canvas.height);
        ctx.closePath();
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };
    
    // Новая функция для рисования рыб
    const drawFish = (ctx: CanvasRenderingContext2D, time: number) => {
      fishRef.current.forEach(fish => {
        // Обновляем положение рыбы
        fish.x += fish.speed * fish.direction;
        
        // Создаем колебательное движение вверх-вниз
        const oscillation = Math.sin(time * fish.oscillationSpeed + fish.phase) * fish.oscillationAmplitude;
        const y = fish.y + oscillation;
        
        // Сохраняем текущий контекст
        ctx.save();
        
        // Перемещаем контекст в позицию рыбы
        ctx.translate(fish.x, y);
        
        // Если рыба плывет влево, отражаем ее по горизонтали
        if (fish.direction < 0) {
          ctx.scale(-1, 1);
        }
        
        // Рисуем тело рыбы
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
          fish.size * 0.5, -fish.size * 0.5,
          fish.size, 0
        );
        ctx.quadraticCurveTo(
          fish.size * 0.5, fish.size * 0.5,
          0, 0
        );
        
        // Заполняем тело основным цветом
        ctx.fillStyle = fish.color;
        ctx.fill();
        
        // Рисуем хвост
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-fish.size * 0.5, -fish.size * 0.4);
        ctx.lineTo(-fish.size * 0.5, fish.size * 0.4);
        ctx.closePath();
        
        // Заполняем хвост немного другим оттенком
        ctx.fillStyle = fish.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        
        // Рисуем глаз
        ctx.beginPath();
        ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 1;
        ctx.fill();
        
        // Рисуем блик в глазу
        ctx.beginPath();
        ctx.arc(fish.size * 0.7 + fish.size * 0.02, -fish.size * 0.12, fish.size * 0.03, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        // Восстанавливаем контекст
        ctx.restore();
        
        // Если рыба ушла за границу экрана, возвращаем ее с другой стороны
        if ((fish.direction > 0 && fish.x > canvas.width + fish.size) || 
            (fish.direction < 0 && fish.x < -fish.size)) {
          // Меняем направление движения
          fish.direction *= -1;
          // Перемещаем на противоположную сторону
          fish.x = fish.direction > 0 ? -fish.size : canvas.width + fish.size;
          // Даем новую случайную высоту
          fish.y = 50 + Math.random() * (canvas.height * 0.6);
        }
      });
    };
    
    // Новая функция для рисования сокровищ
    const drawTreasures = (ctx: CanvasRenderingContext2D, time: number) => {
      treasureRef.current.forEach(treasure => {
        ctx.save();
        
        // Перемещаем в позицию сокровища
        ctx.translate(treasure.x, treasure.y);
        
        // Применяем небольшой наклон для эффекта объема
        ctx.rotate(treasure.rotation);
        
        // Рисуем разные типы сокровищ
        switch(treasure.type) {
          case 'chest':
            // Рисуем сундук с сокровищами
            
            // Основа сундука
            ctx.beginPath();
            ctx.rect(-treasure.size/2, -treasure.size/2, treasure.size, treasure.size * 0.7);
            ctx.fillStyle = '#8D6E63'; // Коричневый цвет сундука
            ctx.fill();
            ctx.strokeStyle = '#5D4037'; // Темно-коричневый контур
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Верхушка сундука
            ctx.beginPath();
            ctx.moveTo(-treasure.size/2, -treasure.size/2);
            ctx.lineTo(treasure.size/2, -treasure.size/2);
            ctx.lineTo(treasure.size/2, -treasure.size/2 - treasure.size * 0.3);
            ctx.lineTo(-treasure.size/2, -treasure.size/2 - treasure.size * 0.3);
            ctx.closePath();
            ctx.fillStyle = '#A1887F'; // Более светлый коричневый
            ctx.fill();
            ctx.stroke();
            
            // Замок
            ctx.beginPath();
            ctx.rect(-treasure.size * 0.1, -treasure.size/2 - treasure.size * 0.15, treasure.size * 0.2, treasure.size * 0.2);
            ctx.fillStyle = '#FFD54F'; // Золотой
            ctx.fill();
            
            // Эффект свечения от сундука
            ctx.beginPath();
            ctx.arc(0, -treasure.size * 0.2, treasure.size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 213, 79, ${0.1 + Math.sin(time * 2) * 0.05 * treasure.glowIntensity})`;
            ctx.fill();
            
            break;
            
          case 'coin':
            // Рисуем золотую монету
            ctx.beginPath();
            ctx.arc(0, 0, treasure.size, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700'; // Золотой цвет
            ctx.fill();
            ctx.strokeStyle = '#FFA000'; // Контур
            ctx.lineWidth = treasure.size * 0.1;
            ctx.stroke();
            
            // Деталь на монете
            ctx.beginPath();
            ctx.arc(0, 0, treasure.size * 0.6, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFA000';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Свечение вокруг монеты
            ctx.beginPath();
            ctx.arc(0, 0, treasure.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${0.05 + Math.sin(time * 3) * 0.05 * treasure.glowIntensity})`;
            ctx.fill();
            
            break;
            
          case 'pearl':
            // Рисуем жемчужину
            ctx.beginPath();
            ctx.arc(0, 0, treasure.size, 0, Math.PI * 2);
            const pearlGradient = ctx.createRadialGradient(
              -treasure.size * 0.3, -treasure.size * 0.3, 0,
              0, 0, treasure.size
            );
            pearlGradient.addColorStop(0, '#FFFFFF');
            pearlGradient.addColorStop(0.5, '#E0E0E0');
            pearlGradient.addColorStop(1, '#BDBDBD');
            ctx.fillStyle = pearlGradient;
            ctx.fill();
            
            // Блик на жемчужине
            ctx.beginPath();
            ctx.arc(-treasure.size * 0.3, -treasure.size * 0.3, treasure.size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            // Свечение вокруг жемчужины
            ctx.beginPath();
            ctx.arc(0, 0, treasure.size * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 224, 224, ${0.07 + Math.sin(time * 2.5) * 0.04 * treasure.glowIntensity})`;
            ctx.fill();
            
            break;
        }
        
        // Легкое движение для сокровищ на основе синуса
        treasure.rotation += Math.sin(time * 0.5) * 0.001;
        
        ctx.restore();
      });
    };
    
    // Запуск анимации
    requestRef.current = requestAnimationFrame(animate);
    
    // Очистка при размонтировании
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, sandColor, waterColor, bubbleColor, seaweedColors, showFish, showTreasure]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${className}`}
    />
  );
};

export default SeabedBackground; 