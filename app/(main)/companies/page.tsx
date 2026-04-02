import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Briefcase, Search } from "lucide-react";

async function getCompanies() {
  try {
    const jobs = await prisma.job.findMany({
      select: { company: true, category: true, id: true },
    });
    const map = new Map<string, { name: string; category: string; count: number }>();
    jobs.forEach((job) => {
      if (map.has(job.company)) {
        map.get(job.company)!.count++;
      } else {
        map.set(job.company, { name: job.company, category: job.category, count: 1 });
      }
    });
    return Array.from(map.values());
  } catch {
    return [];
  }
}

const companyColors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
];

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Top Companies Hiring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {companies.length} companies actively hiring now
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {companies.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-500 mb-2">No companies yet</h3>
            <p className="text-slate-400 text-sm">Companies will appear here once jobs are posted</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {companies.map((company, i) => {
              const gradient = companyColors[i % companyColors.length];
              return (
                <div
                  key={company.name}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl mb-4 shadow-sm`}>
                    {company.name[0].toUpperCase()}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{company.name}</h3>
                  <span className="inline-block text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full mb-4">
                    {company.category}
                  </span>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <Briefcase className="w-4 h-4" />
                      <span>{company.count} {company.count === 1 ? "job" : "jobs"}</span>
                    </div>
                    <Link
                      href={`/jobs?search=${encodeURIComponent(company.name)}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      View Jobs →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
