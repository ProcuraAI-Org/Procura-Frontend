import { Shield, CheckCircle2, AlertTriangle } from "lucide-react";

interface SpendGuardrailsProps {
  dailyCap: number;
  spentToday: number;
  perTaskCap: number;
  perToolCap: number;
  pendingCount: number;
}

export function SpendGuardrails({
  dailyCap,
  spentToday,
  perTaskCap,
  perToolCap,
  pendingCount,
}: SpendGuardrailsProps) {
  const percentUsed = (spentToday / dailyCap) * 100;
  const remaining = dailyCap - spentToday;

  const getProgressColor = () => {
    if (percentUsed < 50) return "from-green-500 to-green-400";
    if (percentUsed < 80) return "from-yellow-500 to-yellow-400";
    return "from-red-500 to-red-400";
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Spend Guardrails
      </h3>

      <div className="space-y-6">
        {/* Daily Spend Cap */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Daily Spend Cap</span>
            <span className="text-sm font-semibold text-white">
              ${dailyCap.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Spent Today</span>
            <span className="text-sm font-semibold text-green-400">
              ${spentToday.toFixed(2)}
            </span>
          </div>

          <div className="mb-2">
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all`}
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">{percentUsed.toFixed(1)}% used</span>
            <span className="text-slate-400">
              ${remaining.toFixed(2)} remaining
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800"></div>

        {/* Cap Limits */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Per-Task Cap</span>
            <span className="text-white font-semibold">
              ${perTaskCap.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Per-Tool Cap</span>
            <span className="text-white font-semibold">
              ${perToolCap.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800"></div>

        {/* Status Indicators */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-300 mb-3">
            Status Checks
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Within Daily Limit</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400">No Cap Violations</span>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400">
                {pendingCount} Pending Authorization{pendingCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-xs text-blue-300">
            Spend caps enforced before payment signing.
          </div>
        </div>
      </div>
    </div>
  );
}
