'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, MapPin, Clock, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '@/contexts/user-context'
import {
  classes,
  attendance,
  students,
  faceVerificationRequests as initialFaceVerificationRequests,
  FaceVerificationRequest,
} from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { verifyFace } from '@/ai/flows/verify-face'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const TeacherAttendance = ({
  verifications,
  setVerifications,
}: {
  verifications: FaceVerificationRequest[]
  setVerifications: React.Dispatch<React.SetStateAction<FaceVerificationRequest[]>>
}) => {
  const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [attendanceMethod, setAttendanceMethod] = useState<'face' | null>(null)

  const handleVerification = (
    id: string,
    status: 'approved' | 'rejected'
  ) => {
    setVerifications(
      verifications.map((v) => (v.id === id ? { ...v, status } : v))
    )
    toast({
      title: `Request ${status}`,
      description: `The student's attendance has been marked.`,
    })
  }

  const handleStartSession = () => {
    if (selectedClass) {
      setSessionStarted(true)
      setAttendanceMethod('face')
    }
  }

  const handleEndSession = () => {
    setSessionStarted(false)
    setAttendanceMethod(null)
  }

  const currentClass = classes.find((c) => c.id === selectedClass)
  const pendingVerifications = verifications.filter(
    (v) => v.status === 'pending'
  )

  return (
    <Tabs defaultValue="take-attendance">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="take-attendance">Take Attendance</TabsTrigger>
        <TabsTrigger value="verifications">
          Verifications <Badge className="ml-2">{pendingVerifications.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="take-attendance" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
            <CardDescription>
              Start a session to record student attendance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!sessionStarted ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Select onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStartSession}
                  disabled={!selectedClass}
                  className="w-full sm:w-auto"
                >
                  Start Session
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {currentClass?.name} Session
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEndSession}
                  >
                    End Session
                  </Button>
                </div>
                {attendanceMethod === 'face' && (
                  <Card className="p-4">
                    <CardTitle className="mb-2">Live Verification</CardTitle>
                    <CardDescription className="mb-4">
                      System is identifying students from the camera stream and
                      awaiting approvals in the 'Verifications' tab.
                    </CardDescription>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentClass?.students.map((s, i) => (
                        <div
                          key={s.id}
                          className="flex flex-col items-center gap-2"
                        >
                          <Avatar
                            className={`w-20 h-20 border-4 ${
                              verifications.find(
                                (v) =>
                                  v.student.id === s.id &&
                                  v.status === 'approved'
                              )
                                ? 'border-green-500'
                                : verifications.find(
                                    (v) =>
                                      v.student.id === s.id &&
                                      v.status === 'pending'
                                  )
                                ? 'border-yellow-500'
                                : 'border-gray-300'
                            }`}
                          >
                            <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-center">{s.name}</span>
                          {verifications.find(
                            (v) =>
                              v.student.id === s.id && v.status === 'approved'
                          ) && (
                            <Badge variant="secondary" className="text-green-600">
                              Present
                            </Badge>
                          )}
                          {verifications.find(
                            (v) =>
                              v.student.id === s.id && v.status === 'pending'
                          ) && <Badge variant="outline">Pending</Badge>}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="verifications" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>
              Review and approve or reject student attendance submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending verifications.
              </p>
            ) : (
              pendingVerifications.map((req) => (
                <Card key={req.id}>
                  <CardContent className="pt-6 grid md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {req.student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{req.student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {req.student.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(req.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {req.location.lat.toFixed(4)},{' '}
                            {req.location.lon.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerification(req.id, 'rejected')}
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVerification(req.id, 'approved')}
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="history" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              View past attendance records for your classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.student.name}</TableCell>
                    <TableCell>{a.class.name}</TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={a.status === 'Present' ? 'default' : 'destructive'}
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

const StudentAttendance = ({
  setVerifications,
}: {
  setVerifications: React.Dispatch<React.SetStateAction<FaceVerificationRequest[]>>
}) => {
  const { toast } = useToast()
  const { user } = useUser()
  const [isCheckingLocation, setIsCheckingLocation] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'failed' | null
  >(null)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [wantsToVerify, setWantsToVerify] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Hardcoded class location and radius
  const classLocation = { lat: 28.688702547493328, lon: 77.45572644713074 }
  const allowedRadius = 50 // in meters

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // metres
    const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // in metres
  }
  
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // for iOS
        await videoRef.current.play();
      }
      setIsVerifying(true);
    } catch (err) {
      console.error('Error accessing camera: ', err);
      setHasCameraPermission(false);
      setIsVerifying(false);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (wantsToVerify) {
      setIsCheckingLocation(true);
      if (!navigator.geolocation) {
        toast({
          title: 'Geolocation Error',
          description: 'Geolocation is not supported by your browser.',
          variant: 'destructive',
        });
        setIsCheckingLocation(false);
        setWantsToVerify(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = getDistance(
            latitude,
            longitude,
            classLocation.lat,
            classLocation.lon
          );

          if (distance <= allowedRadius) {
            openCamera();
          } else {
            toast({
              title: 'Location Error',
              description: `You are not at the correct location. You are ${distance.toFixed(
                0
              )} meters away.`,
              variant: 'destructive',
            });
          }
          setIsCheckingLocation(false);
          setWantsToVerify(false);
        },
        () => {
          toast({
            title: 'Location Error',
            description: 'Could not get your location. Please enable location services.',
            variant: 'destructive',
          });
          setIsCheckingLocation(false);
          setWantsToVerify(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [wantsToVerify]);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (isVerifying) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      }
    };

    getCameraPermission();
  }, [isVerifying]);


  const captureAndSubmit = async () => {
    if (videoRef.current && canvasRef.current && user) {
      const studentData = students.find(s => s.id === user.id);
      if (!studentData?.referencePhotoUri) {
          toast({
            title: 'Verification Failed',
            description: 'No reference photo found for your profile. Please contact an admin.',
            variant: 'destructive',
          });
          return;
      }
        
      setIsSubmitting(true)
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)
      const photoDataUri = canvas.toDataURL('image/jpeg')

      try {
        const { isMatch, reason } = await verifyFace({ photoDataUri, referencePhotoUri: studentData.referencePhotoUri })
        if (!isMatch) {
          toast({
            title: 'Face Verification Failed',
            description:
              reason ||
              'Your face did not match the profile. Please try again.',
            variant: 'destructive',
          })
          setIsSubmitting(false)
          return
        }
      } catch (error) {
        console.error('Error verifying face:', error)
        toast({
          title: 'Verification Failed',
          description: 'Could not verify your face. Please try again.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }

          const newVerificationRequest: FaceVerificationRequest = {
            id: `fv${Date.now()}`,
            student: { id: user.id, name: user.name },
            photoDataUri,
            location,
            timestamp: Date.now(),
            status: 'pending',
          }

          setVerifications((prev) => [...prev, newVerificationRequest])

          stopVerificationCamera()
          setVerificationStatus('pending')
          toast({
            title: 'Submitted for Verification',
            description:
              'Your photo has been sent to the teacher for approval.',
          })
          setIsSubmitting(false)
        },
        (error) => {
          console.error('Error getting location: ', error)
          toast({
            title: 'Location Error',
            description:
              'Could not get your location. Please enable location services.',
            variant: 'destructive',
          })
          setIsSubmitting(false)
        },
        { enableHighAccuracy: true }
      )
    }
  }

  const stopVerificationCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsVerifying(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Join Session</CardTitle>
            <CardDescription>
              Join your class session using face recognition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="h-24 w-full"
              variant="secondary"
              onClick={() => setWantsToVerify(true)}
              disabled={
                isVerifying ||
                verificationStatus === 'pending' ||
                isCheckingLocation
              }
            >
              {isCheckingLocation ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Camera className="mr-2 h-6 w-6" />
              )}
              {isCheckingLocation
                ? 'Checking Location...'
                : 'Use Face Recognition'}
            </Button>
          </CardContent>
          {verificationStatus === 'pending' && (
            <CardFooter>
              <div className="w-full text-center p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-800 dark:text-yellow-200">
                Your face verification is pending teacher approval.
              </div>
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.slice(0, 3).map((att) => (
                  <TableRow key={att.id}>
                    <TableCell>{att.class.name}</TableCell>
                    <TableCell>{att.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          att.status === 'Present' ? 'default' : 'destructive'
                        }
                      >
                        {att.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{att.method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={isVerifying}
        onOpenChange={(open) => !open && stopVerificationCamera()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Face Verification</DialogTitle>
            <DialogDescription>
              Ensure you are in a well-lit area, with your face clearly visible and centered in the frame.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
             {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Alert variant="destructive" className="w-auto">
                      <AlertTitle>Camera Access Denied</AlertTitle>
                      <AlertDescription>
                        Please enable camera permissions in your browser to continue.
                      </AlertDescription>
                    </Alert>
                </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={stopVerificationCamera}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={captureAndSubmit} disabled={isSubmitting || hasCameraPermission !== true}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Camera className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Verifying...' : 'Capture and Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AttendancePage() {
  const { role } = useUser()
  const [verifications, setVerifications] = useState(
    initialFaceVerificationRequests
  )

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold">Attendance</h1>
      {role === 'teacher' ? (
        <TeacherAttendance
          verifications={verifications}
          setVerifications={setVerifications}
        />
      ) : (
        <StudentAttendance setVerifications={setVerifications} />
      )}
    </div>
  )
}
