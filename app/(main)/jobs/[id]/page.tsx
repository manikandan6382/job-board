import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Calendar, Building2, Share2 } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Badge from "@/components/ui/Badge"
import { formatDate, timeAgo } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ApplyButton from "./ApplyButton"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const job = await prisma.job.findUnique({ where: { id } })
  if (!job) notFound()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {job.company[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">{job.title}</h1>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{job.company}</p>
                    </div>
                    <Badge variant={job.type as any}>{job.type.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                    {job.salary && <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"><DollarSign className="w-4 h-4" />{job.salary}</span>}
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{timeAgo(job.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About the Role</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requirements</h2>
              <div className="space-y-3">
                {job.requirements.split("\n").filter(Boolean).map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-5">

            {/* Apply Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Apply for this job</h3>
              <ApplyButton jobId={job.id} isLoggedIn={!!session} />
              <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Job
              </button>
            </div>

            {/* Job Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Job Overview</h3>
              <div className="space-y-4">
                {[
                  { icon: Briefcase, label: "Job Type", value: job.type.replace("_", " ") },
                  { icon: MapPin, label: "Location", value: job.location },
                  { icon: Building2, label: "Category", value: job.category },
                  { icon: Calendar, label: "Posted", value: formatDate(job.createdAt) },
                  ...(job.salary ? [{ icon: DollarSign, label: "Salary", value: job.salary }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
