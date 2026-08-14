import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface Receipt {
  id: string;
  timestamp: string;
  tool: string;
  amount: number;
  reason: string;
  settlementId: string;
  status: "completed" | "pending" | "blocked";
  intentId: string;
  authorizationId: string;
  taskDescription: string;
  transactionHash?: string;
  network: string;
  executionDuration: string;
  budgetLimit: number;
  policyChecks: {
    withinBudget: boolean;
    allowlisted: boolean;
    perToolCap: boolean;
  };
  authorization: {
    approvalMode: string;
    humanApprovalRequired: boolean;
    timestamp: string;
    status: string;
  };
  condition: {
    type: string;
    result: string;
    encrypted: boolean;
    verificationTimestamp: string;
  };
  settlement: {
    amount: number;
    walletAddress: string;
    timestamp: string;
    receiptGenerated: boolean;
  };
}

interface ReceiptsTableProps {
  receipts: Receipt[];
  selectedReceipt: Receipt | null;
  onSelectReceipt: (receipt: Receipt) => void;
}

export function ReceiptsTable({
  receipts,
  selectedReceipt,
  onSelectReceipt,
}: ReceiptsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"timestamp" | "amount">("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: "timestamp" | "amount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredReceipts = receipts
    .filter((receipt) => {
      const matchesSearch =
        receipt.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.settlementId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || receipt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "timestamp") {
        comparison = a.timestamp.localeCompare(b.timestamp);
      } else {
        comparison = a.amount - b.amount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "blocked":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">All Receipts</h2>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tool or settlement ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950/50 border-b border-slate-800">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center gap-1">
                  Timestamp
                  {sortField === "timestamp" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                Tool
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-1">
                  Amount
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                Settlement ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((receipt) => (
              <tr
                key={receipt.id}
                onClick={() => onSelectReceipt(receipt)}
                className={`border-b border-slate-800/50 cursor-pointer transition-all ${
                  selectedReceipt?.id === receipt.id
                    ? "bg-blue-500/10"
                    : "hover:bg-slate-800/30"
                }`}
              >
                <td className="px-4 py-3 text-sm text-slate-300 font-mono">
                  {receipt.timestamp}
                </td>
                <td className="px-4 py-3 text-sm text-white font-medium">
                  {receipt.tool}
                </td>
                <td className="px-4 py-3 text-sm text-white font-mono font-bold">
                  ${receipt.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300 font-mono">
                  {receipt.settlementId || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getStatusStyle(
                      receipt.status
                    )}`}
                  >
                    {receipt.status.charAt(0).toUpperCase() +
                      receipt.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-950/50 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          Showing {filteredReceipts.length} of {receipts.length} receipts
        </div>
      </div>
    </div>
  );
}