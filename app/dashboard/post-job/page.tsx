"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name required"),
  location: z.string().min(2, "Location required"),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE", "INTERNSHIP"]),
  salary: z.string().optional(),
  category: z.string().min(1, "Category required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
})

type FormData = z.infer<typeof schema>

const jobTitleSuggestions = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "React Developer", "Node.js Developer", "Python Developer",
  "UI/UX Designer", "Product Manager", "Data Scientist",
  "DevOps Engineer", "Mobile Developer", "iOS Developer",
  "Android Developer", "Machine Learning Engineer", "QA Engineer",
  "Software Engineer", "Senior Software Engineer", "Tech Lead",
  "Engineering Manager", "Marketing Manager", "Sales Executive",
  "HR Manager", "Finance Analyst", "Business Analyst",
]

const locationSuggestions = [
  "Remote", "Bangalore, India", "Mumbai, India", "Delhi, India",
  "Hyderabad, India", "Chennai, India", "Pune, India", "Kolkata, India",
  "Noida, India", "Gurugram, India", "Ahmedabad, India",
  "San Francisco, USA", "New York, USA", "London, UK",
  "Singapore", "Dubai, UAE", "Berlin, Germany",
]

function AutocompleteInput({
  label, placeholder, suggestions, error, value, onChange, required
}: {
  label: string
  placeholder: string
  suggestions: string[]
  error?: string
  value: string
  onChange: (val: string) => void
  required?: boolean
}) {
  const [show, setShow] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleChange = (val: string) => {
    onChange(val)
    if (val.length > 0) {
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0, 6))
      setShow(true)
    } else {
      setShow(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (value.length > 0 && filtered.length > 0) setShow(true)
          }}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
        />
        {show && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
            {filtered.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={() => { onChange(item); setShow(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function PostJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [titleValue, setTitleValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [error, setError] = useState("")

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push("/dashboard/my-jobs")
        router.refresh()
      } else {
        const result = await res.json()
        setError(result.error || "Failed to post job")
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${hasError ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`

  const selectClass = "w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Post a New Job</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">Fill in the details to attract the best candidates</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Job Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Job Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AutocompleteInput
              label="Job Title"
              placeholder="e.g. Senior React Developer"
              suggestions={jobTitleSuggestions}
              error={errors.title?.message}
              value={titleValue}
              onChange={(val) => { setTitleValue(val); setValue("title", val) }}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("company")}
                placeholder="e.g. Google"
                className={inputClass(!!errors.company)}
              />
              {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AutocompleteInput
              label="Location"
              placeholder="e.g. Bangalore or Remote"
              suggestions={locationSuggestions}
              error={errors.location?.message}
              value={locationValue}
              onChange={(val) => { setLocationValue(val); setValue("location", val) }}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select {...register("type")} className={selectClass}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="REMOTE">Remote</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Salary Range</label>
              <input
                {...register("salary")}
                placeholder="e.g. ₹15L - ₹25L or $80k - $100k"
                className={inputClass(false)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select {...register("category")} className={selectClass}>
                <option value="">Select category</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 bg-purple-50 dark:bg-purple-950/50 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Job Description</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={7}
              placeholder="Describe the role, responsibilities, team culture, and what makes this opportunity exciting..."
              className={`resize-none ${inputClass(!!errors.description)}`}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Requirements <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400">List one requirement per line</p>
            <textarea
              {...register("requirements")}
              rows={6}
              placeholder={"3+ years React experience\nTypeScript proficiency\nExperience with REST APIs\nStrong communication skills"}
              className={`resize-none ${inputClass(!!errors.requirements)}`}
            />
            {errors.requirements && <p className="text-xs text-red-500">{errors.requirements.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </>
            ) : "Post Job"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
