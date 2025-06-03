
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
      <DialogContent className="max-w-sm bg-white/20 backdrop-blur-2xl border border-white/30 shadow-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white flex items-center gap-2 justify-center">
            <User className="w-5 h-5" />
            What's your name?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          <Input
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="text-center border-white/30 focus:border-white/50 bg-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
            maxLength={20}
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
          >
            Let's go!
          </Button>

          <p className="text-xs text-white/70 text-center">
            Progress saves automatically
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
