import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Briefcase, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const [totalJobs, totalApplications, pendingApplications, acceptedApplications, recentApplications] =
    await Promise.all([
      prisma.job.count({ where: { userId } }),
      prisma.application.count({ where: { job: { userId } } }),
      prisma.application.count({ where: { job: { userId }, status: "PENDING" } }),
      prisma.application.count({ where: { job: { userId }, status: "ACCEPTED" } }),
      prisma.application.findMany({
        where: { job: { userId } },
        include: { job: true, user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    {
      label: "Jobs Posted",
      value: totalJobs,
      icon: Briefcase,
      iconBg: "bg-blue-100 dark:bg-blue-950/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-900",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      icon: Users,
      iconBg: "bg-purple-100 dark:bg-purple-950/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-900",
    },
    {
      label: "Pending Review",
      value: pendingApplications,
      icon: Clock,
      iconBg: "bg-yellow-100 dark:bg-yellow-950/50",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-900",
    },
    {
      label: "Accepted",
      value: acceptedApplications,
      icon: CheckCircle,
      iconBg: "bg-green-100 dark:bg-green-950/50",
      iconColor: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-900",
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Here&apos;s what&apos;s happening with your jobs today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, border }) => (
          <div
            key={label}
            className={`bg-white dark:bg-slate-900 rounded-2xl border ${border} p-6 hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-slate-400">All time</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Applications</h2>
          <span className="text-xs text-slate-400">{recentApplications.length} shown</span>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium mb-1">No applications yet</p>
            <p className="text-slate-400 text-sm">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Applicant</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Job Title</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Applied Date</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.user.name || "U")}&background=2563eb&color=fff`}
                          alt={app.user.name || ""}
                          className="w-9 h-9 rounded-full shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{app.user.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-32">{app.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-40">{app.job.title}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-400">{formatDate(app.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status as any}>{app.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
