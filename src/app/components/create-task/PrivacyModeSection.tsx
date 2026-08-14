import { TaskFormData } from "../../pages/CreateTask";
import { ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";
import { useState } from "react";

interface PrivacyModeSectionProps {
  formData: TaskFormData;
  updateFormData: (updates: Partial<TaskFormData>) => void;
}

export function PrivacyModeSection({
  formData,
  updateFormData,
}: PrivacyModeSectionProps) {
  const [expandedInfo, setExpandedInfo] = useState(false);

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border-2 border-purple-500/30 rounded-xl p-6 sm:p-8 shadow-xl shadow-purple-500/10">
      <h2 className="text-2xl font-bold text-white mb-6">
        6. Privacy & Encryption
      </h2>

      <div className="space-y-6">
        {/* Enable Encryption Toggle */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <label className="block text-base font-semibold text-white mb-2">
              Enable Encrypted Intent (BITE v2)
            </label>
            <p className="text-sm text-slate-400 leading-relaxed">
              Budget limits, selected tools, and execution conditions remain
              encrypted until settlement.
            </p>
          </div>
          <button
            onClick={() =>
              updateFormData({ encryptionEnabled: !formData.encryptionEnabled })
            }
            className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors cursor-pointer mt-1 ${
              formData.encryptionEnabled ? "bg-purple-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                formData.encryptionEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Expandable Info Panel */}
        <div className="bg-slate-950/50 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedInfo(!expandedInfo)}
            className="w-full px-5 py-4 flex items-center justify-between text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">
              What information is protected?
            </span>
            {expandedInfo ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedInfo && (
            <div className="px-5 pb-5 pt-2 space-y-4">
              <div>
                <div className="text-sm font-medium text-green-400 mb-2">
                  What stays private:
                </div>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Budget limits
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Tool selection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    SLA conditions
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-medium text-blue-400 mb-2">
                  What triggers decryption:
                </div>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Successful condition verification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Authorization approval
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg ${
            formData.encryptionEnabled
              ? "bg-purple-500/20 border border-purple-500/30"
              : "bg-slate-700/20 border border-slate-600/30"
          }`}
        >
          {formData.encryptionEnabled ? (
            <Lock className="w-4 h-4 text-purple-400" />
          ) : (
            <Unlock className="w-4 h-4 text-slate-400" />
          )}
          <span
            className={`text-sm font-medium ${
              formData.encryptionEnabled ? "text-purple-300" : "text-slate-400"
            }`}
          >
            Encryption: {formData.encryptionEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}