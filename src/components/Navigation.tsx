import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const location = useLocation();
  
  const links = [
    { to: "/", label: "Главная" },
    { to: "/about", label: "О нас" },
    { to: "/projects", label: "Проекты" },
    { to: "/rules", label: "Правила" },
    { to: "/bl", label: "BulimPenis", className: "animate-[inferno_2s_ease-in-out_infinite]" },
    { to: "/fl", label: "FL", className: "animate-[purple_4s_linear_infinite]" },
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
    >
      <nav className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <motion.img 
            src="/lovable-uploads/9b80fe8f-d548-4f95-8636-10f8ea75451b.png" 
            alt="Community Logo" 
            className="h-8 w-auto dark:invert"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-6">
            {links.map(({ to, label, className }) => {
              const isActive = location.pathname === to;
              
              return (
                <li key={to}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                  >
                    <Link
                      to={to}
                      className={cn(
                        "text-sm font-medium transition-colors relative px-2 py-1 rounded-md",
                        isActive 
                          ? "text-black dark:text-white" 
                          : "text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80",
                        className
                      )}
                    >
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-md -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", damping: 20 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <style>
        {`
          @keyframes inferno {
            0% { 
              color: #ff1a1a; 
              text-shadow: 0 0 5px #ff1a1a, 0 0 15px #ff4500, 0 0 25px #ff4500; 
            }
            50% { 
              color: #ff4500; 
              text-shadow: 0 0 10px #ff4500, 0 0 20px #ff1a1a, 0 0 35px #ff1a1a, 0 0 40px #ff4500; 
            }
            100% { 
              color: #ff1a1a; 
              text-shadow: 0 0 5px #ff1a1a, 0 0 15px #ff4500, 0 0 25px #ff4500; 
            }
          }
          @keyframes purple {
            0% { 
              color: #9333EA; 
              text-shadow: 0 0 5px #9333EA, 0 0 10px #9333EA; 
            }
            50% { 
              color: #7C3AED; 
              text-shadow: 0 0 10px #7C3AED, 0 0 20px #7C3AED, 0 0 30px #7C3AED; 
            }
            100% { 
              color: #9333EA; 
              text-shadow: 0 0 5px #9333EA, 0 0 10px #9333EA; 
            }
          }
          @keyframes ascii {
            0% { 
              color: #FFFFFF; 
              text-shadow: 0 0 5px #FFFFFF, 0 0 10px #000000; 
            }
            50% { 
              color: #000000; 
              text-shadow: 0 0 10px #000000, 0 0 20px #FFFFFF; 
            }
            100% { 
              color: #FFFFFF; 
              text-shadow: 0 0 5px #FFFFFF, 0 0 10px #000000; 
            }
          }
        `}
      </style>
    </motion.header>
  );
}
