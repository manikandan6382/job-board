import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  Building2,
  Users,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/jobs/JobCard";
import HeroSearch from "@/components/ui/HeroSearch";

async function getRecentJobs() {
  try {
    return await prisma.job.findMany({ take: 6, orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [jobs, users] = await Promise.all([prisma.job.count(), prisma.user.count()]);
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

const popularSearches = ["React Developer", "Python", "Remote", "Fresher", "UI/UX Designer", "Data Scientist"];

const features = [
  {
    icon: Search,
    title: "1000+ Jobs",
    desc: "Browse thousands of verified job listings updated daily from top companies.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Companies",
    desc: "Every company is verified to ensure you only apply to legitimate opportunities.",
  },
  {
    icon: Zap,
    title: "Easy Apply",
    desc: "One-click apply with your profile. Get noticed by recruiters instantly.",
  },
];

export default async function HomePage() {
  const [jobs, stats] = await Promise.all([getRecentJobs(), getStats()]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
              Find Your{" "}
              <span className="relative inline-block text-blue-600">
                Dream Job
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-600/20 rounded-full" />
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Browse {stats.jobs > 0 ? `${stats.jobs}+` : "1000+"} jobs from top companies across India
            </p>

            <HeroSearch />

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <span className="text-sm text-slate-400">Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/jobs?search=${encodeURIComponent(term)}`}
                  className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1 rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-0 mt-10 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-x divide-slate-200 dark:divide-slate-700 overflow-hidden">
              {[
                { icon: Briefcase, label: "Jobs", value: `${stats.jobs > 0 ? stats.jobs : 1000}+` },
                { icon: Building2, label: "Companies", value: "500+" },
                { icon: Users, label: "Candidates", value: `${stats.users > 0 ? stats.users : 10000}+` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-8 py-4 flex-1 justify-center">
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-950/50 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Browse Jobs by Category
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Find jobs in your field of expertise
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?category=${cat.name}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.count} jobs</p>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Recent Jobs
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Latest opportunities from top companies
              </p>
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
              <h3 className="text-lg font-semibold text-slate-500 mb-2">No jobs yet</h3>
              <p className="text-slate-400 text-sm mb-6">Be the first to post a job!</p>
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

          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Why Choose JobBoard?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Everything you need to land your next role
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

            {/* Glowing orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Dot grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

            {/* Content */}
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Now Hiring
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Are you hiring?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                Post a job and reach{" "}
                <span className="text-white font-semibold">10,000+</span>{" "}
                qualified candidates today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard/post-job"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                >
                  Post a Job <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-base transition-all"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
