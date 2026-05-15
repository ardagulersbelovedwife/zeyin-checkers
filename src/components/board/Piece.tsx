import { PieceType } from '@/lib/game/types';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Piece = ({ type }: { type: PieceType }) => {
  if (type === 0) return null;

  const isP1 = type === 1 || type === 3;
  const isKing = type === 3 || type === 4;

  return (
    <div className={cn(
      "w-[75%] h-[75%] rounded-full flex items-center justify-center transition-all shadow-sm border",
      isP1 
        ? 'bg-primary text-primary-foreground border-primary/20 shadow-primary/20' 
        : 'bg-secondary text-secondary-foreground border-secondary/20 shadow-black/50',
      isKing && 'ring-2 ring-accent'
    )}>
      {isKing && <Crown className={cn("w-5 h-5", isP1 ? 'text-primary-foreground/80' : 'text-secondary-foreground/80')} />}
    </div>
  );
};
