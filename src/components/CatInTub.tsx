
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

  // Auto-save every 10 seconds if username exists
  useEffect(() => {
    if (!username) return;

    const autoSaveInterval = setInterval(() => {
      if (seconds > 0) {
        const entry = {
          id: Date.now().toString(),
          name: username,
          time: seconds,
          date: new Date().toLocaleDateString()
        };

        // Save to localStorage (simulating server connection)
        const savedEntries = localStorage.getItem('catInTubLeaderboard');
        const entries = savedEntries ? JSON.parse(savedEntries) : [];
        
        // Update existing entry for this user or add new one
        const existingIndex = entries.findIndex((e: any) => e.name === username);
        if (existingIndex >= 0) {
          entries[existingIndex] = entry;
        } else {
          entries.push(entry);
        }

        const sortedEntries = entries
          .sort((a: any, b: any) => b.time - a.time)
          .slice(0, 20);

        localStorage.setItem('catInTubLeaderboard', JSON.stringify(sortedEntries));
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSaveInterval);
  }, [seconds, username]);

  const getRankingMessage = (totalSeconds: number) => {
    if (totalSeconds < 300) {
      return "The cat senses a new presence...";
    } else if (totalSeconds < 1800) {
      return "The cat acknowledges your existence";
    } else if (totalSeconds < 3600) {
      return "The cat finds your dedication... acceptable";
    } else if (totalSeconds < 7200) {
      return "The cat begins to appreciate your devotion";
    } else if (totalSeconds < 14400) {
      return "The cat grants you the title of 'Casual Observer'";
    } else if (totalSeconds < 28800) {
      return "The cat deems you a 'Faithful Watcher'";
    } else if (totalSeconds < 57600) {
      return "The cat honors you as a 'Devoted Guardian'";
    } else if (totalSeconds < 115200) {
      return "The cat bestows upon you 'Sacred Protector' status";
    } else if (totalSeconds < 230400) {
      return "The cat recognizes you as 'Ancient Keeper of the Tub'";
    } else {
      return "You have achieved ultimate enlightenment: 'Eternal Servant of the Bathing Feline'";
    }
  };

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('catInTubUsername', newUsername);
    setShowUsernameModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-cyan-50 to-blue-200 relative overflow-hidden">
      {/* Enhanced bathroom tiles background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-24 grid-rows-24 w-full h-full">
          {Array.from({ length: 576 }).map((_, i) => (
            <div key={i} className="border border-blue-300 bg-white/20"></div>
          ))}
        </div>
      </div>

      {/* Leaderboard button */}
      <Button
        onClick={() => setShowLeaderboard(true)}
        className="absolute top-6 right-6 z-20 bg-cyan-800/90 hover:bg-cyan-700 text-white backdrop-blur-md border border-cyan-400/30 shadow-2xl"
        size="lg"
      >
        <Trophy className="w-5 h-5 mr-2" />
        Leaderboard
      </Button>

      {/* Enhanced full screen cat image with better mouse tracking */}
      <div className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.15}px, ${(mousePosition.y - 50) * 0.15}px) scale(1.05)`,
            transformOrigin: 'center center'
          }}
        >
          <img 
            src="https://www.rover.com/blog/wp-content/uploads/iStock-154918525-min-960x540.jpg"
            alt="A serene cat enjoying a peaceful moment in a bathtub"
            className="w-full h-full object-cover filter brightness-110 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 via-transparent to-blue-200/20"></div>
        </div>

        {/* Floating water bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-cyan-100/60 rounded-full animate-bounce shadow-lg`}
              style={{
                top: `${20 + (i * 10)}%`,
                left: `${15 + (i * 8)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i * 0.3)}s`
              }}
            ></div>
          ))}
        </div>

        {/* Title overlay */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-cyan-900 mb-4 tracking-tight drop-shadow-2xl">
            Cat in a Tub
          </h1>
          <p className="text-xl md:text-2xl text-cyan-800 font-light drop-shadow-lg">
            A sacred moment of feline tranquility
          </p>
        </div>

        {/* Simplified timer - just seconds, bigger, no background */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-cyan-900 mb-4 drop-shadow-lg">
              Honoring Time
            </h2>
            
            <div className="text-8xl md:text-9xl font-mono font-bold text-cyan-900 mb-4 tracking-wider drop-shadow-2xl">
              {seconds}s
            </div>
            
            <p className="text-cyan-800 text-lg font-medium drop-shadow-lg max-w-md mx-auto">
              {getRankingMessage(seconds)}
            </p>
          </div>
        </div>

        {/* Water ripple effects */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-cyan-300/40 to-transparent pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`absolute bottom-0 bg-cyan-200/50 rounded-full animate-pulse`}
              style={{
                left: `${10 + (i * 20)}%`,
                width: `${60 + (i * 10)}px`,
                height: `${8 + (i * 2)}px`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + (i * 0.5)}s`
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

      {/* Leaderboard Modal */}
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
