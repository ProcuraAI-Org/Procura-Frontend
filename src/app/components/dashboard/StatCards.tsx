import { ArrowUp, Briefcase, PiggyBank, Wallet } from "lucide-react";
import { motion } from "motion/react";

export function StatCards(props: {
  stats: {
    totalSpendToday: number;
    activeJobs: number;
    pendingAuthorizations: number;
    dailyBudgetCap: number;
    budgetRemaining: number;
  } | null;
  walletSummary?: { label: string; value: string; subtext: string } | null;
}) {
  const s = props.stats;
  const wallet = props.walletSummary ?? null;

  const stats = [
    {
      title: "Total Spend Today",
      value: s ? `$${s.totalSpendToday.toFixed(2)}` : "—",
      subtext: s ? `Daily cap: $${s.dailyBudgetCap.toFixed(2)}` : "—",
      icon: ArrowUp,
      trend: s && s.totalSpendToday > 0 ? "up" : undefined,
    },
    {
      title: "Active Jobs",
      value: s ? String(s.activeJobs) : "—",
      subtext: s ? `${s.pendingAuthorizations} pending authorization` : "—",
      icon: Briefcase,
    },
    {
      title: "Budget Remaining",
      value: s ? `$${s.budgetRemaining.toFixed(2)}` : "—",
      subtext: s ? `Daily cap: $${s.dailyBudgetCap.toFixed(2)}` : "—",
      icon: PiggyBank,
    },
    {
      title: wallet?.label ?? "Wallet",
      value: wallet?.value ?? "—",
      subtext: wallet?.subtext ?? "Connect wallet",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative"
          >
            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Card */}
            <div className="relative backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl h-full">
              {/* Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                {stat.trend === "up" && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>

              {/* Title */}
              <div className="text-sm text-slate-400 mb-2">{stat.title}</div>

              {/* Subtext */}
              <div className="text-xs text-slate-500">{stat.subtext}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}