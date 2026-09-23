import React, { useState } from 'react'
import {
  UserCheck,
  ShieldCheck,
  ChevronDown,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import {
  markAttendanceApi,
  type ISubjectClass
} from '../../../apiRequest/studentRequest'
import { getStudentAttendanceApi } from '../../../apiRequest/teacherRequest'
import { toast } from 'react-toastify'

interface StudentItem {
  id: string
  name: string
  rollNo: string
  avatar: string
  status: 'present' | 'absent'
}

interface TeacherAttendanceModalProps {
  show: boolean
  classList?: ISubjectClass[]
  studentsList?: any[]
  onClose: () => void
  onSuccess?: () => void
}

export const TeacherAttendanceModal: React.FC<TeacherAttendanceModalProps> = ({
  show,
  classList = [],
  studentsList = [],
  onClose,
  onSuccess
}) => {
  const batches = classList.length > 0
    ? classList.map((c) => `${c.name} — Batch A`)
    : ['General — Batch A']
  const uniqueBatches = Array.from(new Set(batches))

  const [selectedBatch, setSelectedBatch] = useState(uniqueBatches[0] || 'General — Batch A')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    classList[0]?._id || '6a9abaa9e1c77f5b10e25037'
  )
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])
  const [students, setStudents] = useState<StudentItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBatchDropdown, setShowBatchDropdown] = useState(false)

  const activeSubjectId =
    selectedSubjectId || classList[0]?._id || '6a9abaa9e1c77f5b10e25037'

  const selectedEpoch = React.useMemo(() => {
    if (!selectedDate) return String(Math.floor(Date.now() / 1000))
    const [y, m, d] = selectedDate.split('-').map(Number)
    const dateObj = new Date()
    dateObj.setFullYear(y, m - 1, d)
    return String(Math.floor(dateObj.getTime() / 1000))
  }, [selectedDate])

  const fetchStudentAttendance = async () => {
    try {
      const res: any = await getStudentAttendanceApi()
      if (res) {
        let raw = res.data !== undefined ? res.data : res
        if (raw && typeof raw === 'object' && raw.data !== undefined && Array.isArray(raw.data)) {
          raw = raw.data
        }
        if (Array.isArray(raw)) {
          setAttendanceHistory(raw)
        }
      }
    } catch (err) {
      console.error('Error fetching student attendance records:', err)
    }
  }

  React.useEffect(() => {
    if (show) {
      fetchStudentAttendance()
    }
  }, [show])

  React.useEffect(() => {
    if (classList.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(classList[0]._id)
    }
  }, [classList, selectedSubjectId])

  React.useEffect(() => {
    if (studentsList && studentsList.length > 0) {
      setStudents(
        studentsList.map((c, idx) => {
          const studentId = c._id || c.id || `student_${idx}`

          // Match student attendance history for the active subject
          const matches = attendanceHistory.filter(
            (rec) =>
              (rec.user === studentId || rec.userDetails?._id === studentId) &&
              (!activeSubjectId || rec.subjectID === activeSubjectId)
          )

          let preselectedStatus: 'present' | 'absent' = 'present'
          if (matches.length > 0) {
            matches.sort((a, b) => {
              const dateA = Number(a.date) || 0
              const dateB = Number(b.date) || 0
              return dateB - dateA
            })
            const latestStatus = String(matches[0].status).toLowerCase()
            if (latestStatus === 'absent') {
              preselectedStatus = 'absent'
            } else if (latestStatus === 'present') {
              preselectedStatus = 'present'
            }
          }

          return {
            id: studentId,
            name: [c.firstName, c.lastName].filter(Boolean).join(' ') || c.name || c.email || `Student ${idx + 1}`,
            rollNo: `Roll #${String(idx + 1).padStart(2, '0')}`,
            avatar: c.profilPic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.firstName || idx}`,
            status: preselectedStatus
          }
        })
      )
    }
  }, [studentsList, attendanceHistory, selectedSubjectId, activeSubjectId])

  if (!show) return null

  const toggleStatus = async (id: string, newStatus: 'present' | 'absent') => {
    // 1. Update UI state
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    )

    // 2. Hit /markattandance/:id API with payload
    try {
      await markAttendanceApi(id, {
        subjectID: activeSubjectId,
        status: newStatus,
        date: selectedEpoch
      })
    } catch (err) {
      console.error(`Error marking attendance for ${id}:`, err)
    }
  }

  const presentCount = students.filter((s) => s.status === 'present').length
  const absentCount = students.filter((s) => s.status === 'absent').length
  const totalCount = students.length

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true)
    try {
      await Promise.all(
        students.map((student) =>
          markAttendanceApi(student.id, {
            subjectID: activeSubjectId,
            status: student.status,
            date: selectedEpoch
          }).catch(() => null)
        )
      )

      toast.success(
        `Attendance recorded! (${presentCount} Present, ${absentCount} Absent)`
      )
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error('Failed to submit attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 ring-1 ring-slate-200 max-h-[90vh]">
        {/* Dark Premium Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <UserCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Mark Attendance
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                {formattedDate} • Batch Attendance
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

        {/* Batch & Calendar Selector Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Class:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{selectedBatch}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showBatchDropdown && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {classList.length > 0 ? (
                    classList.map((cls) => (
                      <button
                        key={cls._id}
                        type="button"
                        onClick={() => {
                          setSelectedBatch(`${cls.name} — Batch A`)
                          setSelectedSubjectId(cls._id)
                          setShowBatchDropdown(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                          selectedSubjectId === cls._id
                            ? 'bg-blue-50 text-blue-600 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cls.name} — Batch A</span>
                        {selectedSubjectId === cls._id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    uniqueBatches.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setSelectedBatch(b)
                          setShowBatchDropdown(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                          selectedBatch === b
                            ? 'bg-blue-50 text-blue-600 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{b}</span>
                        {selectedBatch === b && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
            />
          </div>
        </div>

        {/* Student Cards List (Scrollable) */}
        <div className="p-4 sm:p-5 space-y-2.5 overflow-y-auto flex-1">
          {students.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-500">No students found. Loading students...</p>
            </div>
          ) : (
            students.map((student) => {
              const isPresent = student.status === 'present'
              const isAbsent = student.status === 'absent'

            return (
              <div
                key={student.id}
                className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                {/* Student Info Left Side */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight truncate">
                      {student.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400">
                      {student.rollNo}
                    </p>
                  </div>
                </div>

                {/* P / A Toggle Action Right Side */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Present Button (P) */}
                  <button
                    type="button"
                    onClick={() => toggleStatus(student.id, 'present')}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isPresent
                        ? 'bg-[#10b981] text-white shadow-xs'
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600'
                    }`}
                    aria-label={`Mark ${student.name} Present`}
                  >
                    P
                  </button>

                  {/* Absent Button (A) */}
                  <button
                    type="button"
                    onClick={() => toggleStatus(student.id, 'absent')}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isAbsent
                        ? 'bg-[#ef4444] text-white shadow-xs'
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600'
                    }`}
                    aria-label={`Mark ${student.name} Absent`}
                  >
                    A
                  </button>
                </div>
              </div>
            )
          })
        )}
        </div>

        {/* Modal Footer with Summary & Submit Button */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-3 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <div>
              Present: <span className="text-[#10b981] font-black text-sm">{presentCount}</span>
            </div>
            <div>
              Absent: <span className="text-[#ef4444] font-black text-sm">{absentCount}</span>
            </div>
            <div>
              Total: <span className="text-slate-900 font-black text-sm">{totalCount}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmitAttendance}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Attendance'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
