import { motion } from "motion/react";
import { CheckCircle2, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold text-white leading-tight">
              Autonomous Agents That Can{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Spend Money Safely.
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              ProcuraAI enables AI agents to discover paid tools, reason about
              cost, authorize payments via x402 & AP2, and complete real-world
              workflows — with safeguards, encryption, and full audit trails.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button className="relative group px-8 py-4 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all"></div>
                <div className="absolute inset-0 bg-blue-400/20 blur-xl group-hover:bg-blue-400/30 transition-all"></div>
                <span className="relative font-semibold text-white text-lg">
                  Launch Agent
                </span>
              </button>

              <button className="flex items-center gap-2 px-8 py-4 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all">
                <Play className="w-5 h-5" />
                <span className="font-semibold text-lg">View Demo Flow</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {[
                "x402 Compatible",
                "AP2 Integrated",
                "BITE v2 Encrypted",
                "CDP Wallet Ready",
              ].map((indicator, index) => (
                <motion.div
                  key={indicator}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">{indicator}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Product Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl rounded-3xl"></div>

              {/* Mockup Card */}
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <h3 className="text-white font-semibold">Agent Dashboard</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-slate-400">Active</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <div className="text-sm text-slate-400 mb-3">Execution Timeline</div>
                    {[
                      { label: "Task initialized", time: "0.2s", color: "blue" },
                      { label: "HTTP 402 received", time: "1.4s", color: "purple" },
                      { label: "Payment authorized", time: "2.1s", color: "blue" },
                      { label: "Retry successful", time: "2.8s", color: "green" },
                    ].map((step, index) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.15 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            step.color === "green"
                              ? "bg-green-400"
                              : step.color === "purple"
                              ? "bg-purple-400"
                              : "bg-blue-400"
                          }`}
                        ></div>
                        <div className="flex-1 text-slate-300">{step.label}</div>
                        <div className="text-sm text-slate-500">{step.time}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Spend Tracking Card */}
                  <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Budget Used</span>
                      <span className="text-sm text-blue-400">$2.47 / $100.00</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "2.47%" }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
