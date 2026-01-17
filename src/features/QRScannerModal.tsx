import { useState, useEffect, useRef } from 'react';
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
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [totalEnrolled, setTotalEnrolled] = useState<number>(enrollmentCount || 0);
  const [totalVerified, setTotalVerified] = useState<number>(0);
  const { toast } = useToast();

  // If react-qr-scanner stops emitting callbacks, remount it.
  const lastOnScanAtRef = useRef<number>(Date.now());
  const isProcessingRef = useRef(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setScannedUsers([]);
      setShowList(false);
      setLastScanned('');
      setError('');
      setScanSuccess(false);
      setScanFailed(false);
      setScannerKey(0);
      isProcessingRef.current = false;
    }
  }, [isOpen]);

  // Watchdog: if we haven't received any onScan callbacks for a while, remount the scanner.
  useEffect(() => {
    if (!isOpen) return;

    lastOnScanAtRef.current = Date.now();

    const intervalId = window.setInterval(() => {
      const msSinceLastCallback = Date.now() - lastOnScanAtRef.current;
      if (msSinceLastCallback > 8000) {
        console.warn('[QRScanner] onScan stalled; remounting scanner', { msSinceLastCallback });
        setScannerKey(k => k + 1);
        lastOnScanAtRef.current = Date.now();
      }
    }, 2000);

    const handleVisibility = () => {
      if (!document.hidden) {
        console.warn('[QRScanner] tab visible; remounting scanner');
        setScannerKey(k => k + 1);
        lastOnScanAtRef.current = Date.now();
      }
    };

    const handleFocus = () => {
      console.warn('[QRScanner] window focused; remounting scanner');
      setScannerKey(k => k + 1);
      lastOnScanAtRef.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
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
    // Keep for debugging: helps confirm if onScan is firing.
    console.log(data);
    lastOnScanAtRef.current = Date.now();

    // NOTE: react-qr-scanner often calls onScan with null when nothing is detected.
    if (!data || !data.text) return;

    const scannedText = data.text.trim();

    // Avoid overlapping DB requests (can overwhelm the main thread / camera pipeline).
    if (isProcessingRef.current) return;

    // Prevent duplicate scans
    if (scanFailed || scanSuccess || scannedText === lastScanned) return;

    isProcessingRef.current = true;
    setLastScanned(scannedText);

    try {
      // Clear previous states
      setError('');
      setScanFailed(false);
      setScanSuccess(false);

      // Validate UUID format
      if (!validateUserId(scannedText)) {
        toast({
          title: 'Invalid QR code',
          description: 'Invalid QR code format',
          variant: 'destructive',
        });
        setScanFailed(true);
        setTimeout(() => setScanFailed(false), 1000);
        return;
      }

      // Check if already scanned
      if (scannedUsers.some(u => u.id === scannedText)) {
        toast({
          title: 'Already scanned',
          description: 'User already scanned',
          variant: 'destructive',
        });
        setScanFailed(true);
        setTimeout(() => setScanFailed(false), 1000);
        return;
      }

      // Verify user exists in database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .eq('user_id', scannedText)
        .single();

      if (profileError || !profile) {
        toast({
          title: 'User not found',
          description: 'User not found in database',
          variant: 'destructive',
        });
        setScanFailed(true);
        setTimeout(() => setScanFailed(false), 1000);
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
        setScanFailed(true);
        setTimeout(() => setScanFailed(false), 1000);
        return;
      }

      setScannedUsers(prev => [...prev, newUser]);

      if (!newUser.wasEnrolled) {
        setTotalEnrolled(totalEnrolled + 1)
      }

      // Update total verified count
      setTotalVerified(totalVerified + 1)
      
      // Show green overlay on success
      setScanSuccess(true);
      setTimeout(() => setScanSuccess(false), 1000);
      
      toast({
        title: 'User scanned',
        description: newUser.wasEnrolled 
          ? `${profile.full_name || profile.email} added to verification list`
          : `${profile.full_name || profile.email} will be enrolled and verified`,
      });
    } catch (err) {
      console.error('Error verifying user:', err);
      toast({
        title: 'Error',
        description: 'Error verifying user',
        variant: 'destructive',
      });
      setScanFailed(true);
      setTimeout(() => setScanFailed(false), 1000);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleError = (err: Error) => {
    console.error('QR Scanner Error:', err);
    setError('Camera access denied or unavailable');
    // Often recoverable by forcing a remount.
    setScannerKey(k => k + 1);
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
          <div className="space-y-3 overflow-y-auto flex-1 min-h-0 flex flex-col">

            {/* Scanner Display */}
            <div className="relative aspect-square w-full mx-auto overflow-hidden rounded-lg border-2 border-border bg-black flex-shrink">
              <style>{`
                .qr-scanner-container video {
                  object-fit: cover;
                  width: 100%;
                  height: 100%;
                  transform: scale(1.5);
                }
              `}</style>
              {/* Error Alert */}
              {error && (
                <div className="absolute inset-0 z-10 flex justify-center items-center px-4">
                  <Alert className="w-fit bg-destructive/90 backdrop-blur-sm text-white [&>svg]:text-white flex justify-center gap-2" variant="destructive">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <AlertDescription>{error}</AlertDescription>
                    </div>
                  </Alert>
                </div>
              )}
              <div className="qr-scanner-container absolute inset-0">
                <QrScanner
                  key={`${isOpen ? 'scanner-active' : 'scanner-inactive'}-${scannerKey}`}
                  delay={500}
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
              {!error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`h-[85%] aspect-square border-4 rounded-lg shadow-lg transition-colors duration-300 ${error ? 'border-red-500' : lastScanned && scanFailed ? 'border-red-500' : lastScanned && scanSuccess ? 'border-green-500' : 'border-primary'}`}></div>
                </div>
              )}
            </div>

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
          <div className="grid grid-rows-2 grid-cols-2 gap-x-1 justify-items-center md:grid-rows-1 md:grid-cols-[auto_auto_auto] md:gap-2 md:items-center md:justify-items-start">
            <span className="font-semibold col-span-2 md:col-span-1 md:col-start-2 md:order-2">Scanned:</span>
            <CheckCircle2 className="h-5 w-5 text-green-600 self-center justify-self-end md:col-start-1 md:order-1" />
            <span className="font-semibold justify-self-start md:col-start-3 md:order-3 md:justify-self-start md:self-center">{scannedUsers.length}</span>
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
