import React from 'react'
import { AlertTriangle, Bell, PlusCircle, Sparkles } from 'lucide-react'
import type { IAnnouncement } from '../../../types/dashboard'

interface AnnouncementsProps {
  announcements: IAnnouncement[]
  userRole?: string
  onOpenCreateAnnouncement?: () => void
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements,
  userRole = 'student',
  onOpenCreateAnnouncement
}) => {
  const normalizedRole = userRole.toLowerCase()
  const canCreate = normalizedRole === 'teacher' || normalizedRole === 'admin'

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Announcements & Notices
        </h2>
        {canCreate && onOpenCreateAnnouncement && (
          <button
            onClick={onOpenCreateAnnouncement}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Notice
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {announcements.map((ann) => {
          const isCritical = ann.priority?.toUpperCase() === 'CRITICAL'
          const isTip = ann.priority?.toUpperCase() === 'TIP'

          if (isTip) {
            return (
              <div
                key={ann.id || ann._id || ann.title}
                className="bg-gradient-to-br from-indigo-50/80 via-blue-50/60 to-purple-50/40 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-purple-950/20 p-4 sm:p-4.5 rounded-2xl border border-indigo-100/80 dark:border-indigo-800/60 space-y-1.5 shadow-xs card-hover-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Faculty Tip
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400 font-semibold">
                    {ann.createdAt || ann.date || 'Recent'}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950 dark:text-indigo-200 pt-0.5">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-normal">
                  {ann.description}
                </p>
              </div>
            )
          }

          return (
            <div
              key={ann.id || ann._id || ann.title}
              className={`p-4 sm:p-4.5 rounded-2xl shadow-xs border transition-all card-hover-lift ${
                isCritical
                  ? 'bg-gradient-to-br from-amber-50/70 to-rose-50/40 dark:from-amber-950/30 dark:to-rose-950/20 border-amber-200/80 dark:border-amber-800/60'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200/70 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1.5 font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md ${
                    isCritical
                      ? 'text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80'
                      : 'text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/80'
                  }`}
                >
                  {isCritical ? (
                    <>
                      <AlertTriangle className="w-3 h-3 fill-amber-500/20" />
                      CRITICAL NOTICE
                    </>
                  ) : (
                    'NOTICE'
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
                  {ann.createdAt || ann.date || 'Today'}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight pt-1.5">
                {ann.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-normal mt-1">
                {ann.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
