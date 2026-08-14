interface NotificationSettingsProps {
  notifySettlement: boolean;
  onNotifySettlementChange: (value: boolean) => void;
  notifyViolation: boolean;
  onNotifyViolationChange: (value: boolean) => void;
  notifyFailedPayment: boolean;
  onNotifyFailedPaymentChange: (value: boolean) => void;
  notifyBudgetThreshold: boolean;
  onNotifyBudgetThresholdChange: (value: boolean) => void;
  notifyHumanApproval: boolean;
  onNotifyHumanApprovalChange: (value: boolean) => void;
  notificationChannel: string;
  onNotificationChannelChange: (channel: string) => void;
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

export function NotificationSettings({
  notifySettlement,
  onNotifySettlementChange,
  notifyViolation,
  onNotifyViolationChange,
  notifyFailedPayment,
  onNotifyFailedPaymentChange,
  notifyBudgetThreshold,
  onNotifyBudgetThresholdChange,
  notifyHumanApproval,
  onNotifyHumanApprovalChange,
  notificationChannel,
  onNotificationChannelChange,
  webhookUrl,
  onWebhookUrlChange,
}: NotificationSettingsProps) {
  const ToggleSwitch = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3">
      <label className="text-sm text-slate-300">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-500" : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        ></div>
      </button>
    </div>
  );

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">4. Notifications</h2>

      <div className="space-y-5">
        {/* Toggle Options */}
        <div className="space-y-1 border-b border-slate-800 pb-4">
          <ToggleSwitch
            label="Notify on Settlement Completion"
            checked={notifySettlement}
            onChange={onNotifySettlementChange}
          />
          <ToggleSwitch
            label="Notify on Policy Violation"
            checked={notifyViolation}
            onChange={onNotifyViolationChange}
          />
          <ToggleSwitch
            label="Notify on Failed Payment"
            checked={notifyFailedPayment}
            onChange={onNotifyFailedPaymentChange}
          />
          <ToggleSwitch
            label="Notify on Budget Threshold (>80%)"
            checked={notifyBudgetThreshold}
            onChange={onNotifyBudgetThresholdChange}
          />
          <ToggleSwitch
            label="Notify on Human Approval Required"
            checked={notifyHumanApproval}
            onChange={onNotifyHumanApprovalChange}
          />
        </div>

        {/* Notification Channel */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Notification Channel
          </label>
          <select
            value={notificationChannel}
            onChange={(e) => onNotificationChannelChange(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="in-app">In-App</option>
            <option value="email">Email</option>
            <option value="webhook">Webhook (future)</option>
          </select>
        </div>

        {/* Webhook URL (conditional) */}
        {notificationChannel === "webhook" && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => onWebhookUrlChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
              placeholder="https://your-webhook-url.com/notify"
            />
          </div>
        )}
      </div>
    </div>
  );
}