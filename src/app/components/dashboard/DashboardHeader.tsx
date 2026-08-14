import { Link } from "react-router";
import { Plus, Wallet } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-6 lg:mb-8">
      {/* Left - Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-400">
          Monitor agent activity, spend, and live workflows.
        </p>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          to="/wallet"
          className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          <span className="font-medium">View Wallet</span>
        </Link>

        <Link
          to="/create-task"
          className="relative group px-6 py-3 rounded-lg overflow-hidden cursor-pointer inline-flex items-center justify-center gap-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </Link>
      </div>
    </div>
  );
}