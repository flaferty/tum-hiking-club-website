import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Scanner from 'react-qr-scanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/services/supabase/client';
import { toast } from '@/hooks/use-toast';
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
  const [error, setError] = useState<string>('');
  const [scannerKey, setScannerKey] = useState(0);
  const [totalEnrolled, setTotalEnrolled] = useState<number>(enrollmentCount || 0);
  const [totalVerified, setTotalVerified] = useState<number>(0);

  // Using refs to avoid re-rendering on every scan
  const scannedUsersRef = useRef<ScannedUser[]>([]);
  const lastScannedRef = useRef<string>('');
  const scanSuccessRef = useRef(false);
  const scanFailedRef = useRef(false);

  // If react-qr-scanner stops emitting callbacks, remount it.
  const lastOnScanAtRef = useRef<number>(Date.now());
  const isProcessingRef = useRef(false);

  useEffect(() => {
    scannedUsersRef.current = scannedUsers;
  }, [scannedUsers]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setScannedUsers([]);
      setShowList(false);
      setError('');
      setScannerKey(0);
      isProcessingRef.current = false;

      scannedUsersRef.current = [];
      lastScannedRef.current = '';
      scanSuccessRef.current = false;
      scanFailedRef.current = false;
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

  const validateUserId = useCallback((userId: string): boolean => {
    // UUID v4 format validation
    const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    return uuidRegex.test(userId);
  }, []);

  const handleScan = useCallback(async (data: {text: string, timestamp: number} | null) => {
    // Avoid overlapping DB requests
    if (isProcessingRef.current) return;

    // Clear previous states
    scanFailedRef.current = false;
    scanSuccessRef.current = false;

    // No data scanned
    if (!data || !data.text) return;

    const scannedText = data.text.trim();

    // Prevent duplicate scans
    if (scannedText === lastScannedRef.current) return;
    
    lastOnScanAtRef.current = data.timestamp;
    lastScannedRef.current = scannedText;
    isProcessingRef.current = true;

    try {

      // Validate UUID format
      if (!validateUserId(scannedText)) {
        toast({
          title: 'Invalid QR code',
          description: 'Invalid QR code format',
          variant: 'destructive',
        });
        scanFailedRef.current = true;
        return;
      }

      // Check if already scanned
      if (scannedUsersRef.current.some(u => u.id === scannedText)) {
        toast({
          title: 'Already scanned',
          description: 'User already scanned',
          variant: 'destructive',
        });
        scanFailedRef.current = true;
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
        scanFailedRef.current = true;
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
          description: `${profile.full_name} has already the badge verfied applied`,
        });
        scanFailedRef.current = true;
        return;
      }

      scannedUsersRef.current = [...scannedUsersRef.current, newUser];
      setScannedUsers(prev => [...prev, newUser]);

      if (!newUser.wasEnrolled) {
        setTotalEnrolled(prev => prev + 1);
      }

      setTotalVerified(prev => prev + 1);

      // Show green overlay on success
      scanSuccessRef.current = true;

      toast({
        title: 'User scanned',
        description: newUser.wasEnrolled
          ? `${profile.full_name || profile.email} added to verification list`
          : `${profile.full_name || profile.email} will be enrolled and verified`,
      });
    }
    catch (err) {
      console.error('Error verifying user:', err);
      toast({
        title: 'Error',
        description: 'Error verifying user',
        variant: 'destructive',
      });
      scanFailedRef.current = true;
    } 
    finally {
      // Add delay between scans
      window.setTimeout(() => {
        isProcessingRef.current = false;
      }, 500);

      // Reset last scanned text every 5s to avoid dupplicate scans
      window.setTimeout(() => {
        lastScannedRef.current = '';
      }, 5000);
    }
  }, [hikeId, validateUserId]);

  const handleError = useCallback((err: Error) => {
    console.error('QR Scanner Error:', err);
    setError('Camera access denied or unavailable');
    // Often recoverable by forcing a remount.
    setScannerKey(k => k + 1);
  }, []);

  // Memoize Scanner props to avoid the library thinking constraints/style changed and restarting the stream.
  const scannerFormats = useMemo(() => ['qr_code'], []);
  const scannerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const scannerConstraints = useMemo(
    () => ({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1920 },
      },
    }),
    [],
  );
  const scannerComponents = useMemo(() => ({
    finder: true,
  }), []);

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
                <Scanner
                  key={`${isOpen ? 'scanner-active' : 'scanner-inactive'}-${scannerKey}`}
                  onError={handleError}
                  onScan={handleScan}
                  formats={scannerFormats}
                  style={scannerStyle}
                  constraints={scannerConstraints}
                  // components={scannerComponents}
                  />
              </div>

              {/* Scanning overlay */}
              {!error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`h-[85%] aspect-square border-4 rounded-lg shadow-lg transition-colors duration-300 ${scanFailedRef.current ? 'border-red-500' : scanSuccessRef.current ? 'border-green-500' : 'border-primary'}`}></div>
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
