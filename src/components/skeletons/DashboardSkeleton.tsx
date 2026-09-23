import React from 'react'

export const MetricCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-xs space-y-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="h-3 w-28 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export const ClassCardsSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="space-y-2 flex-1 max-w-sm">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded-md w-1/2" />
            </div>
          </div>
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export const AnnouncementsSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
          </div>
          <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/60 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export const DoubtsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
          </div>
          <div className="h-4 w-3/5 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/60 rounded-md" />
          <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export const FullTabSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-3.5 w-72 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
        </div>
        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
      <MetricCardsSkeleton />
      <ClassCardsSkeleton />
    </div>
  )
}
