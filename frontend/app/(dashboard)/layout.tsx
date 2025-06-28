import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </div>
  )
}
