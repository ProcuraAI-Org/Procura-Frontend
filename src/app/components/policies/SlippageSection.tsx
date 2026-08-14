interface SlippageProps {
  maxVariance: string;
  timeout: string;
  abortOnIncrease: boolean;
  requireMultiSource: boolean;
  onUpdate: (field: string, value: string | boolean) => void;
}

export function SlippageSection({
  maxVariance,
  timeout,
  abortOnIncrease,
  requireMultiSource,
  onUpdate,
}: SlippageProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">
        4. Slippage & Execution Constraints
      </h2>

      <div className="space-y-5">
        {/* Max Price Variance */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Price Variance (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={maxVariance}
            onChange={(e) => onUpdate("maxVariance", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="5"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Maximum acceptable price change during execution
          </p>
        </div>

        {/* Timeout for Tool Calls */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Timeout for Tool Calls (seconds)
          </label>
          <input
            type="number"
            step="1"
            value={timeout}
            onChange={(e) => onUpdate("timeout", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="10"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Max wait time before aborting tool request
          </p>
        </div>

        {/* Abort on Unexpected Price Increase */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Abort on Unexpected Price Increase
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Cancel transaction if price rises above variance
            </div>
          </div>
          <button
            onClick={() => onUpdate("abortOnIncrease", !abortOnIncrease)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              abortOnIncrease ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                abortOnIncrease ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Require Multi-Source Verification */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Require Multi-Source Verification
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Cross-check data from multiple providers
            </div>
          </div>
          <button
            onClick={() => onUpdate("requireMultiSource", !requireMultiSource)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              requireMultiSource ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                requireMultiSource ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Prevents agent from executing transactions outside expected bounds.
        </p>
      </div>
    </div>
  );
}
