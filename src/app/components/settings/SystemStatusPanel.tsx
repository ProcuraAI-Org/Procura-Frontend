import { Check } from "lucide-react";

interface SystemStatusPanelProps {
  walletConnected: boolean;
  networkStatus: string;
  biteEnabled: boolean;
  ap2Enabled: boolean;
  x402Enabled: boolean;
  loggingActive: boolean;
  riskProfile: "low" | "medium" | "high";
  lastUpdate: string;
}

export function SystemStatusPanel({
  walletConnected,
  networkStatus,
  biteEnabled,
  ap2Enabled,
  x402Enabled,
  loggingActive,
  riskProfile,
  lastUpdate,
}: SystemStatusPanelProps) {
  const getRiskProfileStyle = (profile: string) => {
    switch (profile) {
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const StatusItem = ({
    label,
    status,
  }: {
    label: string;
    status: string | boolean;
  }) => {
    const isConnected = typeof status === "boolean" ? status : true;
    const displayText = typeof status === "string" ? status : "Connected";

    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex items-center gap-1.5">
          {isConnected && <Check className="w-3 h-3 text-green-400" />}
          <span className="text-sm text-white">{displayText}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xl font-bold text-white">System Status</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Items */}
        <div className="space-y-1 divide-y divide-slate-800/50">
          <StatusItem label="Wallet" status={walletConnected} />
          <StatusItem label="Network" status={networkStatus} />
          <StatusItem label="Encryption" status={biteEnabled && "BITE v2 Enabled"} />
          <StatusItem label="Authorization" status={ap2Enabled && "AP2 Enabled"} />
          <StatusItem label="Payments" status={x402Enabled && "x402 Enabled"} />
          <StatusItem label="Logging" status={loggingActive && "Active"} />
        </div>

        {/* Risk Profile */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Risk Profile</span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRiskProfileStyle(
                riskProfile
              )}`}
            >
              {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}
            </span>
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-1">
            Last Configuration Update
          </div>
          <div className="text-sm text-white font-medium">{lastUpdate}</div>
        </div>

        {/* System Health Indicator */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
