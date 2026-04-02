"use client";
import { Search, SlidersHorizontal, MapPin, Briefcase, X, Clock, IndianRupee } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "REMOTE", label: "Remote" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const categories = ["Engineering", "Design", "Marketing", "Finance", "Sales", "HR"];

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

const typeBadgeColors: Record<string, string> = {
  FULL_TIME: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PART_TIME: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  REMOTE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CONTRACT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  INTERNSHIP: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

function JobListCard({ job }: { job: any }) {
  const gradient = companyColors[job.company.charCodeAt(0) % companyColors.length];
  const badgeColor = typeBadgeColors[job.type] || "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}>
          {job.company[0].toUpperCase()}
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base leading-snug line-clamp-2"
              >
                {job.title}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{job.company}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badgeColor}`}>
              {job.type.replace("_", " ")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {job.location}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <IndianRupee className="w-3.5 h-3.5" />
                {job.salary}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(job.createdAt)}
            </span>
          </div>
        </div>

        {/* Apply Button */}
        <Link
          href={`/jobs/${job.id}`}
          className="hidden sm:inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors shrink-0"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mt-3" />
        </div>
      </div>
    </div>
  );
}

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type") ? [searchParams.get("type")!] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedTypes.length === 1) params.set("type", selectedTypes[0]);
    if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);
    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [selectedTypes, selectedCategories]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchJobs(); };

  const toggleType = (value: string) =>
    setSelectedTypes((prev) => prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]);

  const toggleCategory = (value: string) =>
    setSelectedCategories((prev) => prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]);

  const clearFilters = () => { setSelectedTypes([]); setSelectedCategories([]); setSearch(""); };

  const hasFilters = selectedTypes.length > 0 || selectedCategories.length > 0 || search;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Search Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Find Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Discover your next opportunity</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 bg-transparent"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Active Filter Tags */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {search && (
                <span className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
                  "{search}"
                  <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedTypes.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
                  {t.replace("_", " ")}
                  <button onClick={() => toggleType(t)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {selectedCategories.map((c) => (
                <span key={c} className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
                  {c}
                  <button onClick={() => toggleCategory(c)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Filters</h2>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Clear All
                  </button>
                )}
              </div>

              {/* Job Type */}
              <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Job Type</h3>
                <div className="space-y-2.5">
                  {jobTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-2.5">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {loading ? "Loading..." : (
                  <>Showing <span className="font-semibold text-slate-900 dark:text-white">{jobs.length}</span> jobs</>
                )}
              </p>
              <select className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>Most Recent</option>
                <option>Most Relevant</option>
              </select>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-500 mb-2">No jobs found</h3>
                <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filters</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => <JobListCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
