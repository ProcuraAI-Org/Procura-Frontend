import { TaskFormData } from "../../pages/CreateTask";
import { ArrowRight, Shield } from "lucide-react";

interface ExecutionSummaryProps {
  formData: TaskFormData;
}

export function ExecutionSummary({ formData }: ExecutionSummaryProps) {
  const getRiskLevel = () => {
    const budget = parseFloat(formData.totalBudget);
    if (budget < 1) return { level: "Low", color: "green" };
    if (budget < 5) return { level: "Medium", color: "yellow" };
    return { level: "High", color: "red" };
  };

  const risk = getRiskLevel();

  return (
    <div className="sticky top-8 pb-32">
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Execution Summary
        </h3>

        <div className="space-y-4">
          {/* Task */}
          <div>
            <div className="text-xs text-slate-500 mb-1">Task</div>
            <div className="text-sm text-white">
              {formData.taskDescription
                ? formData.taskDescription.slice(0, 60) +
                  (formData.taskDescription.length > 60 ? "..." : "")
                : "Not defined"}
            </div>
          </div>

          {/* Total Budget */}
          <div>
            <div className="text-xs text-slate-500 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-white">
              ${formData.totalBudget}
            </div>
          </div>

          {/* Max Per Tool */}
          <div>
            <div className="text-xs text-slate-500 mb-1">Max Per Tool</div>
            <div className="text-sm text-white">${formData.maxSpendPerTool}</div>
          </div>

          {/* Human Approval */}
          <div>
            <div className="text-xs text-slate-500 mb-1">Human Approval</div>
            <div
              className={`inline-flex items-center gap-1 text-sm ${
                formData.requireApproval ? "text-green-400" : "text-slate-400"
              }`}
            >
              {formData.requireApproval ? "Required" : "Not Required"}
            </div>
          </div>

          {/* Encrypted */}
          <div>
            <div className="text-xs text-slate-500 mb-1">Encrypted</div>
            <div
              className={`inline-flex items-center gap-1 text-sm ${
                formData.encryptionEnabled
                  ? "text-purple-400"
                  : "text-slate-400"
              }`}
            >
              {formData.encryptionEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <div className="text-xs text-slate-500 mb-1">
              Estimated Risk Level
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                risk.color === "green"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : risk.color === "yellow"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {risk.level}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700 my-4"></div>

          {/* Visual Flow */}
          <div>
            <div className="text-xs text-slate-500 mb-3">Execution Flow</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Intent</span>
              </div>
              <div className="ml-1 border-l border-slate-700 h-3"></div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Tool Discovery</span>
              </div>
              <div className="ml-1 border-l border-slate-700 h-3"></div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span>x402 Payment</span>
              </div>
              <div className="ml-1 border-l border-slate-700 h-3"></div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span>AP2 Settlement</span>
              </div>
              <div className="ml-1 border-l border-slate-700 h-3"></div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Receipt</span>
              </div>
            </div>
          </div>

          {/* Safeguards Count */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
            <div className="text-xs text-blue-400 mb-1">Active Safeguards</div>
            <div className="text-2xl font-bold text-blue-300">
              {[
                formData.totalBudget !== "",
                formData.allowlistTools.length > 0,
                formData.requireApproval,
                formData.encryptionEnabled,
              ].filter(Boolean).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}