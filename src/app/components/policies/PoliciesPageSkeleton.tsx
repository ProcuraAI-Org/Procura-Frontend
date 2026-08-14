import { Skeleton } from "../ui/skeleton";

const sk = "bg-slate-700/60 animate-pulse rounded";

export function PoliciesPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <Skeleton className={`h-9 w-80 mb-2 ${sk}`} />
            <Skeleton className={`h-5 w-full max-w-md ${sk}`} />
          </div>
          <div className="flex gap-3">
            <Skeleton className={`h-10 w-36 ${sk}`} />
            <Skeleton className={`h-10 w-32 ${sk}`} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
        {/* Left: Policy sections */}
        <div className="space-y-6 lg:space-y-8">
          {/* 1. Spend Control */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-7 w-40 mb-6 ${sk}`} />
            <div className="space-y-5">
              <div>
                <Skeleton className={`h-4 w-28 mb-2 ${sk}`} />
                <Skeleton className={`h-11 w-full ${sk}`} />
              </div>
              <div>
                <Skeleton className={`h-4 w-36 mb-2 ${sk}`} />
                <Skeleton className={`h-11 w-full ${sk}`} />
              </div>
              <div>
                <Skeleton className={`h-4 w-32 mb-2 ${sk}`} />
                <Skeleton className={`h-11 w-full ${sk}`} />
              </div>
              <Skeleton className={`h-3 w-full rounded-full ${sk}`} />
            </div>
          </div>

          {/* 2. Tool Access */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-7 w-44 mb-6 ${sk}`} />
            <div className="space-y-4">
              <Skeleton className={`h-4 w-24 ${sk}`} />
              <div className="flex flex-wrap gap-2">
                <Skeleton className={`h-8 w-20 ${sk}`} />
                <Skeleton className={`h-8 w-24 ${sk}`} />
                <Skeleton className={`h-8 w-22 ${sk}`} />
              </div>
              <Skeleton className={`h-4 w-24 ${sk}`} />
              <div className="flex flex-wrap gap-2">
                <Skeleton className={`h-8 w-28 ${sk}`} />
                <Skeleton className={`h-8 w-24 ${sk}`} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className={`h-4 w-32 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
            </div>
          </div>

          {/* 3. Authorization */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-7 w-52 mb-6 ${sk}`} />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className={`h-4 w-40 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
              <Skeleton className={`h-4 w-28 mb-2 ${sk}`} />
              <Skeleton className={`h-10 w-full ${sk}`} />
              <Skeleton className={`h-4 w-36 mb-2 ${sk}`} />
              <Skeleton className={`h-10 w-24 ${sk}`} />
            </div>
          </div>

          {/* 4. Slippage */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-7 w-48 mb-6 ${sk}`} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className={`h-4 w-24 mb-2 ${sk}`} />
                <Skeleton className={`h-10 w-full ${sk}`} />
              </div>
              <div>
                <Skeleton className={`h-4 w-20 mb-2 ${sk}`} />
                <Skeleton className={`h-10 w-full ${sk}`} />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <Skeleton className={`h-4 w-28 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <Skeleton className={`h-4 w-32 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
            </div>
          </div>

          {/* 5. Privacy */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-7 w-40 mb-6 ${sk}`} />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className={`h-4 w-32 ${sk}`} />
                  <Skeleton className={`h-6 w-12 rounded ${sk}`} />
                </div>
              ))}
            </div>
          </div>

          {/* 6. Execution Safety */}
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
            <Skeleton className={`h-7 w-44 mb-6 ${sk}`} />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className={`h-4 w-40 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className={`h-4 w-36 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className={`h-4 w-40 ${sk}`} />
                <Skeleton className={`h-6 w-12 rounded ${sk}`} />
              </div>
              <div>
                <Skeleton className={`h-4 w-28 mb-2 ${sk}`} />
                <Skeleton className={`h-10 w-16 ${sk}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Risk Summary */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl lg:sticky lg:top-8">
            <Skeleton className={`h-7 w-36 mb-6 ${sk}`} />
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className={`h-4 w-24 ${sk}`} />
                <Skeleton className={`h-4 w-16 ${sk}`} />
              </div>
              <div className="flex justify-between">
                <Skeleton className={`h-4 w-28 ${sk}`} />
                <Skeleton className={`h-4 w-12 ${sk}`} />
              </div>
              <div className="flex justify-between">
                <Skeleton className={`h-4 w-32 ${sk}`} />
                <Skeleton className={`h-4 w-8 ${sk}`} />
              </div>
              <div className="flex justify-between">
                <Skeleton className={`h-4 w-28 ${sk}`} />
                <Skeleton className={`h-4 w-16 ${sk}`} />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Skeleton className={`h-4 w-28 mb-2 ${sk}`} />
                <Skeleton className={`h-6 w-20 rounded ${sk}`} />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Skeleton className={`h-4 w-24 mb-2 ${sk}`} />
                <Skeleton className={`h-4 w-32 ${sk}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
