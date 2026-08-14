import { Shield } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Product: ["Features", "Security", "Documentation"],
    Developers: ["GitHub", "API Docs", "Demo"],
    Hackathon: [
      "Built for SKALE Agentic Commerce x402 Hackathon",
      "Submission Repo",
      "Demo Video",
    ],
  };

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ProcuraAI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              ProcuraAI is a secure agentic commerce platform built for the
              Internet of Agents.
            </p>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Developers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Developers</h3>
            <ul className="space-y-3">
              {footerLinks.Developers.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Hackathon */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hackathon</h3>
            <ul className="space-y-3">
              {footerLinks.Hackathon.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-center text-slate-500">
            © 2026 ProcuraAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
