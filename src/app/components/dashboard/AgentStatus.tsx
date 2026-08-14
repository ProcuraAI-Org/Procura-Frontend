import { Circle, Loader2, Eye } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export function AgentStatus(props: {
  currentTask: null | {
    taskId: string;
    state: string;
    title: string;
    estimatedCost: number;
    totalBudget: number;
  };
}) {
  const navigate = useNavigate();
  const t = props.currentTask;
  const active = t != null;
  const pct = t && t.totalBudget > 0 ? Math.min(100, Math.round((t.estimatedCost / t.totalBudget) * 100)) : 0;

  return (
    <div className="mb-6 lg:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Agent Status</h2>

      <div className="relative group">
        {/* Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur opacity-75"></div>

        {/* Card */}
        <div className="relative backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 sm:p-6 shadow-xl">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-3 sm:space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Circle className={`w-3 h-3 ${active ? "fill-green-400 text-green-400 animate-pulse" : "fill-slate-500 text-slate-500"}`} />
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-semibold">
                  {active ? "Active" : "Idle"}
                </span>
              </div>

              {/* Current Task */}
              <div>
                <div className="text-sm text-slate-400 mb-1">Current Task</div>
                <div className="text-lg sm:text-xl font-semibold text-white">
                  {t?.title ?? "No active task"}
                </div>
              </div>

              {/* Current Step */}
              <div>
                <div className="text-sm text-slate-400 mb-1">Current Step</div>
                <div className="flex items-center gap-2 text-slate-300 text-sm sm:text-base">
                  {active ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>{t?.state ?? "Running"}</span>
                    </>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </div>

              {/* View Execution Button */}
              <button
                onClick={() => navigate("/active-jobs")}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
              >
                <Eye className="w-4 h-4" />
                View Live Execution
              </button>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-semibold text-blue-400">
                    {active ? `${pct}% Complete` : "—"}
                  </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${active ? pct : 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
              </div>

              {/* Estimated Cost */}
              <div>
                <div className="text-sm text-slate-400 mb-1">
                  Estimated Cost
                </div>
                <div className="text-2xl font-bold text-white">
                  ${active ? t?.estimatedCost.toFixed(2) : "0.00"}{" "}
                  <span className="text-base font-normal text-slate-500">
                    / ${active ? t?.totalBudget.toFixed(2) : "0.00"} Budget
                  </span>
                </div>
              </div>

              {/* Cost Progress Bar */}
              <div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${active ? pct : 0}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}