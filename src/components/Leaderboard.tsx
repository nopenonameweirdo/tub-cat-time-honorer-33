
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, Users, Wifi, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LeaderboardEntry {
  id: string;
  name: string;
  time: number;
  date: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 50;

  useEffect(() => {
    if (isOpen) {
      loadEntries();
      // Simulate live updates every 3 seconds for better real-time feel
      const interval = setInterval(loadEntries, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadEntries = () => {
    // Simulate network connection with 99% uptime
    setIsConnected(Math.random() > 0.01);
    
    // Load from shared simulation storage
    const savedEntries = localStorage.getItem('globalCatInTubLeaderboard');
    let entries = savedEntries ? JSON.parse(savedEntries) : [];
    
    // Enhanced simulation - add more realistic users periodically
    if (Math.random() < 0.25 && entries.length < 2000) {
      const userPool = [
        'CatWhisperer', 'TubGuardian', 'FelineWatcher', 'BathTimeHero', 'WhiskerSentry', 
        'PurrProtector', 'AquaCat', 'SoapyPaws', 'BubbleKnight', 'SplashGuard',
        'WaterCat', 'TubMaster', 'CatSitter', 'FelineHonorer', 'BathBuddy',
        'CatLover', 'TubWatcher', 'SoapGuard', 'BubbleCat', 'AquaHonorer'
      ];
      
      const randomUser = userPool[Math.floor(Math.random() * userPool.length)];
      const randomTime = Math.floor(Math.random() * 10800) + 15; // 15 seconds to 3 hours
      const uniqueId = Math.floor(Math.random() * 10000);
      
      const newEntry = {
        id: `sim-${randomUser}-${uniqueId}-${Date.now()}`,
        name: `${randomUser}${uniqueId}`,
        time: randomTime,
        date: new Date().toLocaleDateString()
      };
      
      entries.push(newEntry);
      
      // Sort and save back
      const sortedEntries = entries
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.time - a.time)
        .slice(0, 2000);
      
      localStorage.setItem('globalCatInTubLeaderboard', JSON.stringify(sortedEntries));
      entries = sortedEntries;
    }
    
    setEntries(entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.time - a.time));
  };

  const formatTime = (totalSeconds: number) => {
    return `${totalSeconds}s`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-cyan-700">{index + 1}</span>;
    }
  };

  const clearLeaderboard = () => {
    setEntries([]);
    localStorage.removeItem('globalCatInTubLeaderboard');
  };

  // Filter entries based on search term
  const filteredEntries = entries.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

  const currentUserEntry = entries.find(entry => entry.name === currentUser);
  const currentUserRank = currentUserEntry ? entries.findIndex(entry => entry.name === currentUser) + 1 : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50/95 to-blue-50/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-3xl animate-scale-in">
        {/* Custom close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full p-2 bg-white/80 hover:bg-white/90 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              Global Honoring Leaderboard
            </div>
            <div className="flex items-center gap-3 text-sm font-normal">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <span className="font-medium">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Current User Stats */}
        {currentUser && currentUserEntry && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl border border-blue-200/50 shadow-sm animate-fade-in">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              Your Honoring Journey
            </h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-white/60 rounded-xl border border-blue-200/30">
                <p className="text-2xl font-bold text-blue-800">#{currentUserRank}</p>
                <p className="text-sm text-blue-600 font-medium">Global Rank</p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl border border-blue-200/30">
                <p className="text-2xl font-bold text-blue-800 font-mono">{formatTime(currentUserEntry.time)}</p>
                <p className="text-sm text-blue-600 font-medium">Best Time</p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl border border-blue-200/30">
                <p className="text-2xl font-bold text-blue-800">{entries.length.toLocaleString()}</p>
                <p className="text-sm text-blue-600 font-medium">Total Honorers</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Search and controls */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search honorers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-200 focus:border-blue-400 rounded-xl bg-white/80 backdrop-blur-sm"
              />
            </div>
            {entries.length > 0 && (
              <Button 
                onClick={clearLeaderboard}
                variant="outline"
                size="lg"
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 rounded-xl px-6"
              >
                Reset Board
              </Button>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-16 text-slate-600 animate-fade-in">
              <div className="p-6 bg-slate-50/80 rounded-3xl inline-block mb-6">
                <Trophy className="w-16 h-16 mx-auto text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No honorers yet</h3>
              <p className="text-lg">Start honoring to become the first!</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200/60 overflow-hidden shadow-xl bg-white/90 backdrop-blur-sm animate-slide-in-right">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-100/80 to-blue-100/80 border-b-2 border-slate-200">
                      <TableHead className="w-20 text-center font-bold text-slate-700 py-4">Rank</TableHead>
                      <TableHead className="font-bold text-slate-700 py-4">Honorer</TableHead>
                      <TableHead className="font-bold text-slate-700 py-4">Time (Seconds)</TableHead>
                      <TableHead className="font-bold text-slate-700 py-4">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEntries.map((entry, index) => {
                      const actualRank = startIndex + index;
                      return (
                        <TableRow 
                          key={entry.id} 
                          className={`hover:bg-blue-50/50 transition-all duration-200 border-b border-slate-100 ${
                            entry.name === currentUser ? 'bg-blue-100/70 border-l-4 border-l-blue-500 shadow-sm' : ''
                          } ${actualRank < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-orange-50/30' : ''}`}
                        >
                          <TableCell className="flex items-center justify-center py-4">
                            {getRankIcon(actualRank)}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-800 py-4">
                            <div className="flex items-center gap-3">
                              <span>{entry.name}</span>
                              {entry.name === currentUser && (
                                <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">You</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xl font-bold text-blue-700 py-4">
                            {formatTime(entry.time)}
                          </TableCell>
                          <TableCell className="text-slate-600 py-4">{entry.date}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-6"
                  >
                    Previous
                  </Button>
                  <span className="text-slate-700 px-4 py-2 bg-slate-100 rounded-xl font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center text-sm text-slate-600 mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50">
          <p className="font-medium text-base mb-1">🐱 Live Global Cat Honoring Network 🐱</p>
          <p className="text-xs opacity-75">Auto-saves every 5s • Live updates every 3s • Showing up to 2000 honorers worldwide</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
