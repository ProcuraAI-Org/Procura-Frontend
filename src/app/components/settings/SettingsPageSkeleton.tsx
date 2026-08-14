import { Skeleton } from "../ui/skeleton";

const sk = "bg-slate-700/60 animate-pulse rounded";

export function SettingsPageSkeleton() {
  return (
    <div className="max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <Skeleton className={`h-9 w-32 mb-2 ${sk}`} />
            <Skeleton className={`h-5 w-full max-w-md ${sk}`} />
          </div>
          <div className="flex gap-3">
            <Skeleton className={`h-10 w-36 ${sk}`} />
            <Skeleton className={`h-10 w-32 ${sk}`} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[70%_30%] gap-6 lg:gap-8">
        {/* Left: Settings sections */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl"
            >
              <Skeleton className={`h-7 w-48 mb-6 ${sk}`} />
              <div className="space-y-4">
                <Skeleton className={`h-4 w-32 mb-2 ${sk}`} />
                <Skeleton className={`h-11 w-full ${sk}`} />
                <Skeleton className={`h-4 w-28 mb-2 ${sk}`} />
                <Skeleton className={`h-11 max-w-md ${sk}`} />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className={`h-4 w-40 ${sk}`} />
                  <Skeleton className={`h-6 w-12 rounded ${sk}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: System Status */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl shadow-xl overflow-hidden lg:sticky lg:top-8">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
              <Skeleton className={`h-7 w-36 ${sk}`} />
            </div>
            <div className="p-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className={`h-4 w-24 ${sk}`} />
                  <Skeleton className={`h-4 w-20 ${sk}`} />
                </div>
              ))}
              <div className="pt-4 border-t border-slate-800">
                <Skeleton className={`h-4 w-24 mb-2 ${sk}`} />
                <Skeleton className={`h-6 w-16 rounded ${sk}`} />
              </div>
              <div className="pt-4 border-t border-slate-800">
                <Skeleton className={`h-3 w-40 mb-1 ${sk}`} />
                <Skeleton className={`h-4 w-28 ${sk}`} />
              </div>
              <div className="pt-4 border-t border-slate-800">
                <Skeleton className={`h-10 w-full rounded-lg ${sk}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
