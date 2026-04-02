import Link from "next/link";
import { MapPin, Clock, IndianRupee } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    logo?: string | null;
    location: string;
    type: string;
    salary?: string | null;
    createdAt: Date;
    category: string;
  };
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

const typeBadgeColors: Record<string, string> = {
  FULL_TIME: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PART_TIME: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  REMOTE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CONTRACT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  INTERNSHIP: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function JobCard({ job }: JobCardProps) {
  const colorIndex = job.company.charCodeAt(0) % companyColors.length;
  const gradient = companyColors[colorIndex];
  const badgeColor = typeBadgeColors[job.type] || "bg-slate-100 text-slate-700";

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <div className="group h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 flex flex-col gap-4">

        {/* Top Row */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}>
            {job.company[0].toUpperCase()}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badgeColor}`}>
            {job.type.replace("_", " ")}
          </span>
        </div>

        {/* Job Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{job.company}</p>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center justify-between">
            {job.salary ? (
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{job.salary}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Not disclosed</span>
            )}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeAgo(job.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
