"use client";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-mint-200 dark:bg-mint-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-mint-200 dark:bg-mint-800" />
          <div className="h-6 w-32 rounded bg-mint-200 dark:bg-mint-800" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-white dark:bg-mint-800 p-4 shadow-mint">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-mint-200 dark:bg-mint-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-mint-200 dark:bg-mint-800" />
              <div className="h-3 w-24 rounded bg-mint-200 dark:bg-mint-800" />
            </div>
            <div className="h-5 w-16 rounded bg-mint-200 dark:bg-mint-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
