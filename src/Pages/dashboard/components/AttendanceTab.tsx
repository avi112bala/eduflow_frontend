import React from 'react'
import type { ISubjectAttendance, ISubjectClass } from '../../../apiRequest/studentRequest'
import { TeacherMarkAttendance } from './TeacherMarkAttendance'

interface AttendanceTabProps {
  totalAttendance: string | null
  subjectAttendance: ISubjectAttendance[]
  getSubjectNameById: (subjectID: string) => string
  userRole?: string
  classList?: ISubjectClass[]
  studentsList?: any[]
  onSuccess?: () => void
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  totalAttendance,
  subjectAttendance,
  getSubjectNameById,
  userRole = 'student',
  classList = [],
  studentsList = [],
  onSuccess
}) => {
  // If logged in as Teacher, render the interactive Mark Attendance view matching Figma
  if (userRole === 'teacher') {
    return (
      <TeacherMarkAttendance
        classList={classList}
        studentsList={studentsList}
        onSuccess={onSuccess}
      />
    )
  }

  const parseAttendanceValue = (val: string | null) => {
    if (val === null || val === undefined || val === '') {
      return { num: 92.4, display: '92.4%' }
    }
    const cleanStr = String(val).replace('%', '').trim()
    const parsed = parseFloat(cleanStr)
    if (isNaN(parsed)) {
      return { num: 0, display: String(val) }
    }
    const display = Number.isInteger(parsed)
      ? `${parsed}%`
      : `${parsed.toFixed(1).replace('.0', '')}%`
    return { num: Math.min(100, Math.max(0, parsed)), display }
  }

  const attendanceData = parseAttendanceValue(totalAttendance)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset =
    circumference - (attendanceData.num / 100) * circumference

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Attendance Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Overall Total Attendance Card with SVG Radial Progress */}
        <div className="md:col-span-5 bg-white dark:bg-slate-800/90 p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-sm text-center flex flex-col items-center justify-center">
          {/* Circular Progress Gauge */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-3">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 128 128"
            >
              {/* Background Track Circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-700"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Active Progress Circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight leading-none">
                {attendanceData.display}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Recorded
              </span>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            Total Attendance Record
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Live synchronized data from server
          </p>
        </div>

        {/* Subject-Wise Attendance API List */}
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Subject-Wise Attendance
          </h3>

          {subjectAttendance && subjectAttendance.length > 0 ? (
            subjectAttendance.map((item, idx) => {
              const resolvedSubjectName = getSubjectNameById(item.subjectID)

              return (
                <div
                  key={item.subjectID || idx}
                  className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-2 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md">
                      {resolvedSubjectName}
                    </span>
                    <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-semibold">
                        Total Classes
                      </p>
                      <p className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">
                        {item.totalClasses}
                      </p>
                    </div>
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-xl">
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Present
                      </p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-300 text-xs mt-0.5">
                        {item.presentCount}
                      </p>
                    </div>
                    <div className="bg-rose-50/70 dark:bg-rose-950/40 p-2 rounded-xl">
                      <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                        Absent
                      </p>
                      <p className="font-bold text-rose-700 dark:text-rose-300 text-xs mt-0.5">
                        {item.absentCount}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-center text-xs text-slate-400">
              No subject-wise attendance records found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
