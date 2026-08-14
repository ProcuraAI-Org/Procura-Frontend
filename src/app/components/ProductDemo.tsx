import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ProductDemo() {
  return (
    <section className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            See the Agent in Action
          </h2>
        </motion.div>

        {/* Demo Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-3xl"></div>

          {/* Mockup Container */}
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-3xl p-3 shadow-2xl">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 rounded-t-2xl border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-800/50 rounded-lg px-4 py-1.5 text-sm text-slate-400 text-center">
                  procuraai.app/agent/dashboard
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-8 bg-slate-900/30 rounded-b-2xl">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="text-sm text-slate-400 mb-4">Navigation</div>
                  {[
                    "Dashboard",
                    "Active Tasks",
                    "Payment History",
                    "Settings",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`px-4 py-3 rounded-lg transition-colors ${
                        index === 0
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "text-slate-400 hover:bg-slate-800/50"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Budget Card */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Budget Overview</h3>
                      <span className="text-sm text-slate-400">Today</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Allocated</div>
                        <div className="text-2xl font-bold text-white">$100.00</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Spent</div>
                        <div className="text-2xl font-bold text-blue-400">$2.47</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Available</div>
                        <div className="text-2xl font-bold text-green-400">
                          $97.53
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Execution Timeline */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-6">
                      Live Execution Timeline
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          event: "HTTP 402 received",
                          detail: "Tool: weather-api.com",
                          status: "complete",
                          time: "12:34:21",
                        },
                        {
                          event: "Payment signed",
                          detail: "$0.05 via CDP Wallet",
                          status: "complete",
                          time: "12:34:22",
                        },
                        {
                          event: "Retry successful",
                          detail: "200 OK - Data received",
                          status: "complete",
                          time: "12:34:23",
                        },
                        {
                          event: "Settlement complete",
                          detail: "Receipt #xf47a2b",
                          status: "active",
                          time: "12:34:24",
                        },
                      ].map((step, index) => (
                        <motion.div
                          key={step.event}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <div className="relative pt-1">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                step.status === "active"
                                  ? "bg-blue-400 animate-pulse"
                                  : "bg-green-400"
                              }`}
                            ></div>
                            {index < 3 && (
                              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-700"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-white font-medium">
                                {step.event}
                              </div>
                              <div className="text-sm text-slate-500">
                                {step.time}
                              </div>
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                              {step.detail}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-slate-400 mt-8"
          >
            Real-time agent execution with cost reasoning and policy enforcement.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
