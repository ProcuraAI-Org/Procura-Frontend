import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { StatCards } from "../components/dashboard/StatCards";
import { AgentStatus } from "../components/dashboard/AgentStatus";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { SpendBreakdown } from "../components/dashboard/SpendBreakdown";
import { PolicyAlerts } from "../components/dashboard/PolicyAlerts";
import { DashboardPageSkeleton } from "../components/dashboard/DashboardPageSkeleton";
import { useEffect, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { formatDistanceToNow } from "date-fns";
import { useActiveAccount, useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { skaleBaseSepolia, thirdwebClient } from "../thirdweb/client";

function formatTokenAmount3(value: string | number): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toFixed(3);
}

export default function Dashboard() {
  const { dashboard: data, loadingDashboard, preloadAll } = useAppData();
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const nativeBalance = useWalletBalance({
    client: thirdwebClient,
    chain: skaleBaseSepolia,
    address: account?.address,
  });

  useEffect(() => {
    let cancelled = false;
    preloadAll().catch((e) => {
      if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard");
    });
    return () => {
      cancelled = true;
    };
  }, [preloadAll]);

  const activities =
    data?.recentActivity?.map((a) => ({
      title: a.title,
      detail: a.detail,
      time: formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }),
      color: a.type === "payment" ? "blue" : "purple",
      json: a.json,
    })) ?? [];

  const loading = loadingDashboard && data == null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout>
        <div className="max-w-7xl mx-auto">
          <DashboardHeader />

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <DashboardPageSkeleton />
          ) : (
            <>
          {/* Overview Stat Cards */}
          <StatCards
            stats={data?.stats ?? null}
            walletSummary={
              account?.address
                ? {
                    label: "Wallet",
                    value: nativeBalance.data ? `${formatTokenAmount3(nativeBalance.data.displayValue)} ${nativeBalance.data.symbol}` : "—",
                    subtext: `Connected • ${chain?.name ?? skaleBaseSepolia.name}`,
                  }
                : { label: "Wallet", value: "Not connected", subtext: "Connect on Wallet page" }
            }
          />

          {/* Agent Status */}
          <AgentStatus currentTask={data?.currentTask ?? null} />

          {/* Two Column Layout for Activity and Breakdown */}
          <div className="grid lg:grid-cols-2 gap-4 mb-6 lg:mb-8 lg:items-stretch">
            {/* Recent Activity - full height */}
            <div className="flex flex-col min-h-0">
              <RecentActivity activities={activities} />
            </div>

            {/* Right Column: Spend Breakdown + Policy Alerts */}
            <div className="flex flex-col gap-6">
              <SpendBreakdown spendByTool={data?.spendByTool ?? null} />
              <PolicyAlerts policy={data?.policy ?? null} />
            </div>
          </div>
            </>
          )}
        </div>
      </PageLayout>
    </div>
  );
}