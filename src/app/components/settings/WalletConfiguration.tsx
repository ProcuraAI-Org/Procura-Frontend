import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface WalletConfigurationProps {
  walletProvider: string;
  onWalletProviderChange: (provider: string) => void;
  walletAddress: string;
  walletStatus: "connected" | "disconnected";
  onDisconnect: () => void;
}

export function WalletConfiguration({
  walletProvider,
  onWalletProviderChange,
  walletAddress,
  walletStatus,
  onDisconnect,
}: WalletConfigurationProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">
        1. Wallet Configuration
      </h2>

      <div className="space-y-5">
        {/* Wallet Provider */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Wallet Provider
          </label>
          <select
            value={walletProvider}
            onChange={(e) => onWalletProviderChange(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="cdp">Coinbase CDP Wallet</option>
            <option value="external">External Wallet (future)</option>
          </select>
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Wallet Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={walletAddress}
              readOnly
              className="w-full px-4 py-2.5 pr-12 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-400 font-mono text-sm cursor-not-allowed"
            />
            <button
              onClick={copyAddress}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Wallet Status */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Wallet Status
          </label>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                walletStatus === "connected" ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                walletStatus === "connected" ? "text-green-300" : "text-red-300"
              }`}
            >
              {walletStatus === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Disconnect Button */}
        <div className="pt-2">
          <button
            onClick={onDisconnect}
            disabled={walletStatus === "disconnected"}
            className="px-5 py-2.5 border-2 border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disconnect Wallet
          </button>
        </div>

        {/* Helper Text */}
        <div className="pt-2 border-t border-slate-800">
          <p className="text-sm text-slate-500">
            Wallet is used to sign x402 payments and AP2 settlements.
          </p>
        </div>
      </div>
    </div>
  );
}