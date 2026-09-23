import React, { useState } from 'react'
import { ChevronDown, Loader2, CheckCircle2 } from 'lucide-react'
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

interface TeacherMarkAttendanceProps {
  classList?: ISubjectClass[]
  studentsList?: any[]
  onSuccess?: () => void
}

export const TeacherMarkAttendance: React.FC<TeacherMarkAttendanceProps> = ({
  classList = [],
  studentsList = [],
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
    fetchStudentAttendance()
  }, [])

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
      // Record attendance for students
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
    } catch (err) {
      toast.error('Failed to submit attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-2xl mx-auto">
      {/* Top Header matching Figma design */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            Mark Attendance
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {formattedDate}
          </p>
        </div>

        {/* Batch / Class & Date Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBatchDropdown(!showBatchDropdown)}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{selectedBatch}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>

          {showBatchDropdown && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
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
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{cls.name} — Batch A</span>
                    {selectedSubjectId === cls._id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
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
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBatch === b && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {students.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No students found. Loading students...</p>
          </div>
        ) : (
          students.map((student) => {
            const isPresent = student.status === 'present'
            const isAbsent = student.status === 'absent'

            return (
              <div
                key={student.id}
                className="bg-white dark:bg-slate-800/90 px-4 py-3 sm:py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
              {/* Student Info Left Side */}
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  onError={(e) => {
                    // Fallback to stylized initial
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                    {student.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {student.rollNo}
                  </p>
                </div>
              </div>

              {/* P / A Toggle Action Right Side */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Present Button (P) */}
                <button
                  type="button"
                  onClick={() => toggleStatus(student.id, 'present')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                    isPresent
                      ? 'bg-[#10b981] text-white shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-400/20'
                      : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  aria-label={`Mark ${student.name} Present`}
                >
                  P
                </button>

                {/* Absent Button (A) */}
                <button
                  type="button"
                  onClick={() => toggleStatus(student.id, 'absent')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                    isAbsent
                      ? 'bg-[#ef4444] text-white shadow-sm shadow-rose-500/30 ring-2 ring-rose-400/20'
                      : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-200'
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

      {/* Summary Stats & Submit Action Bar matching Figma */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between px-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          <div>
            Present:{' '}
            <span className="text-[#10b981] font-black text-sm sm:text-base ml-1">
              {presentCount}
            </span>
          </div>
          <div>
            Absent:{' '}
            <span className="text-[#ef4444] font-black text-sm sm:text-base ml-1">
              {absentCount}
            </span>
          </div>
          <div>
            Total:{' '}
            <span className="text-slate-900 dark:text-white font-black text-sm sm:text-base ml-1">
              {totalCount}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmitAttendance}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Attendance...
            </>
          ) : (
            'Submit Attendance'
          )}
        </button>
      </div>
    </div>
  )
}
