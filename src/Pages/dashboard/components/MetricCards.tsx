import React from 'react'
import { Award, CheckCircle2, TrendingUp } from 'lucide-react'

interface MetricCardsProps {
  totalAttendance: string | null
  testsTaken?: number
  rank?: string
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalAttendance,
  testsTaken = 14,
  rank = '#3'
}) => {
  const formatAttendance = (val: string | null) => {
    if (val === null || val === undefined) return '92.4%'
    const num = parseFloat(val)
    if (isNaN(num)) return `${val}%`
    return Number.isInteger(num) ? `${num}%` : `${num.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      {/* 1. Attendance Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-lg border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between card-hover-lift group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Attendance Rate
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">
            {formatAttendance(totalAttendance)}
          </span>
          <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span>Top 5% of batch</span>
          </p>
        </div>
      </div>

      {/* 2. Tests Taken Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-lg border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between card-hover-lift group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Evaluations
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/60">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">
            {testsTaken}
          </span>
          <p className="text-[10px] sm:text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1">
            <span>+2 this month</span>
          </p>
        </div>
      </div>

      {/* 3. All India Rank Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-lg border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between card-hover-lift group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Rank
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800/60">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">
            {rank}
          </span>
          <p className="text-[10px] sm:text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1.5 flex items-center gap-1">
            <span>All India Rank</span>
          </p>
        </div>
      </div>
    </div>
  )
}
