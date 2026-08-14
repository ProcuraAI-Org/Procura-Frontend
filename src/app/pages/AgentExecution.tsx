/**
 * Agent Execution page – rewritten from scratch.
 * Single source of truth: task from GET /api/tasks/:taskId (with list fallback).
 * Debug panel shows why AP2 shows Pending vs Approved and why receipt may be missing.
 */
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { Eye, X, RefreshCw, Bug } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  getOrchestratorTask,
  listOrchestratorTasks,
  getAp2Receipt,
  isOrchestratorTerminalState,
  type OrchestratorTask,
} from "../api/client";
import { TimelineStep } from "../components/execution/TimelineStep";
import { ExecutionSummaryPanel } from "../components/execution/ExecutionSummaryPanel";
import { DeveloperTrace } from "../components/execution/DeveloperTrace";

const STATE_ORDER = [
  "IDLE",
  "DECISION_MADE",
  "AUTHORIZATION_PENDING",
  "AUTHORIZED",
  "PAYMENT_INITIATED",
  "PAYMENT_COMPLETED",
  "CONDITION_VERIFIED",
  "INTENT_DECRYPTED",
  "SETTLEMENT_EXECUTED",
  "RECEIPT_GENERATED",
  "COMPLETED",
];

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

type StepStatus = "pending" | "in-progress" | "completed";

function buildTimelineSteps(task: OrchestratorTask | null) {
  const state = task?.state ?? "IDLE";
  const stateStr = String(state).trim();
  let idx = STATE_ORDER.indexOf(stateStr);
  if (idx === -1 && stateStr) {
    const ci = STATE_ORDER.findIndex((s) => s.toLowerCase() === stateStr.toLowerCase());
    if (ci >= 0) idx = ci;
  }
  const budget = Number(task?.intent?.totalBudget ?? task?.totalBudget ?? 0);
  const maxPerTool = Number(task?.intent?.maxPerTool ?? task?.maxPerTool ?? 0);
  const tool = task?.decision?.selectedTool ?? task?.paymentResult?.tool ?? "—";
  const cost = Number(task?.decision?.estimatedCost ?? task?.paymentResult?.amount ?? 0);
  const intentId = task?.intentId ?? "—";
  const updatedAt = task?.updatedAt ? formatTime(task.updatedAt) : "—";
  const createdAt = task?.createdAt ? formatTime(task.createdAt) : "—";

  const step = (
    i: number,
    title: string,
    icon: string,
    stateKey: string,
    mainText: string,
    details?: Record<string, string>,
    opts?: { showFlow?: boolean; hasReceiptButton?: boolean }
  ) => {
    const stepIdx = STATE_ORDER.indexOf(stateKey);
    const done = idx >= stepIdx;
    const current = idx === stepIdx;
    let status: StepStatus = "pending";
    if (done) status = "completed";
    else if (current) status = "in-progress";
    return {
      id: i,
      title,
      icon,
      status,
      mainText,
      timestamp: done ? updatedAt : createdAt,
      duration: "—",
      details,
      showFlow: opts?.showFlow,
      highlighted: stateStr === "COMPLETED" && stateKey === "COMPLETED",
      hasReceiptButton: opts?.hasReceiptButton,
    };
  };

  return [
    step(1, "Discovering Tools", "🔍", "IDLE", "Agent discovery and tool selection", {
      "Budget Limit": `$${budget.toFixed(2)}`,
      "Max Per Tool": maxPerTool ? `$${maxPerTool.toFixed(2)}` : "—",
    }),
    step(2, "Tool Requires Payment (HTTP 402)", "💰", "DECISION_MADE", `Tool selected: ${tool}`, {
      Tool: tool,
      Cost: `$${cost.toFixed(2)}`,
      "Payment Protocol": "x402",
    }),
    step(3, "Authorization Created (AP2)", "🔐", "AUTHORIZED", "Authorization intent created", {
      "Intent ID": intentId,
      "Budget Verified": `$${budget.toFixed(2)}`,
      "Human Approval Required": task?.intent?.requireHumanApproval ? "Yes" : "No",
    }, { showFlow: true }),
    step(4, "x402 Payment Sent", "💳", "PAYMENT_COMPLETED", task?.paymentResult?.success ? "Payment completed" : "Payment in progress or failed", {
      Amount: `$${cost.toFixed(2)}`,
      Tool: tool,
      ...(task?.paymentResult?.txHash ? { "Transaction Hash": String(task.paymentResult.txHash).slice(0, 10) + "…" } : {}),
    }),
    step(5, "Condition Verified", "🔒", "CONDITION_VERIFIED", "SLA / condition verification", {
      Result: idx >= STATE_ORDER.indexOf("CONDITION_VERIFIED") ? "Satisfied" : "—",
    }),
    step(6, "Settlement Executed", "✅", "SETTLEMENT_EXECUTED", "AP2 settlement on-chain", {
      "Final Cost": `$${cost.toFixed(2)}`,
      "Budget Remaining": `$${Math.max(0, budget - cost).toFixed(2)}`,
    }),
    step(7, "Receipt Generated", "📄", "COMPLETED", stateStr === "COMPLETED" ? "Receipt generated" : "Awaiting completion", {
      "Receipt ID": task?.receiptId ?? "—",
      "Intent ID": typeof task?.intentId === "string" ? task.intentId.slice(0, 10) + "…" : "—",
      "Settlement ID": task?.settlementId ?? "—",
      "Status": stateStr === "COMPLETED" ? "Generated" : "—",
    }, { hasReceiptButton: stateStr === "COMPLETED" }),
  ];
}

