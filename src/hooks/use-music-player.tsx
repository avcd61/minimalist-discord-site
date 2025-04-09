import { createContext, useContext, useState } from "react";

interface MusicPlayerProviderState {
  isMusicEnabled: boolean;
  toggleMusic: () => void;
  enableMusic: () => void;
  disableMusic: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerProviderState | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(true);

  const toggleMusic = () => {
    setIsMusicEnabled((prev) => !prev);
  };

  const enableMusic = () => {
    setIsMusicEnabled(true);
  };

  const disableMusic = () => {
    setIsMusicEnabled(false);
  };

  return (
    <MusicPlayerContext.Provider value={{ isMusicEnabled, toggleMusic, enableMusic, disableMusic }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
} 