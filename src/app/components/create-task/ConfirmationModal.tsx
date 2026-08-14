import { useState } from "react";
import { X, AlertTriangle, Loader2, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import type { AgentRunResponse, PaymentResult, SettlementReceipt } from "../../api/client";

function formatPaymentAmount(amount: number): string {
  if (amount === 0) return "0.00";
  if (amount > 0 && amount < 0.01) {
    const s = amount.toFixed(6).replace(/\.?0+$/, "");
    return s || "0.00";
  }
  return amount.toFixed(2);
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onGoToDashboard?: () => void;
  onRunPayment?: () => void;
  onStartWithOrchestrator?: () => void;
  totalBudget: string;
  agentLoading?: boolean;
  agentResult?: AgentRunResponse | null;
  agentError?: string | null;
  paymentLoading?: boolean;
  paymentResult?: PaymentResult | null;
  ap2Receipt?: SettlementReceipt | null;
  /** BITE: decrypted payload released after condition verified */
  biteDecrypted?: Record<string, unknown> | null;
  orchestratorLoading?: boolean;
  orchestratorStatus?: string;
  /** When using Start with Orchestrator: amount and network for the payment (so user sees it during the flow). */
  orchestratorPaymentInfo?: { amount: number; network: string } | null;
  /** Preview run when modal opens: amount and network shown before user chooses Start Agent / Start with Orchestrator. */
  agentPreview?: AgentRunResponse | null;
  agentPreviewLoading?: boolean;
  agentPreviewError?: string | null;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onGoToDashboard,
  onRunPayment,
  totalBudget,
  agentLoading = false,
  agentResult = null,
  agentError = null,
  paymentLoading = false,
  paymentResult = null,
  ap2Receipt = null,
  biteDecrypted = null,
  onStartWithOrchestrator,
  orchestratorLoading = false,
  orchestratorStatus = "",
  orchestratorPaymentInfo = null,
  agentPreview = null,
  agentPreviewLoading = false,
  agentPreviewError = null,
}: ConfirmationModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
      setConfirmed(false);
    }
  };

  const handleClose = () => {
    onClose();
    setConfirmed(false);
  };

  const showResult = agentResult != null;
  const showError = agentError != null;
  const showConfirmView = !agentLoading && !orchestratorLoading && !showResult && !showError;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl flex flex-col max-h-[90vh] my-auto">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-white truncate pr-2" title={showResult && agentResult?.intent?.description ? agentResult.intent.description : undefined}>
            {orchestratorLoading ? "Orchestrator" : agentLoading ? "Running Agent" : showResult && agentResult?.intent?.description ? agentResult.intent.description : showResult ? "Agent Result" : showError ? "Request Failed" : "Confirm Autonomous Execution"}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto min-h-0 flex-1 overscroll-contain">
          {orchestratorLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <p className="text-slate-300 text-sm text-center">Orchestrator: {orchestratorStatus || "Running..."}</p>
              <p className="text-slate-500 text-xs">Full flow (agent → AP2 → payment → settle) step by step.</p>
              {orchestratorPaymentInfo && (
                <div className="mt-2 w-full max-w-xs rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-left">
                  <p className="text-slate-400 text-xs mb-1">Payment for this run</p>
                  <p className="text-white text-sm font-medium">
                    Amount: <span className="text-green-400">${formatPaymentAmount(orchestratorPaymentInfo.amount)}</span>
                    {orchestratorPaymentInfo.network && orchestratorPaymentInfo.network !== "—" && (
                      <> · Network: <span className="text-slate-200">{orchestratorPaymentInfo.network}</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {agentLoading && !orchestratorLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <p className="text-slate-300 text-sm text-center">Running agent logic (tool discovery, cost evaluation, policy check)...</p>
            </div>
          )}

          {showError && !agentLoading && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-300 mb-1">Error</div>
                <div className="text-sm text-red-200/90">{agentError}</div>
              </div>
            </div>
          )}

          {showResult && !agentLoading && agentResult && (
            <div className="space-y-4">
              {agentResult.state === "DECIDED" ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-300 mb-1">Tool selected</div>
                    <div className="text-lg font-semibold text-white">{agentResult.decision.selectedTool}</div>
                    <div className="text-sm text-slate-300 mt-1">
                      Confidence: {(agentResult.decision.confidenceScore * 100).toFixed(0)}%
                    </div>
                    {agentResult.decision.reason && (
                      <div className="text-xs text-slate-400 mt-2">{agentResult.decision.reason}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-300 mb-1">Policy blocked</div>
                    <div className="text-sm text-amber-200/90">No tool passed policy (allowlist, denylist, or budget). Try adjusting budget or tool access.</div>
                  </div>
                </div>
              )}
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Payment amount</span>
                  <span className="text-white font-semibold">${formatPaymentAmount(agentResult.decision.estimatedCost)}</span>
                </div>
                {agentResult.selectedToolNetwork && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Network</span>
                    <span className="text-white font-medium">{agentResult.selectedToolNetwork}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Task ID</span>
                  <span className="text-white font-mono text-xs">{agentResult.intent.taskId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">State</span>
                  <span className={agentResult.state === "DECIDED" ? "text-green-400" : "text-amber-400"}>{agentResult.state}</span>
                </div>
              </div>

              {agentResult.state === "DECIDED" && agentResult.selectedToolEndpoint && (
                <div className="space-y-3">
                  {paymentLoading && (
                    <div className="flex items-center gap-3 py-2">
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                      <span className="text-sm text-slate-300">Running x402 payment flow (request → 402 → sign → retry)...</span>
                    </div>
                  )}
                  {paymentResult != null && !paymentLoading && (
                    <div className={`rounded-lg p-4 border ${paymentResult.success ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                      {paymentResult.success ? (
                        <>
                          <div className="text-sm font-medium text-green-300 mb-1">Payment completed</div>
                          <div className="text-xs text-slate-300">Tool: {paymentResult.tool} · Amount: ${paymentResult.amount.toFixed(2)}</div>
                          {typeof paymentResult.llmReport === "string" &&
                            paymentResult.llmReport.trim() &&
                            !/report unavailable|llm offline|could not be generated/i.test(paymentResult.llmReport.trim()) && (
                            <div className="mt-2 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700">
                              <div className="text-xs font-medium text-slate-200 mb-1">LLM report</div>
                              <div className="text-xs text-slate-300 whitespace-pre-wrap">
                                {paymentResult.llmReport.trim()}
                              </div>
                            </div>
                          )}
                          {ap2Receipt != null && (
                            <div className="mt-2 p-2 bg-slate-800/50 rounded border border-slate-600 text-xs text-slate-300">
                              <div className="font-medium text-slate-200 mb-1">AP2 Receipt</div>
                              <div>Receipt: {ap2Receipt.receiptId}</div>
                              <div>Settlement: {ap2Receipt.settlementId}</div>
                              <div>Condition: {ap2Receipt.conditionResult ? "Verified" : "Not verified"}</div>
                              {ap2Receipt.txHash && <div>Tx: {ap2Receipt.txHash}</div>}
                            </div>
                          )}
                          {biteDecrypted != null && Object.keys(biteDecrypted).length > 0 && (
                            <div className="mt-2 p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/30 text-xs text-slate-300">
                              <div className="font-medium text-indigo-300 mb-1">BITE released (condition met)</div>
                              <pre className="overflow-auto max-h-24 text-slate-400 text-[11px] leading-tight">
                                {JSON.stringify(biteDecrypted, null, 2)}
                              </pre>
                            </div>
                          )}
                          {paymentResult.data != null && (
                            (() => {
                              const d = paymentResult.data as Record<string, unknown>;
                              if (d && d._binary === true && typeof d.base64 === "string" && d.contentType) {
                                return (
                                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 bg-slate-950/50">
                                    <img
                                      src={`data:${d.contentType};base64,${d.base64}`}
                                      alt="Tool result"
                                      className="w-full max-h-48 object-contain"
                                    />
                                  </div>
                                );
                              }
                              return (
                                <pre className="mt-2 text-xs text-slate-400 overflow-auto max-h-28 p-2.5 bg-slate-950/50 rounded-lg">
                                  {typeof paymentResult.data === "object" ? JSON.stringify(paymentResult.data, null, 2) : String(paymentResult.data)}
                                </pre>
                              );
                            })()
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium text-red-300 mb-1">Payment failed</div>
                          <div className="text-xs text-red-200/90">
                            {(() => {
                              const data: any = paymentResult.data as any;
                              const serverReason =
                                typeof data?.error === "string"
                                  ? data.error
                                  : typeof data?.error?.message === "string"
                                    ? data.error.message
                                    : null;
                              return serverReason ?? paymentResult.error ?? "Unknown error";
                            })()}
                          </div>
                          {(() => {
                            const data: any = paymentResult.data as any;
                            if (data?.code !== "INSUFFICIENT_USDC_BALANCE") return null;
                            return (
                              <a
                                href="/faucet"
                                className="inline-flex mt-2 text-xs font-medium text-blue-300 hover:text-blue-200 underline"
                              >
                                Open Faucet to mint test USDC
                              </a>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  )}
                  {!paymentLoading && paymentResult == null && onRunPayment && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400">
                        Amount: <strong className="text-slate-300">${formatPaymentAmount(agentResult.decision.estimatedCost)}</strong>
                        {agentResult.selectedToolNetwork && (
                          <> · Network: <strong className="text-slate-300">{agentResult.selectedToolNetwork}</strong></>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={onRunPayment}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Run payment (x402)
                      </button>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-500">
                Click &quot;Go to Active Jobs&quot; to see this task in your list.
              </p>
            </div>
          )}

          {showConfirmView && (
            <>
              {agentPreviewLoading && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                  <p className="text-slate-300 text-sm">Checking estimated payment and network…</p>
                </div>
              )}
              {agentPreviewError && !agentPreviewLoading && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-300 mb-1">Could not get estimate</div>
                    <div className="text-sm text-amber-200/90">{agentPreviewError}</div>
                    <p className="text-xs text-slate-400 mt-1">You can still try Start Agent or Start with Orchestrator below.</p>
                  </div>
                </div>
              )}
              {agentPreview && !agentPreviewLoading && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-300 mb-2">Estimated payment (before you start)</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white font-semibold">${formatPaymentAmount(agentPreview.decision.estimatedCost)}</span>
                  </div>
                  {agentPreview.selectedToolNetwork && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400">Network:</span>
                      <span className="text-white font-medium">{agentPreview.selectedToolNetwork}</span>
                    </div>
                  )}
                  {agentPreview.state === "POLICY_BLOCKED" && (
                    <p className="text-amber-300 text-xs mt-2">No tool passed policy; amount/network above are from discovery. You can still run to see the full result.</p>
                  )}
                </div>
              )}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-yellow-300 mb-1">Important Notice</div>
                  <div className="text-sm text-yellow-400/80">This agent may spend up to ${totalBudget} under defined policies. All transactions will be logged and monitored.</div>
                </div>
              </div>
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Maximum Spend:</span>
                  <span className="text-white font-semibold">${totalBudget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-green-400 font-semibold">{agentPreview && !agentPreviewLoading ? "Ready to Launch" : "Checking…"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monitoring:</span>
                  <span className="text-blue-400 font-semibold">Active</span>
                </div>
              </div>
              {onStartWithOrchestrator && (
                <p className="text-xs text-slate-500">
                  <strong className="text-slate-400">Start Agent:</strong> Run agent, then click &quot;Run payment (x402)&quot; in the result. <strong className="text-slate-400">Start with Orchestrator:</strong> Run the full flow (agent → AP2 → payment → settle) in one go.
                </p>
              )}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  I understand and approve this execution. The agent will operate autonomously within defined constraints.
                </span>
              </label>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-slate-800 flex-shrink-0 bg-slate-900 rounded-b-xl">
          {showResult || showError ? (
            <>
              <button onClick={handleClose} className="px-5 py-2.5 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">Close</button>
              {onGoToDashboard && (
                <button onClick={onGoToDashboard} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all cursor-pointer">Go to Active Jobs</button>
              )}
            </>
          ) : (
            <>
              <button onClick={handleClose} className="flex-1 min-w-[7rem] px-4 py-2.5 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-sm font-medium">Cancel</button>
              {onStartWithOrchestrator && (
                <button onClick={onStartWithOrchestrator} disabled={!confirmed || agentLoading || orchestratorLoading || agentPreviewLoading} title="Runs the full flow (agent → AP2 → payment → settle) in one go via the backend Orchestration Engine" className="flex-1 min-w-[11rem] px-4 py-2.5 border border-indigo-500/50 text-indigo-300 rounded-lg hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-medium whitespace-nowrap">Start with Orchestrator</button>
              )}
              <button onClick={handleConfirm} disabled={!confirmed || agentLoading || orchestratorLoading || agentPreviewLoading} className="flex-1 min-w-[7rem] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/30 text-sm font-medium">Start Agent</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
