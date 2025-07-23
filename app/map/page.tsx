"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, ArrowLeft, Filter, Layers } from "lucide-react"
import Link from "next/link"

const mapIssues = [
  {
    id: 1,
    title: "Pothole on Main Street",
    category: "Roads",
    status: "In Progress",
    lat: 40.7128,
    lng: -74.006,
    priority: "High",
  },
  {
    id: 2,
    title: "Broken Street Light",
    category: "Lighting",
    status: "Verified",
    lat: 40.7589,
    lng: -73.9851,
    priority: "Medium",
  },
  {
    id: 3,
    title: "Overflowing Garbage",
    category: "Waste",
    status: "Resolved",
    lat: 40.7505,
    lng: -73.9934,
    priority: "Low",
  },
  {
    id: 4,
    title: "Blocked Storm Drain",
    category: "Water",
    status: "Submitted",
    lat: 40.7282,
    lng: -73.7949,
    priority: "High",
  },
]

const statusColors = {
  Submitted: "#3b82f6",
  Verified: "#eab308",
  "In Progress": "#f97316",
  Resolved: "#22c55e",
}

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<(typeof mapIssues)[0] | null>(null)

  const filteredIssues = mapIssues.filter((issue) => {
    const matchesCategory = selectedCategory === "all" || issue.category.toLowerCase() === selectedCategory
    const matchesStatus = selectedStatus === "all" || issue.status.toLowerCase().replace(" ", "-") === selectedStatus
    return matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issues Map</h1>
            </div>
            <Link href="/report">
              <Button>Report Issue</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Map Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="roads">Roads</SelectItem>
                      <SelectItem value="lighting">Lighting</SelectItem>
                      <SelectItem value="waste">Waste</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Submitted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Resolved</span>
                </div>
              </CardContent>
            </Card>

            {/* Issue List */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Issues</CardTitle>
                <CardDescription>{filteredIssues.length} issues found</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedIssue?.id === issue.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: statusColors[issue.status as keyof typeof statusColors] }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {issue.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          issue.priority === "High"
                            ? "border-red-500 text-red-600"
                            : issue.priority === "Medium"
                              ? "border-yellow-500 text-yellow-600"
                              : "border-gray-500 text-gray-600"
                        }`}
                      >
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden">
                  {/* Placeholder Map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Interactive Map View
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Map integration would show real locations of reported issues
                      </p>
                    </div>
                  </div>

                  {/* Simulated Map Pins */}
                  <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: statusColors["In Progress"] }}
                      onClick={() => setSelectedIssue(mapIssues[0])}
                    ></div>
                  </div>
                  <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: statusColors["Verified"] }}
                      onClick={() => setSelectedIssue(mapIssues[1])}
                    ></div>
                  </div>
                  <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: statusColors["Resolved"] }}
                      onClick={() => setSelectedIssue(mapIssues[2])}
                    ></div>
                  </div>
                  <div className="absolute top-3/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: statusColors["Submitted"] }}
                      onClick={() => setSelectedIssue(mapIssues[3])}
                    ></div>
                  </div>

                  {/* Selected Issue Popup */}
                  {selectedIssue && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{selectedIssue.title}</h4>
                        <Badge
                          className="text-xs"
                          style={{ backgroundColor: statusColors[selectedIssue.status as keyof typeof statusColors] }}
                        >
                          {selectedIssue.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{selectedIssue.category}</Badge>
                        <Badge
                          variant="outline"
                          className={`${
                            selectedIssue.priority === "High"
                              ? "border-red-500 text-red-600"
                              : selectedIssue.priority === "Medium"
                                ? "border-yellow-500 text-yellow-600"
                                : "border-gray-500 text-gray-600"
                          }`}
                        >
                          {selectedIssue.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
