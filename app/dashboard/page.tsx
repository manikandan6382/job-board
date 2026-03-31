import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Briefcase, Users, Clock, CheckCircle } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [totalJobs, totalApplications, pendingApplications, acceptedApplications, recentApplications] =
    await Promise.all([
      prisma.job.count({ where: { userId: (session?.user as any)?.id } }),
      prisma.application.count({ where: { job: { userId: (session?.user as any)?.id } } }),
      prisma.application.count({ where: { job: { userId: (session?.user as any)?.id }, status: "PENDING" } }),
      prisma.application.count({ where: { job: { userId: (session?.user as any)?.id }, status: "ACCEPTED" } }),
      prisma.application.findMany({
        where: { job: { userId: (session?.user as any)?.id } },
        include: { job: true, user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

  const stats = [
    { label: "Jobs Posted", value: totalJobs, icon: Briefcase, color: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" },
    { label: "Total Applications", value: totalApplications, icon: Users, color: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" },
    { label: "Pending Review", value: pendingApplications, icon: Clock, color: "bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400" },
    { label: "Accepted", value: acceptedApplications, icon: CheckCircle, color: "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400" },
  ]

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Applications</h2>
        </div>
        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No applications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={app.user.image || `https://ui-avatars.com/api/?name=${app.user.name}&background=2563eb&color=fff`}
                    alt={app.user.name || ""}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{app.user.name}</p>
                    <p className="text-xs text-slate-400">{app.job.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 hidden sm:block">{formatDate(app.createdAt)}</span>
                  <Badge variant={app.status as any}>{app.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
