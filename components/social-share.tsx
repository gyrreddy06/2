"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Twitter, Facebook, MessageCircle, Copy, X } from "lucide-react"

interface SocialShareProps {
  title: string
  description: string
  url?: string
  onClose?: () => void
}

export function SocialShare({ title, description, url = window.location.href, onClose }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${title} - ${description}`,
    )}&url=${encodeURIComponent(url)}&hashtags=CivicFix,Community`
    window.open(twitterUrl, "_blank", "width=550,height=420")
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, "_blank", "width=550,height=420")
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${description} ${url}`)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.log("Error copying:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Share this issue</h3>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {/* Native Share (if supported) */}
            {navigator.share && (
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleNativeShare}>
                <Share2 className="h-4 w-4 mr-3" />
                Share via...
              </Button>
            )}

            {/* Social Media Options */}
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleTwitterShare}>
              <Twitter className="h-4 w-4 mr-3 text-blue-400" />
              Share on Twitter
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleFacebookShare}>
              <Facebook className="h-4 w-4 mr-3 text-blue-600" />
              Share on Facebook
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleWhatsAppShare}>
              <MessageCircle className="h-4 w-4 mr-3 text-green-500" />
              Share on WhatsApp
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-3" />
              {copied ? "Link Copied!" : "Copy Link"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
