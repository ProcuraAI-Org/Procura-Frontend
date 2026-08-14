interface ExecutionSettingsProps {
  deterministicMode: boolean;
  onDeterministicModeChange: (value: boolean) => void;
  autoRetry: boolean;
  onAutoRetryChange: (value: boolean) => void;
  maxRetryAttempts: string;
  onMaxRetryAttemptsChange: (value: string) => void;
  detailedLogging: boolean;
  onDetailedLoggingChange: (value: boolean) => void;
}

export function ExecutionSettings({
  deterministicMode,
  onDeterministicModeChange,
  autoRetry,
  onAutoRetryChange,
  maxRetryAttempts,
  onMaxRetryAttemptsChange,
  detailedLogging,
  onDetailedLoggingChange,
}: ExecutionSettingsProps) {
  const ToggleSwitch = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-slate-300">{label}</label>
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
      <h2 className="text-xl font-bold text-white mb-6">
        5. Execution Behavior
      </h2>

      <div className="space-y-5">
        {/* Deterministic Mode */}
        <ToggleSwitch
          label="Enable Deterministic Mode"
          checked={deterministicMode}
          onChange={onDeterministicModeChange}
        />

        {/* Auto-Retry */}
        <ToggleSwitch
          label="Auto-Retry Failed Requests"
          checked={autoRetry}
          onChange={onAutoRetryChange}
        />

        {/* Max Retry Attempts */}
        {autoRetry && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Retry Attempts
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={maxRetryAttempts}
              onChange={(e) => onMaxRetryAttemptsChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="2"
            />
          </div>
        )}

        {/* Detailed Logging */}
        <div className="border-t border-slate-800 pt-5">
          <ToggleSwitch
            label="Enable Detailed Logging"
            checked={detailedLogging}
            onChange={onDetailedLoggingChange}
          />
        </div>

        {/* Helper Text */}
        <div className="pt-2 border-t border-slate-800">
          <p className="text-sm text-slate-500">
            Changes apply to new tasks only.
          </p>
        </div>
      </div>
    </div>
  );
}
