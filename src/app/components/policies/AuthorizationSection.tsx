import { ArrowRight } from "lucide-react";

interface AuthorizationProps {
  requireApproval: boolean;
  approvalMode: string;
  autoApprovalThreshold: string;
  onToggleApproval: () => void;
  onUpdateMode: (mode: string) => void;
  onUpdateThreshold: (value: string) => void;
}

export function AuthorizationSection({
  requireApproval,
  approvalMode,
  autoApprovalThreshold,
  onToggleApproval,
  onUpdateMode,
  onUpdateThreshold,
}: AuthorizationProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">
        3. Authorization Requirements
      </h2>

      <div className="space-y-5">
        {/* Require Human Approval Toggle */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Require Human Approval for Settlement
            </div>
            <div className="text-xs text-slate-400 mt-1">
              AP2 authorization before payment execution
            </div>
          </div>
          <button
            onClick={onToggleApproval}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              requireApproval ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                requireApproval ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Approval Mode Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Approval Mode
          </label>
          <select
            value={approvalMode}
            onChange={(e) => onUpdateMode(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="auto">Auto-Approve (Below Threshold)</option>
            <option value="manual">Manual Approval Required</option>
            <option value="delegated">Delegated (Smart Contract)</option>
          </select>
        </div>

        {/* Auto-Approval Threshold */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Auto-Approval Threshold ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={autoApprovalThreshold}
            onChange={(e) => onUpdateThreshold(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.25"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Payments below this amount bypass human approval
          </p>
        </div>

        {/* Visual Flow */}
        <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-3">AP2 Flow</div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded">
              Intent
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded">
              Authorization
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded">
              Settlement
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded">
              Receipt
            </span>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-slate-400 leading-relaxed">
          AP2 authorization is enforced before settlement execution.
        </p>
      </div>
    </div>
  );
}