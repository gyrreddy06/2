"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, MapPin, Calendar, Settings, Bell, Shield, HelpCircle, LogOut, Edit, ArrowLeft } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { SocialShare } from "@/components/social-share"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

const badges = [
  { name: "First Reporter", description: "Reported your first issue", icon: "🎯", earned: true },
  { name: "Community Helper", description: "Helped resolve 5 issues", icon: "🤝", earned: true },
  { name: "Photo Pro", description: "Added photos to 10 reports", icon: "📸", earned: true },
  { name: "Local Hero", description: "Top contributor in your area", icon: "🏆", earned: false },
  { name: "Speed Demon", description: "Quick to report urgent issues", icon: "⚡", earned: false },
  { name: "Consistency King", description: "Active for 30 days straight", icon: "👑", earned: false },
]

const statusColors = {
  "In Progress": "bg-orange-500",
  Resolved: "bg-green-500",
  Verified: "bg-yellow-500",
  Submitted: "bg-blue-500",
}

export default function ProfilePage() {
  const { user, issues, notifications, clearAllData } = useAppStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)

  const userIssues = issues.filter((issue) => issue.reportedBy === "You")
  const recentActivity = userIssues.slice(0, 4).map((issue) => ({
    id: issue.id,
    action: `Reported ${issue.title.toLowerCase()}`,
    location: issue.location,
    date: issue.timeAgo,
    status: issue.status,
    points: 25,
  }))

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      clearAllData()
      // In a real app, you would redirect to login page
      alert("Signed out successfully!")
    }
  }

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      alert("Profile updated successfully!")
    }
  }

  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled)
    if (enabled) {
      alert("Notifications enabled")
    } else {
      alert("Notifications disabled")
    }
  }

  const handleLocationToggle = (enabled: boolean) => {
    setLocationEnabled(enabled)
    if (enabled) {
      alert("Location services enabled")
    } else {
      alert("Location services disabled")
    }
  }

  const handleContactSupport = () => {
    alert("Opening support chat...")
  }

  const handleShareBadge = (badge: any) => {
    setSelectedBadge(badge)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setActiveTab("settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">Active Citizen</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user.reportsCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Issues Reported</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user.resolvedCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Issues Resolved</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{user.points}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Total Points</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">#{user.rank}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Community Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Email</span>
                  </div>
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <span className="text-sm text-gray-600">{user.memberSince}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Location</span>
                  </div>
                  <span className="text-sm text-gray-600">{user.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Push Notifications</span>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Location Services</span>
                  </div>
                  <Switch checked={locationEnabled} onCheckedChange={handleLocationToggle} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Privacy</span>
                  </div>
                  <Badge variant="secondary">Public</Badge>
                </div>
                <Button variant="ghost" className="w-full justify-start p-2" onClick={handleContactSupport}>
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="text-sm">Help & Support</span>
                </Button>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    badge.earned
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                      : "opacity-60"
                  }`}
                  onClick={() => {
                    if (badge.earned) {
                      handleShareBadge(badge)
                    } else {
                      alert(`Keep contributing to unlock: ${badge.name}`)
                    }
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{badge.description}</p>
                    {badge.earned ? (
                      <Badge className="bg-green-500 text-xs">Earned</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Locked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <Card key={activity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-900 dark:text-white">{activity.action}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activity.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={statusColors[activity.status as keyof typeof statusColors]}
                            variant="secondary"
                          >
                            {activity.status}
                          </Badge>
                          <div className="text-xs text-green-600 mt-1">+{activity.points} pts</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{activity.date}</div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-2">📝</div>
                    <p className="text-gray-500">No activity yet</p>
                    <Link href="/upload">
                      <Button className="mt-4" size="sm">
                        Report Your First Issue
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Share Modal */}
      {selectedBadge && (
        <SocialShare
          title={`🏆 Achievement Unlocked: ${selectedBadge.name}`}
          description={`I just earned the "${selectedBadge.name}" badge on CivicFix! ${selectedBadge.description}`}
          onClose={() => setSelectedBadge(null)}
        />
      )}

      <BottomNav currentPage="profile" />
    </div>
  )
}
