import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/services/supabase/client';
import { format } from 'date-fns';
import { Phone, Mail } from 'lucide-react';

interface Participant {
  user_id: string;
  status: string;
  enrolled_at: string;
  profiles: {
    full_name: string;
    email: string;
    phone_number: string;
    avatar_url: string;
  }
}

interface Props {
  hikeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  hikeName: string;
}

export function HikeParticipantsModal({ hikeId, isOpen, onClose, hikeName }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && hikeId) {
      fetchParticipants();
    }
  }, [isOpen, hikeId]);

  async function fetchParticipants() {
        try {
      setIsLoading(true);
    
      const { data, error } = await supabase
      .from('hike_enrollments')
      .select('*, profiles(*)')
        .eq('hike_id', hikeId)
        .returns<Participant[]>();

      if (error) {
        console.error('Supabase Error:', error);
        return;
      }

      if (data) {
        setParticipants(data as unknown as Participant[]);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] w-[95%] max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Participants: {hikeName}</DialogTitle>
          <p className="text-sm text-muted-foreground break-all">{participants.length} enrolled</p>
        </DialogHeader>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            {isLoading ? (
               <p className="text-center text-muted-foreground">Loading...</p>
            ) : participants.length === 0 ? (
               <p className="text-center text-muted-foreground">No one has joined yet.</p>
            ) : (
              participants.map((p) => (
                <div key={p.user_id} className="flex items-start gap-3 rounded-lg border p-3">
                  <Avatar>
                    <AvatarImage src={p.profiles?.avatar_url} />
                    <AvatarFallback>{p.profiles?.full_name?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{p.profiles?.full_name || 'Unknown'}</p>
                      <Badge variant={p.status === 'waitlisted' ? 'secondary' : 'default'} className="text-xs">
                        {p.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-3 w-3 mt-1 shrink-0" />
                        <span className="truncate">{p.profiles?.email}</span>
                      </div>
                      {p.profiles?.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{p.profiles.phone_number}</span>
                        </div>
                      )}
                      <p className="text-xs opacity-70">
                        Joined: {format(new Date(p.enrolled_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}