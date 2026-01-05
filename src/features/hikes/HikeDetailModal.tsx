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
import { useAuth } from '@/features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, TouchEvent } from 'react';
import { useEnrollment, useHike } from '@/features/hikes/useHikes';

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

  const sortedImages = (hike?.images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order);

  const isSingleImage = sortedImages.length <= 1;

  const handleNext = useCallback(() => {
    if (!sortedImages.length) return;
    
    const currentIndex = sortedImages.findIndex(img => img.image_url === activeImageUrl);
    
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % sortedImages.length;
    
    setActiveImageUrl(sortedImages[nextIndex].image_url);
  }, [activeImageUrl, sortedImages]);

  const handlePrev = useCallback(() => {
    if (!sortedImages.length) return;
    
    const currentIndex = sortedImages.findIndex(img => img.image_url === activeImageUrl);
    
    const prevIndex = currentIndex <= 0 
      ? sortedImages.length - 1 
      : currentIndex - 1;
      
    setActiveImageUrl(sortedImages[prevIndex].image_url);
  }, [activeImageUrl, sortedImages]);

  // keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  // touch swipe support on phone
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

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
      <DialogContent className="flex flex-col max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{hike.name}</DialogTitle>
        </DialogHeader>
        
        {/* Main Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] shrink-0 rounded-lg overflow-hidden focus:outline-none bg-muted/20"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          >
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={`${hike.name} photo`}
              className="w-full h-full object-contain bg-muted/20"
              loading="lazy"
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-[inherit] bg-muted/30">
              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          
          <div className="absolute left-3.5 top-3.5 flex gap-2">
            <Badge variant={difficultyVariant[hike.difficulty]}>
              {hike.difficulty}
            </Badge>
            <Badge variant={hike.status === 'upcoming' ? 'upcoming' : 'completed'}>
              {hike.status}
            </Badge>
          </div>
        </div>

        {/* Additional Images - Scrollable Gallery */}
        {!isSingleImage && (
          <div className="mt-4 relative w-full shrink-0">
            <h3 className="mb-2 px-1 font-semibold text-sm text-muted-foreground">More photos</h3>
            <div className="flex gap-3 overflow-x-auto pt-2 pb-4 px-2 w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary/20">
              {sortedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageUrl(img.image_url)}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                    activeImageUrl === img.image_url
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`Gallery image ${img.display_order}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
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
                {hike.status === 'upcoming' ? (
                  <>
                <p className="text-sm font-medium">
                  {enrollmentCount} / {hike.max_participants} enrolled
                </p>
                <p className="text-xs text-muted-foreground">
                  {spotsLeft} spots remaining
                </p>
              </>
              ) : (
                <p className="text-sm font-medium">Registration Closed</p>
                )}
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
