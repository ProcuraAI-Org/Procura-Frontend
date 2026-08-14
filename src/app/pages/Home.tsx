import { useNavigate } from "react-router";
import {
  Shield,
  Target,
  CreditCard,
  Receipt,
  CheckCircle2,
  Github,
  Lock,
  Zap,
  Code,
  Activity,
  FileCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-[#4F7CFF] to-[#7B61FF] p-2 rounded-xl">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ProcuraAI</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("tech-stack")}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Tech Stack
              </button>
              <button className="px-4 py-2 border border-slate-700 rounded-lg text-white hover:border-slate-600 transition-colors flex items-center gap-2 cursor-pointer">
                <Github className="w-4 h-4" />
                GitHub
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2 bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Launch Agent
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-slate-800 pt-4">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("tech-stack")}
                className="block w-full text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Tech Stack
              </button>
              <button className="w-full px-4 py-2 border border-slate-700 rounded-lg text-white hover:border-slate-600 transition-colors flex items-center gap-2 justify-center cursor-pointer">
                <Github className="w-4 h-4" />
                GitHub
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full px-6 py-2 bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Launch Agent
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Autonomous Agents That Can{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF]">
                  Spend Money Safely
                </span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                ProcuraAI enables AI agents to discover paid tools, reason about
                cost, authorize payments via x402 & AP2, and complete real-world
                workflows — with safeguards, encryption, and full audit trails.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/auth")}
                  className="px-8 py-4 bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Launch Agent
                </button>
                <button
                  onClick={() => navigate("/execution/demo-001")}
                  className="px-8 py-4 border border-slate-700 rounded-lg font-semibold text-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all cursor-pointer"
                >
                  View Demo Flow
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                  x402 Compatible
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                  AP2 Integrated
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                  BITE v2 Encrypted
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                  CDP Wallet Ready
                </div>
              </div>
            </div>

            {/* Right Side - Product Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4F7CFF]/20 to-[#7B61FF]/20 blur-3xl"></div>
              <div className="relative bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#4F7CFF]" />
                    <span className="font-semibold">Live Execution</span>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
                    Running
                  </div>
                </div>

                {/* Mock Spend Tracking */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Budget Used</div>
                    <div className="text-2xl font-bold mt-1">$12.45</div>
                    <div className="text-xs text-slate-500 mt-1">
                      of $50.00 limit
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Tasks</div>
                    <div className="text-2xl font-bold mt-1">3/5</div>
                    <div className="text-xs text-slate-500 mt-1">
                      completed
                    </div>
                  </div>
                </div>

                {/* Mock Timeline */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-800 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-[#4F7CFF] mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">HTTP 402 Received</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Tool requires $2.50 payment
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-800 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Payment Signed</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Via CDP Wallet on SKALE
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-800 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Settlement Complete
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Receipt verified via AP2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How Autonomous Commerce Works
            </h2>
            <p className="text-xl text-slate-400">
              Three simple steps to secure agentic payments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-[#4F7CFF]/50 hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#4F7CFF]/20 to-[#7B61FF]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#4F7CFF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Define Intent</h3>
              <p className="text-slate-400 leading-relaxed">
                Set task objectives, budget limits, tool allowlists, and privacy
                conditions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-[#4F7CFF]/50 hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#4F7CFF]/20 to-[#7B61FF]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-[#4F7CFF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Agent Discovers & Pays Tools
              </h3>
              <p className="text-slate-400 leading-relaxed">
                The agent evaluates tool pricing, receives HTTP 402 challenges,
                signs payments via CDP wallet, and retries requests automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-[#4F7CFF]/50 hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#4F7CFF]/20 to-[#7B61FF]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Receipt className="w-8 h-8 text-[#4F7CFF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Verified Settlement & Output
              </h3>
              <p className="text-slate-400 leading-relaxed">
                AP2 authorization enforces accountability while encrypted
                conditions ensure payments only execute when requirements are met.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Real Agentic Commerce
            </h2>
            <p className="text-xl text-slate-400">
              Production-grade infrastructure for autonomous payments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#4F7CFF]/10 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    x402 Native Payments
                  </h3>
                  <p className="text-slate-400">
                    Handles HTTP 402 → pay → retry flows natively, enabling
                    autonomous tool payments.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#4F7CFF]/10 p-3 rounded-xl">
                  <FileCheck className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    AP2 Authorization & Settlement
                  </h3>
                  <p className="text-slate-400">
                    Implements intent → authorization → settlement → receipt
                    lifecycle with full auditability.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#4F7CFF]/10 p-3 rounded-xl">
                  <Lock className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Encrypted Conditional Execution (BITE v2)
                  </h3>
                  <p className="text-slate-400">
                    Sensitive payment conditions remain encrypted until criteria
                    are satisfied.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#4F7CFF]/10 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Spend Caps & Guardrails
                  </h3>
                  <p className="text-slate-400">
                    Daily limits, per-task budgets, allowlists, and optional human
                    approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#4F7CFF]/10 p-3 rounded-xl">
                  <Code className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Deterministic Workflow Engine
                  </h3>
                  <p className="text-slate-400">
                    Structured, traceable, and failure-aware execution — not
                    black-box AI behavior.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#4F7CFF]/10 p-3 rounded-xl">
                  <Activity className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Full Audit Logs & Receipts
                  </h3>
                  <p className="text-slate-400">
                    Every payment includes reason codes, settlement records, and
                    transaction history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DEMO PREVIEW SECTION */}
      <section className="py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See the Agent in Action
            </h2>
            <p className="text-xl text-slate-400">
              Real-time execution with cost reasoning
            </p>
          </div>

          {/* Large UI Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4F7CFF]/10 to-[#7B61FF]/10 blur-3xl"></div>
            <div className="relative bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex">
                {/* Mock Sidebar */}
                <div className="hidden md:block w-64 bg-slate-950 border-r border-slate-800 p-6">
                  <div className="space-y-2">
                    <div className="px-4 py-2 bg-slate-900 rounded-lg text-sm font-medium">
                      Dashboard
                    </div>
                    <div className="px-4 py-2 text-slate-400 rounded-lg text-sm">
                      Active Jobs
                    </div>
                    <div className="px-4 py-2 text-slate-400 rounded-lg text-sm">
                      Receipts
                    </div>
                    <div className="px-4 py-2 text-slate-400 rounded-lg text-sm">
                      Policies
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 md:p-8">
                  {/* Budget Card */}
                  <div className="bg-gradient-to-br from-[#4F7CFF]/10 to-[#7B61FF]/10 border border-[#4F7CFF]/30 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-slate-400">
                        Budget Overview
                      </div>
                      <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400">
                        Active
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">$12.45 / $50.00</div>
                    <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] h-2 rounded-full w-1/4"></div>
                    </div>
                    <div className="text-sm text-slate-400">25% utilized</div>
                  </div>

                  {/* Execution Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-semibold mb-4">Live Execution Timeline</h3>

                    <div className="relative pl-8 pb-8 border-l-2 border-slate-800">
                      <div className="absolute left-0 top-0 w-4 h-4 bg-[#4F7CFF] rounded-full -translate-x-[9px]"></div>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">HTTP 402 received</span>
                          <span className="text-xs text-slate-500">
                            2 mins ago
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          Tool "DataAnalyzer" requires $2.50 payment
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8 pb-8 border-l-2 border-slate-800">
                      <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full -translate-x-[9px]"></div>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Payment signed</span>
                          <span className="text-xs text-slate-500">
                            1 min ago
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          Transaction: 0xf4a2...8bc6 via CDP Wallet
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8 pb-8 border-l-2 border-slate-800">
                      <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full -translate-x-[9px]"></div>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Retry successful</span>
                          <span className="text-xs text-slate-500">
                            30 sec ago
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          API request completed with payment proof
                        </div>
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute left-0 top-0 w-4 h-4 bg-purple-500 rounded-full -translate-x-[9px]"></div>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Settlement complete</span>
                          <span className="text-xs text-slate-500">Just now</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          AP2 receipt verified and stored
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-slate-400">
            Real-time agent execution with cost reasoning and policy enforcement.
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section id="tech-stack" className="py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powered by Modern Agent Infrastructure
            </h2>
            <p className="text-xl text-slate-400">
              Built with cutting-edge Web3 and AI technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "SKALE",
              "x402",
              "AP2",
              "BITE v2",
              "CDP Wallet",
              "Google Cloud",
              "Node.js",
              "Next.js",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 text-center hover:border-[#4F7CFF]/50 transition-colors"
              >
                <div className="text-lg font-semibold text-white">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-32 bg-gradient-to-br from-[#4F7CFF]/10 via-transparent to-[#7B61FF]/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Launch Your Autonomous Agent?
          </h2>
          <p className="text-xl text-slate-400 mb-12">
            Deploy production-ready agentic commerce workflows with secure
            programmable payments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Launch Agent
            </button>
            <button className="px-8 py-4 border border-slate-700 rounded-lg font-semibold text-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all cursor-pointer flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              View GitHub
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Column 1 - Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#4F7CFF] to-[#7B61FF] p-2 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ProcuraAI</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                ProcuraAI is a secure agentic commerce platform built for the
                Internet of Agents.
              </p>
            </div>

            {/* Column 2 - Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors cursor-pointer">
                    Security
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors cursor-pointer">
                    Documentation
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Developers */}
            <div>
              <h4 className="font-semibold mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button className="hover:text-white transition-colors cursor-pointer">
                    GitHub
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors cursor-pointer">
                    API Docs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/execution/demo-001")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Demo
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4 - Hackathon */}
            <div>
              <h4 className="font-semibold mb-4">Hackathon</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Built for SKALE</li>
                <li>Agentic Commerce</li>
                <li>x402 Hackathon</li>
                <li>
                  <button className="hover:text-white transition-colors cursor-pointer">
                    Submission Repo
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors cursor-pointer">
                    Demo Video
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © 2026 ProcuraAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}