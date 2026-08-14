import { motion } from "motion/react";
import {
  CreditCard,
  FileCheck,
  Lock,
  Shield,
  Workflow,
  FileText,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: CreditCard,
      title: "x402 Native Payments",
      description:
        "Handles HTTP 402 → pay → retry flows natively, enabling autonomous tool payments.",
    },
    {
      icon: FileCheck,
      title: "AP2 Authorization & Settlement",
      description:
        "Implements intent → authorization → settlement → receipt lifecycle with full auditability.",
    },
    {
      icon: Lock,
      title: "Encrypted Conditional Execution (BITE v2)",
      description:
        "Sensitive payment conditions remain encrypted until criteria are satisfied.",
    },
    {
      icon: Shield,
      title: "Spend Caps & Guardrails",
      description:
        "Daily limits, per-task budgets, allowlists, and optional human approval.",
    },
    {
      icon: Workflow,
      title: "Deterministic Workflow Engine",
      description:
        "Structured, traceable, and failure-aware execution — not black-box AI behavior.",
    },
    {
      icon: FileText,
      title: "Full Audit Logs & Receipts",
      description:
        "Every payment includes reason codes, settlement records, and transaction history.",
    },
  ];

  return (
    <section id="features" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Built for Real Agentic Commerce
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Card */}
                <div className="relative h-full backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-blue-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
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
