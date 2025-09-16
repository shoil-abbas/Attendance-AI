'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, Smile, ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const enrollmentSteps = [
  { instruction: 'Look straight at the camera', icon: <Camera className="h-8 w-8" />, duration: 3000 },
  { instruction: 'Slowly turn your head to the left', icon: <ArrowLeft className="h-8 w-8" />, duration: 4000 },
  { instruction: 'Slowly turn your head to the right', icon: <ArrowRight className="h-8 w-8" />, duration: 4000 },
  { instruction: 'Smile!', icon: <Smile className="h-8 w-8" />, duration: 2000 },
]

export default function FaceEnrollment() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraOn(true)
    } catch (err) {
      console.error("Error accessing camera: ", err)
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setIsCameraOn(false)
    }
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (isEnrolling && currentStep < enrollmentSteps.length) {
      if (currentStep === -1) {
        setCurrentStep(0)
        return
      }

      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, enrollmentSteps[currentStep].duration)

      return () => clearTimeout(timer)
    }

    if (currentStep >= enrollmentSteps.length) {
      setIsEnrolling(false)
      setIsCompleted(true)
      stopCamera()
      toast({
        title: "Enrollment Successful",
        description: "Your face has been successfully enrolled.",
      })
    }
  }, [currentStep, isEnrolling, toast])

  const handleStartEnrollment = () => {
    setIsCompleted(false)
    startCamera().then(() => {
      setIsEnrolling(true)
      setCurrentStep(-1)
    })
  }
  
  const handleReset = () => {
    setIsCompleted(false)
    setCurrentStep(-1)
    setIsEnrolling(false)
    stopCamera()
  }

  const progress = isEnrolling ? ((currentStep + 1) / enrollmentSteps.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Face Enrollment</CardTitle>
        <CardDescription>
          Register your face for AI-powered attendance verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          {isCameraOn ? (
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Camera is off</p>
            </div>
          )}
          <AnimatePresence>
            {isEnrolling && currentStep >= 0 && currentStep < enrollmentSteps.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center"
              >
                <div className="text-primary">{enrollmentSteps[currentStep].icon}</div>
                <p className="mt-2 text-lg font-semibold text-white">
                  {enrollmentSteps[currentStep].instruction}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {isCompleted && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/80 p-4 text-center">
                <Check className="h-16 w-16 text-white" />
                <p className="mt-2 text-lg font-semibold text-white">
                  Enrollment Complete!
                </p>
              </div>
          )}
        </div>
        {(isEnrolling || isCompleted) && <Progress value={isCompleted ? 100 : progress} className="w-full" />}
      </CardContent>
      <CardFooter>
        {!isEnrolling && !isCompleted && (
          <Button onClick={handleStartEnrollment} className="w-full">
            <Camera className="mr-2 h-4 w-4" /> Start Enrollment
          </Button>
        )}
        {(isEnrolling || isCompleted) && (
            <Button onClick={handleReset} variant="outline" className="w-full">
             {isCompleted ? "Enroll Again" : "Cancel"}
            </Button>
        )}
      </CardFooter>
    </Card>
  )
}
