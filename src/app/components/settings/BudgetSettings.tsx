interface BudgetSettingsProps {
  perTaskBudget: string;
  onPerTaskBudgetChange: (value: string) => void;
  perToolCap: string;
  onPerToolCapChange: (value: string) => void;
  dailySpendLimit: string;
  onDailySpendLimitChange: (value: string) => void;
  applyDefaults: boolean;
  onApplyDefaultsChange: (value: boolean) => void;
}

export function BudgetSettings({
  perTaskBudget,
  onPerTaskBudgetChange,
  perToolCap,
  onPerToolCapChange,
  dailySpendLimit,
  onDailySpendLimitChange,
  applyDefaults,
  onApplyDefaultsChange,
}: BudgetSettingsProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">
        3. Default Budget Controls
      </h2>

      <div className="space-y-5">
        {/* Per-Task Budget */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Default Per-Task Budget ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={perTaskBudget}
            onChange={(e) => onPerTaskBudgetChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="1.00"
          />
        </div>

        {/* Per-Tool Cap */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Default Per-Tool Cap ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={perToolCap}
            onChange={(e) => onPerToolCapChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.30"
          />
        </div>

        {/* Daily Spend Limit */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Default Daily Spend Limit ($)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={dailySpendLimit}
            onChange={(e) => onDailySpendLimitChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="20.00"
          />
        </div>

        {/* Apply Defaults Toggle */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Apply Defaults to New Tasks
            </label>
            <button
              onClick={() => onApplyDefaultsChange(!applyDefaults)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                applyDefaults ? "bg-blue-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  applyDefaults ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="pt-2 border-t border-slate-800">
          <p className="text-sm text-slate-500">
            These values are pre-filled when creating a new autonomous task.
          </p>
        </div>
      </div>
    </div>
  );
}
