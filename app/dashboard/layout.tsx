import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { LayoutDashboard, PlusCircle, Briefcase, Users, ArrowLeft } from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/post-job", icon: PlusCircle, label: "Post a Job" },
  { href: "/dashboard/my-jobs", icon: Briefcase, label: "My Jobs" },
  { href: "/dashboard/applications", icon: Users, label: "Applications" },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Back to site */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to site
            </Link>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">Dashboard</p>

            {sidebarLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <img
                src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=2563eb&color=fff`}
                alt="avatar"
                className="w-9 h-9 rounded-full ring-2 ring-blue-500/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{session.user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
