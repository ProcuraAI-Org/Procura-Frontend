import { Shield, Check, Lock, AlertTriangle } from "lucide-react";

interface RiskSummaryProps {
  dailyLimit: string;
  perToolMax: string;
  allowlistCount: number;
  blockUnknown: boolean;
  requireApproval: boolean;
  encryptionEnabled: boolean;
  loggingEnabled: boolean;
  currentUsage: number;
}

export function RiskSummaryPanel({
  dailyLimit,
  perToolMax,
  allowlistCount,
  blockUnknown,
  requireApproval,
  encryptionEnabled,
  loggingEnabled,
  currentUsage,
}: RiskSummaryProps) {
  const dailyLimitNum = parseFloat(dailyLimit) || 0;
  const usagePercent = dailyLimitNum > 0 ? (currentUsage / dailyLimitNum) * 100 : 0;

  const getRiskLevel = () => {
    let riskScore = 0;

    // Lower risk for active controls
    if (dailyLimitNum > 0 && dailyLimitNum <= 20) riskScore += 0;
    else if (dailyLimitNum > 20) riskScore += 1;

    if (blockUnknown) riskScore += 0;
    else riskScore += 2;

    if (requireApproval) riskScore += 0;
    else riskScore += 1;

    if (encryptionEnabled) riskScore += 0;
    else riskScore += 1;

    if (riskScore === 0) return { level: "Low", color: "green" };
    if (riskScore <= 2) return { level: "Medium", color: "amber" };
    return { level: "High", color: "red" };
  };

  const risk = getRiskLevel();

  return (
    <div className="sticky top-8 pb-32">
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Risk Profile Overview
        </h3>

        <div className="space-y-5">
          {/* Risk Level */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Risk Level</div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${
                risk.color === "green"
                  ? "bg-green-500/20 text-green-300 border-green-500/40"
                  : risk.color === "amber"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-red-500/20 text-red-300 border-red-500/40"
              }`}
            >
              {risk.level}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700"></div>

          {/* Spend Policy */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Spend Policy</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>Daily Cap Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>Per-Tool Cap Active</span>
              </div>
            </div>
          </div>

          {/* Tool Access */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Tool Access</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>Allowlist Enforced ({allowlistCount} tools)</span>
              </div>
              {blockUnknown ? (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Unknown Tools Blocked</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Unknown Tools Allowed</span>
                </div>
              )}
            </div>
          </div>

          {/* Authorization */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Authorization</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>AP2 Enabled</span>
              </div>
              {requireApproval ? (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Human Approval Required</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-slate-500" />
                  <span>Auto-Approval Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Privacy</div>
            <div className="space-y-2">
              {encryptionEnabled ? (
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>BITE Encryption Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Encryption Disabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Audit</div>
            <div className="space-y-2">
              {loggingEnabled ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Logging Enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Receipts Generated</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-slate-500" />
                  <span>Logging Disabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Risk Gauge */}
          <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-3">Risk Exposure</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    risk.color === "green"
                      ? "bg-green-500"
                      : risk.color === "amber"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width:
                      risk.level === "Low"
                        ? "25%"
                        : risk.level === "Medium"
                        ? "50%"
                        : "85%",
                  }}
                ></div>
              </div>
              <span className="text-xs text-slate-400 w-12">
                {risk.level === "Low" ? "25%" : risk.level === "Medium" ? "50%" : "85%"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
