import { useState, useEffect } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { FilterBar } from "../components/logs/FilterBar";
import { LogStream } from "../components/logs/LogStream";
import { EventInspector } from "../components/logs/EventInspector";
import { PerformanceMetrics } from "../components/logs/PerformanceMetrics";
import { useAppData } from "../context/AppDataContext";
import { type DashboardEvent } from "../api/client";
import { Download } from "lucide-react";
import type { LogEvent } from "../components/logs/LogStream";

function eventCategory(event: string): LogEvent["eventCategory"] {
  const e = event.toUpperCase();
  if (e.includes("HTTP") || e.includes("RETRY") || e.includes("RESPONSE")) return "http";
  if (e.includes("PAYMENT") || e.includes("X402") || e.includes("SIGNED")) return "payment";
  if (e.includes("POLICY") || e.includes("BLOCKED") || e.includes("VIOLATION")) return "error";
  if (e.includes("CONDITION")) return "condition";
  if (e.includes("SETTLEMENT") || e.includes("RECEIPT")) return "settlement";
  return "ap2";
}

function eventSeverity(event: string): LogEvent["severity"] {
  const e = event.toUpperCase();
  if (e.includes("BLOCKED") || e.includes("VIOLATION") || e.includes("FAILED") || e.includes("ERROR")) return "error";
  if (e.includes("SIGNED") || e.includes("APPROVED") || e.includes("VERIFIED") || e.includes("COMPLETED") || e.includes("RECEIVED")) return "success";
  if (e.includes("402") || e.includes("CHALLENGE") || e.includes("REQUESTED")) return "warning";
  return "info";
}

function formatLogTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(11, 23).replace("Z", "");
}

function eventToLogEvent(e: DashboardEvent): LogEvent {
  const taskPart = e.taskId ? ` [${e.taskId}]` : "";
  return {
    id: `LOG-${e.id}`,
    timestamp: formatLogTimestamp(e.createdAt),
    eventType: e.event,
    eventCategory: eventCategory(e.event),
    message: `${e.event}${taskPart}`,
    severity: eventSeverity(e.event),
    details: e.payload ?? {},
  };
}

export default function Logs() {
  const { events: eventsCache, loadingEvents, getOrLoadEvents } = useAppData();
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    getOrLoadEvents()
      .then((list) => {
        if (!cancelled) {
          const mapped = list.map(eventToLogEvent);
          setLogs(mapped);
          setSelectedLog(mapped[0] ?? null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load events");
      });
    return () => {
      cancelled = true;
    };
  }, [getOrLoadEvents]);

  const loading = eventsCache === null && loadingEvents;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType =
      eventTypeFilter === "all" || log.eventCategory === eventTypeFilter;
    const matchesStatus = statusFilter === "all" || log.severity === statusFilter;
    return matchesSearch && matchesEventType && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setEventTypeFilter("all");
    setStatusFilter("all");
    setShowOnlyErrors(false);
  };

  const handleDownloadLogs = () => {
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "execution-logs.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      <Sidebar />

      <PageLayout className="pb-16 sm:pb-24">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Execution Logs & Developer Trace
                </h1>
                <p className="text-base sm:text-lg text-slate-400">
                  Structured event logs for agent runtime, payment flows, and
                  settlement lifecycle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 border-2 border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all font-medium font-mono"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleDownloadLogs}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 font-mono"
                >
                  <Download className="w-4 h-4" />
                  Download Logs
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-300 font-mono">
                Live Stream
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Filter Bar */}
          <div className="mb-6">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              eventTypeFilter={eventTypeFilter}
              onEventTypeChange={setEventTypeFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              showOnlyErrors={showOnlyErrors}
              onToggleErrors={() => setShowOnlyErrors(!showOnlyErrors)}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
            {/* Left: Log Stream */}
            <div className="space-y-6">
              {loading ? (
                <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl p-8 text-center text-slate-400 font-mono">
                  Loading logs…
                </div>
              ) : logs.length === 0 ? (
                <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl p-8 text-center">
                  <p className="text-slate-400 mb-2">No logs found</p>
                  <p className="text-sm text-slate-500">Agent and payment events will appear here after runs.</p>
                </div>
              ) : (
                <LogStream
                  logs={filteredLogs}
                  selectedLog={selectedLog}
                  onSelectLog={setSelectedLog}
                  showOnlyErrors={showOnlyErrors}
                />
              )}
            </div>

            {/* Right: Event Inspector + Metrics */}
            <div className="lg:col-span-1 space-y-6">
              <div className="lg:sticky lg:top-8 space-y-6">
                <EventInspector event={selectedLog} />
                <PerformanceMetrics
                  totalExecutionTime={logs.length > 0 ? "—" : "—"}
                  httpCalls={logs.filter((l) => l.eventCategory === "http").length}
                  paymentsSigned={logs.filter((l) => l.eventType.includes("PAYMENT_SIGNED") || l.eventType.includes("X402")).length}
                  retries={logs.filter((l) => l.eventType.includes("RETRY")).length}
                  policyViolations={logs.filter((l) => l.severity === "error" && l.eventCategory === "error").length}
                  averageLatency="—"
                />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}