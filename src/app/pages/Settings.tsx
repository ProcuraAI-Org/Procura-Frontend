import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { SettingsSection } from "../components/settings/SettingsSection";
import { AuthAndWalletSection } from "../components/settings/AuthAndWalletSection";
import { WalletConfiguration } from "../components/settings/WalletConfiguration";
import { NetworkSettings } from "../components/settings/NetworkSettings";
import { BudgetSettings } from "../components/settings/BudgetSettings";
import { NotificationSettings } from "../components/settings/NotificationSettings";
import { ExecutionSettings } from "../components/settings/ExecutionSettings";
import { SystemStatusPanel } from "../components/settings/SystemStatusPanel";
import { SettingsPageSkeleton } from "../components/settings/SettingsPageSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useAppData } from "../context/AppDataContext";
import { useActiveAccount, useActiveWalletChain, useActiveWallet, useDisconnect } from "thirdweb/react";
import {
  Wallet,
  Network,
  User,
  Bell,
  Eye,
  Save,
  RotateCcw,
  Shield,
} from "lucide-react";

const STORAGE_KEY_SETTINGS = "procura_settings";

interface StoredSettings {
  perTaskBudget?: string;
  perToolCap?: string;
  dailySpendLimit?: string;
  applyDefaults?: boolean;
  notifySettlement?: boolean;
  notifyViolation?: boolean;
  notifyFailedPayment?: boolean;
  notifyBudgetThreshold?: boolean;
  notifyHumanApproval?: boolean;
  notificationChannel?: string;
  webhookUrl?: string;
  deterministicMode?: boolean;
  autoRetry?: boolean;
  maxRetryAttempts?: string;
  detailedLogging?: boolean;
}

const defaultSettings: StoredSettings = {
  perTaskBudget: "1.00",
  perToolCap: "0.30",
  dailySpendLimit: "20.00",
  applyDefaults: true,
  notifySettlement: true,
  notifyViolation: true,
  notifyFailedPayment: true,
  notifyBudgetThreshold: true,
  notifyHumanApproval: true,
  notificationChannel: "in-app",
  webhookUrl: "",
  deterministicMode: true,
  autoRetry: true,
  maxRetryAttempts: "2",
  detailedLogging: true,
};

function loadStoredSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

function saveStoredSettings(s: StoredSettings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));
  } catch {}
}

