"use client"
import { useState, useRef, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

const jobTitleSuggestions = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "React Developer", "Node.js Developer", "Python Developer",
  "UI/UX Designer", "Product Manager", "Data Scientist",
  "DevOps Engineer", "Mobile Developer", "iOS Developer",
  "Android Developer", "Machine Learning Engineer", "QA Engineer",
  "Software Engineer", "Senior Software Engineer", "Tech Lead",
  "Marketing Manager", "Sales Executive", "HR Manager",
  "Finance Analyst", "Business Analyst", "Graphic Designer",
]

const locationSuggestions = [
  "Remote", "Bangalore, India", "Mumbai, India", "Delhi, India",
  "Hyderabad, India", "Chennai, India", "Pune, India", "Kolkata, India",
  "Noida, India", "Gurugram, India", "Ahmedabad, India",
  "San Francisco, USA", "New York, USA", "London, UK",
  "Singapore", "Dubai, UAE", "Berlin, Germany",
]

function AutocompleteField({
  icon: Icon,
  name,
  placeholder,
  suggestions,
  borderClass,
}: {
  icon: any
  name: string
  placeholder: string
  suggestions: string[]
  borderClass?: string
}) {
  const [value, setValue] = useState("")
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
    setValue(val)
    if (val.length > 0) {
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0, 6))
      setShow(true)
    } else {
      setFiltered(suggestions.slice(0, 6))
      setShow(true)
    }
  }

  const handleFocus = () => {
    setFiltered(value.length > 0
      ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
      : suggestions.slice(0, 6)
    )
    setShow(true)
  }

  return (
    <div className={`relative flex items-center gap-3 flex-1 px-4 py-3.5 ${borderClass}`} ref={ref}>
      <Icon className="w-5 h-5 text-slate-400 shrink-0" />
      <input
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        className="flex-1 outline-none ring-0 focus:outline-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 bg-transparent"
        autoComplete="off"
      />
      {show && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={() => { setValue(item); setShow(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HeroSearch() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const search = (form.elements.namedItem("search") as HTMLInputElement)?.value
    const location = (form.elements.namedItem("location") as HTMLInputElement)?.value
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (location) params.set("location", location)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-black/30 max-w-2xl mx-auto overflow-visible border border-slate-200 dark:border-slate-700 focus-within:outline-none">
      <div className="flex flex-col sm:flex-row">
        <AutocompleteField
          icon={Search}
          name="search"
          placeholder="Job title, keyword..."
          suggestions={jobTitleSuggestions}
          borderClass="border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700"
        />
        <AutocompleteField
          icon={MapPin}
          name="location"
          placeholder="Location or Remote..."
          suggestions={locationSuggestions}
          borderClass="border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 sm:w-52"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 md:rounded-r-2xl rounded-b-2xl md:rounded-l-none  "
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  )
}