/** Debug info for AP2 Pending vs Approved and receipt */
function DebugPanel({
  taskId,
  task,
  loadSource,
  receiptError,
}: {
  taskId: string | undefined;
  task: OrchestratorTask | null;
  loadSource: "getById" | "listFallback" | null;
  receiptError: string | null;
}) {
  const [open, setOpen] = useState(true);
  const state = task?.state ?? null;
  const stateStr = state != null ? String(state).trim() : "";
  let idx = stateStr ? STATE_ORDER.indexOf(stateStr) : -1;
  if (idx === -1 && stateStr) {
    const ci = STATE_ORDER.findIndex((s) => s.toLowerCase() === stateStr.toLowerCase());
    if (ci >= 0) idx = ci;
  }
  const step3StateKey = "AUTHORIZED";
  const step3Idx = STATE_ORDER.indexOf(step3StateKey);
  const step3Done = idx >= step3Idx;
  const step3Status = step3Done ? "completed (→ Approved)" : idx === step3Idx ? "in-progress" : "pending (→ Pending)";

  return (
    <div className="mb-6 rounded-xl border border-amber-500/50 bg-amber-950/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer"
      >
        <span className="flex items-center gap-2 text-amber-300 font-medium">
          <Bug className="w-4 h-4" />
          Debug: why AP2 / receipt
        </span>
        <span className="text-amber-500/80">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 text-sm font-mono border-t border-amber-500/30 pt-3">
          <div><span className="text-slate-500">URL taskId:</span> <span className="text-white">{taskId ?? "(none)"}</span></div>
          <div><span className="text-slate-500">Task load source:</span> <span className="text-cyan-400">{loadSource ?? "—"}</span></div>
          <div><span className="text-slate-500">task?.state (raw):</span> <span className="text-yellow-300">"{stateStr || "(null)"}"</span></div>
          <div><span className="text-slate-500">STATE_ORDER.indexOf(state):</span> <span className="text-yellow-300">{idx}</span> {idx === -1 && <span className="text-red-400">(state not in list → steps stay pending)</span>}</div>
          <div><span className="text-slate-500">Step 3 (AP2) stateKey:</span> AUTHORIZED, stepIdx = {step3Idx}</div>
          <div><span className="text-slate-500">Step 3 done (idx &gt;= stepIdx):</span> <span className={step3Done ? "text-green-400" : "text-red-400"}>{String(step3Done)}</span></div>
          <div><span className="text-slate-500">Step 3 status:</span> <span className="text-amber-300">{step3Status}</span></div>
          <div><span className="text-slate-500">task?.intentId (for receipt):</span> <span className="text-cyan-400">{task?.intentId ? `"${String(task.intentId).slice(0, 20)}…"` : "(missing)"}</span></div>
          <div><span className="text-slate-500">task?.receiptId:</span> <span className="text-cyan-400">{task?.receiptId ?? "(missing)"}</span></div>
          {receiptError && <div><span className="text-slate-500">Receipt fetch error:</span> <span className="text-red-400">{receiptError}</span></div>}
        </div>
      )}
    </div>
  );
}

