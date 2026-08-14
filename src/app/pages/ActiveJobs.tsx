import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { PendingApprovalCard } from "../components/active-jobs/PendingApprovalCard";
import { FailedJobCard } from "../components/active-jobs/FailedJobCard";
import { JobCard } from "../components/active-jobs/JobCard";
import { JobDetailsDrawer } from "../components/active-jobs/JobDetailsDrawer";
import { EmptyState } from "../components/active-jobs/EmptyState";
import { Search, TrendingDown, Clock, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import {
  listOrchestratorTasks,
  executeOrchestratorStep,
  authorizeAp2Intent,
  type OrchestratorTask,
} from "../api/client";
import { formatDistanceToNow } from "date-fns";

// Active jobs are stored in the database (Postgres) via the backend. This page only loads from GET /api/tasks (DB).

// TypeScript interfaces
interface Job {
  id: string;
  title: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  toolCalls: {
    completed: number;
    pending: number;
  };
  risk: string;
  encryptionEnabled: boolean;
  lastUpdated: string;
  description: string;
  intentId: string;
  authorizationMode: string;
  currentStep?: string;
  policyCompliance: {
    withinBudget: boolean;
    onAllowlist: boolean;
    underPerToolCap: boolean;
  };
}

const TERMINAL_STATES = ["COMPLETED", "POLICY_BLOCKED", "PAYMENT_FAILED", "CONDITION_FAILED", "SETTLEMENT_FAILED"];

function progressFromState(state: string): number {
  switch (state) {
    case "IDLE":
      return 5;
    case "DECISION_MADE":
      return 20;
    case "AUTHORIZATION_PENDING":
      return 25;
    case "AUTHORIZED":
      return 35;
    case "PAYMENT_INITIATED":
      return 50;
    case "PAYMENT_COMPLETED":
      return 70;
    case "SETTLEMENT_EXECUTED":
      return 90;
    case "COMPLETED":
      return 100;
    default:
      return TERMINAL_STATES.includes(state) ? 100 : 25;
  }
}

function statusFromState(state: string): string {
  if (state === "AUTHORIZATION_PENDING") return "pending";
  if (state === "COMPLETED") return "completed";
  if (["PAYMENT_FAILED", "POLICY_BLOCKED", "CONDITION_FAILED", "SETTLEMENT_FAILED"].includes(state)) return "failed";
  return "active";
}

function taskToJob(t: OrchestratorTask): Job {
  const state = String(t.state ?? "IDLE");
  const title = String(t.intent?.description ?? (t as any).description ?? t.taskId);
  const estimated = Number(t.decision?.estimatedCost ?? 0);
  const spent = t.paymentResult?.success ? Number(t.paymentResult.amount ?? 0) : estimated;
  const budget = Number(t.intent?.totalBudget ?? (t as any).totalBudget ?? 0);
  const updatedAt = t.updatedAt ? new Date(t.updatedAt) : new Date();

  return {
    id: t.taskId,
    title,
    status: statusFromState(state),
    progress: progressFromState(state),
    budget,
    spent,
    toolCalls: { completed: t.paymentResult?.success ? 1 : 0, pending: t.paymentResult?.success ? 0 : 1 },
    risk: "low",
    encryptionEnabled: Boolean(t.intent?.encryptionEnabled ?? false),
    lastUpdated: formatDistanceToNow(updatedAt, { addSuffix: true }),
    description: String(t.intent?.description ?? title),
    intentId: String(t.intentId ?? t.taskId),
    authorizationMode: Boolean(t.intent?.requireHumanApproval) ? "Human approval" : "Auto-Approval",
    currentStep: state,
    policyCompliance: { withinBudget: true, onAllowlist: true, underPerToolCap: true },
  };
}

interface NewTaskFromCreation {
  taskId: string;
  description: string;
  selectedTool: string;
  estimatedCost: number;
  state: string;
  totalBudget: number;
  reason: string;
}

function newTaskToJob(t: NewTaskFromCreation): Job {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return {
    id: t.taskId,
    title: t.description?.trim() || `Task ${t.taskId}`,
    status: t.state === "DECIDED" ? "active" : "failed",
    progress: t.state === "DECIDED" ? 25 : 0,
    budget: t.totalBudget,
    spent: t.estimatedCost ?? 0,
    toolCalls: { completed: 0, pending: 1 },
    risk: "low",
    encryptionEnabled: true,
    lastUpdated: "Just now",
    description: t.description || t.reason,
    intentId: t.taskId,
    authorizationMode: "—",
    currentStep:
      t.state === "DECIDED"
        ? `Tool selected: ${t.selectedTool} ($${(t.estimatedCost ?? 0).toFixed(2)})`
        : "Policy blocked",
    policyCompliance: { withinBudget: true, onAllowlist: true, underPerToolCap: true },
  };
}

export default function ActiveJobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const newTask = location.state?.newTask as NewTaskFromCreation | undefined;

  const [tasks, setTasks] = useState<OrchestratorTask[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleRetry = () => {
    setLoadError(null);
    setRetryKey((k) => k + 1);
  };

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    (async () => {
      try {
        let res = await listOrchestratorTasks("frontend");
        let list = res.tasks ?? [];
        if (!cancelled && list.length === 0) {
          const all = await listOrchestratorTasks("system");
          list = all.tasks ?? [];
        }
        if (!cancelled) {
          if (newTask && !list.some((t) => t.taskId === newTask.taskId)) {
            const minimal: OrchestratorTask = {
              taskId: newTask.taskId,
              userId: "frontend",
              state: newTask.state,
              retries: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              intent: { description: newTask.description, totalBudget: newTask.totalBudget },
              decision: { estimatedCost: newTask.estimatedCost, selectedTool: newTask.selectedTool },
            };
            list = [minimal, ...list];
          }
          setTasks(list);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load tasks");
          setTasks([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [newTask?.taskId, retryKey]);

  const jobsWithNewTask = useMemo(() => {
    const base = tasks.map(taskToJob);
    if (!newTask) return base;
    const alreadyInList = base.some((j) => j.id === newTask.taskId);
    if (alreadyInList) return base;
    const created = newTaskToJob(newTask);
    return [created, ...base];
  }, [newTask, tasks]);

  const pendingApprovals = useMemo(() => {
    return tasks
      .filter((t) => String(t.state) === "AUTHORIZATION_PENDING")
      .map((t) => ({
        id: t.taskId,
        task: String(t.intent?.description ?? t.taskId),
        amount: Number(t.decision?.estimatedCost ?? 0),
        reason: "Authorization pending",
        intentId: String(t.intentId ?? t.taskId),
      }));
  }, [tasks]);

  const failedJobs = useMemo(() => {
    return tasks
      .filter((t) => ["PAYMENT_FAILED", "POLICY_BLOCKED", "CONDITION_FAILED", "SETTLEMENT_FAILED"].includes(String(t.state)))
      .map((t) => ({
        id: t.taskId,
        task: String(t.intent?.description ?? t.taskId),
        status: `Failed – ${t.state}`,
        reason: String(t.error ?? "Unknown error"),
        intentId: String(t.intentId ?? t.taskId),
      }));
  }, [tasks]);

  const handleViewExecution = (job: Job) => {
    navigate(`/execution/${encodeURIComponent(job.id)}`);
  };

  const handlePauseJob = (job: Job) => {
    alert(`Pausing job: ${job.title}`);
  };

  const handleCancelJob = (job: Job) => {
    if (confirm(`Are you sure you want to cancel "${job.title}"?`)) {
      alert(`Job cancelled: ${job.title}`);
    }
  };

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const handleApproveTask = async (approval: { id: string; intentId: string; task: string }) => {
    setApprovingId(approval.id);
    try {
      await authorizeAp2Intent(approval.intentId);
      await executeOrchestratorStep(approval.id);
      const res = await listOrchestratorTasks("frontend");
      const list = res.tasks ?? [];
      setTasks(list);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectTask = (approval: { id: string; task: string }) => {
    if (confirm(`Are you sure you want to reject "${approval.task}"?`)) {
      alert(`Rejected: ${approval.task}. Task remains in pending state.`);
    }
  };

  const handleReviewLogs = (job: Job) => {
    navigate("/logs", { state: { taskId: job.id } });
  };

  const handleCreateTask = () => {
    navigate("/create-task");
  };

  const handleViewReceipts = (job: Job | null) => {
    if (job?.intentId) {
      navigate("/receipts", { state: { intentId: job.intentId } });
    } else {
      navigate("/receipts");
    }
  };

  const filteredJobs = jobsWithNewTask
    .filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return 0; // Keep original order
      } else if (sortBy === "budget") {
        return b.budget - a.budget;
      } else if (sortBy === "risk") {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return riskOrder[b.risk] - riskOrder[a.risk];
      }
      return 0;
    });

  const hasAnyJobs = jobsWithNewTask.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 flex flex-wrap items-center justify-between gap-2">
              <span>
                {loadError === "Failed to fetch"
                  ? "Could not reach the backend. Make sure Procura backend is running (e.g. npm run dev in Procura-Backend, or the URL in .env VITE_API_URL)."
                  : loadError}
              </span>
              <button
                type="button"
                onClick={handleRetry}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium shrink-0"
              >
                Retry
              </button>
            </div>
          )}
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Active Jobs
                </h1>
                <p className="text-base sm:text-lg text-slate-400">
                  Monitor all autonomous workflows and their execution status.
                </p>
              </div>

              <button
                onClick={handleCreateTask}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" />
                Create New Task
              </button>
            </div>
          </div>

          {hasAnyJobs ? (
            <>
              {/* Filter Bar */}
              <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 mb-6 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Filter by Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending Approval</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="budget">Sort: Budget</option>
                    <option value="risk">Sort: Risk</option>
                  </select>
                </div>
              </div>

              {/* Pending Approvals Section */}
              {pendingApprovals.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Pending Approvals
                  </h2>
                  <div className="grid gap-4">
                    {pendingApprovals.map((approval) => (
                      <PendingApprovalCard
                        key={approval.id}
                        approval={approval}
                        onApprove={handleApproveTask}
                        onReject={handleRejectTask}
                        isApproving={approvingId === approval.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Failed Jobs Section */}
              {failedJobs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Attention Required
                  </h2>
                  <div className="grid gap-4">
                    {failedJobs.map((job) => (
                      <FailedJobCard
                        key={job.id}
                        job={job}
                        onReviewLogs={handleReviewLogs}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Active Jobs Grid */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-4">All Jobs</h2>
                {filteredJobs.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onViewExecution={handleViewExecution}
                        onPause={handlePauseJob}
                        onCancel={handleCancelJob}
                        onViewDetails={setSelectedJob}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 text-center">
                    <p className="text-slate-400">
                      No jobs match your current filters.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState onCreateTask={handleCreateTask} />
          )}
        </div>
      </PageLayout>

      {/* Job Details Drawer */}
      <JobDetailsDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onViewFullExecution={handleViewExecution}
        onViewReceipts={(job) => handleViewReceipts(job)}
      />
    </div>
  );
}