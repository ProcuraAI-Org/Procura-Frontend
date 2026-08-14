import { TaskFormData } from "../../pages/CreateTask";
import { CheckCircle2 } from "lucide-react";

interface ConditionalExecutionSectionProps {
  formData: TaskFormData;
  updateFormData: (updates: Partial<TaskFormData>) => void;
}

export function ConditionalExecutionSection({
  formData,
  updateFormData,
}: ConditionalExecutionSectionProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2">
        5. Conditional Execution (Optional)
      </h2>
      <p className="text-slate-400 mb-6">
        Define conditions that must be met before payment is settled.
      </p>

      <div className="space-y-6">
        {/* Condition Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Condition Type
          </label>
          <select
            value={formData.conditionType}
            onChange={(e) => updateFormData({ conditionType: e.target.value })}
            className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="time-based">Time-based Trigger</option>
            <option value="event-based">Event-based Trigger</option>
            <option value="manual">Manual Trigger Only</option>
          </select>
        </div>

        {/* Conditional Input (appears when condition is selected) */}
        {formData.conditionType && formData.conditionType !== "" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                {formData.conditionType === "Minimum Data Sources"
                  ? "Minimum Number of Sources"
                  : formData.conditionType === "Minimum Output Length"
                  ? "Minimum Characters"
                  : formData.conditionType === "Time-Based Execution"
                  ? "Execute After (hours)"
                  : "Custom Condition Value"}
              </label>
              <input
                type={
                  formData.conditionType === "Custom Logic" ? "text" : "number"
                }
                value={formData.conditionValue}
                onChange={(e) =>
                  updateFormData({ conditionValue: e.target.value })
                }
                placeholder={
                  formData.conditionType === "Minimum Data Sources"
                    ? "e.g., 3"
                    : formData.conditionType === "Minimum Output Length"
                    ? "e.g., 500"
                    : formData.conditionType === "Time-Based Execution"
                    ? "e.g., 24"
                    : "Enter custom condition"
                }
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Condition Status Indicator */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-blue-300">
                    Condition Configured
                  </div>
                  <div className="text-xs text-blue-400/70 mt-1">
                    Condition will be verified before settlement.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}