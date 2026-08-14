import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { ReceiptsTable } from "../components/receipts/ReceiptsTable";
import { ReceiptDetailPanel } from "../components/receipts/ReceiptDetailPanel";
import { useAppData } from "../context/AppDataContext";
import { type DashboardPayment, type SettlementReceipt, getAp2Receipt } from "../api/client";
import { CheckCircle2, Download, Filter } from "lucide-react";
import type { Receipt } from "../components/receipts/ReceiptsTable";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
}

function paymentToReceipt(p: DashboardPayment): Receipt {
  const status: "completed" | "pending" | "blocked" = p.success ? "completed" : "blocked";
  return {
    id: p.id,
    timestamp: formatTime(p.createdAt),
    tool: p.tool,
    amount: p.amount,
    reason: p.success ? "x402 payment completed" : (p.error ?? "Payment failed"),
    settlementId: p.txHash ? `tx-${p.txHash.slice(0, 10)}` : "—",
    status,
    intentId: "—",
    authorizationId: "—",
    taskDescription: p.taskId ? `Task: ${p.taskId}` : "—",
    transactionHash: p.txHash,
    network: "—",
    executionDuration: "—",
    budgetLimit: 0,
    policyChecks: { withinBudget: true, allowlisted: true, perToolCap: true },
    authorization: {
      approvalMode: "—",
      humanApprovalRequired: false,
      timestamp: formatTime(p.createdAt),
      status: p.success ? "Approved" : "Denied",
    },
    condition: {
      type: "—",
      result: p.success ? "Satisfied" : "Failed",
      encrypted: false,
      verificationTimestamp: "—",
    },
    settlement: {
      amount: p.amount,
      walletAddress: "—",
      timestamp: formatTime(p.createdAt),
      receiptGenerated: p.success,
    },
  };
}

function ap2ReceiptToReceipt(r: SettlementReceipt): Receipt {
  const timestamp = r.timestamp ? formatTime(r.timestamp) : "—";
  return {
    id: r.receiptId,
    timestamp,
    tool: r.tool,
    amount: r.amount,
    reason: r.conditionResult ? "Settlement completed" : "Condition not met",
    settlementId: r.settlementId,
    status: "completed",
    intentId: r.intentId,
    authorizationId: r.authorizationId,
    taskDescription: "—",
    transactionHash: r.txHash,
    network: "—",
    executionDuration: "—",
    budgetLimit: 0,
    policyChecks: { withinBudget: true, allowlisted: true, perToolCap: true },
    authorization: {
      approvalMode: "—",
      humanApprovalRequired: false,
      timestamp,
      status: "Approved",
    },
    condition: {
      type: "—",
      result: r.conditionResult ? "Satisfied" : "Failed",
      encrypted: false,
      verificationTimestamp: timestamp,
    },
    settlement: {
      amount: r.amount,
      walletAddress: "—",
      timestamp,
      receiptGenerated: true,
    },
  };
}

export default function Receipts() {
  const location = useLocation();
  const intentIdFromState = (location.state as { intentId?: string } | null)?.intentId;
  const { payments: paymentsCache, loadingPayments, getOrLoadPayments } = useAppData();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    getOrLoadPayments()
      .then((list) => {
        if (!cancelled) {
          const mapped = list.map(paymentToReceipt);
          setReceipts(mapped);
          setSelectedReceipt(mapped[0] ?? null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load payments");
      });
    return () => {
      cancelled = true;
    };
  }, [getOrLoadPayments]);

  useEffect(() => {
    if (!intentIdFromState) return;
    let cancelled = false;
    getAp2Receipt(intentIdFromState)
      .then((ap2) => {
        if (!cancelled) {
          const receipt = ap2ReceiptToReceipt(ap2);
          setReceipts((prev) => {
            const exists = prev.some((r) => r.id === receipt.id || r.intentId === receipt.intentId);
            if (exists) return prev;
            return [receipt, ...prev];
          });
          setSelectedReceipt(ap2ReceiptToReceipt(ap2));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load receipt");
      });
    return () => {
      cancelled = true;
    };
  }, [intentIdFromState]);

  const loading = paymentsCache === null && loadingPayments;

  const handleExport = () => {
    const json = JSON.stringify(receipts, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipts-export.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout className="pb-16 sm:pb-24">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Receipts & Audit Trail
                </h1>
                <p className="text-base sm:text-lg text-slate-400">
                  Structured records of agent payments, authorization flows, and
                  settlements.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button className="px-5 py-2.5 border-2 border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all font-medium flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Download className="w-4 h-4" />
                  Export All Receipts
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">
                Audit Logging Enabled
              </span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
            {/* Left: Receipts Table */}
            <div>
              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl p-8 text-center text-slate-400">
                  Loading receipts…
                </div>
              ) : receipts.length === 0 ? (
                <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl p-8 text-center">
                  <p className="text-slate-400 mb-2">No receipts found</p>
                  <p className="text-sm text-slate-500">Payment records will appear here after agent runs complete.</p>
                </div>
              ) : (
                <ReceiptsTable
                  receipts={receipts}
                  selectedReceipt={selectedReceipt}
                  onSelectReceipt={setSelectedReceipt}
                />
              )}
            </div>

            {/* Right: Receipt Detail Panel */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <ReceiptDetailPanel receipt={selectedReceipt} />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}