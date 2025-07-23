"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, MapPin, Upload, CheckCircle, X, ArrowLeft, ImageIcon } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { CameraCapture } from "@/components/camera-capture"
import { useAppStore } from "@/lib/store"
import { useNotifications } from "@/components/notification-provider"
import Link from "next/link"

const categories = [
  { value: "roads", label: "Roads & Infrastructure", icon: "🛣️", color: "bg-red-100 text-red-800" },
  { value: "lighting", label: "Street Lighting", icon: "💡", color: "bg-yellow-100 text-yellow-800" },
  { value: "waste", label: "Waste Management", icon: "🗑️", color: "bg-green-100 text-green-800" },
  { value: "water", label: "Water & Drainage", icon: "💧", color: "bg-blue-100 text-blue-800" },
  { value: "parks", label: "Parks & Recreation", icon: "🌳", color: "bg-emerald-100 text-emerald-800" },
  { value: "other", label: "Other", icon: "📋", color: "bg-gray-100 text-gray-800" },
]

export default function UploadPage() {
  const { addIssue, addNotification, updateUserStats } = useAppStore()
  const { sendNotification } = useNotifications()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const handleCameraCapture = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const issueId = `CIV-2024-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    // Add issue to store
    addIssue({
      id: issueId,
      title,
      description,
      category: selectedCategory,
      location,
      images: images.length > 0 ? images : ["/placeholder.svg?height=200&width=300"],
      status: "Submitted",
      priority: "Medium",
      upvotes: 0,
      comments: 0,
      reportedBy: "You",
      timeAgo: "Just now",
      createdAt: new Date().toISOString(),
    })

    // Add notification
    addNotification({
      id: Date.now().toString(),
      title: "Issue reported successfully!",
      description: `Your report "${title}" has been submitted`,
      type: "status_update",
      time: "Just now",
      read: false,
    })

    // Send push notification
    sendNotification("Issue Reported!", {
      body: `Your report "${title}" has been submitted successfully. You earned 25 points!`,
    })

    // Update user stats
    updateUserStats({ reportsCount: 1, points: 25 })

    setIsUploading(false)
    setIsSubmitted(true)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocation("Location access denied - Please enter manually")
        },
      )
    } else {
      setLocation("Geolocation not supported - Please enter manually")
    }
  }

  const resetForm = () => {
    setSelectedCategory("")
    setLocation("")
    setDescription("")
    setTitle("")
    setImages([])
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Issue Reported!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your report has been submitted successfully. You've earned 25 points!
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Issue ID: #{`CIV-2024-${Math.floor(Math.random() * 1000)}`}
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={resetForm} className="w-full">
                Report Another Issue
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <BottomNav currentPage="upload" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Report an Issue</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Help improve your community</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label>Issue Category *</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedCategory === category.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                placeholder="Enter address or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="button" variant="outline" onClick={getCurrentLocation} size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label>Photos (Optional)</Label>

            {/* Upload Options */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Gallery</p>
                  <p className="text-xs text-gray-500 mt-1">Select from photos</p>
                </label>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => setShowCamera(true)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Camera</p>
                  <p className="text-xs text-gray-500 mt-1">Take new photo</p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12"
            disabled={!selectedCategory || !location || !description || !title || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">💡 Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Take clear photos from multiple angles</li>
              <li>• Be specific about the location</li>
              <li>• Check if the issue was already reported</li>
              <li>• Mention any safety concerns</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Camera Modal */}
      {showCamera && <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}

      <BottomNav currentPage="upload" />
    </div>
  )
}
