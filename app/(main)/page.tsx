import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/jobs/JobCard";
import HeroSearch from "@/components/ui/HeroSearch";

async function getRecentJobs() {
  try {
    return await prisma.job.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [jobs, users] = await Promise.all([
      prisma.job.count(),
      prisma.user.count(),
    ]);
    return { jobs, users };
  } catch {
    return { jobs: 0, users: 0 };
  }
}

const categories = [
  { name: "Engineering", icon: "⚙️", count: 120 },
  { name: "Design", icon: "🎨", count: 85 },
  { name: "Marketing", icon: "📢", count: 64 },
  { name: "Finance", icon: "💰", count: 48 },
  { name: "Sales", icon: "📈", count: 92 },
  { name: "HR", icon: "👥", count: 37 },
];

export default async function HomePage() {
  const [jobs, stats] = await Promise.all([getRecentJobs(), getStats()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-slate-300 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>
                {stats.jobs > 0
                  ? `${stats.jobs}+ Jobs Available`
                  : "Start Your Job Search"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
              Find Your <span className="text-blue-400">Dream Job</span> Today
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              Browse thousands of jobs from top companies. Your next career move
              starts here.
            </p>

            {/* Search Bar with autocomplete */}
            <HeroSearch />

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {[
                { icon: Briefcase, label: `${stats.jobs}+ Jobs` },
                { icon: Building2, label: "500+ Companies" },
                { icon: Users, label: `${stats.users}+ Candidates` },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-slate-400"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Explore
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Browse by Category
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
              Find jobs in your field of expertise
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?category=${cat.name}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:shadow-md transition-all duration-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cat.count} jobs
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Latest
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Recent Jobs
              </h2>
            </div>
            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-500 mb-2">
                No jobs yet
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Be the first to post a job!
              </p>
              <Link
                href="/dashboard/post-job"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Post a Job <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Ready to Hire Top Talent?
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                Post your job and reach thousands of qualified candidates today.
              </p>
              <Link
                href="/dashboard/post-job"
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-base transition-colors shadow-lg"
              >
                Post a Job Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
