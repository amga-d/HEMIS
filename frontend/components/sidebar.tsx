"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, DollarSign, Users, Shield, TrendingUp, Settings, LogOut, Activity } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Finance Report", href: "/finance", icon: DollarSign },
  { name: "HR Report", href: "/hr", icon: Users },
  { name: "Compliance Tracking", href: "/compliance", icon: Shield },
  { name: "Predictive Analytics", href: "/analytics", icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isLoggedIn")
    }
    router.push("/landing")
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 glass-panel m-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-white" />
        <h1 className="text-2xl font-bold text-white">HEMIS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? "bg-white/20 text-white shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-2 pt-4 border-t border-white/20">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
