"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowLeft, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Filter } from "lucide-react"
import Link from "next/link"

const adminIssues = [
  {
    id: "CIV-2024-001",
    title: "Large pothole causing traffic issues",
    category: "Roads",
    status: "In Progress",
    priority: "High",
    location: "Main Street & 5th Avenue",
    reportedBy: "John D.",
    assignedTo: "Road Maintenance Dept.",
    createdAt: "2024-01-20",
    dueDate: "2024-01-25",
    sla: "On Track",
  },
  {
    id: "CIV-2024-002",
    title: "Broken street light creating safety hazard",
    category: "Lighting",
    status: "Verified",
    priority: "Medium",
    location: "Park Avenue near Central School",
    reportedBy: "Sarah M.",
    assignedTo: "Electrical Maintenance",
    createdAt: "2024-01-19",
    dueDate: "2024-01-22",
    sla: "At Risk",
  },
  {
    id: "CIV-2024-003",
    title: "Overflowing garbage bins attracting pests",
    category: "Waste",
    status: "Resolved",
    priority: "Medium",
    location: "Central Market Square",
    reportedBy: "Mike R.",
    assignedTo: "Waste Management",
    createdAt: "2024-01-17",
    dueDate: "2024-01-20",
    sla: "Completed",
  },
  {
    id: "CIV-2024-004",
    title: "Blocked storm drain causing flooding",
    category: "Water",
    status: "Submitted",
    priority: "High",
    location: "Elm Street residential area",
    reportedBy: "Lisa K.",
    assignedTo: "Unassigned",
    createdAt: "2024-01-20",
    dueDate: "2024-01-23",
    sla: "Overdue",
  },
]

const categoryData = [
  { name: "Roads", value: 45, color: "#ef4444" },
  { name: "Lighting", value: 25, color: "#f59e0b" },
  { name: "Waste", value: 20, color: "#22c55e" },
  { name: "Water", value: 10, color: "#3b82f6" },
]

const monthlyData = [
  { month: "Oct", submitted: 65, resolved: 58 },
  { month: "Nov", submitted: 78, resolved: 72 },
  { month: "Dec", submitted: 82, resolved: 79 },
  { month: "Jan", submitted: 95, resolved: 85 },
]

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

const slaColors = {
  "On Track": "bg-green-500",
  "At Risk": "bg-yellow-500",
  Overdue: "bg-red-500",
  Completed: "bg-blue-500",
}

export default function AdminPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIssues = adminIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || issue.status.toLowerCase().replace(" ", "-") === selectedStatus
    const matchesPriority = selectedPriority === "all" || issue.priority.toLowerCase() === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    totalIssues: adminIssues.length,
    pendingIssues: adminIssues.filter((i) => i.status !== "Resolved").length,
    resolvedIssues: adminIssues.filter((i) => i.status === "Resolved").length,
    overdueIssues: adminIssues.filter((i) => i.sla === "Overdue").length,
  }

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Municipal Officer</Badge>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="issues">Issue Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Issues</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalIssues}</p>
                    </div>
                    <AlertTriangle className="h-12 w-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.pendingIssues}</p>
                    </div>
                    <Clock className="h-12 w-12 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Resolved</p>
                      <p className="text-3xl font-bold text-green-600">{stats.resolvedIssues}</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overdue</p>
                      <p className="text-3xl font-bold text-red-600">{stats.overdueIssues}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" />
                      <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Issue Management Tab */}
          <TabsContent value="issues" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Export Data</Button>
                </div>
              </CardContent>
            </Card>

            {/* Issues Table */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Management</CardTitle>
                <CardDescription>{filteredIssues.length} issues found</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {issue.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{issue.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[issue.status as keyof typeof statusColors]}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={priorityColors[issue.priority as keyof typeof priorityColors]}
                          >
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.assignedTo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={slaColors[issue.sla as keyof typeof slaColors]}>
                            {issue.sla}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm">Assign</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Resolution Time</span>
                      <span className="font-bold">4.2 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fastest Resolution</span>
                      <span className="font-bold text-green-600">1.5 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Slowest Resolution</span>
                      <span className="font-bold text-red-600">12 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SLA Compliance</span>
                      <span className="font-bold text-blue-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Road Maintenance</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Electrical Maintenance</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Waste Management</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Water & Drainage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                        <span className="text-sm font-medium">58%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Road Maintenance</CardTitle>
                  <CardDescription>Infrastructure & Road Repairs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Issues:</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Resolution:</span>
                      <span className="font-bold">5.2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Size:</span>
                      <span className="font-bold">8 workers</span>
                    </div>
                    <Button className="w-full" size="sm">
                      Manage Team
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Electrical Maintenance</CardTitle>
                  <CardDescription>Street Lights & Electrical</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Issues:</span>
                      <span className="font-bold">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Resolution:</span>
                      <span className="font-bold">3.8 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Size:</span>
                      <span className="font-bold">5 workers</span>
                    </div>
                    <Button className="w-full" size="sm">
                      Manage Team
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Waste Management</CardTitle>
                  <CardDescription>Garbage Collection & Disposal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Issues:</span>
                      <span className="font-bold">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Resolution:</span>
                      <span className="font-bold">2.1 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Size:</span>
                      <span className="font-bold">12 workers</span>
                    </div>
                    <Button className="w-full" size="sm">
                      Manage Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
