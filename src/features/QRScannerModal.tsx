import { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/services/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QrCode, CheckCircle2, AlertCircle, List, Award } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  hikeId: string;
  hikeName: string;
  enrollmentCount?: number;
}

interface ScannedUser {
  id: string;
  email: string | null;
  full_name: string | null;
  scannedAt: Date;
  wasEnrolled: boolean;
  wasVerified: boolean;
}

export function QRScanner({ isOpen, onClose, hikeId, hikeName, enrollmentCount }: QRScannerProps) {
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);
  const [showList, setShowList] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [totalEnrolled, setTotalEnrolled] = useState<number>(enrollmentCount || 0);
  const [totalVerified, setTotalVerified] = useState<number>(0);
  const { toast } = useToast();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setScannedUsers([]);
      setShowList(false);
      setLastScanned('');
      setError('');
    }
  }, [isOpen]);

  // Fetch enrollment and verified counts
  useEffect(() => {
    if (isOpen) {
      const fetchCounts = async () => {
        // Fetch total enrolled count
        const { count: enrolledCount } = await supabase
          .from('hike_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('hike_id', hikeId);
        setTotalEnrolled(enrolledCount || 0);

        // Fetch verified count
        const { count: verifiedCount } = await supabase
          .from('hike_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('hike_id', hikeId)
          .eq('status', 'verified');
        setTotalVerified(verifiedCount || 0);
      };
      fetchCounts();
    }
  }, [isOpen, hikeId]);

  const validateUserId = (userId: string): boolean => {
    // UUID v4 format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId);
  };

  const handleScan = async (data: { text: string } | null) => {
    if (!data || !data.text) return;

    const scannedText = data.text.trim();

    // Prevent duplicate scans
    if (scannedText === lastScanned) return;
    setLastScanned(scannedText);

    // Clear previous error
    setError('');

    // Validate UUID format
    if (!validateUserId(scannedText)) {
      setError('Invalid QR code format');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if already scanned
    if (scannedUsers.some(u => u.id === scannedText)) {
      setError('User already scanned');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Verify user exists in database
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .eq('user_id', scannedText)
        .single();

      if (profileError || !profile) {
        setError('User not found in database');
        setTimeout(() => setError(''), 3000);
        return;
      }

      // Check if user is enrolled in this hike
      const { data: enrollment } = await supabase
        .from('hike_enrollments')
        .select('status')
        .eq('hike_id', hikeId)
        .eq('user_id', profile.user_id)
        .maybeSingle();

      // Add to scanned list
      const newUser: ScannedUser = {
        id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        scannedAt: new Date(),
        wasEnrolled: !!enrollment,
        wasVerified: !!enrollment && enrollment.status === "verified"
      };

      if (newUser.wasVerified) {
        toast({
          title: 'User already verified',
          description: `${profile.full_name} has already the badge verfied applied`
        });
        return;
      }

      setScannedUsers(prev => [...prev, newUser]);

      if (!newUser.wasEnrolled) {
        setTotalEnrolled(totalEnrolled + 1)
      }

      // Update total verified count
      setTotalVerified(totalVerified + 1)
      
      toast({
        title: 'User scanned',
        description: newUser.wasEnrolled 
          ? `${profile.full_name || profile.email} added to verification list`
          : `${profile.full_name || profile.email} will be enrolled and verified`,
      });
    } catch (err) {
      console.error('Error verifying user:', err);
      setError('Error verifying user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleError = (err: Error) => {
    console.error('QR Scanner Error:', err);
    setError('Camera access denied or unavailable');
  };

  const handleApplyVerifyBadge = async () => {
    if (scannedUsers.length === 0) {
      toast({
        title: 'No users to verify',
        description: 'Please scan QR codes first',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Process each user: enroll if not enrolled, then verify
      for (const user of scannedUsers) {
        // Check if user is already enrolled
        const { data: existingEnrollment } = await supabase
          .from('hike_enrollments')
          .select('id, status')
          .eq('hike_id', hikeId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingEnrollment) {
          // Update existing enrollment to verified
          const { error: updateError } = await supabase
            .from('hike_enrollments')
            .update({ status: 'verified' })
            .eq('id', existingEnrollment.id);

          if (updateError) throw updateError;
        } else {
          // Create new enrollment with verified status
          const { error: insertError } = await supabase
            .from('hike_enrollments')
            .insert({
              hike_id: hikeId,
              user_id: user.id,
              status: 'verified'
            });

          if (insertError) throw insertError;
        }
      }
      
      toast({
        title: 'Success',
        description: `Verified ${scannedUsers.length} participant${scannedUsers.length > 1 ? 's' : ''}`,
      });

      // Close dialog and reset
      onClose();
    } catch (err) {
      console.error('Error applying verify badges:', err);
      toast({
        title: 'Error',
        description: 'Failed to apply verify badges',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan QR Codes - {hikeName}
          </DialogTitle>
        </DialogHeader>

        {!showList ? (
            <div className="space-y-4 overflow-hidden flex-1 min-h-0">

            {/* Scanner Display */}
            <div className="relative aspect-square w-full max-h-[400px] overflow-hidden rounded-lg border-2 border-border bg-black">
              <style>{`
                .qr-scanner-container video {
                  object-fit: cover;
                  transform: scale(1.5);
                }
              `}</style>
              <div className="qr-scanner-container absolute inset-0">
                <QrScanner
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  constraints={{
                    video: { 
                      facingMode: { ideal: 'environment' },
                      width: { ideal: 1920 },
                      height: { ideal: 1920 }
                    }
                  }}
                />
              </div>

              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[80%] md:h-[90%] aspect-square border-4 border-primary rounded-lg shadow-lg"></div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          /* List View */
          <div className="max-h-96 overflow-y-auto space-y-2">
            {scannedUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{user.full_name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>   
        )}
        
        {/* Scan Counter */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              {totalEnrolled - totalVerified} not verified yet
            </p>
            <p className="text-xs text-muted-foreground">
              {scannedUsers.filter(u => u.wasEnrolled).length} already enrolled · {scannedUsers.filter(u => !u.wasEnrolled).length} new
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Scanned: {scannedUsers.length}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowList(!showList)}
            variant="outline"
            className="flex-1 gap-2"
            disabled={scannedUsers.length === 0}
          >
            {showList ? "Back to Scanner" : <span className="inline-flex items-center gap-2"><List className="h-4 w-4" />See List</span>}
          </Button>
          <Button
            onClick={handleApplyVerifyBadge}
            className="flex-1 gap-2"
            disabled={scannedUsers.length === 0 || isVerifying}
          >
            <Award className="h-4 w-4" />
            {isVerifying ? 'Applying...' : 'Apply Verify Badge'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
