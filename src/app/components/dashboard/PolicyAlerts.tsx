import { AlertTriangle, Lock, CheckCircle } from "lucide-react";

export function PolicyAlerts(props: { policy: { dailySpendPct: number; anyHumanApprovalRequired: boolean } | null }) {
  const p = props.policy;
  const pct = p ? Math.round((p.dailySpendPct ?? 0) * 100) : 0;

  const alerts = [
    ...(p && pct >= 75
      ? [
          {
            icon: AlertTriangle,
            message: `Daily spend at ${pct}% of limit`,
            type: "warning",
          },
        ]
      : []),
    ...(p?.anyHumanApprovalRequired
      ? [
          {
            icon: Lock,
            message: "Human approval required for at least one active task",
            type: "info",
          },
        ]
      : []),
    {
      icon: CheckCircle,
      message: "Policy engine enforced (deterministic)",
      type: "success",
    },
  ];

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          icon: "text-yellow-400",
          text: "text-yellow-200",
        };
      case "info":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          icon: "text-blue-400",
          text: "text-blue-200",
        };
      case "success":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          icon: "text-green-400",
          text: "text-green-200",
        };
      default:
        return {
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          icon: "text-slate-400",
          text: "text-slate-200",
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4">
        Policy & Guardrail Alerts
      </h2>

      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl flex-1">
        <div className="space-y-3">
          {alerts.length === 0 && (
            <div className="text-sm text-slate-400">No active policy alerts.</div>
          )}
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            const style = getAlertStyle(alert.type);

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border ${style.bg} ${style.border}`}
              >
                <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0`} />
                <span className={`${style.text} font-medium`}>
                  {alert.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}