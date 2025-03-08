
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Coins,
  Pickaxe,
  Zap,
  Bot,
  Sparkles,
  Star,
  Rocket
} from "lucide-react";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  level: number;
  effect: (level: number) => number;
  onPurchase: () => void;
}

const CoinClicker = () => {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('coins');
    return saved ? parseFloat(saved) : 0;
  });
  const [clickValue, setClickValue] = useState(1);
  const [autoCoins, setAutoCoins] = useState(0);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; id: number }[]>([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    localStorage.setItem('coins', String(coins));
  }, [coins]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + autoCoins);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoCoins]);

  const handleClick = (e: React.MouseEvent) => {
    const newEffect = { x: e.clientX, y: e.clientY, id: Date.now() };
    setClickEffect(prev => [...prev, newEffect]);
    setCoins(prev => prev + clickValue);
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    setTimeout(() => setClickEffect(prev => prev.filter(effect => effect.id !== newEffect.id)), 1000);
  };

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "pickaxe",
      name: "Золотая лопата",
      description: "Увеличивает монеты за клик",
      icon: <Pickaxe className="w-6 h-6 text-orange-500" />,
      cost: 10,
      level: 0,
      effect: (level) => level + 1,
      onPurchase: () => {
        const upgrade = upgrades.find(u => u.id === "pickaxe")!;
        if (coins >= upgrade.cost) {
          setCoins(prev => prev - upgrade.cost);
          setClickValue(prev => prev + 1);
          setUpgrades(prev =>
            prev.map(u =>
              u.id === "pickaxe" ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.5) } : u
            )
          );
        }
      }
    },
    {
      id: "miner",
      name: "Монетный автомат",
      description: "Добывает монеты автоматически",
      icon: <Bot className="w-6 h-6 text-orange-500" />,
      cost: 50,
      level: 0,
      effect: (level) => level * 0.5,
      onPurchase: () => {
        const upgrade = upgrades.find(u => u.id === "miner")!;
        if (coins >= upgrade.cost) {
          setCoins(prev => prev - upgrade.cost);
          setAutoCoins(prev => prev + 0.5);
          setUpgrades(prev =>
            prev.map(u =>
              u.id === "miner" ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.5) } : u
            )
          );
        }
      }
    },
    {
      id: "energy",
      name: "Денежная энергия",
      description: "Удваивает доход за клик",
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      cost: 100,
      level: 0,
      effect: (level) => Math.pow(2, level),
      onPurchase: () => {
        const upgrade = upgrades.find(u => u.id === "energy")!;
        if (coins >= upgrade.cost) {
          setCoins(prev => prev - upgrade.cost);
          setClickValue(prev => prev * 2);
          setUpgrades(prev =>
            prev.map(u =>
              u.id === "energy" ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 2) } : u
            )
          );
        }
      }
    },
    {
      id: "magic",
      name: "Магия монет",
      description: "Увеличивает автодобычу",
      icon: <Sparkles className="w-6 h-6 text-orange-500" />,
      cost: 200,
      level: 0,
      effect: (level) => level * 1,
      onPurchase: () => {
        const upgrade = upgrades.find(u => u.id === "magic")!;
        if (coins >= upgrade.cost) {
          setCoins(prev => prev - upgrade.cost);
          setAutoCoins(prev => prev + 1);
          setUpgrades(prev =>
            prev.map(u =>
              u.id === "magic" ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 2) } : u
            )
          );
        }
      }
    }
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-6 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Заголовок */}
        <h1 className="text-4xl font-bold text-center text-orange-500">Coin Clicker</h1>

        {/* Основной кликер */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <button
              onClick={handleClick}
              className={`relative group ${flash ? 'animate-bounce' : ''}`}
            >
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors" />
              <Coins className="w-32 h-32 text-orange-500 relative z-10 transform transition-all duration-200 group-hover:scale-110 group-hover:rotate-12" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-orange-500 text-4xl">$</span>
            <span className="text-4xl font-bold">{coins.toLocaleString()}</span>
          </div>
          <p className="text-gray-400">Монет за клик: {clickValue} | Автодобыча: {autoCoins}/с</p>
          {/* Эффект клика */}
          {clickEffect.map(effect => (
            <span
              key={effect.id}
              className="absolute text-orange-400 text-lg animate-rise"
              style={{ left: effect.x, top: effect.y }}
            >
              +{clickValue}
            </span>
          ))}
        </div>

        {/* Улучшения */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className="bg-[#1a1a1a] rounded-lg p-4 border border-orange-500/20 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {upgrade.icon}
                <h3 className="font-bold text-orange-400">{upgrade.name}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-2">{upgrade.description}</p>
              <p className="text-sm text-gray-500">Уровень: {upgrade.level}</p>
              <p className="text-sm text-gray-500">Стоимость: {upgrade.cost.toLocaleString()} $</p>
              <Button
                onClick={upgrade.onPurchase}
                disabled={coins < upgrade.cost}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Купить
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinClicker;
