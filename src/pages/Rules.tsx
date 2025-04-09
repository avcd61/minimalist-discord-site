import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, Flame, MessageSquare, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Rules = () => {
  const [expanded, setExpanded] = useState(null);

  const rules = [
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-400" />,
      title: "Живите дружно",
      description:
        "Старайтесь избегать конфликтов, а если они возникают — решайте их мирно. Не стесняйтесь общаться!",
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
      borderColor: "border-blue-400/30"
    },
    {
      icon: <Flame className="h-6 w-6 text-orange-400" />,
      title: "Споры решаются честно",
      description:
        "Любые разногласия устраняются в честном поединке в Roblox 1 на 1 в любом режиме.",
      gradient: "from-orange-500/20 via-orange-400/10 to-transparent",
      borderColor: "border-orange-400/30"
    },
    {
      icon: <Book className="h-6 w-6 text-green-400" />,
      title: "Мат разрешён",
      description:
        "Можна матюкатся пока мама не видит.",
      gradient: "from-green-500/20 via-green-400/10 to-transparent",
      borderColor: "border-green-400/30"
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
      title: "Порно запрещено",
      description: "Никаких NSFW-каналов. Держим братух в рамках приличия.",
      gradient: "from-red-500/20 via-red-400/10 to-transparent",
      borderColor: "border-red-400/30"
    },
  ];

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="min-h-screen container max-w-4xl py-24 space-y-12">
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mb-2">
          <Book className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-montserrat font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
          Правила сервера
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Ознакомьтесь с основными правилами нашего сервера.
          Соблюдение этих правил заставляет Андрея пукать звонко.
        </p>
      </motion.div>

      <div className="grid gap-6">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="will-change-transform"
          >
            <Card
              className={`p-0 overflow-hidden border ${rule.borderColor} bg-gradient-to-r ${rule.gradient} hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => handleToggle(index)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-3 bg-background/80 shadow-sm flex items-center justify-center">
                    {rule.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-montserrat font-semibold text-lg">
                        {rule.title}
                      </h3>
                      <motion.div
                        animate={{ rotate: expanded === index ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-6 w-6 flex items-center justify-center rounded-full bg-muted/50"
                      >
                        <X className="h-4 w-4" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {expanded === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-muted-foreground leading-relaxed">
                            {rule.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
  className="text-center mt-8"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.6 }}
>
  <Button 
    variant="secondary" 
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
    onClick={() => window.open('https://youtu.be/1A_QYQmbPY0', '_blank')}
  >
    Принять 95
  </Button>
</motion.div>

      {/* Background decorations */}
      <div className="fixed -z-10 top-[20%] left-[10%] w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="fixed -z-10 bottom-[20%] right-[10%] w-60 h-60 bg-pink-500/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Rules;
