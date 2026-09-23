import React from 'react'
import { BookOpen, Calendar } from 'lucide-react'
import type { ClassItem } from '../../../types/dashboard'

interface TimetableModalProps {
  show: boolean
  classes: ClassItem[]
  onClose: () => void
}

export const TimetableModal: React.FC<TimetableModalProps> = ({
  show,
  classes,
  onClose
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100 ring-1 ring-slate-200">
        {/* Dark Premium Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Calendar className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Full Timetable
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-300" /> 2026 Batch
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                Weekly scheduled lectures and laboratories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-sm cursor-pointer flex items-center justify-center transition-colors border border-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Timetable List Body */}
        <div className="p-6 space-y-3 overflow-y-auto max-h-[380px]">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors"
            >
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cls.badgeBg} ${cls.badgeText}`}
                >
                  {cls.subject}
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {cls.title}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {cls.time} • {cls.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            Close Timetable
          </button>
        </div>
      </div>
    </div>
  )
}
