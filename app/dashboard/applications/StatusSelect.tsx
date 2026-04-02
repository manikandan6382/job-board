"use client";

export default function StatusSelect({ appId, status }: { appId: string; status: string }) {
  return (
    <select
      defaultValue={status}
      className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      onChange={async (e) => {
        await fetch(`/api/applications`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: appId, status: e.target.value }),
        });
      }}
    >
      <option value="PENDING">Pending</option>
      <option value="REVIEWED">Reviewed</option>
      <option value="ACCEPTED">Accepted</option>
      <option value="REJECTED">Rejected</option>
    </select>
  );
}
