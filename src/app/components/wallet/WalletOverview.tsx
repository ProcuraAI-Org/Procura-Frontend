import { Copy, TrendingUp } from "lucide-react";
import { useState } from "react";

interface WalletOverviewProps {
  address: string;
  balance: number;
  spentToday: number;
  pendingAmount: number;
}

export function WalletOverview({
  address,
  balance,
  spentToday,
  pendingAmount,
}: WalletOverviewProps) {
  const [copied, setCopied] = useState(false);

  const availableAfterPending = balance - pendingAmount;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 24h trend: simulate cumulative spend over the day (smoother with more points)
  const pointCount = 24;
  const rawPoints = Array.from({ length: pointCount }, (_, i) => {
    const t = i / (pointCount - 1);
    const progress = t * t * (3 - 2 * t); // smoothstep
    return progress * spentToday;
  });
  const maxSpend = Math.max(spentToday, 0.01);
  const chartHeight = 56;
  const chartWidth = 100;

  const linePoints = rawPoints
    .map((point, i) => {
      const x = (i / (rawPoints.length - 1)) * chartWidth;
      const y = chartHeight - (point / maxSpend) * (chartHeight - 4);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${chartHeight} ${linePoints} ${chartWidth},${chartHeight}`;

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Wallet Overview</h2>

      <div className="space-y-6">
        {/* Wallet Address */}
        <div>
          <div className="text-sm text-slate-400 mb-2">Wallet Address</div>
          <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="font-mono text-sm text-slate-300 flex-1 break-all">
              {address}
            </div>
            <button
              onClick={copyAddress}
              className="flex-shrink-0 p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          {copied && (
            <div className="text-xs text-green-400 mt-1">
              Address copied to clipboard!
            </div>
          )}
        </div>

        {/* Balance Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Balance */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="text-sm text-blue-300 mb-2">Wallet Balance</div>
            <div className="text-4xl font-bold text-white mb-1">
              ${balance.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">USDC</div>
          </div>

          {/* Available After Pending */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">
              Available After Pending
            </div>
            <div className="text-4xl font-bold text-green-400 mb-1">
              ${availableAfterPending.toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">
              {pendingAmount > 0
                ? `$${pendingAmount.toFixed(2)} pending`
                : "No pending holds"}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Spend Today</div>
            <div className="text-2xl font-bold text-white">
              ${spentToday.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">
              Pending Authorizations
            </div>
            <div className="text-2xl font-bold text-amber-400">
              ${pendingAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* 24-Hour Spend Trend */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-300">24-Hour Spend Trend</span>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Active</span>
            </div>
          </div>
          <div className="w-full h-14">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="spend-trend-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={areaPoints}
                fill="url(#spend-trend-fill)"
              />
              <polyline
                points={linePoints}
                fill="none"
                stroke="rgb(96, 165, 250)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 px-0.5">
            <span>24h ago</span>
            <span className="text-slate-400">Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}