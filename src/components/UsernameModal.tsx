
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
      <DialogContent className="max-w-sm bg-white/95 backdrop-blur-xl border border-cyan-200/50 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-cyan-900 flex items-center gap-2 justify-center">
            <User className="w-5 h-5" />
            Enter Name
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          <Input
            type="text"
            placeholder="Your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="text-center border-cyan-200 focus:border-cyan-400 bg-white/80"
            maxLength={20}
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="w-full bg-cyan-700 hover:bg-cyan-600 text-white"
          >
            Start Watching
          </Button>

          <p className="text-xs text-cyan-600 text-center opacity-75">
            Auto-saves every 10 seconds
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
