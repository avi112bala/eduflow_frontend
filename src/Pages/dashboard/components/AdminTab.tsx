import React from 'react'
import {
  Shield,
  Users,
  GraduationCap,
  CreditCard,
  UserCheck,
  PlusCircle,
  Clock,
  Layers,
  Phone
} from 'lucide-react'
import type { IAdminAnalytics, IBatchItem } from '../../../types/dashboard'

interface AdminTabProps {
  analytics: IAdminAnalytics
  batches: IBatchItem[]
  defaulters: any[]
  onOpenCreateBatch: () => void
  onOpenCreateAnnouncement: () => void
}

export const AdminTab: React.FC<AdminTabProps> = ({
  analytics,
  batches,
  defaulters,
  onOpenCreateBatch,
  onOpenCreateAnnouncement
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Institute Administration & Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time enrollment, batch allocations, fee collections, and faculty rosters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateBatch}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create Batch
          </button>
          <button
            onClick={onOpenCreateAnnouncement}
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Broadcast Notice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalStudents}</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
            <GraduationCap className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Faculty</p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{analytics.totalTeachers}</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Fees</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{(analytics.feesCollectedThisMonth / 100000).toFixed(2)}L
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
            <UserCheck className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Attendance</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{analytics.overallAttendanceToday}%</p>
        </div>
      </div>

      {/* Batches Overview */}
      <div className="bg-white dark:bg-slate-800/90 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Active Academic Batches ({batches.length})
          </h3>
          <button
            onClick={onOpenCreateBatch}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
          >
            + Add New Batch
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {batches.map((batch) => (
            <div key={batch._id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md">
                {batch.batchName}
              </span>
              <div className="space-y-1 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {batch.timing}
                </p>
                <p>
                  <b>Location:</b> {batch.room}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Enrolled Students: <b>{batch.studentCount || 40}</b>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Defaulters Tracker */}
      <div className="bg-white dark:bg-slate-800/90 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Fee Pending Defaulters Alert ({defaulters.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Students with overdue installment dues</p>
          </div>
        </div>

        <div className="border border-slate-100 dark:border-slate-700/80 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
          {defaulters.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-white dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">{item.studentName}</p>
                <p className="text-[11px] text-slate-400">
                  {item.batchName} • Parent: {item.parentPhone}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-black text-rose-600 dark:text-rose-400">₹{item.dueAmount}</p>
                  <p className="text-[10px] text-rose-500 font-bold">{item.overdueDays} days overdue</p>
                </div>
                <a
                  href={`tel:${item.parentPhone}`}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Parent
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