export default function Settings() {
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const [walletProvider, setWalletProvider] = useState("cdp");

  const [perTaskBudget, setPerTaskBudget] = useState("1.00");
  const [perToolCap, setPerToolCap] = useState("0.30");
  const [dailySpendLimit, setDailySpendLimit] = useState("20.00");
  const [applyDefaults, setApplyDefaults] = useState(true);

  const [notifySettlement, setNotifySettlement] = useState(true);
  const [notifyViolation, setNotifyViolation] = useState(true);
  const [notifyFailedPayment, setNotifyFailedPayment] = useState(true);
  const [notifyBudgetThreshold, setNotifyBudgetThreshold] = useState(true);
  const [notifyHumanApproval, setNotifyHumanApproval] = useState(true);
  const [notificationChannel, setNotificationChannel] = useState("in-app");
  const [webhookUrl, setWebhookUrl] = useState("");

  const [deterministicMode, setDeterministicMode] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState("2");
  const [detailedLogging, setDetailedLogging] = useState(true);

  const [lastUpdate, setLastUpdate] = useState<string>("—");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const { dashboard, loadingDashboard, getOrLoadDashboard } = useAppData();

  const walletAddress = activeAccount?.address ?? "";
  const walletStatus: "connected" | "disconnected" = activeAccount ? "connected" : "disconnected";
  const activeNetwork =
    activeChain?.name === "SKALE Base Sepolia"
      ? "skale-base-sepolia"
      : activeChain?.name
        ? "skale-mainnet"
        : "not-connected";
  const networkStatus: "connected" | "disconnected" = activeChain ? "connected" : "disconnected";
  const gaslessEnabled = true;

  const loadData = useCallback((dash: { stats: { dailyBudgetCap: number } } | null) => {
    const stored = loadStoredSettings();
    setPerTaskBudget(stored.perTaskBudget ?? "1.00");
    setPerToolCap(stored.perToolCap ?? "0.30");
    setDailySpendLimit(dash ? String(dash.stats.dailyBudgetCap) : (stored.dailySpendLimit ?? "20.00"));
    setApplyDefaults(stored.applyDefaults ?? true);
    setNotifySettlement(stored.notifySettlement ?? true);
    setNotifyViolation(stored.notifyViolation ?? true);
    setNotifyFailedPayment(stored.notifyFailedPayment ?? true);
    setNotifyBudgetThreshold(stored.notifyBudgetThreshold ?? true);
    setNotifyHumanApproval(stored.notifyHumanApproval ?? true);
    setNotificationChannel(stored.notificationChannel ?? "in-app");
    setWebhookUrl(stored.webhookUrl ?? "");
    setDeterministicMode(stored.deterministicMode ?? true);
    setAutoRetry(stored.autoRetry ?? true);
    setMaxRetryAttempts(stored.maxRetryAttempts ?? "2");
    setDetailedLogging(stored.detailedLogging ?? true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getOrLoadDashboard().then((dash) => {
      if (!cancelled) loadData(dash);
    }).catch(() => {
      if (!cancelled) loadData(null);
    });
    return () => { cancelled = true; };
  }, [getOrLoadDashboard, loadData]);

  const loading = dashboard == null && loadingDashboard;

  const handleSaveChanges = () => {
    const toStore: StoredSettings = {
      perTaskBudget,
      perToolCap,
      dailySpendLimit,
      applyDefaults,
      notifySettlement,
      notifyViolation,
      notifyFailedPayment,
      notifyBudgetThreshold,
      notifyHumanApproval,
      notificationChannel,
      webhookUrl,
      deterministicMode,
      autoRetry,
      maxRetryAttempts,
      detailedLogging,
    };
    saveStoredSettings(toStore);
    setLastUpdate(new Date().toLocaleString());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        "Are you sure you want to reset all settings to default values? This action cannot be undone."
      )
    ) {
      saveStoredSettings(defaultSettings);
      setPerTaskBudget("1.00");
      setPerToolCap("0.30");
      setDailySpendLimit("20.00");
      setApplyDefaults(true);
      setNotifySettlement(true);
      setNotifyViolation(true);
      setNotifyFailedPayment(true);
      setNotifyBudgetThreshold(true);
      setNotifyHumanApproval(true);
      setNotificationChannel("in-app");
      setWebhookUrl("");
      setDeterministicMode(true);
      setAutoRetry(true);
      setMaxRetryAttempts("2");
      setDetailedLogging(true);
      setLastUpdate("—");
      getOrLoadDashboard().then((dash) => loadData(dash)).catch(() => loadData(null));
    }
  };

  const handleDisconnectWallet = () => {
    setDisconnectModalOpen(true);
  };

  const confirmDisconnectWallet = () => {
    if (activeWallet) {
      disconnect(activeWallet);
    }
    setDisconnectModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Sidebar />
        <PageLayout className="pb-16 sm:pb-24">
          <SettingsPageSkeleton />
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <AlertDialog open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">
              Disconnect wallet?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to disconnect your wallet? You can connect again anytime from the Wallet page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              onClick={() => setDisconnectModalOpen(false)}
              className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDisconnectWallet}
              className="bg-red-600 text-white hover:bg-red-500 border-0"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageLayout className="pb-16 sm:pb-24">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Settings
                </h1>
                <p className="text-base sm:text-lg text-slate-400">
                  Configure wallet connectivity, network environment, and default
                  execution preferences.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleResetToDefault}
                  className="px-5 py-2.5 border-2 border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
              <Save className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-green-300">Settings saved successfully.</span>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
            {/* Left: Settings Controls */}
            <div className="space-y-6">
              {/* Account (sign-in status & sign out) */}
              <SettingsSection
                icon={<Shield className="w-5 h-5" />}
                title="Account"
                description="Your sign-in status. Sign out or go to the sign-in page from here."
              >
                <AuthAndWalletSection />
              </SettingsSection>

              {/* 1. Wallet Configuration */}
              <SettingsSection
                icon={<Wallet className="w-5 h-5" />}
                title="1. Wallet Configuration"
                description="Manage your wallet settings and connectivity."
              >
                <WalletConfiguration
                  walletProvider={walletProvider}
                  onWalletProviderChange={setWalletProvider}
                  walletAddress={walletAddress || "Not connected"}
                  walletStatus={walletStatus}
                  onDisconnect={handleDisconnectWallet}
                />
              </SettingsSection>

              {/* 2. Network Settings */}
              <SettingsSection
                icon={<Network className="w-5 h-5" />}
                title="2. Network Settings"
                description="Configure your network environment and gasless transactions."
              >
                <NetworkSettings
                  activeNetwork={activeNetwork}
                  onNetworkChange={() => {}}
                  networkStatus={networkStatus}
                  gaslessEnabled={gaslessEnabled}
                />
              </SettingsSection>

              {/* 3. Default Budget Settings */}
              <SettingsSection
                icon={<User className="w-5 h-5" />}
                title="3. Default Budget Settings"
                description="Set default budget limits for tasks and tools."
              >
                <BudgetSettings
                  perTaskBudget={perTaskBudget}
                  onPerTaskBudgetChange={setPerTaskBudget}
                  perToolCap={perToolCap}
                  onPerToolCapChange={setPerToolCap}
                  dailySpendLimit={dailySpendLimit}
                  onDailySpendLimitChange={setDailySpendLimit}
                  applyDefaults={applyDefaults}
                  onApplyDefaultsChange={setApplyDefaults}
                />
              </SettingsSection>

              {/* 4. Notification Preferences */}
              <SettingsSection
                icon={<Bell className="w-5 h-5" />}
                title="4. Notification Preferences"
                description="Configure how you receive notifications for various events."
              >
                <NotificationSettings
                  notifySettlement={notifySettlement}
                  onNotifySettlementChange={setNotifySettlement}
                  notifyViolation={notifyViolation}
                  onNotifyViolationChange={setNotifyViolation}
                  notifyFailedPayment={notifyFailedPayment}
                  onNotifyFailedPaymentChange={setNotifyFailedPayment}
                  notifyBudgetThreshold={notifyBudgetThreshold}
                  onNotifyBudgetThresholdChange={setNotifyBudgetThreshold}
                  notifyHumanApproval={notifyHumanApproval}
                  onNotifyHumanApprovalChange={setNotifyHumanApproval}
                  notificationChannel={notificationChannel}
                  onNotificationChannelChange={setNotificationChannel}
                  webhookUrl={webhookUrl}
                  onWebhookUrlChange={setWebhookUrl}
                />
              </SettingsSection>

              {/* 5. Execution Behavior */}
              <SettingsSection
                icon={<Eye className="w-5 h-5" />}
                title="5. Execution Behavior"
                description="Define how tasks are executed and retried."
              >
                <ExecutionSettings
                  deterministicMode={deterministicMode}
                  onDeterministicModeChange={setDeterministicMode}
                  autoRetry={autoRetry}
                  onAutoRetryChange={setAutoRetry}
                  maxRetryAttempts={maxRetryAttempts}
                  onMaxRetryAttemptsChange={setMaxRetryAttempts}
                  detailedLogging={detailedLogging}
                  onDetailedLoggingChange={setDetailedLogging}
                />
              </SettingsSection>
            </div>

            {/* Right: System Status Panel */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <SystemStatusPanel
                  walletConnected={walletStatus === "connected"}
                  networkStatus={activeChain?.name ?? "Not connected"}
                  biteEnabled={true}
                  ap2Enabled={true}
                  x402Enabled={true}
                  loggingActive={detailedLogging}
                  riskProfile="low"
                  lastUpdate={lastUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}