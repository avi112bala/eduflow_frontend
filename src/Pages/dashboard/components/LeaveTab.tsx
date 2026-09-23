import React from 'react'
import {
  CalendarDays,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react'
import type { ILeaveItem } from '../../../types/dashboard'

interface LeaveTabProps {
  leaves: ILeaveItem[]
  userRole: string
  onOpenApplyLeave: () => void
  onUpdateLeaveStatus?: (leaveId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>
}

export const LeaveTab: React.FC<LeaveTabProps> = ({
  leaves,
  userRole,
  onOpenApplyLeave,
  onUpdateLeaveStatus
}) => {
  const normalizedRole = userRole.toLowerCase()
  const isTeacherOrAdmin = normalizedRole === 'teacher' || normalizedRole === 'admin'

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Leave Applications & Absences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isTeacherOrAdmin
              ? 'Review and approve student absence and leave requests'
              : 'Submit official leave requests and track approval status'}
          </p>
        </div>

        <button
          onClick={onOpenApplyLeave}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leaves Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leaves.map((leave) => {
          const isPending = leave.status === 'PENDING'
          const isApproved = leave.status === 'APPROVED'

          const statusBadge = isApproved
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
            : isPending
            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'

          return (
            <div
              key={leave._id}
              className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">
                    Applied by {leave.appliedBy} on {leave.createdAt}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${statusBadge}`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isPending ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {leave.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{leave.studentName}</h3>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Duration: {leave.startDate} to {leave.endDate}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  <b>Reason:</b> {leave.reason}
                </p>

                {leave.remarks && (
                  <p className="text-xs text-slate-600 dark:text-slate-200 bg-blue-50/50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <b>Note:</b> {leave.remarks}
                  </p>
                )}
              </div>

              {/* Action Buttons for Teachers/Admin on Pending Leaves */}
              {isTeacherOrAdmin && isPending && onUpdateLeaveStatus && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => onUpdateLeaveStatus(leave._id, 'APPROVED')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve Leave
                  </button>
                  <button
                    onClick={() => onUpdateLeaveStatus(leave._id, 'REJECTED')}
                    className="px-4 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
