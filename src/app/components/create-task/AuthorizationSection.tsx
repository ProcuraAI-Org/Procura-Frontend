import { TaskFormData } from "../../pages/CreateTask";
import { ArrowRight } from "lucide-react";

interface AuthorizationSectionProps {
  formData: TaskFormData;
  updateFormData: (updates: Partial<TaskFormData>) => void;
}

export function AuthorizationSection({
  formData,
  updateFormData,
}: AuthorizationSectionProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        4. Authorization & Settlement
      </h2>

      <div className="space-y-6">
        {/* Require Approval Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Require Human Approval Before Settlement
            </label>
            <p className="text-sm text-slate-500">
              Enable manual confirmation for each transaction
            </p>
          </div>
          <button
            onClick={() =>
              updateFormData({ requireApproval: !formData.requireApproval })
            }
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors cursor-pointer ${
              formData.requireApproval ? "bg-blue-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                formData.requireApproval ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Approval Method (conditional) */}
        {formData.requireApproval && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Approval Method
            </label>
            <select
              value={formData.approvalMethod}
              onChange={(e) =>
                updateFormData({ approvalMethod: e.target.value })
              }
              className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option value="automatic">
                Automatic (below threshold)
              </option>
              <option value="human">Human Approval Required</option>
              <option value="delegated">Delegated (Smart Contract)</option>
            </select>
          </div>
        )}

        {/* Authorization Flow Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Authorization Flow Preview
          </label>
          <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div className="text-sm text-slate-300">Intent</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600" />

              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-purple-500/20 border border-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div className="text-sm text-slate-300">Authorization</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600" />

              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-cyan-400 font-bold">3</span>
                </div>
                <div className="text-sm text-slate-300">Settlement</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600" />

              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-400 font-bold">4</span>
                </div>
                <div className="text-sm text-slate-300">Receipt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}