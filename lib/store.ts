"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Issue {
  id: string
  title: string
  description: string
  category: string
  location: string
  images: string[]
  status: "Submitted" | "Verified" | "In Progress" | "Resolved"
  priority: "Low" | "Medium" | "High"
  upvotes: number
  comments: number
  reportedBy: string
  timeAgo: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  description: string
  type: "status_update" | "resolved" | "points" | "new_issue"
  time: string
  read: boolean
}

export interface User {
  name: string
  email: string
  location: string
  memberSince: string
  reportsCount: number
  resolvedCount: number
  points: number
  rank: number
}

interface AppState {
  user: User
  issues: Issue[]
  notifications: Notification[]
  addIssue: (issue: Issue) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  updateUserStats: (updates: Partial<Pick<User, "reportsCount" | "resolvedCount" | "points">>) => void
  clearAllData: () => void
}

const initialUser: User = {
  name: "John Doe",
  email: "john.doe@email.com",
  location: "Downtown District",
  memberSince: "January 2024",
  reportsCount: 12,
  resolvedCount: 8,
  points: 340,
  rank: 23,
}

const initialIssues: Issue[] = [
  {
    id: "CIV-2024-001",
    title: "Large pothole causing traffic issues",
    description: "Deep pothole approximately 3 feet wide causing vehicles to swerve dangerously.",
    category: "roads",
    location: "Main Street & 5th Avenue",
    images: ["/placeholder.svg?height=200&width=300"],
    status: "In Progress",
    priority: "High",
    upvotes: 45,
    comments: 12,
    reportedBy: "John D.",
    timeAgo: "2 hours ago",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "CIV-2024-002",
    title: "Broken street light creating safety hazard",
    description: "Street light has been out for over a week, making the area unsafe for pedestrians at night.",
    category: "lighting",
    location: "Park Avenue near Central School",
    images: ["/placeholder.svg?height=200&width=300"],
    status: "Verified",
    priority: "Medium",
    upvotes: 28,
    comments: 8,
    reportedBy: "Sarah M.",
    timeAgo: "1 day ago",
    createdAt: "2024-01-19T14:30:00Z",
  },
  {
    id: "CIV-2024-003",
    title: "Overflowing garbage bins attracting pests",
    description: "Multiple garbage bins overflowing for several days, creating unsanitary conditions.",
    category: "waste",
    location: "Central Market Square",
    images: ["/placeholder.svg?height=200&width=300"],
    status: "Resolved",
    priority: "Medium",
    upvotes: 19,
    comments: 5,
    reportedBy: "Mike R.",
    timeAgo: "3 days ago",
    createdAt: "2024-01-17T09:15:00Z",
  },
]

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Your pothole report has been verified",
    description: "Main Street & 5th Ave - Road Maintenance team assigned",
    type: "status_update",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Issue resolved in your area",
    description: "Broken street light on Park Avenue has been fixed",
    type: "resolved",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "New issue reported nearby",
    description: "Overflowing garbage bin - Central Market",
    type: "new_issue",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    title: "You earned 50 points!",
    description: "Your report helped resolve a community issue",
    type: "points",
    time: "2 days ago",
    read: true,
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      issues: initialIssues,
      notifications: initialNotifications,

      addIssue: (issue) =>
        set((state) => ({
          issues: [issue, ...state.issues],
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        })),

      updateUserStats: (updates) =>
        set((state) => ({
          user: {
            ...state.user,
            reportsCount: state.user.reportsCount + (updates.reportsCount || 0),
            resolvedCount: state.user.resolvedCount + (updates.resolvedCount || 0),
            points: state.user.points + (updates.points || 0),
          },
        })),

      clearAllData: () =>
        set({
          user: initialUser,
          issues: initialIssues,
          notifications: initialNotifications,
        }),
    }),
    {
      name: "civicfix-storage",
    },
  ),
)
