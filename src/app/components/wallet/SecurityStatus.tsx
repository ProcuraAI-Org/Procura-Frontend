import { CheckCircle2, Clock } from "lucide-react";

export function SecurityStatus() {
  const securityChecks = [
    { label: "Wallet Connected", status: true },
    { label: "Encryption Enabled", status: true },
    { label: "Policy Enforcement Active", status: true },
    { label: "Allowlist Restrictions Applied", status: true },
    { label: "Transaction Logging Enabled", status: true },
  ];

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">
        Security & Compliance
      </h3>

      <div className="space-y-4">
        {securityChecks.map((check, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle2
              className={`w-5 h-5 ${
                check.status ? "text-green-400" : "text-slate-600"
              }`}
            />
            <span
              className={`text-sm ${
                check.status ? "text-green-400" : "text-slate-500"
              }`}
            >
              {check.label}
            </span>
          </div>
        ))}

        <div className="border-t border-slate-800 pt-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Last Security Audit:</span>
          </div>
          <div className="text-sm text-white font-medium mt-1">
            Today – 10:00 AM
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-4">
          <div className="text-xs text-green-300 font-medium">
            All security checks passed
          </div>
        </div>
      </div>
    </div>
  );
}
