import { Check, Info } from "lucide-react";

interface NetworkSettingsProps {
  activeNetwork: string;
  onNetworkChange: (network: string) => void;
  networkStatus: "connected" | "disconnected";
  gaslessEnabled: boolean;
}

export function NetworkSettings({
  activeNetwork,
  onNetworkChange,
  networkStatus,
  gaslessEnabled,
}: NetworkSettingsProps) {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">2. Network</h2>

      <div className="space-y-5">
        {/* Active Network */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Active Network
          </label>
          <select
            value={activeNetwork}
            onChange={(e) => onNetworkChange(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="not-connected">Not connected</option>
            <option value="skale-base-sepolia">SKALE Base Sepolia</option>
            <option value="skale-mainnet">SKALE Mainnet</option>
            <option value="skale-testnet">SKALE Testnet</option>
            <option value="local">Local Development</option>
          </select>
        </div>

        {/* Network Status */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Network Status
          </label>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                networkStatus === "connected" ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                networkStatus === "connected" ? "text-green-300" : "text-red-300"
              }`}
            >
              {networkStatus === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Gas Model */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gas Model
          </label>
          <div className="flex items-center gap-2">
            {gaslessEnabled && <Check className="w-4 h-4 text-green-400" />}
            <span className="text-sm text-white">
              Gasless Execution {gaslessEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {/* Info Note */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-500">
              Network affects settlement and payment execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}