import { motion } from "motion/react";
import { Target, Zap, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Define Intent",
      description:
        "Set task objectives, budget limits, tool allowlists, and privacy conditions.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Agent Discovers & Pays Tools",
      description:
        "The agent evaluates tool pricing, receives HTTP 402 challenges, signs payments via CDP wallet, and retries requests automatically.",
      color: "purple",
    },
    {
      icon: ShieldCheck,
      title: "Verified Settlement & Output",
      description:
        "AP2 authorization enforces accountability while encrypted conditions ensure payments only execute when requirements are met.",
      color: "blue",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            How Autonomous Commerce Works
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Glow on hover */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${
                    step.color === "purple"
                      ? "from-purple-500/20 to-blue-500/20"
                      : "from-blue-500/20 to-purple-500/20"
                  } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}
                ></div>

                {/* Card */}
                <div className="relative h-full backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 pt-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                        step.color === "purple"
                          ? "from-purple-500/20 to-blue-500/20"
                          : "from-blue-500/20 to-purple-500/20"
                      } flex items-center justify-center`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          step.color === "purple"
                            ? "text-purple-400"
                            : "text-blue-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
