
import React, { useState, useEffect } from 'react';

const CatInTub = () => {
  const [seconds, setSeconds] = useState(0);
  const [startTime] = useState(Date.now());
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getRankingMessage = (totalSeconds: number) => {
    if (totalSeconds < 30) {
      return "The cat senses a new presence...";
    } else if (totalSeconds < 120) {
      return "The cat acknowledges your existence";
    } else if (totalSeconds < 300) {
      return "The cat finds your dedication... acceptable";
    } else if (totalSeconds < 600) {
      return "The cat begins to appreciate your devotion";
    } else if (totalSeconds < 1200) {
      return "The cat grants you the title of 'Casual Observer'";
    } else if (totalSeconds < 1800) {
      return "The cat deems you a 'Faithful Watcher'";
    } else if (totalSeconds < 3600) {
      return "The cat honors you as a 'Devoted Guardian'";
    } else if (totalSeconds < 7200) {
      return "The cat bestows upon you 'Sacred Protector' status";
    } else if (totalSeconds < 14400) {
      return "The cat recognizes you as 'Ancient Keeper of the Tub'";
    } else {
      return "You have achieved ultimate enlightenment: 'Eternal Servant of the Bathing Feline'";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
      {/* Background bathroom tiles effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-blue-200"></div>
          ))}
        </div>
      </div>

      {/* Main cat image - full screen */}
      <div className="relative w-full h-screen">
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
          }}
        >
          <img 
            src="https://www.rover.com/blog/wp-content/uploads/iStock-154918525-min-960x540.jpg"
            alt="A serene cat enjoying a peaceful moment in a bathtub"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-amber-200/20"></div>
        </div>

        {/* Floating bubbles - more bathroom-like */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/40 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-100/50 rounded-full animate-bounce delay-75 shadow-md"></div>
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-white/30 rounded-full animate-pulse delay-150 shadow-lg"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-100/60 rounded-full animate-bounce delay-300 shadow-sm"></div>
          <div className="absolute bottom-1/4 right-1/5 w-3 h-3 bg-white/35 rounded-full animate-pulse delay-500 shadow-md"></div>
        </div>

        {/* Title overlay */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-2 tracking-tight drop-shadow-2xl">
            Cat in a Tub
          </h1>
          <p className="text-lg md:text-xl text-amber-800 font-light drop-shadow-lg">
            A sacred moment of feline tranquility
          </p>
        </div>

        {/* Timer overlay - bottom center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-amber-200/50">
            <h2 className="text-xl md:text-2xl font-semibold text-amber-900 mb-3 text-center">
              Time Honoring the Sacred Cat
            </h2>
            
            <div className="text-3xl md:text-5xl font-mono font-bold text-amber-900 mb-3 tracking-wider text-center">
              {formatTime(seconds)}
            </div>
            
            <p className="text-amber-700 text-base font-light text-center leading-relaxed">
              {getRankingMessage(seconds)}
            </p>
          </div>
        </div>

        {/* Water ripple effects */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-200/30 to-transparent pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-20 h-3 bg-cyan-200/40 rounded-full animate-pulse delay-200"></div>
          <div className="absolute bottom-2 right-1/3 w-16 h-2 bg-blue-200/50 rounded-full animate-pulse delay-700"></div>
        </div>
      </div>
    </div>
  );
};

export default CatInTub;
