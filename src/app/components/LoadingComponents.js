'use client'

function LoadingSkeleton({ className = '', children }) {
  return (
    <div className={`animate-pulse bg-surface-200 dark:bg-surface-300 rounded ${className}`}>
      {children}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden h-full flex flex-col">
      <LoadingSkeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-3 w-1/2" />
          <LoadingSkeleton className="h-6 w-1/3" />
        </div>
        <LoadingSkeleton className="h-10 w-full mt-auto" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
      {[...Array(8)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
