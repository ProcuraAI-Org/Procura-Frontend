import { TaskFormData } from "../../pages/CreateTask";
import { X } from "lucide-react";
import { useState } from "react";

interface ToolAccessSectionProps {
  formData: TaskFormData;
  updateFormData: (updates: Partial<TaskFormData>) => void;
}

export function ToolAccessSection({
  formData,
  updateFormData,
}: ToolAccessSectionProps) {
  const [allowlistInput, setAllowlistInput] = useState("");
  const [denylistInput, setDenylistInput] = useState("");

  const addAllowlistTool = (tool: string) => {
    if (tool.trim() && !formData.allowlistTools.includes(tool.trim())) {
      updateFormData({
        allowlistTools: [...formData.allowlistTools, tool.trim()],
      });
      setAllowlistInput("");
    }
  };

  const removeAllowlistTool = (tool: string) => {
    updateFormData({
      allowlistTools: formData.allowlistTools.filter((t) => t !== tool),
    });
  };

  const addDenylistTool = (tool: string) => {
    if (tool.trim() && !formData.denylistTools.includes(tool.trim())) {
      updateFormData({
        denylistTools: [...formData.denylistTools, tool.trim()],
      });
      setDenylistInput("");
    }
  };

  const removeDenylistTool = (tool: string) => {
    updateFormData({
      denylistTools: formData.denylistTools.filter((t) => t !== tool),
    });
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        3. Tool Access Policy
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Labels row */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Allowlist Tools
          </label>
          <p className="text-xs text-slate-500 mb-2 min-h-[2.5rem]">
            Leave empty to allow any tool. Add exact tool names to restrict to those only. Agent picks the <strong>lowest-cost</strong> valid tool, so the demo ($0.001) is often chosen unless you allowlist another or denylist it.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Denylist Tools
          </label>
          <p className="text-xs text-slate-500 mb-2 min-h-[2.5rem]">
            Tool names to never use. E.g. add <code className="text-slate-400">x402-demo-discovery-endpoint-pro</code> to skip the demo and use the next-cheapest tool (e.g. base-sepolia).
          </p>
        </div>

        {/* Inputs row – same row, same size */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <input
            type="text"
            value={allowlistInput}
            onChange={(e) => setAllowlistInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAllowlistTool(allowlistInput);
              }
            }}
            placeholder="Type and press Enter"
            className="w-full min-h-[46px] bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="text"
            value={denylistInput}
            onChange={(e) => setDenylistInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addDenylistTool(denylistInput);
              }
            }}
            placeholder="Type and press Enter"
            className="w-full min-h-[46px] bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Tags row */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div className="flex flex-wrap gap-2">
            {formData.allowlistTools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm"
              >
                {tool}
                <button
                  onClick={() => removeAllowlistTool(tool)}
                  className="hover:text-green-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.denylistTools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm"
              >
                {tool}
                <button
                  onClick={() => removeDenylistTool(tool)}
                  className="hover:text-red-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Agent picks the <strong>lowest-cost</strong> tool that passes allowlist/denylist. To use a different discovery resource, allowlist one (e.g. &quot;0.07 USDC on base-sepolia&quot;) or denylist the demo.
      </p>
    </div>
  );
}
