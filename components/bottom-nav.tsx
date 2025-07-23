"use client"

import { Home, Upload, User, Trophy } from "lucide-react"
import Link from "next/link"

interface BottomNavProps {
  currentPage: "home" | "upload" | "profile" | "points"
}

export function BottomNav({ currentPage }: BottomNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "upload", label: "Report", icon: Upload, href: "/upload" },
    { id: "points", label: "Points", icon: Trophy, href: "/points" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-blue-600" : ""}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
