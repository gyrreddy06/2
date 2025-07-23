"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Search, ArrowLeft, MessageCircle, ThumbsUp, Share2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { SocialShare } from "@/components/social-share"
import { useAppStore } from "@/lib/store"
import { useNotifications } from "@/components/notification-provider"
import Link from "next/link"

const statusColors = {
  Submitted: "bg-blue-500",
  Verified: "bg-yellow-500",
  "In Progress": "bg-orange-500",
  Resolved: "bg-green-500",
}

const priorityColors = {
  Low: "bg-gray-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
}

export default function IssuesPage() {
  const { issues, updateUserStats } = useAppStore()
  const { sendNotification } = useNotifications()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<(typeof issues)[0] | null>(null)
  const [shareIssue, setShareIssue] = useState<any>(null)

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || issue.category.toLowerCase() === selectedCategory
    const matchesStatus = selectedStatus === "all" || issue.status.toLowerCase().replace(" ", "-") === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleUpvote = (issueId: string) => {
    updateUserStats({ points: 5 })
    sendNotification("Issue Upvoted!", {
      body: "Thanks for supporting this community issue. +5 points earned!",
    })
  }

  const handleComment = (issueId: string) => {
    alert("Comment feature coming soon! This will allow you to discuss issues with other community members.")
  }

  const handleShare = (issue: any) => {
    setShareIssue(issue)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Community Issues</h1>
          </div>
          <Link href="/upload">
            <Button size="sm">Report Issue</Button>
          </Link>
        </div>
      </header>

      <div className="p-4">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="waste">Waste</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={issue.images[0] || "/placeholder.svg"}
                      alt={issue.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {issue.location}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={statusColors[issue.status as keyof typeof statusColors]}>
                            {issue.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={priorityColors[issue.priority as keyof typeof priorityColors]}
                          >
                            {issue.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{issue.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpvote(issue.id)
                            }}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {issue.upvotes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleComment(issue.id)
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {issue.comments}
                          </Button>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {issue.timeAgo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{issue.category}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare(issue)
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedIssue?.id === issue.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2">Full Description</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{issue.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Reported by:</span>
                            <span className="ml-2 font-medium">{issue.reportedBy}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Priority:</span>
                            <Badge
                              variant="outline"
                              className={`ml-2 ${priorityColors[issue.priority as keyof typeof priorityColors]}`}
                            >
                              {issue.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpvote(issue.id)
                            }}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Upvote ({issue.upvotes})
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleComment(issue.id)
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Comment
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare(issue)
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">🔍</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No issues found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <Link href="/upload">
                  <Button>Report New Issue</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
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
