import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { SpendControlSection } from "../components/policies/SpendControlSection";
import { useAppData } from "../context/AppDataContext";
import { PoliciesPageSkeleton } from "../components/policies/PoliciesPageSkeleton";
import { ToolAccessSection } from "../components/policies/ToolAccessSection";
import { AuthorizationSection } from "../components/policies/AuthorizationSection";
import { SlippageSection } from "../components/policies/SlippageSection";
import { PrivacySection } from "../components/policies/PrivacySection";
import { ExecutionSafetySection } from "../components/policies/ExecutionSafetySection";
import { RiskSummaryPanel } from "../components/policies/RiskSummaryPanel";
import {
  Shield,
  DollarSign,
  Lock,
  AlertTriangle,
  XCircle,
  Save,
  RotateCcw,
} from "lucide-react";

interface PolicyState {
  // Spend Control
  dailyLimit: string;
  perTaskCap: string;
  perToolMax: string;
  currentUsage: number;

  // Tool Access
  allowlist: string[];
  denylist: string[];
  blockUnknown: boolean;

  // Authorization
  requireApproval: boolean;
  approvalMode: string;
  autoApprovalThreshold: string;

  // Slippage
  maxVariance: string;
  timeout: string;
  abortOnIncrease: boolean;
  requireMultiSource: boolean;

  // Privacy
  encryptIntent: boolean;
  encryptBudget: boolean;
  encryptTools: boolean;
  encryptConditions: boolean;

  // Execution Safety
  deterministicMode: boolean;
  logReasoning: boolean;
  blockRepeatedFailures: boolean;
  maxRetries: string;
}

const STORAGE_KEY_POLICIES = "procura_policies";

const defaultPolicies: PolicyState = {
  dailyLimit: "20.00",
  perTaskCap: "5.00",
  perToolMax: "0.50",
  currentUsage: 0,

  allowlist: ["CryptoReportAPI"],
  denylist: [],
  blockUnknown: true,

  requireApproval: false,
  approvalMode: "threshold",
  autoApprovalThreshold: "0.25",

  maxVariance: "5",
  timeout: "10",
  abortOnIncrease: true,
  requireMultiSource: true,

  encryptIntent: true,
  encryptBudget: true,
  encryptTools: false,
  encryptConditions: true,

  deterministicMode: true,
  logReasoning: true,
  blockRepeatedFailures: true,
  maxRetries: "2",
};

function loadStoredPolicies(): Partial<PolicyState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POLICIES);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PolicyState>;
    return parsed;
  } catch {
    return null;
  }
}

function mergeWithDashboard(
  base: PolicyState,
  stats: { totalSpendToday: number; dailyBudgetCap: number } | null
): PolicyState {
  if (!stats) return base;
  return {
    ...base,
    currentUsage: stats.totalSpendToday,
    dailyLimit: String(stats.dailyBudgetCap),
  };
}

