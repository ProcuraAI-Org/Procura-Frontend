import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { WalletOverview } from "../components/wallet/WalletOverview";
import { SpendGuardrails } from "../components/wallet/SpendGuardrails";
import { TransactionHistory } from "../components/wallet/TransactionHistory";
import { PendingAuthorizations } from "../components/wallet/PendingAuthorizations";
import { PaymentMethodDetails } from "../components/wallet/PaymentMethodDetails";
import { SecurityStatus } from "../components/wallet/SecurityStatus";
import { WalletPageSkeleton } from "../components/wallet/WalletPageSkeleton";
import { Download, Plus, Circle, AlertTriangle, Wallet as WalletIcon, CheckCircle, XCircle, Loader2, ShieldCheck, CreditCard, Lock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConnectButton, useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import {
  getUsdcFaucetStatus,
  listOrchestratorTasks,
  authorizeAp2Intent,
  type OrchestratorTask,
} from "../api/client";
import { useAppData } from "../context/AppDataContext";
import { skaleBaseSepolia, thirdwebClient } from "../thirdweb/client";

const AUTHORIZATION_PENDING = "AUTHORIZATION_PENDING";

export default function Wallet() {
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const { dashboard, loadingDashboard, getOrLoadDashboard, preloadAll } = useAppData();
  const [showFundModal, setShowFundModal] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const address = activeAccount?.address ?? null;
  const isCorrectChain = activeChain?.id === skaleBaseSepolia.id;

  const [tasks, setTasks] = useState<OrchestratorTask[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [loadingFaucetAndTasks, setLoadingFaucetAndTasks] = useState(false);

  const spentToday = dashboard?.stats?.totalSpendToday ?? 0;
  const dailySpendCap = dashboard?.stats?.dailyBudgetCap ?? 20;
  const pendingCount = dashboard?.stats?.pendingAuthorizations ?? 0;
  const pendingAmount = 0;
  const recentActivity = dashboard?.recentActivity ?? [];

  const pendingAuths = useMemo(() => {
    return tasks
      .filter((t) => t.state === AUTHORIZATION_PENDING)
      .map((t) => ({
        id: t.taskId,
        tool: t.decision?.selectedTool ?? "—",
        amount: t.decision?.estimatedCost ?? 0,
        intentId: t.intentId ?? "",
        status: "Awaiting Approval",
        timestamp: t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString() : "—",
      }));
  }, [tasks]);

  // Ensure dashboard is in cache (from preload or load here)
  useEffect(() => {
    if (dashboard == null) getOrLoadDashboard();
  }, [dashboard, getOrLoadDashboard]);

  const loadFaucetAndTasks = useCallback(async () => {
    if (!address) return;
    setLoadingFaucetAndTasks(true);
    setWalletError(null);
    try {
      const [faucet, tasksRes] = await Promise.all([
        getUsdcFaucetStatus(address),
        listOrchestratorTasks(),
      ]);
      setUsdcBalance(faucet.balance ?? "0");
      setTasks(tasksRes.tasks ?? []);
    } catch (e) {
      setWalletError(e instanceof Error ? e.message : "Failed to load wallet data");
    } finally {
      setLoadingFaucetAndTasks(false);
    }
  }, [address]);

  useEffect(() => {
    loadFaucetAndTasks();
  }, [loadFaucetAndTasks]);

  const loading = dashboard == null && loadingDashboard;

  const walletBalance = useMemo(() => Number(usdcBalance ?? 0), [usdcBalance]);
  const showLowBalanceWarning =
    Boolean(address) &&
    !loadingFaucetAndTasks &&
    dashboard !== null &&
    walletBalance < dailySpendCap;

  const handleLearnMore = () => {
    window.open("https://docs.cdp.coinbase.com/wallet/", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Wallet & Payments
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-400">
                Manage your Web3 wallet, view balance, and configure payment
                channels.
              </p>
            </div>
          </div>

          {/* Connected: slim status bar (network + faucet); wrong-network and errors */}
          {address && (
            <div className="mb-6 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3">
                <div className="text-sm text-slate-300">
                  Connected to <span className="text-white font-medium">{skaleBaseSepolia.name}</span>
                  <span className="text-slate-500 ml-2 font-mono text-xs">({address.slice(0, 6)}…{address.slice(-4)})</span>
                </div>
                <a
                  href="/faucet"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  USDC Faucet →
                </a>
              </div>
              {!isCorrectChain && (
                <div className="text-xs text-amber-200 bg-amber-950/30 border border-amber-900 rounded-lg p-3">
                  Wrong network. Switch to <strong>{skaleBaseSepolia.name}</strong> in your wallet.
                </div>
              )}
              {walletError && (
                <div className="text-xs text-red-200 bg-red-950/30 border border-red-900 rounded-lg p-3">
                  {walletError}
                </div>
              )}
            </div>
          )}

          {/* Low Balance Warning - Only when connected */}
          <AnimatePresence>
            {showLowBalanceWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 lg:mb-8 backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <div className="text-amber-300 font-medium text-sm sm:text-base">
                      Wallet balance is below recommended operational threshold
                    </div>
                    <div className="text-amber-400/70 text-xs sm:text-sm">
                      Consider adding funds to ensure uninterrupted agent
                      operations.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowFundModal(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors cursor-pointer w-full sm:w-auto whitespace-nowrap"
                >
                  Add Funds
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Connected / Disconnected content */}
          <AnimatePresence mode="wait">
            {!address && (
              <motion.div
                key="disconnected-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 lg:space-y-8"
              >
                {/* Main Onboarding Card */}
                <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 lg:p-12 shadow-xl text-center max-w-3xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                      <WalletIcon className="w-10 h-10 text-blue-400" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-4">
                    Connect Wallet to Enable Autonomous Payments
                  </h2>

                  <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                    ProcuraAI requires a CDP wallet to sign x402 payments and execute AP2 settlements securely.
                  </p>

                  {/* Checklist */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-xl mx-auto">
                    <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Required for tool payments</div>
                        <div className="text-sm text-slate-500">Execute x402 payment flows</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Required for settlement execution</div>
                        <div className="text-sm text-slate-500">AP2 protocol authorizations</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Enables autonomous workflows</div>
                        <div className="text-sm text-slate-500">Agent-driven commerce</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Enforces spend guardrails</div>
                        <div className="text-sm text-slate-500">Policy-based controls</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button - connects to SKALE Base Sepolia */}
                  <div className="flex flex-col items-center gap-2">
                    <ConnectButton
                      client={thirdwebClient}
                      chain={skaleBaseSepolia}
                      chains={[skaleBaseSepolia]}
                      wallets={[createWallet("io.metamask"), createWallet("com.rabby"), createWallet("com.coinbase.wallet")]}
                      theme="dark"
                    />
                    <p className="text-xs text-slate-500">
                      Connects to {skaleBaseSepolia.name}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500 mt-6">
                    Wallet connection is required before creating payment-enabled tasks.
                  </p>
                </div>
              </motion.div>
            )}

            {/* CONNECTED STATE - Skeleton while loading or before first load */}
            {address && (loading || dashboard === null) && (
              <motion.div
                key="wallet-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <WalletPageSkeleton />
              </motion.div>
            )}

            {/* CONNECTED STATE - Full Dashboard (data loaded) */}
            {address && !loading && dashboard !== null && (
              <motion.div
                key="connected-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8"
              >
                {/* Left Column */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Wallet Overview */}
                  <WalletOverview
                    address={address}
                    balance={walletBalance}
                    spentToday={spentToday}
                    pendingAmount={pendingAmount}
                  />

                  {/* Transaction History */}
                  <TransactionHistory recentActivity={recentActivity} />

                  {/* Pending Authorizations */}
                  <PendingAuthorizations
                    pendingAuthorizations={pendingAuths}
                    onApprove={async (intentId) => {
                      try {
                        await authorizeAp2Intent(intentId);
                        await Promise.all([preloadAll(), loadFaucetAndTasks()]);
                      } catch (e) {
                        setWalletError(e instanceof Error ? e.message : "Approval failed");
                      }
                    }}
                    onReject={() => {}}
                  />

                  {/* Payment Method Details */}
                  <PaymentMethodDetails
                    connectedAddress={address}
                    networkName={activeChain?.name ?? (isCorrectChain ? "SKALE Base Sepolia" : null)}
                  />
                </div>

                {/* Right Column - Sticky */}
                <div className="space-y-6 lg:space-y-8">
                  <div className="lg:sticky lg:top-8 space-y-6 lg:space-y-8">
                    {/* Spend Guardrails */}
                    <SpendGuardrails
                      dailyCap={dailySpendCap}
                      spentToday={spentToday}
                      perTaskCap={1.0}
                      perToolCap={0.3}
                      pendingCount={pendingCount}
                    />

                    {/* Security Status */}
                    <SecurityStatus />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageLayout>

      {/* Fund Wallet Modal - Only accessible when connected */}
      {showFundModal && Boolean(address) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Fund Wallet</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-sm text-blue-300 mb-2">
                  CDP Wallet Address
                </div>
                <div className="font-mono text-xs text-blue-400 break-all">
                  {address}
                </div>
              </div>

              <div className="text-sm text-slate-400">
                Send USDC to this address on SKALE Network to fund your agent
                wallet. Funds typically arrive within 30 seconds.
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-2">Recommended Minimum</div>
                <div className="text-2xl font-bold text-white">$50.00 USDC</div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800">
              <button
                onClick={() => setShowFundModal(false)}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}