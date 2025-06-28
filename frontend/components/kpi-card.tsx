import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function KPICard({ title, value, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/20">
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? "text-green-300" : "text-red-300"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-white/70 text-sm font-medium mb-2">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  )
}
