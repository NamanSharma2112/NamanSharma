"use client";

import { useEffect, useState } from "react";
import { ControlCenterIcon, WifiIcon, BatteryIcon, SearchIcon, AppleIcon } from "./icons";
import WeatherWidget from "./WeatherWidget";

export function DesktopMenuBar() {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: "Tue Aug 11  2:41 PM"
      const datePart = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const timePart = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTimeString(`${datePart}  ${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[28px] z-[60] flex items-center justify-between px-3 text-[13px] font-medium text-white/90 bg-black/20 backdrop-blur-xl border-b border-white/10 select-none">
      <div className="flex items-center gap-2 h-full">
        {/* Apple-like logo / Brand */}
        <div className="flex items-center justify-center font-bold tracking-tight text-white hover:bg-white/20 px-2 h-full cursor-pointer transition-colors">
          NS
        </div>
        <div className="hidden sm:flex items-center h-full">
          <span className="font-bold hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">Naman Sharma</span>
          <span className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">File</span>
          <span className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">Edit</span>
          <span className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">View</span>
          <span className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">Go</span>
          <span className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">Window</span>
          <span className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors">Help</span>
        </div>
      </div>
      
      <div className="flex items-center h-full">
        {/* Control center icons */}
        <div className="flex items-center gap-4 px-3 h-full opacity-80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        
        <div className="relative h-full group flex items-center">
          <div className="hover:bg-white/20 px-3 h-full flex items-center cursor-pointer transition-colors whitespace-pre tabular-nums tracking-tight">
            {timeString || "..."}
          </div>
          
          <div className="absolute top-full right-2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
