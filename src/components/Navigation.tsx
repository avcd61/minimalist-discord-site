import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

// Добавляем глобальные стили для устранения белой полоски
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

export function Navigation() {
  const location = useLocation();
  const isBPPage = location.pathname === "/bl";
  const isHomePage = location.pathname === "/";
  const isRulesPage = location.pathname === "/rules";
  
  const links = [
    { to: "/", label: "Главная" },
    { to: "/about", label: "О нас" },
    { to: "/projects", label: "Проекты" },
    { to: "/rules", label: "Правила" },
    { to: "/bl", label: "BulimPenis" },
    { to: "/fl", label: "FL" },
  ];

  // Определяем цвет фона навигации в зависимости от страницы
  const getNavBackgroundClass = () => {
    if (isBPPage) return "bg-black";
    if (isHomePage) return "bg-gradient-to-r from-summer-coral/40 to-summer-sand/40";
    if (isRulesPage) return "bg-gradient-to-r from-blue-800/60 to-blue-500/40";
    return "bg-gradient-to-r from-summer-sky/40 to-summer-sea/40";
  };

  return (
    <>
      <GlobalStyle />
      <motion.header 
        className={cn(
          "absolute top-0 left-0 right-0 z-50 shadow-md border-b-0 backdrop-blur-md w-full",
          getNavBackgroundClass()
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          damping: 15,
          stiffness: 80
        }}
      >
        <nav className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img 
              src="/lovable-uploads/9b80fe8f-d548-4f95-8636-10f8ea75451b.png" 
              alt="Community Logo Summer" 
              className="h-10 w-auto transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-md"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          </Link>
          
          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-8">
              {links.map(({ to, label }) => {
                const isActive = location.pathname === to;
                
                return (
                  <li key={to}>
                    <motion.div
                      className="relative"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <Link
                        to={to}
                        className={cn(
                          "text-sm font-medium transition-all duration-200 relative px-3 py-2 group",
                          isActive 
                            ? "text-summer-white font-bold" 
                            : "text-summer-text-dark/90 hover:text-summer-white",
                        )}
                      >
                        {label}
                        <span className={cn(
                          "absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-summer-coral to-summer-sand",
                          "scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center",
                          isActive ? "scale-x-100" : ""
                        )} />
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
      </motion.header>
    </>
  );
}
