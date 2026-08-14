import { motion } from "motion/react";

export function TechStack() {
  const technologies = [
    { name: "SKALE", category: "Blockchain" },
    { name: "x402", category: "Payment Protocol" },
    { name: "AP2", category: "Authorization" },
    { name: "BITE v2", category: "Encryption" },
    { name: "Coinbase CDP Wallet", category: "Wallet" },
    { name: "Google Cloud", category: "Infrastructure" },
    { name: "Node.js", category: "Runtime" },
    { name: "Next.js", category: "Framework" },
  ];

  return (
    <section id="tech-stack" className="relative py-32 px-6">
      {/* Darker Background */}
      <div className="absolute inset-0 bg-slate-950"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Powered by Modern Agent Infrastructure
          </h2>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              {/* Glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Badge Card */}
              <div className="relative backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 text-center shadow-xl h-full flex flex-col items-center justify-center">
                <div className="text-white font-semibold text-lg mb-2">
                  {tech.name}
                </div>
                <div className="text-slate-400 text-sm">{tech.category}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
