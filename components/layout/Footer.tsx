import Link from "next/link"
import { Briefcase, Globe, Mail, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">JobBoard</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Find your dream job or hire the best talent. Thousands of jobs from top companies.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Globe, label: "website" },
                { icon: Mail, label: "email" },
                { icon: ExternalLink, label: "link" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              {[
                { label: "Browse Jobs", href: "/jobs" },
                { label: "Companies", href: "/companies" },
                { label: "Create Account", href: "/register" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">For Employers</h3>
            <ul className="space-y-3">
              {[
                { label: "Post a Job", href: "/dashboard/post-job" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "My Jobs", href: "/dashboard/my-jobs" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Built with ❤️ by{" "}
            <a href="https://linkedin.com/in/mani-kandan-ui" target="_blank" className="text-blue-600 hover:text-blue-700 font-medium">
              Manikandan M
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
