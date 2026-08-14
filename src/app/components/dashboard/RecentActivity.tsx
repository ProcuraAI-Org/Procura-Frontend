import { CreditCard, AlertTriangle, Lock, RefreshCw, CheckCircle, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function RecentActivity(props: {
  activities: Array<{
    title: string;
    detail: string;
    time: string;
    color: "blue" | "yellow" | "purple" | "green" | "slate";
    json: Record<string, unknown>;
  }>;
}) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const activities = props.activities ?? [];

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-400 bg-blue-500/10";
      case "yellow":
        return "text-yellow-400 bg-yellow-500/10";
      case "purple":
        return "text-purple-400 bg-purple-500/10";
      case "green":
        return "text-green-400 bg-green-500/10";
      default:
        return "text-slate-400 bg-slate-500/10";
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <h2 className="text-2xl font-bold text-white mb-4 flex-shrink-0">Recent Activity</h2>

      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl flex-1 min-h-0 flex flex-col">
        {activities.length === 0 ? (
          <div className="flex-1 min-h-0 w-full flex items-center justify-center py-12 px-6">
            <div className="flex flex-col items-center justify-center text-center max-w-sm">
              <div className="text-5xl mb-4 select-none" aria-hidden>
                📋
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No activity found
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create a task to see payments, LLM reasoning logs, and receipts here.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 min-h-0 flex flex-col">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800"></div>

          {/* Activity items */}
          <div className="space-y-4 overflow-auto flex-1 min-h-0 pr-2">
            {activities.map((activity, index) => {
              const Icon =
                activity.color === "green"
                  ? CheckCircle
                  : activity.color === "yellow"
                    ? AlertTriangle
                    : activity.color === "purple"
                      ? Lock
                      : activity.color === "blue"
                        ? CreditCard
                        : RefreshCw;
              const isExpanded = expandedItem === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`relative z-10 w-12 h-12 rounded-lg ${getIconColor(activity.color)} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : index)}
                        className="w-full text-left group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                              {activity.title}
                            </div>
                            <div className="text-sm text-slate-400">
                              {activity.detail}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 whitespace-nowrap">
                              {activity.time}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-500 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Expanded JSON Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 p-4 bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden"
                        >
                          <pre className="text-xs text-slate-400 font-mono overflow-x-auto">
                            {JSON.stringify(activity.json, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}