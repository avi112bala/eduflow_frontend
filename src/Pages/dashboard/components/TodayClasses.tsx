import React from 'react'
import { ChevronRight, Clock, MapPin, Video } from 'lucide-react'
import type { ClassItem } from '../../../types/dashboard'

interface TodayClassesProps {
  classes: ClassItem[]
  onSelectClass: (cls: ClassItem) => void
  onViewTimetable: () => void
}

export const TodayClasses: React.FC<TodayClassesProps> = ({
  classes,
  onSelectClass,
  onViewTimetable
}) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Classes
          </h2>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <button
          onClick={onViewTimetable}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50"
        >
          View Full Timetable &rarr;
        </button>
      </div>

      {/* Class List */}
      {classes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 p-8 rounded-2xl sm:rounded-3xl border border-slate-200/70 dark:border-slate-700/80 text-center space-y-1.5 shadow-xs">
          <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No classes scheduled for today</p>
          <p className="text-xs text-slate-400 dark:text-slate-400">Scheduled lectures will appear here once published by faculty</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => onSelectClass(cls)}
              className="bg-white dark:bg-slate-800/90 p-4 sm:p-4.5 rounded-2xl shadow-xs border border-slate-200/70 dark:border-slate-700/80 flex items-center justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md card-hover-lift transition-all group"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Colored Accent Indicator Bar */}
                <div className={`w-1.5 h-12 ${cls.barColor} rounded-full shrink-0`} />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${cls.badgeBg} ${cls.badgeText}`}
                    >
                      {cls.subject}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {cls.time}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cls.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {cls.location}
                    </span>
                    {cls.liveMeetingUrl && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                        <Video className="w-3 h-3" /> Live Link
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
