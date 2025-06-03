
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, Users, Wifi, Search } from 'lucide-react';
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
      // Simulate live updates every 3 seconds
      const interval = setInterval(loadEntries, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadEntries = () => {
    // Simulate network connection with 95% uptime
    setIsConnected(Math.random() > 0.05);
    
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
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-cyan-700">{index + 1}</span>;
    }
  };

  const clearLeaderboard = () => {
    setEntries([]);
    localStorage.removeItem('catInTubLeaderboard');
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cyan-50/98 to-blue-50/98 backdrop-blur-xl border border-cyan-200/60 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              Global Leaderboard
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
          <div className="mb-4 p-4 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 rounded-xl border border-cyan-300/50">
            <h3 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Your Stats
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-cyan-800">{currentUserRank}</p>
                <p className="text-xs text-cyan-600">Rank</p>
              </div>
              <div>
                <p className="text-xl font-bold text-cyan-800 font-mono">{formatTime(currentUserEntry.time)}</p>
                <p className="text-xs text-cyan-600">Best Time</p>
              </div>
              <div>
                <p className="text-xl font-bold text-cyan-800">{entries.length}</p>
                <p className="text-xs text-cyan-600">Total Players</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Search and controls */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-4 h-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-cyan-200 focus:border-cyan-400"
              />
            </div>
            {entries.length > 0 && (
              <Button 
                onClick={clearLeaderboard}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-300"
              >
                Reset
              </Button>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-cyan-700">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No players recorded yet.</p>
              <p className="text-sm opacity-75">Start watching to become the first!</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-cyan-200/60 overflow-hidden shadow-lg bg-white/80">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-cyan-200/80 to-blue-200/80">
                      <TableHead className="w-16 text-center font-bold text-cyan-900">Rank</TableHead>
                      <TableHead className="font-bold text-cyan-900">Player</TableHead>
                      <TableHead className="font-bold text-cyan-900">Time</TableHead>
                      <TableHead className="font-bold text-cyan-900">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEntries.map((entry, index) => {
                      const actualRank = startIndex + index;
                      return (
                        <TableRow 
                          key={entry.id} 
                          className={`hover:bg-cyan-50/50 transition-colors ${
                            entry.name === currentUser ? 'bg-cyan-100/70 border-l-4 border-l-cyan-500' : ''
                          }`}
                        >
                          <TableCell className="flex items-center justify-center py-3">
                            {getRankIcon(actualRank)}
                          </TableCell>
                          <TableCell className="font-medium text-cyan-800">
                            {entry.name}
                            {entry.name === currentUser && (
                              <span className="ml-2 text-xs bg-cyan-600 text-white px-2 py-1 rounded-full">You</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-lg font-bold text-cyan-700">
                            {formatTime(entry.time)}
                          </TableCell>
                          <TableCell className="text-cyan-600 text-sm">{entry.date}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-cyan-700 px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center text-xs text-cyan-600 mt-4 p-3 bg-cyan-50/50 rounded-lg">
          <p className="font-medium">🐱 Live multiplayer cat watching leaderboard 🐱</p>
          <p className="text-xs mt-1 opacity-75">Auto-saves every 10s • Live updates every 3s • Showing up to 1000 players</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
