
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-cyan-50/95 backdrop-blur-md border border-cyan-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-900 flex items-center gap-2 justify-center">
            <User className="w-6 h-6" />
            Welcome to Cat in a Tub
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <p className="text-cyan-800 text-center">
            Enter your username to begin honoring the sacred cat and join the leaderboard:
          </p>
          
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="text-center text-lg border-cyan-300 focus:border-cyan-500"
              maxLength={20}
            />
            
            <Button 
              onClick={handleSubmit}
              disabled={!username.trim()}
              className="w-full bg-cyan-700 hover:bg-cyan-600 text-white text-lg py-3"
            >
              Begin Sacred Watch
            </Button>
          </div>

          <p className="text-xs text-cyan-600 text-center">
            Your progress will be automatically saved every 10 seconds
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
