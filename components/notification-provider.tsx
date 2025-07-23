"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"

interface NotificationContextType {
  permission: NotificationPermission
  requestPermission: () => Promise<NotificationPermission>
  sendNotification: (title: string, options?: NotificationOptions) => void
  isSupported: boolean
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const { addNotification } = useAppStore()

  useEffect(() => {
    setIsSupported("Notification" in window)
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return "denied"

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== "granted") return

    const notification = new Notification(title, {
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      ...options,
    })

    // Also add to in-app notifications
    addNotification({
      id: Date.now().toString(),
      title,
      description: options?.body || "",
      type: "status_update",
      time: "Just now",
      read: false,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000)
  }

  const value = {
    permission,
    requestPermission,
    sendNotification,
    isSupported,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
