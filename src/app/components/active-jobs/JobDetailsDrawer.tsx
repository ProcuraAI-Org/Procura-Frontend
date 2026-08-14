import { X, Check, ExternalLink, FileText } from "lucide-react";
import { Job } from "./JobCard";

interface JobDetailsDrawerProps {
  job: Job | null;
  onClose: () => void;
  onViewFullExecution: (job: Job) => void;
  onViewReceipts: (job: Job) => void;
}

export function JobDetailsDrawer({
  job,
  onClose,
  onViewFullExecution,
  onViewReceipts,
}: JobDetailsDrawerProps) {
  if (!job) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-slate-950 border-l border-slate-800 z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Job Overview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-2">
              Task Description
            </h3>
            <p className="text-base text-white">{job.description}</p>
          </div>

          {/* Intent ID */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-2">Intent ID</h3>
            <div className="text-base text-blue-400 font-mono">{job.intentId}</div>
          </div>

          {/* Authorization Mode */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-2">
              Authorization Mode
            </h3>
            <div className="text-base text-white">{job.authorizationMode}</div>
          </div>

          {/* Current Step */}
          {job.currentStep && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-2">
                Current Step
              </h3>
              <div className="text-base text-white">{job.currentStep}</div>
            </div>
          )}

          {/* Policy Compliance */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-3">
              Policy Compliance
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>
                  {job.policyCompliance.withinBudget
                    ? "Within Budget"
                    : "Budget Exceeded"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>
                  {job.policyCompliance.onAllowlist
                    ? "On Allowlist"
                    : "Not on Allowlist"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>
                  {job.policyCompliance.underPerToolCap
                    ? "Under Per-Tool Cap"
                    : "Exceeds Per-Tool Cap"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-3">
              Recent Events
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-slate-300">HTTP 402 received</div>
                  <div className="text-xs text-slate-500">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-slate-300">Payment signed</div>
                  <div className="text-xs text-slate-500">1 minute ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-slate-300">Retry successful</div>
                  <div className="text-xs text-slate-500">30 seconds ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => onViewFullExecution(job)}
              className="w-full px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Full Execution View
            </button>
            <button
              onClick={() => onViewReceipts(job)}
              className="w-full px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {job.intentId ? "View Receipt" : "View Receipts"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
