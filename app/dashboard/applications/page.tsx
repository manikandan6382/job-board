import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"
import { Users } from "lucide-react"

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions)

  const applications = await prisma.application.findMany({
    where: { job: { userId: (session?.user as any)?.id } },
    include: { job: true, user: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{applications.length} total applications received</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No applications yet</h3>
          <p className="text-slate-400 text-sm">Applications will appear here once candidates apply</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={app.user.image || `https://ui-avatars.com/api/?name=${app.user.name}&background=2563eb&color=fff`}
                    alt={app.user.name || ""}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{app.user.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{app.job.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-slate-400 hidden sm:block">{formatDate(app.createdAt)}</span>
                  <Badge variant={app.status as any}>{app.status}</Badge>
                  <select
                    defaultValue={app.status}
                    className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
