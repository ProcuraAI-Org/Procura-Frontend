import { Copy, Check, ArrowDown } from "lucide-react";
import { useState } from "react";
import { LogEvent } from "./LogStream";

interface EventInspectorProps {
  event: LogEvent | null;
}

export function EventInspector({ event }: EventInspectorProps) {
  const [copied, setCopied] = useState(false);

  const copyJSON = () => {
    if (!event) return;
    const json = JSON.stringify(event.details, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!event) {
    return (
      <div className="backdrop-blur-xl bg-slate-950/80 border border-slate-800/50 rounded-xl p-8 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-bold text-slate-400 mb-2">
            No Event Selected
          </h3>
          <p className="text-sm text-slate-500">
            Click on a log entry to view details
          </p>
        </div>
      </div>
    );
  }

  const renderHTTP402Details = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Service</div>
          <div className="text-sm text-white font-mono">
            {event.details.service}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Response Code</div>
          <div className="text-sm text-amber-300 font-mono font-bold">
            {event.details.responseCode}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-500 mb-1">Endpoint</div>
        <div className="text-sm text-blue-400 font-mono break-all">
          {event.details.endpoint}
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-500 mb-1">Required Payment</div>
        <div className="text-lg text-white font-mono font-bold">
          ${event.details.requiredPayment}
        </div>
      </div>

      {event.details.rawResponse && (
        <div>
          <div className="text-xs text-slate-500 mb-2">Raw Response</div>
          <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-x-auto">
            {JSON.stringify(event.details.rawResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-slate-500 mb-1">Wallet Address</div>
        <div className="text-sm text-blue-400 font-mono break-all">
          {event.details.walletAddress}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Amount</div>
          <div className="text-lg text-white font-mono font-bold">
            ${event.details.amount}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Network</div>
          <div className="text-sm text-white font-mono">{event.details.network}</div>
        </div>
      </div>

      {event.details.transactionHash && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
          <div className="text-sm text-blue-400 font-mono break-all">
            {event.details.transactionHash}
          </div>
        </div>
      )}

      {event.details.signedPayload && (
        <div>
          <div className="text-xs text-slate-500 mb-2">Signed Payload</div>
          <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-x-auto">
            {JSON.stringify(event.details.signedPayload, null, 2)}
          </pre>
        </div>
      )}

      {event.details.status && (
        <div className="flex items-center gap-2 text-sm text-green-300">
          <Check className="w-4 h-4" />
          <span>Status: {event.details.status}</span>
        </div>
      )}
    </div>
  );

  const renderAP2Details = () => (
    <div className="space-y-4">
      {event.details.intentId && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Intent ID</div>
          <div className="text-sm text-white font-mono">{event.details.intentId}</div>
        </div>
      )}

      {event.details.authorizationId && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Authorization ID</div>
          <div className="text-sm text-white font-mono">
            {event.details.authorizationId}
          </div>
        </div>
      )}

      {event.details.policyChecks && (
        <div>
          <div className="text-xs text-slate-500 mb-2">Policy Checks</div>
          <div className="space-y-1.5">
            {Object.entries(event.details.policyChecks).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-xs text-slate-300">
                <Check
                  className={`w-3 h-3 ${
                    value ? "text-green-400" : "text-red-400"
                  }`}
                />
                <span>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {event.details.lifecycle && (
        <div>
          <div className="text-xs text-slate-500 mb-3">AP2 Lifecycle</div>
          <div className="space-y-2">
            {event.details.lifecycle.map((stage: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    stage.completed
                      ? "bg-green-500/20 text-green-300 border border-green-500/40"
                      : "bg-slate-700/50 text-slate-500 border border-slate-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{stage.name}</div>
                  {stage.timestamp && (
                    <div className="text-xs text-slate-500 font-mono">
                      {stage.timestamp}
                    </div>
                  )}
                </div>
                {stage.completed && <Check className="w-4 h-4 text-green-400" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderConditionDetails = () => (
    <div className="space-y-4">
      {event.details.conditionType && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Condition Type</div>
          <div className="text-sm text-white">{event.details.conditionType}</div>
        </div>
      )}

      {event.details.result && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Result</div>
          <div className="text-sm text-green-300">
            {event.details.result} ✔
          </div>
        </div>
      )}

      {event.details.encrypted !== undefined && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Encryption Status</div>
          <div className="text-sm text-purple-300">
            {event.details.encrypted ? "Decrypted at verification" : "Not encrypted"}
          </div>
        </div>
      )}
    </div>
  );

  const renderErrorDetails = () => (
    <div className="space-y-4">
      {event.details.errorType && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Error Type</div>
          <div className="text-sm text-red-300 font-mono">
            {event.details.errorType}
          </div>
        </div>
      )}

      {event.details.requested !== undefined && event.details.allowed !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Requested</div>
            <div className="text-sm text-red-300 font-mono font-bold">
              ${event.details.requested}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Allowed</div>
            <div className="text-sm text-green-300 font-mono font-bold">
              ${event.details.allowed}
            </div>
          </div>
        </div>
      )}

      {event.details.action && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Action Taken</div>
          <div className="text-sm text-amber-300">{event.details.action}</div>
        </div>
      )}

      {event.details.reason && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Reason</div>
          <div className="text-sm text-slate-300">{event.details.reason}</div>
        </div>
      )}
    </div>
  );

  const renderSettlementDetails = () => (
    <div className="space-y-4">
      {event.details.settlementId && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Settlement ID</div>
          <div className="text-sm text-white font-mono">
            {event.details.settlementId}
          </div>
        </div>
      )}

      {event.details.amount !== undefined && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Amount</div>
          <div className="text-lg text-white font-mono font-bold">
            ${event.details.amount}
          </div>
        </div>
      )}

      {event.details.receiptGenerated !== undefined && (
        <div className="flex items-center gap-2 text-sm text-green-300">
          <Check className="w-4 h-4" />
          <span>Receipt Generated: {event.details.receiptGenerated ? "Yes" : "No"}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Details Card */}
      <div className="backdrop-blur-xl bg-slate-950/80 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-xl font-bold text-white">Event Details</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Common Fields */}
          <div>
            <div className="text-xs text-slate-500 mb-1">Event ID</div>
            <div className="text-sm text-white font-mono">{event.id}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Event Type</div>
              <div className="text-sm text-blue-400 font-mono">{event.eventType}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Timestamp</div>
              <div className="text-sm text-white font-mono">{event.timestamp}</div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            {/* Type-Specific Details */}
            {event.eventCategory === "http" && renderHTTP402Details()}
            {event.eventCategory === "payment" && renderPaymentDetails()}
            {event.eventCategory === "ap2" && renderAP2Details()}
            {event.eventCategory === "condition" && renderConditionDetails()}
            {event.eventCategory === "error" && renderErrorDetails()}
            {event.eventCategory === "settlement" && renderSettlementDetails()}
          </div>

          {/* Copy JSON Button */}
          <div className="border-t border-slate-800 pt-4">
            <button
              onClick={copyJSON}
              className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors font-mono"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Raw JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
