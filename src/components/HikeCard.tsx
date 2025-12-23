import { Hike, Difficulty } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Mountain, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface HikeCardProps {
  hike: Hike;
  onClick?: () => void;
}

const difficultyVariant: Record<Difficulty, 'easy' | 'moderate' | 'hard' | 'expert'> = {
  easy: 'easy',
  moderate: 'moderate',
  hard: 'hard',
  expert: 'expert',
};

export function HikeCard({ hike, onClick }: HikeCardProps) {
  const spotsLeft = hike.max_participants - (hike.enrollment_count || 0);
  const dateStr = format(new Date(hike.date), 'dd/MM/yyyy');

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {hike.image_url ? (
          <img
            src={hike.image_url}
            alt={hike.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${hike.image_url ? 'hidden' : ''} flex h-full items-center justify-center bg-muted`}>
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
        
        {/* Date badge */}
        <div className="absolute right-3 top-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm font-medium">
            {dateStr}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-heading text-lg font-semibold leading-tight line-clamp-1">
          {hike.name}
        </h3>
        
        {hike.description && (
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {hike.description}
          </p>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{hike.distance} km</span>
            <span>·</span>
            <Badge variant={difficultyVariant[hike.difficulty]} className="text-xs">
              {hike.difficulty}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {spotsLeft} spots left
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
