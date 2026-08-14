"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudDrizzle, CloudLightning, Sunset, CloudFog, CloudSnow } from "lucide-react";

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const getWeatherDetails = (code: number) => {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code === 1 || code === 2) return { label: "Partly Cloudy", Icon: Cloud };
  if (code === 3) return { label: "Cloudy", Icon: Cloud };
  if (code >= 45 && code <= 48) return { label: "Fog", Icon: CloudFog };
  if (code >= 51 && code <= 55) return { label: "Drizzle", Icon: CloudDrizzle };
  if (code >= 61 && code <= 65) return { label: "Rain", Icon: CloudRain };
  if (code >= 71 && code <= 77) return { label: "Snow", Icon: CloudSnow };
  if (code >= 80 && code <= 82) return { label: "Showers", Icon: CloudRain };
  if (code >= 95 && code <= 99) return { label: "Storm", Icon: CloudLightning };
  return { label: "Unknown", Icon: Cloud };
};

export default function WeatherWidget() {
  const [data, setData] = useState<any>(null);
  const [city, setCity] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number, locationName?: string) => {
      try {
        setLoading(true);
        // 1. Get City Name if not provided
        let finalCity = locationName;
        if (!finalCity) {
          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const geoData = await geoRes.json();
            finalCity = geoData.city || geoData.locality || "Current Location";
          } catch (e) {
            finalCity = "Current Location";
          }
        }
        setCity(finalCity!);

        // 2. Fetch Weather Data (Current, Hourly, Daily)
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const wData = await res.json();
        setData(wData);
      } catch (error) {
        console.error("Failed to fetch weather", error);
        setCity("Error");
      } finally {
        setLoading(false);
      }
    };

    const loadJalandhar = () => fetchWeather(31.3260, 75.5762, "Jalandhar");

    // Request Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => loadJalandhar() // Fallback to Jalandhar if denied/failed
      );
    } else {
      loadJalandhar();
    }
  }, []);

  if (loading || !data) {
    return (
      <motion.div drag dragMomentum={false} className="absolute top-12 right-4 hidden sm:flex flex-col items-center justify-center w-[330px] h-[340px] rounded-[28px] bg-black/40 backdrop-blur-[40px] backdrop-saturate-[150%] border border-white/10 text-white z-40">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
      </motion.div>
    );
  }

  const current = data.current_weather;
  const { label: currentLabel, Icon: CurrentIcon } = getWeatherDetails(current.weathercode);
  const todayMax = Math.round(data.daily.temperature_2m_max[0]);
  const todayMin = Math.round(data.daily.temperature_2m_min[0]);

  // Find current hour index to show next 6 hours
  const now = new Date();
  const currentHourString = now.toISOString().slice(0,13) + ":00"; 
  let hourIndex = data.hourly.time.findIndex((t: string) => t >= currentHourString);
  if (hourIndex === -1) hourIndex = 0;
  
  const hourlyData = data.hourly.time.slice(hourIndex, hourIndex + 6).map((t: string, i: number) => {
    const d = new Date(t);
    const timeStr = i === 0 ? "Now" : d.toLocaleTimeString('en-US', { hour: 'numeric' }).replace(' ', '');
    return {
      time: timeStr,
      temp: Math.round(data.hourly.temperature_2m[hourIndex + i]) + "°",
      code: data.hourly.weathercode[hourIndex + i],
      active: i === 0
    };
  });

  // 5 Day Forecast (skip today which is index 0)
  const dailyData = data.daily.time.slice(1, 6).map((t: string, i: number) => {
    const d = new Date(t);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const min = Math.round(data.daily.temperature_2m_min[i + 1]);
    const max = Math.round(data.daily.temperature_2m_max[i + 1]);
    
    // Calculate global weekly min/max to size the range bar perfectly
    const weeklyMin = Math.min(...data.daily.temperature_2m_min.slice(1, 6));
    const weeklyMax = Math.max(...data.daily.temperature_2m_max.slice(1, 6));
    const range = weeklyMax - weeklyMin;
    const startPct = ((min - weeklyMin) / range) * 100;
    const widthPct = ((max - min) / range) * 100;

    return { day: dayStr, min: min + "°", max: max + "°", code: data.daily.weathercode[i + 1], pct: [startPct, startPct + widthPct] };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="hidden sm:flex flex-col w-[330px] rounded-[24px] bg-black/40 backdrop-blur-[40px] backdrop-saturate-[150%] border border-white/10 p-5 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] z-40 select-none font-sans pointer-events-auto"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <span className="text-[17px] font-semibold tracking-tight text-white/95 truncate max-w-[150px]">{city}</span>
          <span className="text-[64px] leading-[1.05] font-extralight tracking-tighter">{Math.round(current.temperature)}&deg;</span>
        </div>
        <div className="flex flex-col items-end gap-1 mt-1">
          <CurrentIcon className="w-6 h-6 text-white/90" fill="currentColor" />
          <span className="text-[14px] font-semibold mt-1">{currentLabel}</span>
          <span className="text-[13px] font-semibold text-white/90 tracking-tight">H:{todayMax}&deg; L:{todayMin}&deg;</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/20 my-3" />

      {/* Hourly Section */}
      <div className="flex justify-between items-center px-1 mb-3">
        {hourlyData.map((h: any, i: number) => {
          const { Icon } = getWeatherDetails(h.code);
          return (
            <div key={i} className="flex flex-col items-center gap-[6px]">
              <span className="text-[12px] font-bold text-white/90 tracking-tight">{h.time}</span>
              <div className="py-1">
                <Icon className="w-[18px] h-[18px] text-white/90" fill={h.active ? "none" : "currentColor"} />
              </div>
              <span className="text-[14px] font-bold tracking-tight">{h.temp}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full h-[1px] bg-white/20 my-3" />

      {/* 5-Day Forecast */}
      <div className="flex flex-col gap-3.5 px-1 mt-1">
        {dailyData.map((d: any, i: number) => {
          const { Icon } = getWeatherDetails(d.code);
          return (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[15px] font-bold tracking-tight w-10">{d.day}</span>
              <Icon className="w-[18px] h-[18px] text-white/90 ml-1" fill="currentColor" />
              <span className="text-[15px] font-bold tracking-tight text-white/70 w-8 text-right">{d.min}</span>
              {/* Range Bar */}
              <div className="flex-1 mx-3.5 h-[5px] rounded-full bg-black/40 overflow-hidden relative">
                <div 
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400"
                  style={{ left: `${d.pct[0]}%`, width: `${d.pct[1]}%` }}
                />
              </div>
              <span className="text-[15px] font-bold tracking-tight w-8 text-right">{d.max}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
