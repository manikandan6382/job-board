import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE" | "INTERNSHIP" | "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED"
  className?: string
}

const variants = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  FULL_TIME: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PART_TIME: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONTRACT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  REMOTE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  INTERNSHIP: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  REVIEWED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ACCEPTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
