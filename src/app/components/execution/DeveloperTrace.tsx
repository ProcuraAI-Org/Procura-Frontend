import { useState } from "react";
import { ChevronDown, ChevronUp, Code, Copy } from "lucide-react";
import type { OrchestratorTask } from "../../api/client";

interface DeveloperTraceProps {
  task: OrchestratorTask | null;
  receiptData: Record<string, unknown> | null;
}

export function DeveloperTrace({ task, receiptData }: DeveloperTraceProps) {
  const [expanded, setExpanded] = useState(false);

  const budget = Number(task?.intent?.totalBudget ?? task?.totalBudget ?? 0);
  const cost = Number(task?.decision?.estimatedCost ?? task?.paymentResult?.amount ?? 0);
  const tool = task?.decision?.selectedTool ?? task?.paymentResult?.tool;
  const endpoint = task?.selectedToolEndpoint;
  const network = task?.selectedToolNetwork;

  const http402Block =
    task && tool && endpoint
      ? {
          status: 402,
          statusText: "Payment Required",
          tool,
          amount: cost,
          endpoint,
          network: network ?? undefined,
        }
      : null;

  const paymentPayloadBlock =
    task?.intentId && tool != null
      ? {
          intentId: task.intentId,
          amount: cost,
          tool,
          taskId: task.taskId,
          totalBudget: budget,
        }
      : null;

  const retryBlock =
    task?.paymentResult && endpoint
      ? {
          endpoint,
          method: "POST" as const,
          success: task.paymentResult.success,
          amount: task.paymentResult.amount,
          tool: task.paymentResult.tool,
          ...(task.paymentResult.txHash ? { txHash: task.paymentResult.txHash } : {}),
        }
      : null;

  const settlementBlock =
    task?.settlementId || task?.authorizationId || task?.intentId
      ? {
          ...(task?.settlementId && { settlement_id: task.settlementId }),
          ...(task?.authorizationId && { authorization_id: task.authorizationId }),
          ...(task?.intentId && { intent_id: task.intentId }),
          amount: cost,
          budget_remaining: Math.max(0, budget - cost),
          tool: tool ?? undefined,
          human_approval_required: Boolean(task?.intent?.requireHumanApproval ?? task?.requireHumanApproval),
        }
      : null;

  const receiptBlock =
    receiptData || (task?.receiptId && task?.intentId)
      ? {
          ...(receiptData ?? {}),
          ...(task?.receiptId && !receiptData?.receiptId && { receiptId: task.receiptId }),
          ...(task?.intentId && !receiptData?.intentId && { intentId: task.intentId }),
          ...(task?.settlementId && !receiptData?.settlementId && { settlementId: task.settlementId }),
          ...(tool != null && !receiptData?.tool && { tool }),
          ...(cost != null && cost > 0 && !receiptData?.amount && { amount: cost }),
        }
      : null;

  const hasAnyTrace = http402Block || paymentPayloadBlock || retryBlock || settlementBlock || receiptBlock;

  const copyToClipboard = (data: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-white">Developer Trace</h3>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
            {task ? (hasAnyTrace ? "From task & receipt API" : "No trace data yet") : "Load task to see trace"}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-800">
          <div className="p-6 space-y-6 max-h-[600px] overflow-auto">
            {!task && (
              <p className="text-sm text-slate-400">Open a task from Active Jobs to view execution trace.</p>
            )}

            {task && !hasAnyTrace && (
              <p className="text-sm text-slate-400">
                Trace will appear as the task progresses (402 challenge, payment, settlement, receipt).
              </p>
            )}

            {http402Block && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">HTTP 402 (Payment Required)</div>
                  <button
                    onClick={() => copyToClipboard(http402Block)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-green-400">
                    {JSON.stringify(http402Block, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {paymentPayloadBlock && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">Payment / Intent</div>
                  <button
                    onClick={() => copyToClipboard(paymentPayloadBlock)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-cyan-400">
                    {JSON.stringify(paymentPayloadBlock, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {retryBlock && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">Request After Payment</div>
                  <button
                    onClick={() => copyToClipboard(retryBlock)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-blue-400">
                    {JSON.stringify(retryBlock, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {settlementBlock && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">AP2 Settlement</div>
                  <button
                    onClick={() => copyToClipboard(settlementBlock)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-purple-400">
                    {JSON.stringify(settlementBlock, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {receiptBlock && Object.keys(receiptBlock).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">Receipt</div>
                  <button
                    onClick={() => copyToClipboard(receiptBlock)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-yellow-400">
                    {JSON.stringify(receiptBlock, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
