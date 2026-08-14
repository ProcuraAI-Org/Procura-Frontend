import { useState } from "react";
import { CheckCircle2, X, Clock } from "lucide-react";

export interface PendingAuthorizationItem {
  id: string;
  tool: string;
  amount: number;
  intentId: string;
  status: string;
  timestamp: string;
}

interface PendingAuthorizationsProps {
  pendingAuthorizations?: PendingAuthorizationItem[];
  onApprove?: (intentId: string) => void | Promise<void>;
  onReject?: (id: string) => void | Promise<void>;
}

export function PendingAuthorizations({
  pendingAuthorizations = [],
  onApprove,
  onReject,
}: PendingAuthorizationsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (auth: PendingAuthorizationItem) => {
    if (!onApprove || !auth.intentId) return;
    setLoadingId(auth.id);
    try {
      await onApprove(auth.intentId);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (auth: PendingAuthorizationItem) => {
    if (onReject) await onReject(auth.id);
  };

  const displayIntentId = (intentId: string) =>
    intentId.startsWith("#") ? intentId : `#${intentId}`;

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Pending Authorizations (AP2)
      </h2>

      {pendingAuthorizations.length > 0 ? (
        <div className="space-y-4">
          {pendingAuthorizations.map((auth) => (
            <div
              key={auth.id}
              className="bg-slate-950/50 border-2 border-amber-500/30 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-lg font-semibold text-white">
                      {auth.tool}
                    </div>
                    <div className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {auth.status}
                    </div>
                  </div>

                  <div className="text-sm text-slate-400 mb-1">
                    {auth.timestamp}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-1">Amount</div>
                  <div className="text-2xl font-bold text-white">
                    ${auth.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-1">Intent ID</div>
                <div className="text-sm text-white font-mono">{displayIntentId(auth.intentId)}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprove(auth)}
                  disabled={!auth.intentId || loadingId === auth.id}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {loadingId === auth.id ? "Approving…" : "Approve Now"}
                </button>

                <button
                  onClick={() => handleReject(auth)}
                  disabled={loadingId === auth.id}
                  className="flex-1 px-4 py-2 border-2 border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-500">
                  Funds not settled until authorization completes.
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-8 text-center">
          <div className="text-slate-400 mb-2">No pending authorizations</div>
          <div className="text-sm text-slate-500">
            All recent transactions have been processed.
          </div>
        </div>
      )}
    </div>
  );
}
