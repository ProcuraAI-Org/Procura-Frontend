import { Skeleton } from "../ui/skeleton";

const sk = "bg-slate-700/60 animate-pulse rounded";

export function DashboardPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header placeholder */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <Skeleton className={`h-9 w-64 mb-2 ${sk}`} />
          <Skeleton className={`h-4 w-80 ${sk}`} />
        </div>
        <div className="flex gap-3">
          <Skeleton className={`h-12 w-32 ${sk}`} />
          <Skeleton className={`h-12 w-40 ${sk}`} />
        </div>
      </div>

      {/* Stat cards - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl"
          >
            <Skeleton className={`h-4 w-24 mb-3 ${sk}`} />
            <Skeleton className={`h-8 w-20 mb-2 ${sk}`} />
            <Skeleton className={`h-4 w-28 ${sk}`} />
          </div>
        ))}
      </div>

      {/* Agent Status block */}
      <div className="mb-6 lg:mb-8 backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <Skeleton className={`h-6 w-36 mb-4 ${sk}`} />
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className={`h-10 w-10 rounded-lg ${sk}`} />
          <Skeleton className={`h-5 w-48 ${sk}`} />
          <Skeleton className={`h-6 w-20 rounded-full ${sk}`} />
        </div>
      </div>

      {/* Two columns: Recent Activity | Spend + Policy */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6 lg:mb-8 lg:items-stretch">
        <div className="flex flex-col min-h-0">
          <Skeleton className={`h-7 w-40 mb-4 ${sk}`} />
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl flex-1 min-h-[280px]">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className={`h-10 w-10 rounded-lg flex-shrink-0 ${sk}`} />
                  <div className="flex-1 space-y-2">
                    <Skeleton className={`h-4 w-full max-w-[200px] ${sk}`} />
                    <Skeleton className={`h-3 w-3/4 ${sk}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className={`h-7 w-36 mb-4 ${sk}`} />
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl h-64">
              <Skeleton className={`h-full w-full rounded-lg ${sk}`} />
            </div>
          </div>
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 shadow-xl">
            <Skeleton className={`h-5 w-44 mb-3 ${sk}`} />
            <div className="flex items-center gap-3">
              <Skeleton className={`h-8 w-8 rounded ${sk}`} />
              <Skeleton className={`h-4 w-56 ${sk}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
