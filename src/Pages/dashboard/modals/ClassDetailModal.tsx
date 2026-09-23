import React from 'react'
import { Clock, MapPin, BookOpen, CheckCircle2 } from 'lucide-react'
import type { ClassItem } from '../../../types/dashboard'

interface ClassDetailModalProps {
  selectedClass: ClassItem | null
  onClose: () => void
  onMarkAttendance: (classId: string) => void
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  selectedClass,
  onClose,
  onMarkAttendance
}) => {
  if (!selectedClass) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 ring-1 ring-slate-200">
        {/* Dark Premium Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Class Session
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Live
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                {selectedClass.subject} • Today's Topic
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-lg ${selectedClass.badgeBg} ${selectedClass.badgeText}`}
            >
              {selectedClass.subject}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {selectedClass.time}
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 leading-tight">
            {selectedClass.title}
          </h3>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">
                Time: {selectedClass.time}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="font-semibold text-slate-800">
                Location: {selectedClass.location}
              </span>
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                onMarkAttendance(selectedClass.id)
                onClose()
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Attendance
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
