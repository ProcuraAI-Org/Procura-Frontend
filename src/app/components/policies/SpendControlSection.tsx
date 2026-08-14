interface SpendControlProps {
  dailyLimit: string;
  perTaskCap: string;
  perToolMax: string;
  currentUsage: number;
  onUpdate: (field: string, value: string) => void;
}

export function SpendControlSection({
  dailyLimit,
  perTaskCap,
  perToolMax,
  currentUsage,
  onUpdate,
}: SpendControlProps) {
  const dailyLimitNum = parseFloat(dailyLimit) || 0;
  const usagePercent = dailyLimitNum > 0 ? (currentUsage / dailyLimitNum) * 100 : 0;

  const getProgressColor = () => {
    if (usagePercent >= 100) return "bg-red-500";
    if (usagePercent >= 75) return "bg-amber-500";
    return "bg-green-500";
  };

  const getProgressBorderColor = () => {
    if (usagePercent >= 100) return "border-red-500/30";
    if (usagePercent >= 75) return "border-amber-500/30";
    return "border-green-500/30";
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">1. Spend Limits</h2>

      <div className="space-y-5">
        {/* Daily Spend Limit */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Daily Spend Limit ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={dailyLimit}
            onChange={(e) => onUpdate("dailyLimit", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="20.00"
          />
        </div>

        {/* Per-Task Budget Cap */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Per-Task Budget Cap ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={perTaskCap}
            onChange={(e) => onUpdate("perTaskCap", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="5.00"
          />
        </div>

        {/* Per-Tool Maximum Spend */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Per-Tool Maximum Spend ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={perToolMax}
            onChange={(e) => onUpdate("perToolMax", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.50"
          />
        </div>

        {/* Current Usage Progress */}
        <div className={`bg-slate-950/50 border ${getProgressBorderColor()} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">
              Current Daily Usage
            </span>
            <span className="text-sm font-bold text-white">
              ${currentUsage.toFixed(2)} / ${dailyLimit || "0.00"}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-300`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Payments exceeding limits will be blocked before x402 signing.
        </p>
      </div>
    </div>
  );
}
