import { motion } from "motion/react";
import { ArrowRight, Github } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-32 px-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Headline */}
          <h2 className="text-5xl font-bold text-white leading-tight">
            Ready to Launch Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Autonomous Agent?
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Deploy production-ready agentic commerce workflows with secure
            programmable payments.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="relative group px-10 py-5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all"></div>
              <div className="absolute inset-0 bg-blue-400/20 blur-xl group-hover:bg-blue-400/30 transition-all"></div>
              <span className="relative font-semibold text-white text-lg flex items-center gap-2">
                Launch Agent
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <button className="flex items-center gap-2 px-10 py-5 border-2 border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all">
              <Github className="w-5 h-5" />
              <span className="font-semibold text-lg">View GitHub</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
