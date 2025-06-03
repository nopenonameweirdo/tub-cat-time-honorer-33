
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  time: number;
  date: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: number;
  isRecording: boolean;
  onRecordComplete: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
  currentTime,
  isRecording,
  onRecordComplete
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [runName, setRunName] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('catInTubLeaderboard');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      setShowSubmitForm(true);
    }
  }, [isRecording]);

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

  const submitRun = () => {
    if (!runName.trim()) return;

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: runName.trim(),
      time: currentTime,
      date: new Date().toLocaleDateString()
    };

    const updatedEntries = [...entries, newEntry]
      .sort((a, b) => b.time - a.time) // Sort by time descending (longest first)
      .slice(0, 10); // Keep only top 10

    setEntries(updatedEntries);
    localStorage.setItem('catInTubLeaderboard', JSON.stringify(updatedEntries));
    
    setRunName('');
    setShowSubmitForm(false);
    onRecordComplete();
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
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{index + 1}</span>;
    }
  };

  const clearLeaderboard = () => {
    setEntries([]);
    localStorage.removeItem('catInTubLeaderboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Cat Honoring Leaderboard
          </DialogTitle>
        </DialogHeader>

        {showSubmitForm && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Record Your Run</h3>
            <p className="text-amber-700 mb-3">
              Time: <span className="font-mono font-bold">{formatTime(currentTime)}</span>
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter run name..."
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submitRun()}
                className="flex-1"
              />
              <Button 
                onClick={submitRun}
                disabled={!runName.trim()}
                className="bg-amber-700 hover:bg-amber-600"
              >
                Submit
              </Button>
              <Button 
                onClick={() => {
                  setShowSubmitForm(false);
                  onRecordComplete();
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-amber-900">Top Devotees</h3>
            {entries.length > 0 && (
              <Button 
                onClick={clearLeaderboard}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-amber-700">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No runs recorded yet. Be the first to honor the cat!</p>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-100">
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={entry.id} className="hover:bg-amber-50">
                      <TableCell className="flex items-center justify-center">
                        {getRankIcon(index)}
                      </TableCell>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell className="font-mono">{formatTime(entry.time)}</TableCell>
                      <TableCell className="text-gray-600">{entry.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-amber-600 mt-4">
          <p>Honor the sacred cat with your devoted watching time</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
