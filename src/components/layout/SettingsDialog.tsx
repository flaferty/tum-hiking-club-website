import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/services/supabase/client';
import { Loader2 } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ fullName: '', email: '', phone: '' });

  useEffect(() => {
    if (user && open) {
      const defaultFullName = user.user_metadata?.full_name || '';
      const defaultEmail = user.email || '';
      const defaultPhone = user.user_metadata?.phone_number || '';
      
      setFullName(defaultFullName);
      setEmail(defaultEmail);
      setPhone(defaultPhone);
      setInitialValues({ fullName: defaultFullName, email: defaultEmail, phone: defaultPhone });
      
      // Optionally sync from profiles table
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email, phone_number')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          const fetchedFullName = data.full_name || defaultFullName;
          const fetchedEmail = data.email || defaultEmail;
          const fetchedPhone = data.phone_number || defaultPhone;
          
          setFullName(fetchedFullName);
          setEmail(fetchedEmail);
          setPhone(fetchedPhone);
          setInitialValues({ fullName: fetchedFullName, email: fetchedEmail, phone: fetchedPhone });
        }
      };
      fetchProfile();
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const lowerCaseEmail = email.toLowerCase();
    const cleanPhone = phone.replace(/[\s-]/g, '');

    const emailChanged = lowerCaseEmail !== initialValues.email;
    const nameChanged = fullName !== initialValues.fullName;
    const phoneChanged = cleanPhone !== initialValues.phone.replace(/[\s-]/g, '');

    if (!emailChanged && !nameChanged && !phoneChanged) {
      onOpenChange(false);
      return;
    }
    
    if (emailChanged && !lowerCaseEmail.endsWith('@tum.de') && !lowerCaseEmail.endsWith('@mytum.de')) {
      toast({
        title: 'Invalid Email',
        description: 'Please use your university email (@tum.de or @mytum.de).',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const authUpdates: { email?: string; data: Record<string, string> } = { data: {} };
      const profileUpdates: Record<string, string> = {};
      
      if (nameChanged) {
        authUpdates.data.full_name = fullName;
        profileUpdates.full_name = fullName;
      }
      
      if (phoneChanged) {
        authUpdates.data.phone_number = cleanPhone;
        profileUpdates.phone_number = cleanPhone;
      }
      
      if (emailChanged) {
        authUpdates.email = lowerCaseEmail;
        profileUpdates.email = lowerCaseEmail;
      }

      // 1. Update Auth User
      if (emailChanged || Object.keys(authUpdates.data).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) throw authError;
      }

      // 2. Update Profile Table
      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: 'Settings Updated',
        description: emailChanged 
          ? 'Your profile has been updated. Please verify your new email address.' 
          : 'Your profile has been updated successfully.',
      });
      
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating your profile.';

      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] sm:w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile Settings</DialogTitle>
          <DialogDescription>
            Update your personal information here. Changes will be reflected across the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49123456789"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input 
              id="email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@tum.de"
              required
            />
            <p className="text-xs text-muted-foreground">
              Must be a valid @tum.de or @mytum.de address.
            </p>
          </div>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="mt-2 sm:mt-0">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
