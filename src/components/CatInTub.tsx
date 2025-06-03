import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import Leaderboard from './Leaderboard';
import UsernameModal from './UsernameModal';

const CatInTub = () => {
  const [seconds, setSeconds] = useState(0);
  const [startTime] = useState(Date.now());
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // Check if username exists in localStorage
    const savedUsername = localStorage.getItem('catInTubUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setShowUsernameModal(true);
    }
  }, []);

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

  // Enhanced auto-save to shared global leaderboard every 5 seconds
  useEffect(() => {
    if (!username || seconds === 0) return;

    const autoSaveInterval = setInterval(() => {
      const entry = {
        id: `${username}-${Date.now()}`,
        name: username,
        time: seconds,
        date: new Date().toLocaleDateString()
      };

      // Get existing entries from global shared storage
      const savedEntries = localStorage.getItem('globalCatInTubLeaderboard');
      let entries = savedEntries ? JSON.parse(savedEntries) : [];
      
      // Update existing entry for this user or add new one
      const existingIndex = entries.findIndex((e: any) => e.name === username);
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }

      // Sort by time (highest first) and keep top 2000
      const sortedEntries = entries
        .sort((a: any, b: any) => b.time - a.time)
        .slice(0, 2000);

      localStorage.setItem('globalCatInTubLeaderboard', JSON.stringify(sortedEntries));
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval);
  }, [seconds, username]);

  const getRankingMessage = (totalSeconds: number) => {
    if (totalSeconds < 30) {
      return "The cat notices you honoring...";
    } else if (totalSeconds < 120) {
      return "You're gaining the cat's respect";
    } else if (totalSeconds < 300) {
      return "The cat feels honored by your presence";
    } else if (totalSeconds < 600) {
      return "You're becoming a trusted presence";
    } else if (totalSeconds < 1200) {
      return "The cat considers you a devoted friend";
    } else if (totalSeconds < 1800) {
      return "You're now a faithful companion";
    } else if (totalSeconds < 3600) {
      return "The cat truly trusts your honor";
    } else if (totalSeconds < 7200) {
      return "You've become the cat's honored guardian";
    } else if (totalSeconds < 14400) {
      return "A bond of honor beyond words has formed";
    } else {
      return "You and the cat share an eternal honored connection";
    }
  };

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('catInTubUsername', newUsername);
    setShowUsernameModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-slate-200"></div>
          ))}
        </div>
      </div>

      {/* Leaderboard button with enhanced animation */}
      <Button
        onClick={() => setShowLeaderboard(true)}
        className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        size="lg"
      >
        <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
        Leaderboard
      </Button>

      {/* Cat image with parallax effect */}
      <div className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.15}px, ${(mousePosition.y - 50) * 0.15}px) scale(1.05)`,
            transformOrigin: 'center center'
          }}
        >
          <img 
            src="https://www.rover.com/blog/wp-content/uploads/iStock-154918525-min-960x540.jpg"
            alt="A peaceful cat in a bathtub"
            className="w-full h-full object-cover brightness-105 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white/40 rounded-full animate-bounce`}
              style={{
                top: `${25 + (i * 12)}%`,
                left: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2.5 + (i * 0.4)}s`
              }}
            ></div>
          ))}
        </div>

        {/* Title */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-3 tracking-wide"
              style={{
                textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 1px 1px 0px #000'
              }}>
            Cat in a Tub
          </h1>
        </div>

        {/* Clean timer without background - white text with black outline */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-light text-white mb-4 tracking-wider"
                 style={{
                   textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 1px 1px 0px #000'
                 }}>
              {seconds}s
            </div>
            
            <p className="text-white text-base font-light max-w-md mx-auto"
               style={{
                 textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
               }}>
              {getRankingMessage(seconds)}
            </p>
          </div>
        </div>

        {/* Subtle water effect */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-200/30 to-transparent pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`absolute bottom-0 bg-blue-300/20 rounded-full animate-pulse`}
              style={{
                left: `${15 + (i * 30)}%`,
                width: `${40 + (i * 15)}px`,
                height: `${6 + (i * 2)}px`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${4 + (i * 0.8)}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <UsernameModal
          isOpen={showUsernameModal}
          onSubmit={handleUsernameSubmit}
        />
      )}

      {/* Leaderboard Modal with enhanced animations */}
      {showLeaderboard && (
        <Leaderboard
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          currentUser={username}
        />
      )}
    </div>
  );
};

export default CatInTub;
