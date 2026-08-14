import { useState, useEffect } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { useSidebar } from "../context/SidebarContext";
import { TaskIntentSection } from "../components/create-task/TaskIntentSection";
import { BudgetControlsSection } from "../components/create-task/BudgetControlsSection";
import { ToolAccessSection } from "../components/create-task/ToolAccessSection";
import { AuthorizationSection } from "../components/create-task/AuthorizationSection";
import { ConditionalExecutionSection } from "../components/create-task/ConditionalExecutionSection";
import { PrivacyModeSection } from "../components/create-task/PrivacyModeSection";
import { ExecutionSummary } from "../components/create-task/ExecutionSummary";
import { ConfirmationModal } from "../components/create-task/ConfirmationModal";
import { useNavigate } from "react-router";
import {
  runAgent,
  executePayment,
  createAp2Intent,
  authorizeAp2Intent,
  verifyAp2Condition,
  settleAp2Intent,
  getAp2Receipt,
  biteEncrypt,
  biteDecrypt,
  createOrchestratorTask,
  executeOrchestratorStep,
  isOrchestratorTerminalState,
  type AgentRunResponse,
  type PaymentResult,
  type SettlementReceipt,
  type OrchestratorTask,
} from "../api/client";
import {
  buildPaymentSignatureHeaderFrom402WithThirdwebAccount,
  type X402AcceptV1,
} from "../wallet/evmWallet";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { skaleBaseSepolia } from "../thirdweb/client";

export interface TaskFormData {
  taskDescription: string;
  taskCategory: string;
  totalBudget: string;
  maxSpendPerTool: string;
  dailySpendCap: number;
  allowlistTools: string[];
  denylistTools: string[];
  requireApproval: boolean;
  approvalMethod: string;
  conditionType: string;
  conditionValue: string;
  encryptionEnabled: boolean;
}

