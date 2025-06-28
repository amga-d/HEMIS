import type React from "react"
import { Bell, User } from "lucide-react"

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl glass hover:bg-white/20 transition-colors">
            <Bell className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-3 glass-card py-2">
            <div className="p-2 rounded-full bg-white/20">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-medium">Dr. Smith</span>
          </div>
        </div>
      </div>
    </div>
  )
}
