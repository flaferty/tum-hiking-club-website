import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { format } from "date-fns";

interface PastHike {
  id: string;
  name: string;
  date: string;
}

export function AdminEmail() {
  const { toast } = useToast();
  const [selectedHikeId, setSelectedHikeId] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: pastHikes = [], isLoading } = useQuery({
    queryKey: ["completed-hikes"],
    queryFn: async (): Promise<PastHike[]> => {
      const { data, error } = await supabase
        .from("hikes")
        .select("id, name, date")
        .lt("date", new Date().toISOString()) 
        .order("date", { ascending: false });

      if (error) throw error;
      
      return data as PastHike[];
    },
  });

  const handleSend = async () => {
    if (!selectedHikeId || !photoLink) {
      toast({ title: "Error", description: "Please select a hike and add a link.", variant: "destructive" });
      return;
    }

    try {
      setIsSending(true);
      const { data, error } = await supabase.functions.invoke("send-hike-photos", {
        body: {
          hikeId: selectedHikeId,
          photoLink,
          message,
        },
      });

      if (error) throw new Error(error.message || "Failed to invoke function");
      if (data?.error) throw new Error(data.error);

      toast({ 
        title: "Emails Sent!", 
        description: `Photos link sent to participants successfully.` 
      });
      
      setPhotoLink("");
      setMessage("");
    } catch (err: unknown) { 
      console.error(err);
      
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";

      toast({ 
        title: "Sending Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Send Hike Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Past Hike</label>
          <Select onValueChange={setSelectedHikeId} value={selectedHikeId}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading..." : "Select a hike"} />
            </SelectTrigger>
            <SelectContent>
              {pastHikes.map((hike) => (
                <SelectItem key={hike.id} value={hike.id}>
                  {format(new Date(hike.date), "dd/MM/yyyy")} - {hike.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Google Drive / Photo Link</label>
          <Input 
            placeholder="https:/tumde-my.sharepoint.com/..." 
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Message (Optional)</label>
          <Textarea 
            placeholder="Hope you had fun! Here are the memories..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Button 
          className="w-full gap-2" 
          onClick={handleSend} 
          disabled={isSending || !selectedHikeId || !photoLink}
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send Photos to All Participants
        </Button>

      </CardContent>
    </Card>
  );
}