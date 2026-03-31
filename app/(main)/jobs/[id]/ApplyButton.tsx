"use client"
import Link from "next/link"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

export default function ApplyButton({ jobId, isLoggedIn }: { jobId: string; isLoggedIn: boolean }) {
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })
      if (res.ok) setApplied(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
          Sign in to Apply
        </Link>
        <p className="text-xs text-center text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    )
  }

  if (applied) {
    return (
      <div className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl font-semibold text-sm border border-green-200 dark:border-green-800">
        <CheckCircle className="w-4 h-4" />
        Application Submitted!
      </div>
    )
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  )
}
