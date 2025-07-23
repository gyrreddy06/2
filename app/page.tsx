"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle, Users, ThumbsUp, Share2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { useAppStore } from "@/lib/store"
import { useNotifications } from "@/components/notification-provider"
import { SocialShare } from "@/components/social-share"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  const { user, issues, notifications, markNotificationAsRead } = useAppStore()
  const { requestPermission, sendNotification, permission } = useNotifications()
  const [unreadCount, setUnreadCount] = useState(0)
  const [shareIssue, setShareIssue] = useState<any>(null)

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  useEffect(() => {
    // Request notification permission on first load
    if (permission === "default") {
      requestPermission()
    }
  }, [permission, requestPermission])

  const recentIssues = issues.slice(0, 3)
  const nearbyIssues = issues.filter((issue) => issue.location.includes("Street")).slice(0, 2)

  const handleNotificationClick = async () => {
    // Mark all notifications as read
    notifications.forEach((notification) => {
      if (!notification.read) {
        markNotificationAsRead(notification.id)
      }
    })
    setUnreadCount(0)

    // Send test notification if permission granted
    if (permission === "granted") {
      sendNotification("Notifications cleared!", {
        body: "All your notifications have been marked as read.",
      })
    }
  }

  const handleUpvote = (issueId: string) => {
    console.log(`Upvoted issue ${issueId}`)
    if (permission === "granted") {
      sendNotification("Issue Upvoted!", {
        body: "Thanks for supporting this community issue. +5 points earned!",
      })
    }
  }

  const handleShare = (issue: any) => {
    setShareIssue(issue)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Good morning, {user.name}!</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Here's what's happening in your area</p>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleNotificationClick} className="relative">
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">{user.reportsCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Your Reports</div>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">{user.resolvedCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Resolved</div>
            </CardContent>
          </Card>
          <Link href="/points">
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-bold text-gray-900 dark:text-white">{user.points}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Your Points</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Updates */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Updates</h2>
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      {notification.type === "status_update" && <AlertTriangle className="h-6 w-6 text-blue-600" />}
                      {notification.type === "resolved" && <CheckCircle className="h-6 w-6 text-green-600" />}
                      {notification.type === "points" && <TrendingUp className="h-6 w-6 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</h3>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{notification.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nearby Issues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nearby Issues</h2>
            <Button variant="ghost" size="sm" className="text-blue-600" asChild>
              <Link href="/issues">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {nearbyIssues.map((issue) => (
              <Card key={issue.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={issue.images[0] || "/placeholder.svg?height=64&width=64"}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{issue.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {issue.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {issue.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`text-xs ${
                              issue.status === "Resolved"
                                ? "bg-green-500"
                                : issue.status === "In Progress"
                                  ? "bg-orange-500"
                                  : issue.status === "Verified"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                            }`}
                          >
                            {issue.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleUpvote(issue.id)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {issue.upvotes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleShare(issue)}
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Impact */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Community Impact</h3>
                <p className="text-sm opacity-90">
                  Your reports helped resolve {user.resolvedCount} issues this month!
                </p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Action */}
        <Link href="/upload">
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* Social Share Modal */}
      {shareIssue && (
        <SocialShare
          title={shareIssue.title}
          description={`Help resolve this community issue: ${shareIssue.description}`}
          onClose={() => setShareIssue(null)}
        />
      )}

      <BottomNav currentPage="home" />
    </div>
  )
}
