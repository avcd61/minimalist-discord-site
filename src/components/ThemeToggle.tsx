import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Варианты анимации для иконок
  const iconVariants = {
    initial: { opacity: 0, rotate: -180, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 180, scale: 0.5 }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full bg-background hover:bg-accent transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SunIcon className="h-5 w-5 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MoonIcon className="h-5 w-5 text-indigo-400" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Фоновая анимация */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {theme === "light" ? (
            <motion.div
              key="sun-bg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-amber-300 rounded-full"
            />
          ) : (
            <motion.div
              key="moon-bg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-indigo-500 rounded-full"
            />
          )}
        </AnimatePresence>
      </div>
      
      <span className="sr-only">Переключить тему</span>
    </Button>
  );
}
