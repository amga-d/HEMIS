import { Sidebar } from "@/components/sidebar";
import AuthCheck from "@/components/auth-check";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-cyan-700 to-indigo-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}
