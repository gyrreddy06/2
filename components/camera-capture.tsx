"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X, RotateCcw, Check } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    setIsLoading(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    } finally {
      setIsLoading(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageUrl)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      cleanup()
      onClose()
    }
  }

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const handleClose = () => {
    cleanup()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 text-white">
        <h2 className="font-semibold">Take Photo</h2>
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex-1 relative">
        {!stream && !capturedImage && (
          <div className="flex items-center justify-center h-full">
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold mb-2">Camera Access</h3>
                <p className="text-sm text-gray-600 mb-4">We need access to your camera to take photos of issues</p>
                <Button onClick={startCamera} disabled={isLoading}>
                  {isLoading ? "Starting Camera..." : "Start Camera"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {stream && !capturedImage && (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}

        {capturedImage && (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/50">
        {stream && !capturedImage && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        )}

        {capturedImage && (
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={retakePhoto} className="bg-white/20 text-white border-white/30">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
            <Button onClick={confirmPhoto} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Use Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
