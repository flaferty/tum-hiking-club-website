import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePlannedDates, useAddPlannedDate, useDeletePlannedDate } from '@/features/hikes/usePlannedDates';
import { Calendar, Plus, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PlannedDatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlannedDatesDialog({ isOpen, onClose }: PlannedDatesDialogProps) {
  const { toast } = useToast();
  const { data: plannedDates = [], isLoading } = usePlannedDates();
  const addMutation = useAddPlannedDate();
  const deleteMutation = useDeletePlannedDate();

  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAdd = async () => {
    if (!newDate) {
      toast({ title: 'Error', description: 'Please select a date.', variant: 'destructive' });
      return;
    }

    try {
      await addMutation.mutateAsync({
        date: newDate,
        description: newDescription || undefined,
      });
      toast({ title: 'Date added', description: 'Planned date has been added.' });
      setNewDate('');
      setNewDescription('');
    } catch {
      toast({ title: 'Error', description: 'Failed to add planned date.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Date removed', description: 'Planned date has been removed.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove planned date.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manage Planned Dates
          </DialogTitle>
          <DialogDescription>
            Add or remove planned hike dates. These are shown to users on the home and participants pages.
          </DialogDescription>
        </DialogHeader>

        {/* Add new date form */}
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <h4 className="text-sm font-medium">Add New Date</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="planned-date">Date</Label>
              <Input
                id="planned-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="planned-description">Description (optional)</Label>
              <Input
                id="planned-description"
                placeholder="e.g. After retakes"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={addMutation.isPending || !newDate}
            size="sm"
            className="gap-1"
          >
            {addMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Add Date
          </Button>
        </div>

        {/* Existing dates list */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Current Planned Dates ({plannedDates.length})
          </h4>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : plannedDates.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No planned dates yet.
            </div>
          ) : (
            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
              {plannedDates.map((pd) => (
                <div
                  key={pd.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                      <span className="text-xs font-medium leading-none">
                        {format(new Date(pd.date + 'T00:00:00'), 'MMM')}
                      </span>
                      <span className="text-sm font-bold leading-tight">
                        {format(new Date(pd.date + 'T00:00:00'), 'dd')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(pd.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                      </p>
                      {pd.description && (
                        <p className="text-xs text-muted-foreground">{pd.description}</p>
                      )}
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Planned Date</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove{' '}
                          {format(new Date(pd.date + 'T00:00:00'), 'MMMM d, yyyy')}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(pd.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
