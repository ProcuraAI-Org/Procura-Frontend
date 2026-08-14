import { Lock, Info } from "lucide-react";

interface PrivacyProps {
  encryptIntent: boolean;
  encryptBudget: boolean;
  encryptTools: boolean;
  encryptConditions: boolean;
  onToggle: (field: string) => void;
}

export function PrivacySection({
  encryptIntent,
  encryptBudget,
  encryptTools,
  encryptConditions,
  onToggle,
}: PrivacyProps) {
  const isAnyEnabled =
    encryptIntent || encryptBudget || encryptTools || encryptConditions;

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          5. Privacy & Encryption Controls
        </h2>
        {isAnyEnabled && (
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium rounded-full flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Encryption Mode: Enabled
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Enable Encrypted Intent by Default */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Enable Encrypted Intent by Default
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Hide task description until authorization
            </div>
          </div>
          <button
            onClick={() => onToggle("encryptIntent")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              encryptIntent ? "bg-purple-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                encryptIntent ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Encrypt Budget Values */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Encrypt Budget Values
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Keep spending limits private until execution
            </div>
          </div>
          <button
            onClick={() => onToggle("encryptBudget")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              encryptBudget ? "bg-purple-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                encryptBudget ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Encrypt Tool Selection */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Encrypt Tool Selection
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Conceal which APIs will be used
            </div>
          </div>
          <button
            onClick={() => onToggle("encryptTools")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              encryptTools ? "bg-purple-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                encryptTools ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Encrypt SLA Conditions */}
        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-700 rounded-lg p-4">
          <div>
            <div className="text-sm font-medium text-white">
              Encrypt SLA Conditions
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Hide execution conditions until verified
            </div>
          </div>
          <button
            onClick={() => onToggle("encryptConditions")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              encryptConditions ? "bg-purple-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                encryptConditions ? "translate-x-7" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {/* Information Panel */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-medium text-purple-300">
              What remains encrypted until settlement?
            </div>
          </div>
          <ul className="text-xs text-purple-200/80 space-y-1 ml-6 list-disc">
            <li>Budget limits</li>
            <li>Tool choices</li>
            <li>Conditional triggers</li>
          </ul>

          <div className="flex items-start gap-2 mt-4 mb-3">
            <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-medium text-purple-300">
              What triggers decryption?
            </div>
          </div>
          <ul className="text-xs text-purple-200/80 space-y-1 ml-6 list-disc">
            <li>Condition satisfied</li>
            <li>Authorization approval</li>
            <li>Settlement execution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
