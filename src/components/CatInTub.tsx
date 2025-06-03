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
          id: `${username}-${Date.now()}`,
          name: username,
          time: seconds,
          date: new Date().toLocaleDateString()
        };

        // Simulate multiplayer by adding random entries occasionally
        const savedEntries = localStorage.getItem('catInTubLeaderboard');
        let entries = savedEntries ? JSON.parse(savedEntries) : [];
        
        // Add some simulated users to make it feel multiplayer
        if (Math.random() < 0.3 && entries.length < 1000) {
          const randomUsers = ['CatLover42', 'TubGuardian', 'FelineWatcher', 'BathTimeHero', 'WhiskerSentry', 'PurrProtector', 'AquaCat', 'SoapyPaws', 'BubbleKnight', 'SplashGuard'];
          const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
          const randomTime = Math.floor(Math.random() * 86400) + 60; // Random time between 1 minute and 24 hours
          
          entries.push({
            id: `sim-${randomUser}-${Date.now()}`,
            name: `${randomUser}${Math.floor(Math.random() * 999)}`,
            time: randomTime,
            date: new Date().toLocaleDateString()
          });
        }
        
        // Update existing entry for this user or add new one
        const existingIndex = entries.findIndex((e: any) => e.name === username);
        if (existingIndex >= 0) {
          entries[existingIndex] = entry;
        } else {
          entries.push(entry);
        }

        // Sort and keep top 1000
        const sortedEntries = entries
          .sort((a: any, b: any) => b.time - a.time)
          .slice(0, 1000);

        localStorage.setItem('catInTubLeaderboard', JSON.stringify(sortedEntries));
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSaveInterval);
  }, [seconds, username]);

  const getRankingMessage = (totalSeconds: number) => {
    if (totalSeconds < 300) {
      return "The cat notices you watching...";
    } else if (totalSeconds < 1800) {
      return "You're gaining the cat's attention";
    } else if (totalSeconds < 3600) {
      return "The cat seems comfortable with you";
    } else if (totalSeconds < 7200) {
      return "You're becoming a trusted presence";
    } else if (totalSeconds < 14400) {
      return "The cat considers you a friend";
    } else if (totalSeconds < 28800) {
      return "You're now a devoted companion";
    } else if (totalSeconds < 57600) {
      return "The cat truly trusts you";
    } else if (totalSeconds < 115200) {
      return "You've become the cat's guardian";
    } else if (totalSeconds < 230400) {
      return "A bond beyond words has formed";
    } else {
      return "You and the cat share an eternal connection";
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

      {/* Leaderboard button */}
      <Button
        onClick={() => setShowLeaderboard(true)}
        className="absolute top-6 right-6 z-20 bg-white/80 hover:bg-white/90 text-slate-700 backdrop-blur-md border border-slate-200 shadow-lg"
        size="lg"
      >
        <Trophy className="w-5 h-5 mr-2" />
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
          <h1 className="text-5xl md:text-6xl font-light text-slate-800 mb-3 tracking-wide">
            Cat in a Tub
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-light">
            A moment of pure tranquility
          </p>
        </div>

        {/* Clean timer without background */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-light text-slate-800 mb-4 tracking-wider">
              {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
            </div>
            
            <p className="text-slate-600 text-base font-light max-w-md mx-auto">
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
