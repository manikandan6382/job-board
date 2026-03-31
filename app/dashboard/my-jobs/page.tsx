import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

export default async function MyJobsPage() {
  const session = await getServerSession(authOptions)

  const jobs = await prisma.job.findMany({
    where: { userId: (session?.user as any)?.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{jobs.length} jobs posted</p>
        </div>
        <Link
          href="/dashboard/post-job"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No jobs posted yet</h3>
          <p className="text-slate-400 text-sm mb-6">Post your first job to start receiving applications</p>
          <Link href="/dashboard/post-job" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <PlusCircle className="w-4 h-4" />
            Post a Job
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                    {job.company[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{job.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{job.company} · {formatDate(job.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge variant={job.type as any} className="hidden sm:inline-flex">
                    {job.type.replace("_", " ")}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{job._count.applications}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/post-job?edit=${job.id}`} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
