interface ExecutionSafetyProps {
  deterministicMode: boolean;
  logReasoning: boolean;
  blockRepeatedFailures: boolean;
  maxRetries: string;
  onToggle: (field: string) => void;
  onUpdateRetries: (value: string) => void;
}

export function ExecutionSafetySection({
  deterministicMode,
  logReasoning,
  blockRepeatedFailures,
  maxRetries,
  onToggle,
  onUpdateRetries,
}: ExecutionSafetyProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">6. Execution Safety</h2>

      <div className="space-y-5">
        {/* Enable Deterministic Execution Mode */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Enable Deterministic Execution Mode
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Ensure consistent, predictable agent behavior
            </div>
          </div>
          <button
            onClick={() => onToggle("deterministicMode")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              deterministicMode ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                deterministicMode ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Log All Agent Reasoning Steps */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Log All Agent Reasoning Steps
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Record decision-making process for audit
            </div>
          </div>
          <button
            onClick={() => onToggle("logReasoning")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              logReasoning ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                logReasoning ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Block Repeated Failed Payments */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Block Repeated Failed Payments
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Prevent retry loops on persistent failures
            </div>
          </div>
          <button
            onClick={() => onToggle("blockRepeatedFailures")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              blockRepeatedFailures ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                blockRepeatedFailures ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Max Retries per Tool */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Retries per Tool
          </label>
          <input
            type="number"
            step="1"
            min="0"
            max="10"
            value={maxRetries}
            onChange={(e) => onUpdateRetries(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="2"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Number of retry attempts before giving up
          </p>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Ensures structured, traceable execution.
        </p>
      </div>
    </div>
  );
}
