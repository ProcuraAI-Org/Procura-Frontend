import { X, Check } from "lucide-react";

interface ToolAccessProps {
  allowlist: string[];
  denylist: string[];
  blockUnknown: boolean;
  onUpdateAllowlist: (tools: string[]) => void;
  onUpdateDenylist: (tools: string[]) => void;
  onToggleBlockUnknown: () => void;
}

export function ToolAccessSection({
  allowlist,
  denylist,
  blockUnknown,
  onUpdateAllowlist,
  onUpdateDenylist,
  onToggleBlockUnknown,
}: ToolAccessProps) {
  const availableTools = [
    "CryptoReportAPI",
    "PriceAPI",
    "SentimentAPI",
    "NewsDataAPI",
    "HighCostPremiumAPI",
    "UnverifiedToolX",
    "MarketDataAPI",
    "CryptoNewsAPI",
  ];

  const toggleTool = (tool: string, list: "allowlist" | "denylist") => {
    if (list === "allowlist") {
      if (allowlist.includes(tool)) {
        onUpdateAllowlist(allowlist.filter((t) => t !== tool));
      } else {
        onUpdateAllowlist([...allowlist, tool]);
      }
    } else {
      if (denylist.includes(tool)) {
        onUpdateDenylist(denylist.filter((t) => t !== tool));
      } else {
        onUpdateDenylist([...denylist, tool]);
      }
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">2. Tool Access Policy</h2>

      <div className="space-y-6">
        {/* Global Allowlist */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Global Allowlist
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTools.map((tool) => (
              <button
                key={tool}
                onClick={() => toggleTool(tool, "allowlist")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  allowlist.includes(tool)
                    ? "bg-green-500/20 border-green-500/40 text-green-300"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {allowlist.includes(tool) && (
                  <Check className="w-3 h-3 inline mr-1" />
                )}
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Global Denylist */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Global Denylist
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTools.map((tool) => (
              <button
                key={tool}
                onClick={() => toggleTool(tool, "denylist")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  denylist.includes(tool)
                    ? "bg-red-500/20 border-red-500/40 text-red-300"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {denylist.includes(tool) && <X className="w-3 h-3 inline mr-1" />}
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Block Unknown Tools Toggle */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Block Unknown Tools
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Prevent agent from using tools not in allowlist
            </div>
          </div>
          <button
            onClick={onToggleBlockUnknown}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              blockUnknown ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                blockUnknown ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <Check className="w-4 h-4" />
          <span>All active tasks comply with tool policies</span>
        </div>
      </div>
    </div>
  );
}
