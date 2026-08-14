import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

interface TimelineStepProps {
  step: {
    id: number;
    title: string;
    icon: string;
    status: "pending" | "in-progress" | "completed";
    mainText: string;
    timestamp: string;
    duration: string;
    details?: Record<string, string>;
    technical?: Record<string, string>;
    reasoning?: string;
    showFlow?: boolean;
    highlighted?: boolean;
    hasReceiptButton?: boolean;
  };
  isLast: boolean;
  onViewReceipt?: () => void;
}

export function TimelineStep({ step, isLast, onViewReceipt }: TimelineStepProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (step.status) {
      case "completed":
        return "bg-green-500 border-green-400";
      case "in-progress":
        return "bg-blue-500 border-blue-400 animate-pulse";
      case "pending":
        return "bg-slate-600 border-slate-500";
    }
  };

  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case "pending":
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Vertical Line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-800"></div>
      )}

      <div
        className={`backdrop-blur-xl bg-slate-900/50 border rounded-xl shadow-xl transition-all ${
          step.highlighted
            ? "border-green-500/50 shadow-green-500/20"
            : "border-slate-800/50"
        }`}
      >
        {/* Main Step Header */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon Circle */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl ${getStatusColor()}`}
            >
              {step.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    {getStatusIcon()}
                  </div>
                  <p className="text-slate-300">{step.mainText}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-slate-400">{step.timestamp}</div>
                  <div className="text-xs text-slate-500">{step.duration}</div>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              {(step.details || step.technical || step.reasoning || step.showFlow) && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Details
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-6 pl-16 space-y-4">
              {/* Details Table */}
              {step.details && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.entries(step.details).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning */}
              {step.reasoning && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-300 mb-2">
                    Reasoning
                  </div>
                  <div className="text-sm text-purple-200/80">
                    {step.reasoning}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              {step.technical && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
                  <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800">
                    <div className="text-xs font-medium text-slate-400">
                      Technical Details
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {Object.entries(step.technical).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm font-mono"
                      >
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-cyan-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flow Visualization: Intent → Auth → Approved/Pending (reflects actual state) */}
              {step.showFlow && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center mb-1">
                        <span className="text-blue-400">📝</span>
                      </div>
                      <div className="text-slate-400">Intent</div>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-700 mx-2"></div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500/20 border border-purple-500 rounded-full flex items-center justify-center mb-1">
                        <span className="text-purple-400">🔐</span>
                      </div>
                      <div className="text-slate-400">Auth</div>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-700 mx-2"></div>
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 border ${
                          step.status === "completed"
                            ? "bg-green-500/20 border-green-500"
                            : "bg-yellow-500/20 border border-yellow-500"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <span className="text-yellow-400">⏳</span>
                        )}
                      </div>
                      <div className={step.status === "completed" ? "text-green-400" : "text-slate-400"}>
                        {step.status === "completed" ? "Approved" : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt Button */}
              {step.hasReceiptButton && onViewReceipt && (
                <button
                  onClick={onViewReceipt}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  <Eye className="w-4 h-4" />
                  View Structured Receipt
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
