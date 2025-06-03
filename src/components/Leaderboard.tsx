
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, Users, Wifi } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      loadEntries();
      // Simulate live updates every 5 seconds
      const interval = setInterval(loadEntries, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadEntries = () => {
    // Simulate network connection
    setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    
    const savedEntries = localStorage.getItem('catInTubLeaderboard');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.time - a.time));
    }
  };

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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-cyan-700">{index + 1}</span>;
    }
  };

  const clearLeaderboard = () => {
    setEntries([]);
    localStorage.removeItem('catInTubLeaderboard');
  };

  const currentUserEntry = entries.find(entry => entry.name === currentUser);
  const currentUserRank = currentUserEntry ? entries.findIndex(entry => entry.name === currentUser) + 1 : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cyan-50/95 to-blue-50/95 backdrop-blur-md border border-cyan-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-cyan-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Sacred Cat Devotion Leaderboard
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Current User Stats */}
        {currentUser && currentUserEntry && (
          <div className="mb-6 p-6 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 rounded-xl border border-cyan-300">
            <h3 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Stats
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-cyan-800">{currentUserRank}</p>
                <p className="text-sm text-cyan-600">Rank</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-800 font-mono">{formatTime(currentUserEntry.time)}</p>
                <p className="text-sm text-cyan-600">Best Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-800">{entries.length}</p>
                <p className="text-sm text-cyan-600">Total Devotees</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-cyan-900">Global Rankings</h3>
            {entries.length > 0 && (
              <Button 
                onClick={clearLeaderboard}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-300"
              >
                Reset Leaderboard
              </Button>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12 text-cyan-700">
              <Trophy className="w-16 h-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg">No devotees have been recorded yet.</p>
              <p className="text-sm opacity-75">Start watching to become the first sacred guardian!</p>
            </div>
          ) : (
            <div className="rounded-xl border border-cyan-200 overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-cyan-200 to-blue-200">
                    <TableHead className="w-20 text-center font-bold text-cyan-900">Rank</TableHead>
                    <TableHead className="font-bold text-cyan-900">Devotee Name</TableHead>
                    <TableHead className="font-bold text-cyan-900">Sacred Time</TableHead>
                    <TableHead className="font-bold text-cyan-900">Date Achieved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow 
                      key={entry.id} 
                      className={`hover:bg-cyan-50/50 transition-colors ${
                        entry.name === currentUser ? 'bg-cyan-100/70 border-l-4 border-l-cyan-500' : ''
                      }`}
                    >
                      <TableCell className="flex items-center justify-center py-4">
                        {getRankIcon(index)}
                      </TableCell>
                      <TableCell className="font-semibold text-cyan-800">
                        {entry.name}
                        {entry.name === currentUser && (
                          <span className="ml-2 text-xs bg-cyan-600 text-white px-2 py-1 rounded-full">You</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-lg font-bold text-cyan-700">
                        {formatTime(entry.time)}
                      </TableCell>
                      <TableCell className="text-cyan-600">{entry.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-cyan-600 mt-6 p-4 bg-cyan-50/50 rounded-lg">
          <p className="font-medium">🐱 Honor the sacred cat with your devoted watching time 🐱</p>
          <p className="text-xs mt-1 opacity-75">Auto-saves every 10 seconds • Live leaderboard updates every 5 seconds</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
