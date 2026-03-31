import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover }: CardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm",
      hover && "hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200",
      className
    )}>
      {children}
    </div>
  )
}
