import { Shield } from "lucide-react";
import type { OrchestratorTask } from "../../api/client";

interface ExecutionSummaryPanelProps {
  task?: OrchestratorTask | null;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  } catch {
    return "—";
  }
}

export function ExecutionSummaryPanel({ task }: ExecutionSummaryPanelProps) {
  const description = task?.intent?.description ?? task?.description ?? "—";
  const budget = Number(task?.intent?.totalBudget ?? task?.totalBudget ?? 0);
  const spent = task?.paymentResult?.success ? Number(task.paymentResult.amount ?? 0) : Number(task?.decision?.estimatedCost ?? 0);
  const remaining = Math.max(0, budget - spent);
  const progressPct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const isComplete = task?.state === "COMPLETED";
  const encryptionEnabled = Boolean(task?.intent?.encryptionEnabled ?? task?.encryptionEnabled);
  const humanApproval = Boolean(task?.intent?.requireHumanApproval ?? task?.requireHumanApproval);
  const authMode = humanApproval ? "Human approval" : "Auto-Approval";
  const tool = task?.decision?.selectedTool ?? task?.paymentResult?.tool ?? "—";
  const updatedAt = task?.updatedAt ? formatTime(task.updatedAt) : "—";

  const stateOrder = [
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
  const currentStepIndex = stateOrder.indexOf(task?.state ?? "");
  const flowSteps = [
    { label: "Intent", minState: "AUTHORIZED" },
    { label: "x402 Payment", minState: "PAYMENT_COMPLETED" },
    { label: "Authorization", minState: "AUTHORIZED" },
    { label: "Condition Check", minState: "CONDITION_VERIFIED" },
    { label: "Settlement", minState: "SETTLEMENT_EXECUTED" },
    { label: "Receipt", minState: "COMPLETED" },
  ];
  const currentStateIndex = currentStepIndex >= 0 ? currentStepIndex : -1;

  return (
    <div className="sticky top-8">
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Execution Summary
        </h3>

        <div className="space-y-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">Task</div>
            <div className="text-sm text-white font-medium break-words">{description}</div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Budget</span>
              <span className="text-sm text-white font-semibold">${budget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Spent</span>
              <span className="text-sm text-green-400 font-semibold">${spent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Remaining</span>
              <span className="text-sm text-blue-400 font-semibold">${remaining.toFixed(2)}</span>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {task && (
            <>
              <div>
                <div className="text-xs text-slate-500 mb-1">Tool</div>
                <div className="text-sm text-white font-medium">{tool}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-3">Spend Policy (from task)</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total budget</span>
                    <span className="text-white font-medium">${budget.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Per-tool cap</span>
                    <span className="text-white font-medium">
                      {Number(task?.intent?.maxPerTool ?? task?.maxPerTool ?? 0) > 0
                        ? `$${Number(task?.intent?.maxPerTool ?? task?.maxPerTool).toFixed(2)}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Allowlist</span>
                    <span className="text-white font-medium">
                      {((task?.intent?.allowlist ?? task?.allowlist) ?? []).length
                        ? (task?.intent?.allowlist ?? task?.allowlist)!.join(", ")
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Denylist</span>
                    <span className="text-white font-medium">
                      {((task?.intent?.denylist ?? task?.denylist) ?? []).length
                        ? (task?.intent?.denylist ?? task?.denylist)!.join(", ")
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Encryption</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                  {encryptionEnabled ? "Enabled (BITE v2)" : "Disabled"}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Authorization Mode</div>
                <div className="text-sm text-white font-medium">{authMode}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">State</div>
                <div className="text-sm text-white font-medium">{task.state ?? "—"}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-3">Progress</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                      style={{
                        width: isComplete ? "100%" : `${Math.min(100, (currentStepIndex + 1) * (100 / stateOrder.length))}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">
                    {isComplete ? "100%" : currentStepIndex >= 0 ? Math.round(((currentStepIndex + 1) / stateOrder.length) * 100) : 0}%
                  </span>
                </div>
                <div className="text-xs text-green-400">{isComplete ? "Complete" : task.state ?? "—"}</div>
              </div>

              <div className="border-t border-slate-700" />

              <div>
                <div className="text-xs text-slate-500 mb-3">Execution Flow</div>
                <div className="space-y-2">
                  {flowSteps.map(({ label, minState }) => {
                    const minIdx = stateOrder.indexOf(minState);
                    const done = currentStateIndex >= minIdx;
                    return (
                      <div key={minState} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${done ? "bg-green-500" : "bg-slate-600"}`}
                        />
                        <span className={done ? "text-slate-300" : "text-slate-500"}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {task?.paymentResult?.llmReport?.trim() &&
                !/report unavailable|llm offline|could not be generated/i.test(task.paymentResult.llmReport.trim()) && (
                <div className="border-t border-slate-700 pt-4">
                  <div className="text-xs text-slate-500 mb-2">LLM Report</div>
                  <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {task.paymentResult.llmReport.trim()}
                  </div>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs text-blue-400 mb-1">Last updated</div>
                <div className="text-sm font-medium text-blue-300">{updatedAt}</div>
              </div>
            </>
          )}

          {!task && (
            <>
              <div>
                <div className="text-xs text-slate-500 mb-1">Encryption</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-400">
                  —
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Authorization Mode</div>
                <div className="text-sm text-slate-400">—</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">Load task to see summary</div>
                <div className="text-sm text-slate-400">Open a task from Active Jobs</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
