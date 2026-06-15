"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";
import { playTap } from "@/lib/sounds";

export default function TextToSpeech({
  title,
  contentSections,
  isDark
}: {
  title: string;
  contentSections: { heading: string; paragraphs: string[] }[];
  isDark: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      
      // Stop any existing speech when component mounts or unmounts
      window.speechSynthesis.cancel();
      
      return () => {
        window.speechSynthesis.cancel();
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  const handlePlayPause = () => {
    playTap();
    
    if (!("speechSynthesis" in window)) return;

    // If currently playing, pause it
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    // If currently paused, resume it
    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // If not playing at all, start fresh
    // Construct the full text to read
    const fullText = [
      title,
      ...contentSections.map(section => 
        `${section.heading}. ${section.paragraphs.join(" ")}`
      )
    ].join(". ");

    const utterance = new SpeechSynthesisUtterance(fullText);
    
    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes("en") && v.name.includes("Google")) 
      || voices.find(v => v.lang.includes("en-US")) 
      || voices[0];
      
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.95; // Slightly slower for better comprehension
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    playTap();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={handlePlayPause}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
          isDark 
            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" 
            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
        }`}
      >
        {isPlaying && !isPaused ? (
          <Pause size={14} className={isDark ? "text-amber-400" : "text-blue-600"} />
        ) : (
          <Volume2 size={14} className={isDark ? "text-amber-400" : "text-blue-600"} />
        )}
        <span>{isPlaying && !isPaused ? "Pause Audio" : "Listen to Article"}</span>
      </button>

      {isPlaying && (
        <button
          onClick={handleStop}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-95 ${
            isDark 
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400" 
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-500"
          }`}
          title="Stop reading"
        >
          <Square size={12} />
        </button>
      )}
      
      {isPlaying && !isPaused && (
        <div className="flex items-end gap-0.5 h-3 ml-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`w-1 rounded-full animate-pulse ${isDark ? "bg-amber-400/60" : "bg-blue-600/60"}`}
              style={{ 
                height: `${Math.random() * 60 + 40}%`,
                animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