export default function AgentExecution() {
  const navigate = useNavigate();
  const { id: taskId } = useParams<{ id: string }>();
  const [task, setTask] = useState<OrchestratorTask | null>(null);
  const [taskLoadError, setTaskLoadError] = useState<string | null>(null);
  const [loadSource, setLoadSource] = useState<"getById" | "listFallback" | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<Record<string, unknown> | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const loadTask = useCallback(async (id: string) => {
    setTaskLoadError(null);
    setLoadSource(null);
    try {
      const t = await getOrchestratorTask(id);
      setTask(t);
      setLoadSource("getById");
      return;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.toLowerCase().includes("not found")) {
        setTaskLoadError(msg);
        setTask(null);
        return;
      }
    }
    try {
      const res = await listOrchestratorTasks("frontend");
      let list = res.tasks ?? [];
      if (list.length === 0) {
        const all = await listOrchestratorTasks("system");
        list = all.tasks ?? [];
      }
      const found = list.find((t) => t.taskId === id);
      if (found) {
        setTask(found);
        setLoadSource("listFallback");
      } else {
        setTaskLoadError("Task not found");
        setTask(null);
      }
    } catch {
      setTaskLoadError("Task not found");
      setTask(null);
    }
  }, []);

  useEffect(() => {
    if (!taskId) return;
    setTask(null);
    loadTask(taskId);
  }, [taskId, loadTask]);

  useEffect(() => {
    if (!taskId || !task || taskLoadError || isOrchestratorTerminalState(task.state)) return;
    const interval = setInterval(() => loadTask(taskId), 3000);
    return () => clearInterval(interval);
  }, [taskId, task?.state, taskLoadError, loadTask]);

  const handleRefresh = () => {
    if (!taskId) return;
    loadTask(taskId);
  };

  const handleShowReceipt = () => {
    setReceiptData(null);
    setReceiptError(null);
    setShowReceipt(true);
    if (!task?.intentId) {
      setReceiptError("No intentId on task – cannot fetch receipt");
      return;
    }
    getAp2Receipt(task.intentId)
      .then((r) => {
        setReceiptData(typeof r === "object" && r !== null ? { ...r } : {});
        setReceiptError(null);
      })
      .catch((e) => {
        setReceiptData(null);
        setReceiptError(e instanceof Error ? e.message : String(e));
      });
  };

  const timelineSteps = buildTimelineSteps(task);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <PageLayout className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Top bar: task id + state + back */}
          <div className="mb-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 text-sm">Task</span>
              <div className="font-mono text-white font-medium">{taskId ?? "—"}</div>
              <div className="text-sm text-slate-300 mt-1">
                State: <span className="font-medium">{taskLoadError ?? task?.state ?? "—"}</span>
              </div>
              {taskLoadError && (
                <p className="text-sm text-amber-300 mt-2 max-w-xl">
                  Task not in database or link is old. Open from <strong>Active Jobs</strong> or refresh.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate("/active-jobs")}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 text-sm"
            >
              Back to Active Jobs
            </button>
          </div>

          {/* Debug panel */}
          <DebugPanel taskId={taskId} task={task} loadSource={loadSource} receiptError={receiptError} />

          {/* Header */}
          <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Agent Execution</h1>
              <p className="text-slate-400">Workflow with payment authorization and settlement.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  task?.state === "COMPLETED"
                    ? "bg-green-500/20 border-green-500/30"
                    : ["PAYMENT_FAILED", "POLICY_BLOCKED", "CONDITION_FAILED", "SETTLEMENT_FAILED"].includes(String(task?.state))
                    ? "bg-red-500/20 border-red-500/30"
                    : "bg-green-500/20 border-green-500/30"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    task?.state === "COMPLETED"
                      ? "bg-green-400"
                      : ["PAYMENT_FAILED", "POLICY_BLOCKED"].includes(String(task?.state))
                      ? "bg-red-400"
                      : "bg-green-400 animate-pulse"
                  }`}
                />
                <span className={task?.state === "COMPLETED" ? "text-green-400 font-medium" : ["PAYMENT_FAILED", "POLICY_BLOCKED", "CONDITION_FAILED", "SETTLEMENT_FAILED"].includes(String(task?.state)) ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
                  {task?.state === "COMPLETED" ? "Completed" : ["PAYMENT_FAILED", "POLICY_BLOCKED", "CONDITION_FAILED", "SETTLEMENT_FAILED"].includes(String(task?.state)) ? String(task?.state) : "Active"}
                </span>
              </div>
              <button type="button" onClick={handleRefresh} className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2" title="Refetch task from API">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button type="button" onClick={handleShowReceipt} className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2">
                <Eye className="w-4 h-4" /> View Receipt
              </button>
              <button type="button" className="px-4 py-2 border-2 border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel Task
              </button>
            </div>
          </div>

          {/* Two columns: timeline | summary */}
          <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Workflow Timeline</h2>
              <div className="space-y-4">
                {timelineSteps.map((step, index) => (
                  <TimelineStep
                    key={step.id}
                    step={step}
                    isLast={index === timelineSteps.length - 1}
                    onViewReceipt={step.hasReceiptButton ? handleShowReceipt : undefined}
                  />
                ))}
              </div>
            </div>
            <div className="lg:sticky lg:top-8">
              <ExecutionSummaryPanel task={task} />
            </div>
          </div>

          <div className="mt-6 lg:mt-8">
            <DeveloperTrace task={task} receiptData={receiptData} />
          </div>
        </div>
      </PageLayout>

      {/* Receipt modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Structured Receipt</h3>
              <button type="button" onClick={() => setShowReceipt(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300">
                {receiptData !== null ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(receiptData, null, 2)}</pre>
                ) : receiptError ? (
                  <p className="text-red-400">{receiptError}</p>
                ) : task?.intentId ? (
                  <p className="text-slate-400">Loading receipt…</p>
                ) : (
                  <p className="text-slate-400">No intentId on task – receipt not available.</p>
                )}
              </div>
              <button type="button" onClick={() => setShowReceipt(false)} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
