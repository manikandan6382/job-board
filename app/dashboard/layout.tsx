import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LayoutDashboard, PlusCircle, Briefcase, Users } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/post-job", icon: PlusCircle, label: "Post a Job" },
  { href: "/dashboard/my-jobs", icon: Briefcase, label: "My Jobs" },
  { href: "/dashboard/applications", icon: Users, label: "Applications" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex-1 p-4 space-y-1 overflow-y-auto pt-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-4">MENU</p>

            {sidebarLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
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
                src={
                  session.user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=2563eb&color=fff`
                }
                alt="avatar"
                className="w-9 h-9 rounded-full ring-2 ring-blue-500/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{session.user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
              </div>
            </div>
            {user?.role && (
              <div className="mt-2 px-3">
                <span className="text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
