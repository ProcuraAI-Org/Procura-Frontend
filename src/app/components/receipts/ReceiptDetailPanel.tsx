import { Check, Copy, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { useState } from "react";
import { Receipt } from "./ReceiptsTable";

interface ReceiptDetailPanelProps {
  receipt: Receipt | null;
}

export function ReceiptDetailPanel({ receipt }: ReceiptDetailPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intent",
    "authorization",
    "condition",
    "settlement",
  ]);
  const [showJSON, setShowJSON] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const copyJSON = () => {
    if (!receipt) return;
    const json = JSON.stringify(
      {
        receipt_id: receipt.settlementId,
        intent_id: receipt.intentId,
        authorization_id: receipt.authorizationId,
        settlement_id: receipt.settlementId,
        task: receipt.taskDescription,
        tool: receipt.tool,
        amount: receipt.amount,
        currency: "USD",
        network: receipt.network,
        transaction_hash: receipt.transactionHash,
        policy_checks: {
          budget_within_limit: receipt.policyChecks.withinBudget,
          allowlisted: receipt.policyChecks.allowlisted,
          per_tool_cap: receipt.policyChecks.perToolCap,
        },
        authorization: {
          approval_mode: receipt.authorization.approvalMode,
          human_approval_required: receipt.authorization.humanApprovalRequired,
          status: receipt.authorization.status,
          timestamp: receipt.authorization.timestamp,
        },
        condition: {
          type: receipt.condition.type,
          result: receipt.condition.result,
          encrypted: receipt.condition.encrypted,
          verification_timestamp: receipt.condition.verificationTimestamp,
        },
        settlement: {
          amount: receipt.settlement.amount,
          wallet_address: receipt.settlement.walletAddress,
          timestamp: receipt.settlement.timestamp,
          receipt_generated: receipt.settlement.receiptGenerated,
        },
        status: receipt.status,
        execution_duration: receipt.executionDuration,
      },
      null,
      2
    );
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!receipt) {
    return (
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
        <div className="text-center">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-400 mb-2">
            No Receipt Selected
          </h3>
          <p className="text-sm text-slate-500">
            Select a receipt from the table to view details
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-300";
      case "pending":
        return "text-amber-300";
      case "blocked":
        return "text-red-300";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Receipt Details</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Tool</div>
              <div className="text-sm text-white font-medium">{receipt.tool}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Amount</div>
              <div className="text-lg text-white font-bold font-mono">
                ${receipt.amount.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">Final Status</div>
            <div className={`text-sm font-medium ${getStatusColor(receipt.status)}`}>
              {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}{" "}
              {receipt.status === "completed" && "✔"}
            </div>
          </div>

          {receipt.transactionHash && (
            <div>
              <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
              <div className="text-sm text-blue-400 font-mono break-all">
                {receipt.transactionHash}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Network</div>
              <div className="text-sm text-white">{receipt.network}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Execution Duration</div>
              <div className="text-sm text-white font-mono">
                {receipt.executionDuration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AP2 Flow Breakdown */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">AP2 Flow Breakdown</h3>
        </div>

        {/* 1. Intent */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection("intent")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-sm font-bold">
                1
              </div>
              <span className="text-sm font-bold text-white">Intent</span>
            </div>
            {expandedSections.includes("intent") ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {expandedSections.includes("intent") && (
            <div className="px-6 pb-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Intent ID</div>
                <div className="text-sm text-white font-mono">{receipt.intentId}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Task</div>
                <div className="text-sm text-white">{receipt.taskDescription}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Budget Limit</div>
                  <div className="text-sm text-white font-mono">
                    ${receipt.budgetLimit.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Tool Requested</div>
                  <div className="text-sm text-white">{receipt.tool}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-2">Policy Checks</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>
                      {receipt.policyChecks.withinBudget
                        ? "Within Budget"
                        : "Exceeds Budget"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>
                      {receipt.policyChecks.allowlisted
                        ? "Tool Allowlisted"
                        : "Tool Not Allowlisted"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>
                      {receipt.policyChecks.perToolCap
                        ? "Below Per-Tool Cap"
                        : "Exceeds Per-Tool Cap"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Authorization */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection("authorization")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm font-bold">
                2
              </div>
              <span className="text-sm font-bold text-white">Authorization</span>
            </div>
            {expandedSections.includes("authorization") ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {expandedSections.includes("authorization") && (
            <div className="px-6 pb-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Authorization ID</div>
                <div className="text-sm text-white font-mono">
                  {receipt.authorizationId}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Approval Mode</div>
                  <div className="text-sm text-white">
                    {receipt.authorization.approvalMode}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Human Approval</div>
                  <div className="text-sm text-slate-300">
                    {receipt.authorization.humanApprovalRequired
                      ? "Required"
                      : "Not Required"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Timestamp</div>
                  <div className="text-sm text-white font-mono">
                    {receipt.authorization.timestamp}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <div className="text-sm text-green-300">
                    {receipt.authorization.status} ✔
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Condition Verification */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => toggleSection("condition")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-sm font-bold">
                3
              </div>
              <span className="text-sm font-bold text-white">
                Condition Verification
              </span>
            </div>
            {expandedSections.includes("condition") ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {expandedSections.includes("condition") && (
            <div className="px-6 pb-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Condition Type</div>
                <div className="text-sm text-white">{receipt.condition.type}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Condition Result</div>
                  <div className="text-sm text-green-300">
                    {receipt.condition.result} ✔
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Encrypted Policy</div>
                  <div className="text-sm text-purple-300">
                    {receipt.condition.encrypted
                      ? "Decrypted at Settlement"
                      : "Not Encrypted"}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  Verification Timestamp
                </div>
                <div className="text-sm text-white font-mono">
                  {receipt.condition.verificationTimestamp}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Settlement */}
        <div>
          <button
            onClick={() => toggleSection("settlement")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-300 text-sm font-bold">
                4
              </div>
              <span className="text-sm font-bold text-white">Settlement</span>
            </div>
            {expandedSections.includes("settlement") ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {expandedSections.includes("settlement") && (
            <div className="px-6 pb-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Settlement ID</div>
                <div className="text-sm text-white font-mono">
                  {receipt.settlementId}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Amount Settled</div>
                <div className="text-lg text-white font-bold font-mono">
                  ${receipt.settlement.amount.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Wallet Address</div>
                <div className="text-sm text-blue-400 font-mono break-all">
                  {receipt.settlement.walletAddress}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">
                    Settlement Timestamp
                  </div>
                  <div className="text-sm text-white font-mono">
                    {receipt.settlement.timestamp}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Receipt Generated</div>
                  <div className="text-sm text-green-300">
                    {receipt.settlement.receiptGenerated ? "Yes ✔" : "No"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* JSON View */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
        <button
          onClick={() => setShowJSON(!showJSON)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
        >
          <span className="text-sm font-bold text-white">
            Structured Receipt (JSON)
          </span>
          {showJSON ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showJSON && (
          <div className="p-6 border-t border-slate-800">
            <div className="relative">
              <pre className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 font-mono overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(
                  {
                    receipt_id: receipt.settlementId,
                    intent_id: receipt.intentId,
                    authorization_id: receipt.authorizationId,
                    settlement_id: receipt.settlementId,
                    task: receipt.taskDescription,
                    tool: receipt.tool,
                    amount: receipt.amount,
                    currency: "USD",
                    network: receipt.network,
                    transaction_hash: receipt.transactionHash,
                    policy_checks: {
                      budget_within_limit: receipt.policyChecks.withinBudget,
                      allowlisted: receipt.policyChecks.allowlisted,
                      per_tool_cap: receipt.policyChecks.perToolCap,
                    },
                    authorization: {
                      approval_mode: receipt.authorization.approvalMode,
                      human_approval_required:
                        receipt.authorization.humanApprovalRequired,
                      status: receipt.authorization.status,
                      timestamp: receipt.authorization.timestamp,
                    },
                    condition: {
                      type: receipt.condition.type,
                      result: receipt.condition.result,
                      encrypted: receipt.condition.encrypted,
                      verification_timestamp:
                        receipt.condition.verificationTimestamp,
                    },
                    settlement: {
                      amount: receipt.settlement.amount,
                      wallet_address: receipt.settlement.walletAddress,
                      timestamp: receipt.settlement.timestamp,
                      receipt_generated: receipt.settlement.receiptGenerated,
                    },
                    status: receipt.status,
                    execution_duration: receipt.executionDuration,
                  },
                  null,
                  2
                )}
              </pre>
              <button
                onClick={copyJSON}
                className="absolute top-2 right-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs rounded flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Integrity */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">Audit Integrity</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-3 h-3 text-green-400" />
            <span>All payments logged</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-3 h-3 text-green-400" />
            <span>AP2 lifecycle enforced</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-3 h-3 text-green-400" />
            <span>Conditional checks recorded</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-3 h-3 text-green-400" />
            <span>Immutable receipt ID generated</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          Receipts are generated deterministically after successful settlement.
        </p>
      </div>
    </div>
  );
}
