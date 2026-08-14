import { Check, X, AlertCircle } from "lucide-react";

interface PendingApproval {
  id: string;
  task: string;
  amount: number;
  reason: string;
  intentId: string;
}

interface PendingApprovalCardProps {
  approval: PendingApproval;
  onApprove: (approval: PendingApproval) => void;
  onReject: (approval: PendingApproval) => void;
  isApproving?: boolean;
}

export function PendingApprovalCard({
  approval,
  onApprove,
  onReject,
  isApproving = false,
}: PendingApprovalCardProps) {
  return (
    <div className="backdrop-blur-xl bg-amber-500/5 border border-amber-500/30 rounded-xl p-5 shadow-xl">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-white mb-2">{approval.task}</h4>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Amount</div>
              <div className="text-lg text-white font-mono font-bold">
                ${approval.amount.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Intent ID</div>
              <div className="text-sm text-slate-300 font-mono">
                {approval.intentId}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-1">Reason</div>
            <div className="text-sm text-amber-300">{approval.reason}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onApprove(approval)}
              disabled={isApproving}
              className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isApproving ? "Approving…" : "Approve"}
            </button>
            <button
              onClick={() => onReject(approval)}
              className="flex-1 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
