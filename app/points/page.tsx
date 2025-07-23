"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Gift, Users, Award, Crown, Medal, ArrowLeft } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

const pointsBreakdown = [
  { action: "Report Issue", points: 25, description: "Submit a new civic issue" },
  { action: "Issue Resolved", points: 50, description: "Your reported issue gets resolved" },
  { action: "Photo Evidence", points: 10, description: "Add photos to your report" },
  { action: "Upvote Issue", points: 5, description: "Support community issues" },
  { action: "Quick Response", points: 15, description: "Report urgent issues within 1 hour" },
  { action: "Weekly Streak", points: 30, description: "Stay active for 7 consecutive days" },
]

const leaderboard = [
  { rank: 1, name: "Sarah M.", points: 1250, avatar: "SM", badge: "🏆" },
  { rank: 2, name: "Mike R.", points: 980, avatar: "MR", badge: "🥈" },
  { rank: 3, name: "Lisa K.", points: 875, avatar: "LK", badge: "🥉" },
  { rank: 4, name: "David L.", points: 720, avatar: "DL", badge: "⭐" },
  { rank: 5, name: "Emma W.", points: 650, avatar: "EW", badge: "⭐" },
  { rank: 6, name: "You", points: 340, avatar: "JD", badge: "🔥", isCurrentUser: true },
  { rank: 7, name: "Alex P.", points: 290, avatar: "AP", badge: "💪" },
  { rank: 8, name: "Maria G.", points: 245, avatar: "MG", badge: "🌟" },
]

const rewards = [
  {
    id: 1,
    title: "Coffee Voucher",
    description: "Free coffee at local cafes",
    points: 100,
    available: true,
    icon: "☕",
  },
  {
    id: 2,
    title: "Public Transport Pass",
    description: "1-day free bus pass",
    points: 200,
    available: true,
    icon: "🚌",
  },
  {
    id: 3,
    title: "Community Recognition",
    description: "Featured in monthly newsletter",
    points: 300,
    available: true,
    icon: "📰",
  },
  {
    id: 4,
    title: "City Hall Tour",
    description: "Exclusive behind-the-scenes tour",
    points: 500,
    available: false,
    icon: "🏛️",
  },
  {
    id: 5,
    title: "Mayor Meeting",
    description: "15-minute meeting with the mayor",
    points: 1000,
    available: false,
    icon: "🤝",
  },
]

const achievements = [
  { title: "First Steps", description: "Reported your first issue", completed: true, points: 25 },
  { title: "Photo Pro", description: "Added photos to 10 reports", completed: true, points: 50 },
  { title: "Community Helper", description: "Helped resolve 5 issues", completed: true, points: 75 },
  { title: "Consistency King", description: "Active for 30 days", completed: false, points: 100, progress: 65 },
  { title: "Local Hero", description: "Top 10 in your district", completed: false, points: 150, progress: 23 },
  { title: "Super Citizen", description: "Earn 1000 total points", completed: false, points: 200, progress: 34 },
]

export default function PointsPage() {
  const { user, updateUserStats, addNotification } = useAppStore()
  const [activeTab, setActiveTab] = useState("overview")
  const nextLevelPoints = 500

  const handleRedeemReward = (reward: (typeof rewards)[0]) => {
    if (user.points >= reward.points) {
      updateUserStats({ points: -reward.points })
      addNotification({
        id: Date.now().toString(),
        title: "Reward Redeemed!",
        description: `You've successfully redeemed: ${reward.title}`,
        type: "points",
        time: "Just now",
        read: false,
      })
      alert(`🎉 Congratulations! You've redeemed: ${reward.title}`)
    } else {
      alert(`You need ${reward.points - user.points} more points to redeem this reward.`)
    }
  }

  const handleLeaderboardClick = (userItem: (typeof leaderboard)[0]) => {
    if (userItem.isCurrentUser) {
      alert("That's you! Keep up the great work! 🎉")
    } else {
      alert(`${userItem.name} has ${userItem.points} points. Great job to them!`)
    }
  }

  const handleAchievementClick = (achievement: (typeof achievements)[0]) => {
    if (achievement.completed) {
      alert(`🏆 Achievement Unlocked: ${achievement.title} - ${achievement.description}`)
    } else {
      const progressText = achievement.progress ? ` (${achievement.progress}% complete)` : ""
      alert(`🎯 Keep going! ${achievement.description}${progressText}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-6">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Your Points</h1>
          <div className="text-3xl font-bold mb-2">{user.points}</div>
          <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
            <span>Level 3 Citizen</span>
            <Badge className="bg-white/20 text-white border-white/30">Rank #{user.rank}</Badge>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level 4</span>
              <span>{nextLevelPoints - user.points} points to go</span>
            </div>
            <Progress value={(user.points / nextLevelPoints) * 100} className="h-2 bg-white/20" />
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  How to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pointsBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
                    onClick={() => alert(`💡 Tip: ${item.description}`)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.action}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{item.description}</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +{item.points}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Points Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Reported pothole issue</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                  <Badge className="bg-green-500">+25</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Issue resolved bonus</div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                  <Badge className="bg-green-500">+50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Photo evidence added</div>
                    <div className="text-xs text-gray-500">2 days ago</div>
                  </div>
                  <Badge className="bg-green-500">+10</Badge>
                </div>
              </CardContent>
            </Card>

            <Link href="/upload">
              <Button className="w-full">
                <Trophy className="h-4 w-4 mr-2" />
                Earn More Points
              </Button>
            </Link>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Community Leaderboard
                </CardTitle>
                <CardDescription>Top contributors in your district</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((userItem, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:shadow-md transition-all ${
                      userItem.isCurrentUser
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleLeaderboardClick(userItem)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 font-bold text-sm">
                      {userItem.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {userItem.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center">
                        {userItem.name}
                        {userItem.isCurrentUser && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{userItem.points} points</div>
                    </div>
                    <div className="text-xl">{userItem.badge}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-purple-500" />
                  Available Rewards
                </CardTitle>
                <CardDescription>Redeem your points for real benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl">{reward.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{reward.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{reward.description}</div>
                      <div className="text-xs text-purple-600 font-medium mt-1">{reward.points} points</div>
                    </div>
                    <Button
                      size="sm"
                      disabled={!reward.available || user.points < reward.points}
                      variant={reward.available && user.points >= reward.points ? "default" : "outline"}
                      onClick={() => handleRedeemReward(reward)}
                    >
                      {user.points >= reward.points ? "Redeem" : "Locked"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardContent className="p-4 text-center">
                <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Premium Rewards Coming Soon!</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Unlock exclusive city benefits and special recognition programs
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-500" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Complete goals to earn bonus points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="space-y-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                    onClick={() => handleAchievementClick(achievement)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            achievement.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {achievement.completed ? <Medal className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{achievement.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">{achievement.description}</div>
                        </div>
                      </div>
                      <Badge
                        variant={achievement.completed ? "default" : "outline"}
                        className={achievement.completed ? "bg-green-500" : ""}
                      >
                        {achievement.completed ? "Completed" : `+${achievement.points}`}
                      </Badge>
                    </div>
                    {!achievement.completed && achievement.progress && (
                      <div className="ml-11">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav currentPage="points" />
    </div>
  )
}
