"use client"
import { Search, SlidersHorizontal, MapPin, Briefcase, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import JobCard from "@/components/jobs/JobCard"

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "REMOTE", label: "Remote" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
]

const categories = ["Engineering", "Design", "Marketing", "Finance", "Sales", "HR"]

export default function JobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type") ? [searchParams.get("type")!] : []
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  )

  const fetchJobs = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (selectedTypes.length === 1) params.set("type", selectedTypes[0])
    if (selectedCategories.length === 1) params.set("category", selectedCategories[0])

    const res = await fetch(`/api/jobs?${params.toString()}`)
    const data = await res.json()
    setJobs(data)
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [selectedTypes, selectedCategories])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const toggleType = (value: string) => {
    setSelectedTypes(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    )
  }

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedCategories([])
    setSearch("")
  }

  const hasFilters = selectedTypes.length > 0 || selectedCategories.length > 0 || search

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Find Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Discover your next opportunity</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
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
            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0">
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Filters</h2>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Clear all
                  </button>
                )}
              </div>

              {/* Job Type */}
              <div className="mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                    <div className="flex gap-3 mb-4">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                  </div>
                ))}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
