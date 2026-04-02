import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import StatusSelect from "./StatusSelect";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  const applications = await prisma.application.findMany({
    where: { job: { userId: (session?.user as any)?.id } },
    include: { job: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  const tabs = ["All", "Pending", "Reviewed", "Accepted", "Rejected"] as const;

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Applications Received</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          {applications.length} total applications
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit overflow-x-auto">
        {tabs.map((tab, idx) => {
          const count =
            tab === "All"
              ? applications.length
              : applications.filter((a) => a.status === tab.toUpperCase()).length;
          return (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                idx === 0
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className="ml-1.5 text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No applications yet</h3>
          <p className="text-slate-400 text-sm">Applications will appear here once candidates apply</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Left: Applicant */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={
                      app.user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(app.user.name || "U")}&background=2563eb&color=fff`
                    }
                    alt={app.user.name || ""}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{app.user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{app.user.email}</p>
                  </div>
                </div>

                {/* Middle: Job Info */}
                <div className="flex-1 min-w-0 sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{app.job.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {app.job.company} · {formatDate(app.createdAt)}
                  </p>
                </div>

                {/* Right: Status + Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={app.status as any}>{app.status}</Badge>
                  <StatusSelect appId={app.id} status={app.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
