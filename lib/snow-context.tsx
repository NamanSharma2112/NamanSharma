"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SnowContextType = {
  isSnowing: boolean;
  toggleSnow: () => void;
};

const SnowContext = createContext<SnowContextType | undefined>(undefined);

export function SnowProvider({ children }: { children: React.ReactNode }) {
  const [isSnowing, setIsSnowing] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("festive-mode");
    if (saved !== null) {
      setIsSnowing(saved === "true");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("festive-mode", isSnowing.toString());
    }
  }, [isSnowing, mounted]);

  const toggleSnow = () => setIsSnowing((prev) => !prev);

  // Avoid hydration mismatch by not rendering anything until mounted
  // or providing a default state. We'll provide the provider but 
  // components using it should handle the 'isSnowing' state carefully.
  return (
    <SnowContext.Provider value={{ isSnowing, toggleSnow }}>
      {children}
    </SnowContext.Provider>
  );
}

export function useSnow() {
  const context = useContext(SnowContext);
  if (context === undefined) {
    throw new Error("useSnow must be used within a SnowProvider");
  }
  return context;
}
