import { Wallet, Shield, Lock } from "lucide-react";

interface PaymentMethodDetailsProps {
  /** Connected wallet address (from Web3); when set, shows connected state. */
  connectedAddress?: string | null;
  /** Network name (e.g. SKALE Base Sepolia). */
  networkName?: string | null;
}

export function PaymentMethodDetails({ connectedAddress, networkName }: PaymentMethodDetailsProps = {}) {
  const isConnected = Boolean(connectedAddress);

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-400 mb-1">Wallet Provider</div>
            <div className="text-base font-semibold text-white">
              {isConnected ? "Connected (CDP / MetaMask / Rabby)" : "Coinbase CDP Wallet"}
            </div>
            {isConnected && connectedAddress && (
              <div className="text-xs text-slate-500 font-mono mt-1 truncate">
                {connectedAddress.slice(0, 6)}…{connectedAddress.slice(-4)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-400 mb-1">Signing Mode</div>
            <div className="text-base font-semibold text-white">
              {isConnected ? (networkName ? `Connected • ${networkName}` : "Connected") : "Server-hosted secure signer"}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Payment Protocol</span>
            <span className="text-white font-medium">x402 Compatible</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Settlement Protocol</span>
            <span className="text-white font-medium">AP2 Integrated</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Encryption</span>
            <span className="text-purple-400 font-medium flex items-center gap-2">
              <Lock className="w-3 h-3" />
              BITE v2 Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
