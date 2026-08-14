import { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { Droplet, ExternalLink, Loader2, CheckCircle, XCircle } from "lucide-react";
import { getUsdcFaucetStatus, mintUsdcFromFaucet, type FaucetStatusResponse } from "../api/client";

export default function Faucet() {
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<FaucetStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const handleCheck = async () => {
    setError(null);
    setLastTxHash(null);
    setLoading(true);
    try {
      const s = await getUsdcFaucetStatus(address.trim());
      setStatus(s);
    } catch (e) {
      setStatus(null);
      setError(e instanceof Error ? e.message : "Status failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    setError(null);
    setLastTxHash(null);
    setMinting(true);
    try {
      const r = await mintUsdcFromFaucet(address.trim());
      setLastTxHash(r.txHash);
      const s = await getUsdcFaucetStatus(address.trim());
      setStatus(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mint failed");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <Droplet className="w-5 h-5 text-blue-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">USDC Faucet</h1>
            </div>
            <p className="text-slate-400">
              Get test USDC for SKALE Base Sepolia (our deployed MockUSDC) once per 24 hours per address.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Wallet address</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleCheck}
                disabled={loading || minting}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking…
                  </span>
                ) : (
                  "Check"
                )}
              </button>
              <button
                onClick={handleMint}
                disabled={minting || loading || !status?.canMint}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {minting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Minting…
                  </span>
                ) : (
                  "Mint USDC"
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-950/40 border border-red-900 text-red-200">
                <XCircle className="w-5 h-5 mt-0.5" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            {lastTxHash && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-900 text-emerald-200">
                <CheckCircle className="w-5 h-5 mt-0.5" />
                <div className="text-sm">
                  Mint successful. Tx hash: <span className="font-mono break-all">{lastTxHash}</span>
                </div>
              </div>
            )}

            {status && (
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Token</div>
                  <div className="text-sm text-white font-mono break-all">{status.token}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Balance (raw units)</div>
                  <div className="text-sm text-white font-mono break-all">{status.balance}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Can mint now</div>
                  <div className="text-sm text-white">{status.canMint ? "Yes" : "No"}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Next available</div>
                  <div className="text-sm text-white">{status.nextAvailableAt ?? "Now"}</div>
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-slate-400">
              Need gas (CREDIT)? Use the SKALE faucet:{" "}
              <a
                href="https://base-sepolia-faucet.skale.space"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 underline"
              >
                base-sepolia-faucet.skale.space <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}

