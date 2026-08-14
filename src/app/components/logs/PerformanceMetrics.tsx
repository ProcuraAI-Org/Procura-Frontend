import { Clock, Zap, CreditCard, RefreshCw, ShieldAlert, Activity } from "lucide-react";

interface PerformanceMetricsProps {
  totalExecutionTime: string;
  httpCalls: number;
  paymentsSigned: number;
  retries: number;
  policyViolations: number;
  averageLatency: string;
}

export function PerformanceMetrics({
  totalExecutionTime,
  httpCalls,
  paymentsSigned,
  retries,
  policyViolations,
  averageLatency,
}: PerformanceMetricsProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-950/80 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-lg font-bold text-white">Runtime Metrics</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Execution Time */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div className="text-xs text-slate-500">Total Time</div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {totalExecutionTime}
            </div>
          </div>

          {/* HTTP Calls */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <div className="text-xs text-slate-500">HTTP Calls</div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{httpCalls}</div>
          </div>

          {/* Payments Signed */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              <div className="text-xs text-slate-500">Payments</div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {paymentsSigned}
            </div>
          </div>

          {/* Retries */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <div className="text-xs text-slate-500">Retries</div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{retries}</div>
          </div>

          {/* Policy Violations */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert
                className={`w-4 h-4 ${
                  policyViolations > 0 ? "text-red-400" : "text-green-400"
                }`}
              />
              <div className="text-xs text-slate-500">Violations</div>
            </div>
            <div
              className={`text-2xl font-bold font-mono ${
                policyViolations > 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              {policyViolations}
            </div>
          </div>

          {/* Average Latency */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <div className="text-xs text-slate-500">Avg Latency</div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {averageLatency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
