import React, { useMemo } from 'react'
import { CheckCircle, ShieldCheck, Calendar, Clock, Hash } from 'lucide-react'

interface TeacherSelfAttendanceModalProps {
  show: boolean
  selfAttendanceForm: { status: string; date: string }
  setSelfAttendanceForm: React.Dispatch<
    React.SetStateAction<{ status: string; date: string }>
  >
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export const TeacherSelfAttendanceModal: React.FC<TeacherSelfAttendanceModalProps> = ({
  show,
  selfAttendanceForm,
  setSelfAttendanceForm,
  isSubmitting,
  onSubmit,
  onClose
}) => {
  // Convert current epoch in form to YYYY-MM-DD for calendar input
  const calendarDateValue = useMemo(() => {
    const num = Number(selfAttendanceForm.date)
    if (num && !isNaN(num) && num > 100000000) {
      const d = new Date(num * 1000)
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }
    // If it's already YYYY-MM-DD format
    if (selfAttendanceForm.date && selfAttendanceForm.date.includes('-')) {
      return selfAttendanceForm.date
    }
    return new Date().toISOString().split('T')[0]
  }, [selfAttendanceForm.date])

  if (!show) return null

  // When user picks a date from calendar picker, convert to Epoch
  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value
    if (selected) {
      const [y, m, d] = selected.split('-').map(Number)
      const dateObj = new Date()
      dateObj.setFullYear(y, m - 1, d)
      const epoch = Math.floor(dateObj.getTime() / 1000)
      setSelfAttendanceForm((p) => ({
        ...p,
        date: String(epoch)
      }))
    }
  }

  const handleSetNow = () => {
    setSelfAttendanceForm((p) => ({
      ...p,
      date: String(Math.floor(Date.now() / 1000))
    }))
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 ring-1 ring-slate-200">
        {/* Dark Premium Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <CheckCircle className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Faculty Self Attendance
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> Faculty
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                Record your attendance (/teacher-markattandance)
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

        {/* Modal Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Attendance Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setSelfAttendanceForm((p) => ({ ...p, status: 'present' }))
                }
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selfAttendanceForm.status === 'present'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ✓ Present
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelfAttendanceForm((p) => ({ ...p, status: 'absent' }))
                }
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selfAttendanceForm.status === 'absent'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ✕ Absent
              </button>
            </div>
          </div>

          {/* Calendar Picker + Epoch Converter */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Select Date (Calendar)
                </label>
                <button
                  type="button"
                  onClick={handleSetNow}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3 h-3" /> Set to Today
                </button>
              </div>
              <input
                type="date"
                value={calendarDateValue}
                onChange={handleCalendarChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white cursor-pointer"
                required
              />
            </div>

            {/* Epoch Timestamp Converted Payload View */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>API Epoch Time:</span>
              </div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/60">
                {selfAttendanceForm.date || String(Math.floor(Date.now() / 1000))}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-70 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Recording...' : 'Submit Attendance'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


