import { Shield, Github } from "lucide-react";
import { motion } from "motion/react";

export function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/50 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">ProcuraAI</span>
            </div>

            {/* Navigation Links & Buttons */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("tech-stack")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Tech Stack
              </button>

              {/* GitHub Button */}
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-slate-600 transition-all">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </button>

              {/* Launch Agent CTA */}
              <button className="relative group px-6 py-2 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all"></div>
                <div className="absolute inset-0 bg-blue-400/20 blur-xl group-hover:bg-blue-400/30 transition-all"></div>
                <span className="relative font-semibold text-white">
                  Launch Agent
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
