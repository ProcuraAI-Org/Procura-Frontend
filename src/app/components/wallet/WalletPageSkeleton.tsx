import { Skeleton } from "../ui/skeleton";

const sk = "bg-slate-700/60 animate-pulse rounded";

export function WalletPageSkeleton() {
  return (
    <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
      {/* Left Column */}
      <div className="space-y-6 lg:space-y-8">
        {/* Wallet Overview skeleton */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
          <Skeleton className={`h-8 w-48 mb-6 ${sk}`} />
          <div className="space-y-6">
            <div>
              <Skeleton className={`h-4 w-24 mb-2 ${sk}`} />
              <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                <Skeleton className={`h-4 flex-1 max-w-[280px] ${sk}`} />
                <Skeleton className={`h-8 w-8 rounded ${sk}`} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                <Skeleton className={`h-4 w-28 mb-2 ${sk}`} />
                <Skeleton className={`h-10 w-24 mb-1 ${sk}`} />
                <Skeleton className={`h-4 w-12 ${sk}`} />
              </div>
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                <Skeleton className={`h-4 w-36 mb-2 ${sk}`} />
                <Skeleton className={`h-10 w-24 mb-1 ${sk}`} />
                <Skeleton className={`h-4 w-20 ${sk}`} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                <Skeleton className={`h-4 w-20 mb-1 ${sk}`} />
                <Skeleton className={`h-8 w-16 ${sk}`} />
              </div>
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                <Skeleton className={`h-4 w-32 mb-1 ${sk}`} />
                <Skeleton className={`h-8 w-16 ${sk}`} />
              </div>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between mb-4">
                <Skeleton className={`h-4 w-36 ${sk}`} />
                <Skeleton className={`h-6 w-14 rounded-full ${sk}`} />
              </div>
              <Skeleton className={`h-14 w-full rounded-lg ${sk}`} />
              <div className="flex justify-between mt-2">
                <Skeleton className={`h-3 w-14 ${sk}`} />
                <Skeleton className={`h-3 w-8 ${sk}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History skeleton */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl">
          <Skeleton className={`h-7 w-44 mb-6 ${sk}`} />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className={`h-4 w-20 ${sk}`} />
                  <Skeleton className={`h-4 w-24 ${sk}`} />
                  <Skeleton className={`h-4 w-16 ${sk}`} />
                  <Skeleton className={`h-4 w-12 ${sk}`} />
                  <Skeleton className={`h-5 w-16 rounded ${sk}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Authorizations skeleton */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
          <Skeleton className={`h-8 w-56 mb-6 ${sk}`} />
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-8 text-center">
            <Skeleton className={`h-4 w-40 mx-auto mb-2 ${sk}`} />
            <Skeleton className={`h-4 w-64 mx-auto ${sk}`} />
          </div>
        </div>

        {/* Payment Method skeleton */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 shadow-xl">
          <Skeleton className={`h-8 w-40 mb-6 ${sk}`} />
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className={`h-10 w-10 rounded-lg flex-shrink-0 ${sk}`} />
              <div className="flex-1">
                <Skeleton className={`h-4 w-28 mb-1 ${sk}`} />
                <Skeleton className={`h-5 w-40 ${sk}`} />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Skeleton className={`h-10 w-10 rounded-lg flex-shrink-0 ${sk}`} />
              <div className="flex-1">
                <Skeleton className={`h-4 w-24 mb-1 ${sk}`} />
                <Skeleton className={`h-5 w-44 ${sk}`} />
              </div>
            </div>
            <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className={`h-4 w-28 ${sk}`} />
                  <Skeleton className={`h-4 w-24 ${sk}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6 lg:space-y-8">
        <div className="lg:sticky lg:top-8 space-y-6 lg:space-y-8">
          {/* Spend Guardrails skeleton */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className={`h-5 w-5 rounded ${sk}`} />
              <Skeleton className={`h-6 w-40 ${sk}`} />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Skeleton className={`h-4 w-24 ${sk}`} />
                  <Skeleton className={`h-4 w-12 ${sk}`} />
                </div>
                <div className="flex justify-between mb-2">
                  <Skeleton className={`h-4 w-20 ${sk}`} />
                  <Skeleton className={`h-4 w-12 ${sk}`} />
                </div>
                <Skeleton className={`h-3 w-full rounded-full ${sk}`} />
              </div>
              <div className="border-t border-slate-800" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className={`h-4 w-24 ${sk}`} />
                  <Skeleton className={`h-4 w-12 ${sk}`} />
                </div>
                <div className="flex justify-between">
                  <Skeleton className={`h-4 w-20 ${sk}`} />
                  <Skeleton className={`h-4 w-12 ${sk}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Security Status skeleton */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-6 w-44 mb-6 ${sk}`} />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className={`h-5 w-5 rounded ${sk}`} />
                  <Skeleton className={`h-4 w-40 ${sk}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
