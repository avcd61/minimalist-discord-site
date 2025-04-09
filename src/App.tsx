import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { MusicPlayerProvider } from "@/hooks/use-music-player";
import { Navigation } from "@/components/Navigation";
import MusicPlayer from "@/components/MusicPlayer";
import Index from "./pages/Index";
import About from "./pages/About";
import Rules from "./pages/Rules";
import BL from "./pages/BL";
import Projects from "./pages/Projects";
import FL from "./pages/FL";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <MusicPlayerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/bl" element={<BL />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/fl" element={<FL />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <MusicPlayer />
        </BrowserRouter>
      </TooltipProvider>
    </MusicPlayerProvider>
  </ThemeProvider>
);

export default App;
