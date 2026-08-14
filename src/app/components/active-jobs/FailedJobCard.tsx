import { AlertTriangle, FileText } from "lucide-react";

interface FailedJob {
  id: string;
  task: string;
  status: string;
  reason: string;
  intentId: string;
}

interface FailedJobCardProps {
  job: FailedJob;
  onReviewLogs: (job: FailedJob) => void;
}

export function FailedJobCard({ job, onReviewLogs }: FailedJobCardProps) {
  return (
    <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/30 rounded-xl p-5 shadow-xl">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-white mb-2">{job.task}</h4>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Status</div>
              <div className="text-sm text-red-300 font-bold">{job.status}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Intent ID</div>
              <div className="text-sm text-slate-300 font-mono">{job.intentId}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-1">Reason</div>
            <div className="text-sm text-red-300">{job.reason}</div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onReviewLogs(job)}
            className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Review Logs
          </button>
        </div>
      </div>
    </div>
  );
}
