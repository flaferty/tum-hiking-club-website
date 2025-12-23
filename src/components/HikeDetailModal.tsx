import { Hike, Difficulty } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { 
  Calendar, 
  MapPin, 
  Mountain, 
  Clock, 
  Users, 
  Image as ImageIcon,
  Tent,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useEnrollment, useHike } from '@/hooks/useHikes';

interface HikeDetailModalProps {
  hike: Hike | null;
  isOpen: boolean;
  onClose: () => void;
  onEnrollmentChange?: () => void;
}

const difficultyVariant: Record<Difficulty, 'easy' | 'moderate' | 'hard' | 'expert'> = {
  easy: 'easy',
  moderate: 'moderate',
  hard: 'hard',
  expert: 'expert',
};

export function HikeDetailModal({ hike: initialHike, isOpen, onClose, onEnrollmentChange }: HikeDetailModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch fresh hike data to get updated enrollment count
  const { data: freshHike } = useHike(initialHike?.id);
  const hike = freshHike || initialHike;
  
  const { enrollment, enroll, unenroll, isEnrolling, isUnenrolling } = useEnrollment(hike?.id);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(
    hike?.image_url ?? hike?.images?.[0]?.image_url ?? null
  );

  useEffect(() => {
    if (!hike) {
      setActiveImageUrl(null);
      return;
    }
    setActiveImageUrl(hike.image_url ?? hike.images?.[0]?.image_url ?? null);
  }, [hike?.id, hike?.image_url, hike?.images?.length]);

  if (!hike) return null;

  const enrollmentCount = hike.enrollment_count || 0;
  const spotsLeft = hike.max_participants - enrollmentCount;
  const isEnrolled = !!enrollment;
  const isWaitlisted = enrollment?.status === 'waitlisted';
  const isMultiDay = hike.end_date && hike.end_date !== hike.date;
  const isLoading = isEnrolling || isUnenrolling;
  
  const dateDisplay = isMultiDay
    ? `${format(new Date(hike.date), 'dd/MM')} - ${format(new Date(hike.end_date!), 'dd/MM/yyyy')}`
    : format(new Date(hike.date), 'dd/MM/yyyy');

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth');
      onClose();
      return;
    }

    if (isEnrolled) {
      unenroll(hike.id);
    } else {
      enroll({ hikeId: hike.id, maxParticipants: hike.max_participants });
    }
    onEnrollmentChange?.();
  };

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (isWaitlisted) return 'Leave Waitlist';
    if (isEnrolled) return 'Unenroll';
    if (spotsLeft === 0) return 'Join Waitlist';
    return 'Enroll Now';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{hike.name}</DialogTitle>
        </DialogHeader>
        
        {/* Main Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={`${hike.name} photo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={difficultyVariant[hike.difficulty]}>
              {hike.difficulty}
            </Badge>
            <Badge variant={hike.status === 'upcoming' ? 'upcoming' : 'completed'}>
              {hike.status}
            </Badge>
          </div>
        </div>

        {/* Additional Images - Scrollable Gallery */}
        {hike.images && hike.images.length > 0 && (
          <div>
            <h4 className="mb-2 font-heading text-sm font-semibold">More Photos</h4>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
                {(hike.images ?? [])
                  .slice()
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImageUrl(image.image_url)}
                      className={
                        "relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/40 " +
                        (activeImageUrl === image.image_url ? "ring-2 ring-primary/50" : "")
                      }
                      aria-label={`Open photo for ${hike.name}`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${hike.name} photo thumbnail`}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Calendar className="mb-1 h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">Date</span>
            <span className="text-center text-sm font-medium">{dateDisplay}</span>
          </div>
          
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <MapPin className="mb-1 h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">Distance</span>
            <span className="text-sm font-medium">{hike.distance} km</span>
          </div>
          
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Mountain className="mb-1 h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">Elevation</span>
            <span className="text-sm font-medium">{hike.elevation} m</span>
          </div>
          
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Clock className="mb-1 h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">Duration</span>
            <span className="text-sm font-medium">{hike.duration}</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{hike.location_name}</span>
        </div>
        
        {/* Description */}
        {hike.description && (
          <div>
            <h4 className="mb-2 font-heading font-semibold">About this hike</h4>
            <p className="text-muted-foreground">{hike.description}</p>
          </div>
        )}
        
        {/* Enrollment info */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {enrollmentCount} / {hike.max_participants} enrolled
                </p>
                <p className="text-xs text-muted-foreground">
                  {spotsLeft} spots remaining
                </p>
              </div>
            </div>
          </div>
          
          {/* Enrollment status */}
          {isWaitlisted && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-center">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                You're on the waitlist
              </p>
              <p className="text-xs text-muted-foreground">
                We'll notify you if a spot opens up
              </p>
            </div>
          )}
          
          {isEnrolled && !isWaitlisted && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                You're enrolled!
              </p>
            </div>
          )}
          
        </div>
        
        {/* Action button */}
        <div className="flex gap-3">
          {hike.status === 'upcoming' && (
            <>
              {user ? (
                <Button 
                  className="flex-1"
                  variant={isEnrolled ? 'outline' : 'default'}
                  onClick={handleEnroll}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              ) : (
                <Button className="flex-1" onClick={() => { navigate('/auth'); onClose(); }}>
                  Sign in to Enroll
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
