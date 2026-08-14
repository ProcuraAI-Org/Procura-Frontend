import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Copy } from "lucide-react";

interface Transaction {
  id: string;
  timestamp: string;
  type: string;
  tool: string;
  amount: number;
  status: "confirmed" | "pending" | "completed";
  txHash?: string;
  intentId?: string;
  policyChecks?: string[];
  reasonCode?: string;
  network: string;
  gasless: boolean;
}

export interface RecentActivityItem {
  type: "payment" | "event";
  taskId: string | null;
  title: string;
  detail: string;
  createdAt: string;
  json: Record<string, unknown>;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return iso;
  }
}

function mapRecentActivityToTransactions(activity: RecentActivityItem[]): Transaction[] {
  return activity.map((item, index) => {
    const id = `${item.taskId ?? "activity"}-${item.createdAt}-${index}`;
    const timestamp = formatTime(item.createdAt);
    const json = item.json as { tool?: string; amount?: string | number; success?: boolean; tx_hash?: string; event?: string };
    const amount = Number(json?.amount ?? 0);
    const tool = String(json?.tool ?? item.title ?? "—");

    if (item.type === "payment") {
      return {
        id,
        timestamp,
        type: "x402 Payment",
        tool,
        amount,
        status: json?.success ? "confirmed" : "pending",
        txHash: json?.tx_hash ? String(json.tx_hash).slice(0, 9) + "..." : undefined,
        intentId: undefined,
        network: "SKALE",
        gasless: true,
      };
    }

    return {
      id,
      timestamp,
      type: item.title,
      tool: tool !== "—" ? tool : item.detail,
      amount,
      status: "completed",
      network: "SKALE",
      gasless: true,
    };
  });
}

interface TransactionHistoryProps {
  recentActivity?: RecentActivityItem[];
}

export function TransactionHistory({ recentActivity = [] }: TransactionHistoryProps) {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const transactions = useMemo(() => mapRecentActivityToTransactions(recentActivity), [recentActivity]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTx(expandedTx === id ? null : id);
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-8 text-center">
          <div className="text-slate-400 mb-2">No transactions yet</div>
          <div className="text-sm text-slate-500">
            Payments and settlements will appear here after you run tasks.
          </div>
        </div>
      ) : (
        <>
      {/* Mobile View - Stacked Cards */}
      <div className="lg:hidden space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white mb-1">{tx.type}</div>
                  <div className="text-xs text-slate-400">{tx.timestamp}</div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                    tx.status
                  )}`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Tool</div>
                  <div className="text-sm text-slate-300">{tx.tool}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Amount</div>
                  <div className="text-sm font-semibold text-white">
                    ${tx.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              {tx.txHash && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Tx:</span>
                  <span className="font-mono text-slate-400">{tx.txHash}</span>
                  <button
                    onClick={() => copyTxHash(tx.txHash!)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button
                onClick={() => toggleExpand(tx.id)}
                className="w-full px-3 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center justify-center gap-1 bg-slate-900/50 rounded"
              >
                {expandedTx === tx.id ? "Hide Details" : "View Details"}
                {expandedTx === tx.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Expanded Details */}
            {expandedTx === tx.id && (
              <div className="border-t border-slate-800 bg-slate-900/30 p-4">
                <div className="space-y-3">
                  {tx.intentId && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Intent ID</div>
                      <div className="text-sm text-white font-mono">{tx.intentId}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-slate-500 mb-1">Network</div>
                    <div className="text-sm text-white">{tx.network}</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      Gasless Transaction
                    </div>
                    <div className="text-sm text-green-400">
                      {tx.gasless ? "Yes" : "No"}
                    </div>
                  </div>

                  {tx.policyChecks && tx.policyChecks.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500 mb-2">
                        Policy Checks Passed
                      </div>
                      <div className="space-y-1">
                        {tx.policyChecks.map((check, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-green-400"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                            {check}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tx.reasonCode && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Reason</div>
                      <div className="text-sm text-slate-300">{tx.reasonCode}</div>
                    </div>
                  )}

                  {tx.txHash &&
                    (tx.txHash.length > 20 ? (
                      <a
                        href={`https://base-sepolia-testnet-explorer.skalenodes.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Block Explorer
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400 font-mono">{tx.txHash}</span>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden"
          >
            {/* Transaction Row */}
            <div className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 text-sm text-slate-400">
                  {tx.timestamp}
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium text-white">{tx.type}</div>
                </div>

                <div className="col-span-2 text-sm text-slate-300">
                  {tx.tool}
                </div>

                <div className="col-span-1 text-sm font-semibold text-white">
                  ${tx.amount.toFixed(2)}
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                      tx.status
                    )}`}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>

                <div className="col-span-2">
                  {tx.txHash ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 truncate">
                        {tx.txHash}
                      </span>
                      <button
                        onClick={() => copyTxHash(tx.txHash!)}
                        className="text-slate-400 hover:text-white cursor-pointer flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">—</span>
                  )}
                </div>

                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => toggleExpand(tx.id)}
                    className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {expandedTx === tx.id ? "Hide" : "Details"}
                    {expandedTx === tx.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedTx === tx.id && (
              <div className="border-t border-slate-800 bg-slate-900/30 p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {tx.intentId && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Intent ID</div>
                        <div className="text-sm text-white font-mono">{tx.intentId}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Network</div>
                      <div className="text-sm text-white">{tx.network}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Gasless Transaction</div>
                      <div className="text-sm text-green-400">{tx.gasless ? "Yes" : "No"}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {tx.policyChecks && tx.policyChecks.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Policy Checks Passed</div>
                        <div className="space-y-1">
                          {tx.policyChecks.map((check, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-green-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              {check}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {tx.reasonCode && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Reason</div>
                        <div className="text-sm text-slate-300">{tx.reasonCode}</div>
                      </div>
                    )}
                  </div>
                </div>
                {tx.txHash && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    {tx.txHash.length > 20 ? (
                      <a
                        href={`https://base-sepolia-testnet-explorer.skalenodes.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Block Explorer
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400 font-mono">{tx.txHash}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}