export default function Policies() {
  const { dashboard, loadingDashboard, getOrLoadDashboard } = useAppData();
  const [policies, setPolicies] = useState<PolicyState>(defaultPolicies);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrLoadDashboard().then((dash) => {
      if (cancelled) return;
      const stored = loadStoredPolicies();
      const base: PolicyState = stored
        ? { ...defaultPolicies, ...stored }
        : defaultPolicies;
      setPolicies(mergeWithDashboard(base, dash?.stats ?? null));
    }).catch(() => {
      if (!cancelled) {
        const stored = loadStoredPolicies();
        const base: PolicyState = stored
          ? { ...defaultPolicies, ...stored }
          : defaultPolicies;
        setPolicies(base);
      }
    });
    return () => { cancelled = true; };
  }, [getOrLoadDashboard]);

  const loading = dashboard == null && loadingDashboard;

  const updateSpend = (field: string, value: string) => {
    setPolicies((prev) => ({ ...prev, [field]: value }));
  };

  const updateToolAccess = (field: string, value: any) => {
    setPolicies((prev) => ({ ...prev, [field]: value }));
  };

  const updateAuthorization = (field: string, value: any) => {
    setPolicies((prev) => ({ ...prev, [field]: value }));
  };

  const updateSlippage = (field: string, value: any) => {
    setPolicies((prev) => ({ ...prev, [field]: value }));
  };

  const updatePrivacy = (field: string) => {
    setPolicies((prev) => ({ ...prev, [field]: !prev[field as keyof PolicyState] }));
  };

  const updateSafety = (field: string, value?: any) => {
    if (value !== undefined) {
      setPolicies((prev) => ({ ...prev, [field]: value }));
    } else {
      setPolicies((prev) => ({ ...prev, [field]: !prev[field as keyof PolicyState] }));
    }
  };

  const handleSave = () => {
    try {
      const toStore = { ...policies };
      localStorage.setItem(STORAGE_KEY_POLICIES, JSON.stringify(toStore));
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch {
      setShowSaveSuccess(false);
    }
  };

  const handleReset = async () => {
    try {
      const dash = await getOrLoadDashboard();
      const reset = mergeWithDashboard(defaultPolicies, dash?.stats ?? null);
      setPolicies(reset);
      localStorage.removeItem(STORAGE_KEY_POLICIES);
    } catch {
      setPolicies(defaultPolicies);
      localStorage.removeItem(STORAGE_KEY_POLICIES);
    }
  };

  const dailyLimitNum = parseFloat(policies.dailyLimit) || 0;
  const usagePercent = dailyLimitNum > 0 ? (policies.currentUsage / dailyLimitNum) * 100 : 0;

  const showWarning = usagePercent >= 80 && usagePercent < 100;
  const showCritical = usagePercent >= 100;

  const encryptionEnabled =
    policies.encryptIntent ||
    policies.encryptBudget ||
    policies.encryptTools ||
    policies.encryptConditions;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Sidebar />
        <PageLayout className="pb-16 sm:pb-24">
          <PoliciesPageSkeleton />
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Alert Banners */}
          {showCritical && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-red-300">
                  Critical: Daily spend limit exceeded
                </div>
                <div className="text-xs text-red-200/80 mt-1">
                  Payment signing will be blocked until policy is updated.
                </div>
              </div>
            </div>
          )}

          {showWarning && !showCritical && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-amber-300">
                  Warning: Daily spend exceeds 80% of cap
                </div>
                <div className="text-xs text-amber-200/80 mt-1">
                  Consider adjusting limits or monitoring active tasks.
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSaveSuccess && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
              <Save className="w-5 h-5 text-green-400" />
              <div className="text-sm font-bold text-green-300">
                Policies saved successfully
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Global Policies & Guardrails
                </h1>
                <p className="text-base sm:text-lg text-slate-400">
                  Define the rules that govern autonomous spending, authorization,
                  and execution behavior.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  These values are used as defaults when you create a new task.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 border-2 border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
            {/* Left: Policy Controls */}
            <div className="space-y-6 lg:space-y-8">
              {/* 1. Spend Control */}
              <SpendControlSection
                dailyLimit={policies.dailyLimit}
                perTaskCap={policies.perTaskCap}
                perToolMax={policies.perToolMax}
                currentUsage={policies.currentUsage}
                onUpdate={updateSpend}
              />

              {/* 2. Tool Access Control */}
              <ToolAccessSection
                allowlist={policies.allowlist}
                denylist={policies.denylist}
                blockUnknown={policies.blockUnknown}
                onUpdateAllowlist={(tools) => updateToolAccess("allowlist", tools)}
                onUpdateDenylist={(tools) => updateToolAccess("denylist", tools)}
                onToggleBlockUnknown={() =>
                  updateToolAccess("blockUnknown", !policies.blockUnknown)
                }
              />

              {/* 3. Authorization Requirements */}
              <AuthorizationSection
                requireApproval={policies.requireApproval}
                approvalMode={policies.approvalMode}
                autoApprovalThreshold={policies.autoApprovalThreshold}
                onToggleApproval={() =>
                  updateAuthorization("requireApproval", !policies.requireApproval)
                }
                onUpdateMode={(mode) => updateAuthorization("approvalMode", mode)}
                onUpdateThreshold={(value) =>
                  updateAuthorization("autoApprovalThreshold", value)
                }
              />

              {/* 4. Slippage & Risk Control */}
              <SlippageSection
                maxVariance={policies.maxVariance}
                timeout={policies.timeout}
                abortOnIncrease={policies.abortOnIncrease}
                requireMultiSource={policies.requireMultiSource}
                onUpdate={updateSlippage}
              />

              {/* 5. Privacy & Encryption */}
              <PrivacySection
                encryptIntent={policies.encryptIntent}
                encryptBudget={policies.encryptBudget}
                encryptTools={policies.encryptTools}
                encryptConditions={policies.encryptConditions}
                onToggle={updatePrivacy}
              />

              {/* 6. Execution Safety */}
              <ExecutionSafetySection
                deterministicMode={policies.deterministicMode}
                logReasoning={policies.logReasoning}
                blockRepeatedFailures={policies.blockRepeatedFailures}
                maxRetries={policies.maxRetries}
                onToggle={updateSafety}
                onUpdateRetries={(value) => updateSafety("maxRetries", value)}
              />
            </div>

            {/* Right: Risk Summary Panel */}
            <div className="lg:col-span-1">
              <RiskSummaryPanel
                dailyLimit={policies.dailyLimit}
                perToolMax={policies.perToolMax}
                allowlistCount={policies.allowlist.length}
                blockUnknown={policies.blockUnknown}
                requireApproval={policies.requireApproval}
                encryptionEnabled={encryptionEnabled}
                loggingEnabled={policies.logReasoning}
                currentUsage={policies.currentUsage}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}