export default function CreateTask() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentRunResponse | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [ap2Receipt, setAp2Receipt] = useState<SettlementReceipt | null>(null);
  const [biteDecrypted, setBiteDecrypted] = useState<Record<string, unknown> | null>(null);
  const [orchestratorLoading, setOrchestratorLoading] = useState(false);
  const [orchestratorStatus, setOrchestratorStatus] = useState<string>("");
  const [orchestratorPaymentInfo, setOrchestratorPaymentInfo] = useState<{ amount: number; network: string } | null>(null);
  const [agentPreview, setAgentPreview] = useState<AgentRunResponse | null>(null);
  const [agentPreviewLoading, setAgentPreviewLoading] = useState(false);
  const [agentPreviewError, setAgentPreviewError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    taskDescription: "",
    taskCategory: "data-analysis",
    totalBudget: "1.00",
    maxSpendPerTool: "0.30",
    dailySpendCap: 25,
    allowlistTools: [],
    denylistTools: [],
    requireApproval: true,
    approvalMethod: "Manual Confirmation",
    conditionType: "",
    conditionValue: "",
    encryptionEnabled: true,
  });

  const updateFormData = (updates: Partial<TaskFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Hydrate form defaults from Global Policies (Policies page) so task creation uses them
  useEffect(() => {
    try {
      const raw = localStorage.getItem("procura_policies");
      if (!raw) return;
      const stored = JSON.parse(raw) as Record<string, unknown>;
      const updates: Partial<TaskFormData> = {};
      if (typeof stored.perTaskCap === "string" && stored.perTaskCap) updates.totalBudget = stored.perTaskCap;
      if (typeof stored.perToolMax === "string" && stored.perToolMax) updates.maxSpendPerTool = stored.perToolMax;
      if (typeof stored.dailyLimit === "string") {
        const n = parseFloat(stored.dailyLimit);
        if (Number.isFinite(n)) updates.dailySpendCap = n;
      }
      if (Array.isArray(stored.allowlist)) updates.allowlistTools = stored.allowlist.map(String);
      if (Array.isArray(stored.denylist)) updates.denylistTools = stored.denylist.map(String);
      if (typeof stored.requireApproval === "boolean") updates.requireApproval = stored.requireApproval;
      const anyEncrypt =
        stored.encryptIntent === true ||
        stored.encryptBudget === true ||
        stored.encryptTools === true ||
        stored.encryptConditions === true;
      if (anyEncrypt) updates.encryptionEnabled = true;
      else if (stored.encryptIntent === false && stored.encryptBudget === false) updates.encryptionEnabled = false;
      if (Object.keys(updates).length > 0) setFormData((prev) => ({ ...prev, ...updates }));
    } catch {
      // ignore invalid or missing stored policies
    }
  }, []);

  const budgetNum = parseFloat(formData.totalBudget) || 0;
  const maxPerToolNum = parseFloat(formData.maxSpendPerTool) || 0;

  const isFormValid = () => {
    return (
      formData.taskDescription.trim() !== "" &&
      formData.taskCategory !== "" &&
      budgetNum > 0 &&
      maxPerToolNum <= budgetNum
    );
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleLaunchAgent = () => {
    if (isFormValid()) {
      setAgentPreview(null);
      setAgentPreviewError(null);
      setAgentResult(null);
      setAgentError(null);
      setShowConfirmModal(true);
    }
  };

  useEffect(() => {
    if (!showConfirmModal || agentPreview != null || agentPreviewLoading) return;
    setAgentPreviewLoading(true);
    setAgentPreviewError(null);
    const payload = {
      description: formData.taskDescription,
      totalBudget: parseFloat(formData.totalBudget) || 0,
      maxPerTool: parseFloat(formData.maxSpendPerTool) || undefined,
      allowlist: formData.allowlistTools?.length ? formData.allowlistTools : undefined,
      denylist: formData.denylistTools?.length ? formData.denylistTools : undefined,
      requireHumanApproval: formData.requireApproval,
      encryptionEnabled: formData.encryptionEnabled,
    };
    runAgent(payload)
      .then((result) => {
        setAgentPreview(result);
      })
      .catch((e) => {
        setAgentPreviewError(e instanceof Error ? e.message : "Could not get estimated payment");
      })
      .finally(() => {
        setAgentPreviewLoading(false);
      });
  }, [showConfirmModal]);

  const handleConfirmLaunch = async () => {
    if (agentPreview != null) {
      setAgentResult(agentPreview);
      return;
    }
    setAgentError(null);
    setAgentResult(null);
    setAgentLoading(true);
    try {
      const payload = {
        description: formData.taskDescription,
        totalBudget: parseFloat(formData.totalBudget) || 0,
        maxPerTool: parseFloat(formData.maxSpendPerTool) || undefined,
        allowlist: formData.allowlistTools?.length ? formData.allowlistTools : undefined,
        denylist: formData.denylistTools?.length ? formData.denylistTools : undefined,
        requireHumanApproval: formData.requireApproval,
        encryptionEnabled: formData.encryptionEnabled,
      };
      const result = await runAgent(payload);
      setAgentResult(result);
    } catch (e) {
      setAgentError(e instanceof Error ? e.message : "Agent request failed");
    } finally {
      setAgentLoading(false);
    }
  };

  const handleLaunchWithOrchestrator = async () => {
    setAgentError(null);
    setAgentResult(null);
    setPaymentResult(null);
    setAp2Receipt(null);
    setBiteDecrypted(null);
    setOrchestratorPaymentInfo(null);
    setOrchestratorLoading(true);
    setOrchestratorStatus("Creating task...");
    try {
      const budgetNum = parseFloat(formData.totalBudget) || 0;
      const maxPerToolNum = parseFloat(formData.maxSpendPerTool) || 0;
      let task: OrchestratorTask = await createOrchestratorTask({
        userId: "frontend",
        description: formData.taskDescription || undefined,
        totalBudget: budgetNum,
        maxPerTool: maxPerToolNum,
        allowlist: formData.allowlistTools?.length ? formData.allowlistTools : undefined,
        denylist: formData.denylistTools?.length ? formData.denylistTools : undefined,
        requireHumanApproval: formData.requireApproval,
        encryptionEnabled: formData.encryptionEnabled,
      });
      setOrchestratorStatus(task.state);

      while (!isOrchestratorTerminalState(task.state)) {
        task = await executeOrchestratorStep(task.taskId);
        setOrchestratorStatus(task.state);
        if (task.decision && (task.selectedToolNetwork != null || task.decision.estimatedCost != null)) {
          setOrchestratorPaymentInfo({
            amount: task.decision.estimatedCost,
            network: task.selectedToolNetwork ?? "—",
          });
        }
        await new Promise((r) => setTimeout(r, 400));
      }

      if (task.state === "COMPLETED" && task.intent && task.decision) {
        setAgentResult({
          intent: task.intent,
          decision: task.decision,
          state: "DECIDED",
          selectedToolEndpoint: task.selectedToolEndpoint,
          selectedToolNetwork: task.selectedToolNetwork,
        });
        if (task.paymentResult) setPaymentResult(task.paymentResult);
        if (task.intentId) {
          try {
            const receipt = await getAp2Receipt(task.intentId);
            setAp2Receipt(receipt);
          } catch {
            // optional
          }
          if (formData.encryptionEnabled) {
            try {
              const released = await biteDecrypt(task.intentId);
              setBiteDecrypted(released.decrypted);
            } catch {
              // optional
            }
          }
        }
      } else {
        setAgentError(task.error ?? `Orchestrator ended in ${task.state}`);
      }
    } catch (e) {
      setAgentError(e instanceof Error ? e.message : "Orchestrator failed");
    } finally {
      setOrchestratorLoading(false);
      setOrchestratorStatus("");
    }
  };

  const handleRunPayment = async () => {
    const result = agentResult;
    if (!result || result.state !== "DECIDED" || !result.selectedToolEndpoint) return;
    setPaymentResult(null);
    setAp2Receipt(null);
    setBiteDecrypted(null);
    setPaymentLoading(true);
    try {
      const intent = await createAp2Intent({
        taskId: result.intent.taskId,
        tool: result.decision.selectedTool,
        amount: result.decision.estimatedCost,
        totalBudget: result.intent.totalBudget,
        perToolCap: result.intent.maxPerTool,
        allowlist: result.intent.allowlist,
        denylist: result.intent.denylist,
        requireHumanApproval: result.intent.requireHumanApproval,
        encryptionEnabled: result.intent.encryptionEnabled,
      });

      const auth = await authorizeAp2Intent(intent.intentId);
      if (!auth.approved) {
        const failed = auth.policyChecks.filter((p) => !p.passed).map((p) => p.message);
        setPaymentResult({
          success: false,
          tool: result.decision.selectedTool,
          amount: result.decision.estimatedCost,
          error: `AP2 authorization blocked: ${failed.join("; ")}`,
        });
        setPaymentLoading(false);
        return;
      }

      if (intent.encryptionEnabled) {
        await biteEncrypt(intent.intentId, {
          tool: intent.tool,
          amount: intent.amount,
          taskId: intent.taskId,
        });
      }

      const toolName = result.decision.selectedTool;
      const endpoint = result.selectedToolEndpoint;

      // If user has connected wallet and tool is our CryptoReportAPI, pay using USER wallet signature (EIP-712).
      // This lets the user be the payer instead of the server-managed EVM_PRIVATE_KEY.
      let payResult: PaymentResult;
      if (activeAccount?.address && toolName === "CryptoReportAPI") {
        if (!activeChain?.id || activeChain.id !== skaleBaseSepolia.id) {
          payResult = {
            success: false,
            tool: toolName,
            amount: result.decision.estimatedCost,
            error: `Wrong network. Please switch to ${skaleBaseSepolia.name} in Wallet.`,
          };
          setPaymentResult(payResult);
          setPaymentLoading(false);
          return;
        }

        const body = {
          price_data: { btc: { weekly_change_percent: 4.2, current_price: 43000 } },
          sentiment_data: { score: 0.72, trend: "bullish" },
          task: result.intent.description,
        };

        const first = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body),
        });
        const firstData = await first.json().catch(async () => await first.text());

        if (first.status !== 402) {
          payResult = {
            success: first.ok,
            tool: toolName,
            amount: result.decision.estimatedCost,
            data: firstData,
            error: first.ok ? undefined : `HTTP ${first.status}`,
          };
        } else {
          const accepts = (firstData as any)?.accepts;
          const acc = Array.isArray(accepts) ? (accepts[0] as any) : null;
          if (!acc?.payTo || !acc?.asset || !acc?.maxAmountRequired) {
            payResult = {
              success: false,
              tool: toolName,
              amount: result.decision.estimatedCost,
              data: firstData,
              error: "Invalid 402 body (missing accepts[0].payTo/asset/maxAmountRequired)",
            };
          } else {
            const accept: X402AcceptV1 = {
              scheme: String(acc.scheme ?? "exact"),
              network: String(acc.network ?? "skale-base-sepolia"),
              maxAmountRequired: String(acc.maxAmountRequired),
              payTo: String(acc.payTo),
              asset: String(acc.asset),
            };
            const { paymentSignatureBase64 } = await buildPaymentSignatureHeaderFrom402WithThirdwebAccount({
              accept,
              account: activeAccount as any,
            });

            const second = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "PAYMENT-SIGNATURE": paymentSignatureBase64,
              },
              body: JSON.stringify(body),
            });
            const secondData = await second.json().catch(async () => await second.text());

            payResult = {
              success: second.ok,
              tool: toolName,
              amount: result.decision.estimatedCost,
              data: secondData,
              error: second.ok ? undefined : `HTTP ${second.status}`,
            };
          }
        }
      } else {
        // Default path: pay via backend (server-managed wallet), for demo/bazaar tools.
        payResult = await executePayment({
          taskId: result.intent.taskId,
          intentId: intent.intentId,
          toolName,
          endpoint,
          amount: result.decision.estimatedCost,
          maxPerTool: result.intent.maxPerTool,
          remainingBudget: result.intent.totalBudget,
          allowlist: result.intent.allowlist,
          denylist: result.intent.denylist,
        });
      }

      setPaymentResult(payResult);

      if (payResult.success) {
        const outputSummary =
          payResult.data == null
            ? {}
            : typeof payResult.data === "object" && (payResult.data as Record<string, unknown>)._binary === true
              ? {
                  hasData: true,
                  type: "binary",
                  outputLength: typeof (payResult.data as { base64?: string }).base64 === "string"
                    ? (payResult.data as { base64: string }).base64.length
                    : 0,
                }
              : {
                  hasData: true,
                  type: "json",
                  keys: Object.keys(payResult.data as object).length,
                  outputLength: JSON.stringify(payResult.data).length,
                };
        await verifyAp2Condition(intent.intentId, outputSummary);
        const settle = await settleAp2Intent(intent.intentId);
        if (settle.success) {
          const receipt = await getAp2Receipt(intent.intentId);
          setAp2Receipt(receipt);
          if (intent.encryptionEnabled) {
            try {
              const released = await biteDecrypt(intent.intentId);
              setBiteDecrypted(released.decrypted);
            } catch {
              // Decrypt may 403 if condition not met; optional for display
            }
          }
        }
      }
    } catch (e) {
      setPaymentResult({
        success: false,
        tool: result!.decision.selectedTool,
        amount: result!.decision.estimatedCost,
        error: e instanceof Error ? e.message : "Payment failed",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleGoToActiveJobs = () => {
    const result = agentResult;
    setShowConfirmModal(false);
    setAgentResult(null);
    setAgentError(null);
    setPaymentResult(null);
    setAp2Receipt(null);
    setBiteDecrypted(null);
    if (result) {
      navigate("/active-jobs", {
        state: {
          newTask: {
            taskId: result.intent.taskId,
            description: formData.taskDescription || result.decision.reason,
            selectedTool: result.decision.selectedTool,
            estimatedCost: result.decision.estimatedCost,
            state: result.state,
            totalBudget: result.intent.totalBudget,
            reason: result.decision.reason,
          },
        },
      });
    } else {
      navigate("/active-jobs");
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setAgentResult(null);
    setAgentError(null);
    setPaymentResult(null);
    setAp2Receipt(null);
    setBiteDecrypted(null);
    setOrchestratorLoading(false);
    setOrchestratorStatus("");
    setOrchestratorPaymentInfo(null);
    setAgentPreview(null);
    setAgentPreviewError(null);
  };

  const remainingDailyBudget = 18.55;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Panel */}
      <PageLayout className="pb-32 sm:pb-36">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Create New Autonomous Task
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-400">
                Define the agent's intent, budget, safeguards, and execution
                conditions.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Budget, allowlist/denylist, and approval defaults are loaded from Global Policies.
              </p>
            </div>
          </div>

          {/* Form Layout */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left: Form Sections */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8 pb-40 sm:pb-32 lg:pb-32">
              {/* 1. Task Intent */}
              <TaskIntentSection
                formData={formData}
                updateFormData={updateFormData}
              />

              {/* 2. Budget Controls */}
              <BudgetControlsSection
                formData={formData}
                updateFormData={updateFormData}
                remainingDailyBudget={remainingDailyBudget}
              />

              {/* 3. Tool Access Policy */}
              <ToolAccessSection
                formData={formData}
                updateFormData={updateFormData}
              />

              {/* 4. Authorization Settings */}
              <AuthorizationSection
                formData={formData}
                updateFormData={updateFormData}
              />

              {/* 5. Conditional Execution */}
              <ConditionalExecutionSection
                formData={formData}
                updateFormData={updateFormData}
              />

              {/* 6. Privacy Mode */}
              <PrivacyModeSection
                formData={formData}
                updateFormData={updateFormData}
              />
            </div>

            {/* Right: Execution Summary (Sticky - Hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1">
              <ExecutionSummary formData={formData} />
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div
            className={`fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 z-50 transition-all duration-300 ${
              isCollapsed ? "lg:left-20" : "lg:left-64"
            }`}
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              <div className="text-white text-center sm:text-left w-full sm:w-auto">
                <span className="text-slate-400 text-xs sm:text-sm mr-2">
                  Estimated Max Spend:
                </span>
                <span className="text-lg sm:text-xl font-bold">
                  ${formData.totalBudget}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLaunchAgent}
                  disabled={!isFormValid()}
                  className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/30 text-sm sm:text-base font-medium"
                >
                  Launch Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLaunch}
        onGoToDashboard={handleGoToActiveJobs}
        onRunPayment={handleRunPayment}
        onStartWithOrchestrator={handleLaunchWithOrchestrator}
        totalBudget={formData.totalBudget}
        agentLoading={agentLoading}
        agentResult={agentResult}
        agentError={agentError}
        paymentLoading={paymentLoading}
        paymentResult={paymentResult}
        ap2Receipt={ap2Receipt}
        biteDecrypted={biteDecrypted}
        orchestratorLoading={orchestratorLoading}
        orchestratorStatus={orchestratorStatus}
        orchestratorPaymentInfo={orchestratorPaymentInfo}
        agentPreview={agentPreview}
        agentPreviewLoading={agentPreviewLoading}
        agentPreviewError={agentPreviewError}
      />
    </div>
  );
}