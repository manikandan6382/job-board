import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, DollarSign, Briefcase, Calendar, Building2, Share2, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { formatDate, timeAgo } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ApplyButton from "./ApplyButton";

const companyColors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  const gradient = companyColors[job.company.charCodeAt(0) % companyColors.length];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">{job.title}</span>
        </nav>

        {/* Job Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-sm`}>
              {job.company[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">{job.title}</h1>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</p>
                </div>
                <Badge variant={job.type as any}>{job.type.replace("_", " ")}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-5">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                {job.salary && (
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                    <DollarSign className="w-4 h-4" />{job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{timeAgo(job.createdAt)}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="sm:hidden w-full">
                  <ApplyButton jobId={job.id} isLoggedIn={!!session} />
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <ApplyButton jobId={job.id} isLoggedIn={!!session} />
                  <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Meta Row */}
          <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Posted {formatDate(job.createdAt)}</span>
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{job.category}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.type.replace("_", " ")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About the Role</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{job.description}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requirements</h2>
              <div className="space-y-3">
                {job.requirements.split("\n").filter(Boolean).map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Apply for this Job</h3>
              <ApplyButton jobId={job.id} isLoggedIn={!!session} />
              <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Job
              </button>
            </div>

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

            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Similar Jobs</p>
              <Link href="/jobs" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Browse more jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
