import { Play, Pause, X, ArrowRight, Lock } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  status: "active" | "pending" | "completed" | "failed";
  progress: number;
  budget: number;
  spent: number;
  toolCalls: {
    completed: number;
    pending: number;
  };
  risk: "low" | "medium" | "high";
  encryptionEnabled: boolean;
  lastUpdated: string;
  description: string;
  intentId: string;
  authorizationMode: string;
  currentStep?: string;
  policyCompliance: {
    withinBudget: boolean;
    onAllowlist: boolean;
    underPerToolCap: boolean;
  };
  failureReason?: string;
}

interface JobCardProps {
  job: Job;
  onViewExecution: (job: Job) => void;
  onPause?: (job: Job) => void;
  onCancel?: (job: Job) => void;
  onViewDetails: (job: Job) => void;
}

export function JobCard({
  job,
  onViewExecution,
  onPause,
  onCancel,
  onViewDetails,
}: JobCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-amber-400";
      case "high":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const remaining = job.budget - job.spent;

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:bg-slate-900/70 hover:-translate-y-1 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-2 truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(
                job.status
              )}`}
            >
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
            {job.encryptionEnabled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Lock className="w-3 h-3" />
                Encrypted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {job.status === "active" && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-xs text-slate-300 font-mono font-bold">
              {job.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Budget Section */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-slate-500 mb-1">Budget</div>
            <div className="text-sm text-white font-mono font-bold">
              ${job.budget.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Spent</div>
            <div className="text-sm text-amber-300 font-mono font-bold">
              ${job.spent.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Remaining</div>
            <div className="text-sm text-green-300 font-mono font-bold">
              ${remaining.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Tool Calls</div>
          <div className="text-sm text-white font-mono">
            {job.toolCalls.completed} completed /{" "}
            <span className="text-blue-400">{job.toolCalls.pending} pending</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Risk</div>
          <div className={`text-sm font-bold ${getRiskStyle(job.risk)}`}>
            {job.risk.charAt(0).toUpperCase() + job.risk.slice(1)}
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mb-4 pb-4 border-b border-slate-800">
        <div className="text-xs text-slate-500">
          Last Updated: <span className="text-slate-400">{job.lastUpdated}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewExecution(job);
          }}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          View Execution
          <ArrowRight className="w-4 h-4" />
        </button>

        {job.status === "active" && onPause && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPause(job);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm rounded-lg transition-colors"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}

        {(job.status === "active" || job.status === "pending") && onCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(job);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 text-sm rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
