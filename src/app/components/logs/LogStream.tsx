import { ChevronRight } from "lucide-react";

export interface LogEvent {
  id: string;
  timestamp: string;
  eventType: string;
  eventCategory: "http" | "payment" | "ap2" | "condition" | "settlement" | "error" | "info";
  message: string;
  details: any;
  severity: "success" | "info" | "warning" | "error";
}

interface LogStreamProps {
  logs: LogEvent[];
  selectedLog: LogEvent | null;
  onSelectLog: (log: LogEvent) => void;
  showOnlyErrors: boolean;
}

export function LogStream({
  logs,
  selectedLog,
  onSelectLog,
  showOnlyErrors,
}: LogStreamProps) {
  const filteredLogs = showOnlyErrors
    ? logs.filter((log) => log.severity === "error")
    : logs;

  const getEventBadgeStyle = (category: string) => {
    switch (category) {
      case "http":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "payment":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      case "ap2":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "condition":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "settlement":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      case "error":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const getSeverityMarkerColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-400";
      case "info":
        return "bg-blue-400";
      case "warning":
        return "bg-amber-400";
      case "error":
        return "bg-red-400";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-950/80 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
        <h2 className="text-xl font-bold text-white">Live Execution Log</h2>
      </div>

      {/* Log Entries */}
      <div className="max-h-[800px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No logs to display
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectLog(log)}
                className={`flex items-start gap-3 px-6 py-4 cursor-pointer transition-all ${
                  selectedLog?.id === log.id
                    ? "bg-blue-500/10 border-l-2 border-l-blue-500"
                    : "hover:bg-slate-800/30 border-l-2 border-l-transparent"
                }`}
              >
                {/* Severity Marker */}
                <div className="flex-shrink-0 mt-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${getSeverityMarkerColor(
                      log.severity
                    )}`}
                  ></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-500">
                      [{log.timestamp}]
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${getEventBadgeStyle(
                        log.eventCategory
                      )}`}
                    >
                      {log.eventType}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 font-mono">
                    {log.message}
                  </div>
                </div>

                {/* Expand Arrow */}
                <div className="flex-shrink-0 mt-1">
                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      selectedLog?.id === log.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50">
        <div className="text-xs text-slate-500 font-mono">
          {filteredLogs.length} events
        </div>
      </div>
    </div>
  );
}
