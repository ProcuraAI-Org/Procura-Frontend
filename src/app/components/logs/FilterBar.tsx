import { Search, X } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  eventTypeFilter: string;
  onEventTypeChange: (type: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  showOnlyErrors: boolean;
  onToggleErrors: () => void;
  onClearFilters: () => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  eventTypeFilter,
  onEventTypeChange,
  statusFilter,
  onStatusChange,
  showOnlyErrors,
  onToggleErrors,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    searchTerm || eventTypeFilter !== "all" || statusFilter !== "all" || showOnlyErrors;

  return (
    <div className="backdrop-blur-xl bg-slate-950/80 border border-slate-800/50 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Event Type Filter */}
        <select
          value={eventTypeFilter}
          onChange={(e) => onEventTypeChange(e.target.value)}
          className="px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
        >
          <option value="all">All Events</option>
          <option value="http_402">HTTP 402</option>
          <option value="payment">Payment</option>
          <option value="authorization">Authorization</option>
          <option value="settlement">Settlement</option>
          <option value="error">Error</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        {/* Show Only Errors Toggle */}
        <button
          onClick={onToggleErrors}
          className={`px-4 py-2 rounded-lg text-sm font-mono font-medium border transition-all ${
            showOnlyErrors
              ? "bg-red-500/20 border-red-500/40 text-red-300"
              : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          Errors Only
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm rounded-lg flex items-center gap-2 transition-colors font-mono"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}