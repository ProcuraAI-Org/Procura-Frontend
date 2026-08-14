import { TaskFormData } from "../../pages/CreateTask";
import { Info } from "lucide-react";

interface BudgetControlsSectionProps {
  formData: TaskFormData;
  updateFormData: (updates: Partial<TaskFormData>) => void;
  remainingDailyBudget: number;
}

export function BudgetControlsSection({
  formData,
  updateFormData,
  remainingDailyBudget,
}: BudgetControlsSectionProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        2. Budget & Spend Controls
      </h2>

      <div className="space-y-6">
        {/* Total Budget Limit */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Total Budget Limit ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.totalBudget}
              onChange={(e) => updateFormData({ totalBudget: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Max Spend per Tool */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            Max Spend per Tool ($)
            <div className="group relative">
              <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
              <div className="absolute left-0 top-6 w-48 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Enforced before authorization
              </div>
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.maxSpendPerTool}
              onChange={(e) =>
                updateFormData({ maxSpendPerTool: e.target.value })
              }
              className={`w-full bg-slate-950/50 border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                (parseFloat(formData.maxSpendPerTool) || 0) > (parseFloat(formData.totalBudget) || 0)
                  ? "border-amber-500/50 focus:ring-amber-500"
                  : "border-slate-700"
              }`}
            />
          </div>
          {(parseFloat(formData.maxSpendPerTool) || 0) > (parseFloat(formData.totalBudget) || 0) && (
            <p className="mt-1.5 text-sm text-amber-400">
              Max per tool must be less than or equal to total budget.
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            To test <span className="text-slate-400">Policy blocked</span>: set both fields to <span className="text-slate-400">0.05</span> (no tool is that cheap), then Launch Agent.
          </p>
        </div>

        {/* Daily Spend Cap Slider */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            Daily Spend Cap ($)
            <div className="group relative">
              <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
              <div className="absolute left-0 top-6 w-48 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Prevents overspending across all agents
              </div>
            </div>
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={formData.dailySpendCap}
              onChange={(e) =>
                updateFormData({ dailySpendCap: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>$0</span>
              <span className="text-white font-semibold">
                ${formData.dailySpendCap.toFixed(2)}
              </span>
              <span>$50</span>
            </div>
          </div>
        </div>

        {/* Remaining Daily Budget */}
        <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Remaining Daily Budget:</span>
            <span className="text-xl font-bold text-green-400">
              ${remainingDailyBudget.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
