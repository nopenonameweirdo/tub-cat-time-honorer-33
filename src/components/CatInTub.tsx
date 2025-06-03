
import React, { useState, useEffect } from 'react';

const CatInTub = () => {
  const [seconds, setSeconds] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold text-blue-900 mb-8 tracking-tight">
          Cat in a Tub
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-blue-700 mb-12 font-light">
          A peaceful moment of feline serenity
        </p>

        {/* Cat Image */}
        <div className="mb-12 relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
            <img 
              src="https://www.rover.com/blog/wp-content/uploads/iStock-154918525-min-960x540.jpg"
              alt="A serene cat enjoying a peaceful moment in a bathtub"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          
          {/* Floating bubbles animation */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-75"></div>
            <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-4">
            Time spent honoring the Cat in a Tub
          </h2>
          
          <div className="text-4xl md:text-6xl font-mono font-bold text-blue-900 mb-4 tracking-wider">
            {formatTime(seconds)}
          </div>
          
          <p className="text-blue-600 text-lg font-light">
            {seconds < 10 
              ? "Welcome, fellow cat appreciator" 
              : seconds < 60 
              ? "The cat acknowledges your presence" 
              : seconds < 300 
              ? "The cat finds your dedication admirable"
              : "You have achieved true cat enlightenment"
            }
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-blue-500 text-sm">
          <p>✨ May this peaceful cat bring tranquility to your day ✨</p>
        </div>
      </div>
    </div>
  );
};

export default CatInTub;
