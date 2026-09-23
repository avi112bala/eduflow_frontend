import React from 'react'
import { Clock, Video, PlusCircle, MapPin, User, Trash2 } from 'lucide-react'
import type { ClassItem } from '../../../types/dashboard'

interface ScheduleTabProps {
  classes: ClassItem[]
  userRole?: string
  onOpenCreateSchedule?: () => void
  onDeleteSchedule?: (scheduleId: string) => void
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  classes,
  userRole = 'student',
  onOpenCreateSchedule,
  onDeleteSchedule
}) => {
  const normalizedRole = userRole.toLowerCase()
  const isTeacherOrAdmin = normalizedRole === 'teacher' || normalizedRole === 'admin'

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Class Schedule
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Weekly lecture timings, room allocations, and live video conference links
          </p>
        </div>

        {isTeacherOrAdmin && onOpenCreateSchedule && (
          <button
            onClick={onOpenCreateSchedule}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Schedule New Class
          </button>
        )}
      </div>

      {/* Schedule Grid */}
      {classes.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-100 dark:border-slate-700/80 p-8 space-y-3">
          <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No scheduled classes found</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 max-w-sm mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Schedule New Class" above to add your first lecture slot.'
              : 'Your faculty has not published any lecture schedules yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${c.badgeBg || 'bg-blue-100 dark:bg-blue-950/70'
                      } ${c.badgeText || 'text-blue-700 dark:text-blue-300'}`}
                  >
                    {c.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {c.time}
                    </span>
                    {isTeacherOrAdmin && onDeleteSchedule && (
                      <button
                        onClick={() => onDeleteSchedule(c.id)}
                        title="Delete Schedule Slot (/deleteschedule)"
                        className="p-1.5 text-slate-300 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{c.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    {c.location}
                  </span>
                  {c.teacherName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {c.teacherName}
                    </span>
                  )}
                  {c.dayOfWeek && (
                    <span className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md font-bold text-[10px] text-slate-600 dark:text-slate-200">
                      {c.dayOfWeek}
                    </span>
                  )}
                </div>
              </div>

              {/* Live Meeting URL */}
              {c.liveMeetingUrl && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <a
                    href={c.liveMeetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join Live Lecture Meeting
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
