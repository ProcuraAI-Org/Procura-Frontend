import { TaskFormData } from "../../pages/CreateTask";

interface TaskIntentSectionProps {
  formData: TaskFormData;
  updateFormData: (updates: Partial<TaskFormData>) => void;
}

export function TaskIntentSection({
  formData,
  updateFormData,
}: TaskIntentSectionProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">1. Task Intent</h2>

      <div className="space-y-6">
        {/* Task Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Task Description
          </label>
          <textarea
            value={formData.taskDescription}
            onChange={(e) =>
              updateFormData({ taskDescription: e.target.value })
            }
            placeholder="Example: Generate a weekly crypto market report using paid data sources under $1 budget. Include sentiment analysis and price movements."
            className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-2 text-sm text-slate-500">
            This becomes the AP2 intent definition for the workflow.
          </p>
        </div>

        {/* Task Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Task Category
          </label>
          <select
            value={formData.taskCategory}
            onChange={(e) => updateFormData({ taskCategory: e.target.value })}
            className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="data-analysis">Data Analysis</option>
            <option value="market-research">Market Research</option>
            <option value="content-generation">Content Generation</option>
            <option value="api-integration">API Integration</option>
          </select>
        </div>
      </div>
    </div>
  );
}