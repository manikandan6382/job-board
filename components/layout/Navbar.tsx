"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Briefcase, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              JobBoard
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/jobs"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              Companies
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/post-job">
                  <Button size="sm" variant="outline">
                    Post a Job
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                  <img
                    src={
                      session.user?.image ||
                      `https://ui-avatars.com/api/?name=${session.user?.name}&background=2563eb&color=fff`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors ml-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/register">
                  <Button size="sm">Post a Job</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <Link
              href="/jobs"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Companies
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Sign In with Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
