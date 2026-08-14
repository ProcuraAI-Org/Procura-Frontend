import { Plus, Rocket } from "lucide-react";

interface EmptyStateProps {
  onCreateTask: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          No Active Workflows
        </h3>
        <p className="text-base text-slate-400 mb-6">
          Create your first autonomous task to start monitoring agent execution
          and settlements.
        </p>
        <button
          onClick={onCreateTask}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Create Your First Autonomous Task
        </button>
      </div>
    </div>
  );
}
