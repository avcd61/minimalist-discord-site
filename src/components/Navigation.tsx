
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

export function Navigation() {
  const location = useLocation();
  
  const links = [
    { to: "/", label: "Главная" },
    { to: "/about", label: "О нас" },
    { to: "/projects", label: "Проекты" },
    { to: "/rules", label: "Правила" },
    { to: "/members", label: "Участники" },
    { to: "/bl", label: "BulimPenis", className: "animate-[inferno_2s_ease-in-out_infinite]" },
    { to: "/fl", label: "FL", className: "animate-[purple_4s_linear_infinite]" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <motion.img 
            src="/lovable-uploads/9b80fe8f-d548-4f95-8636-10f8ea75451b.png" 
            alt="Community Logo" 
            className="h-8 w-auto dark:invert"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </Link>
        
        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {links.map(({ to, label, className }) => (
              <li key={to}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                >
                  <Link
                    to={to}
                    className={cn(
                      "text-sm font-medium transition-colors relative",
                      location.pathname === to 
                        ? "text-black dark:text-white after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-current after:bottom-[-4px] after:left-0" 
                        : "text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80",
                      className
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              </li>
            ))}
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
        `}
      </style>
    </header>
  );
}
