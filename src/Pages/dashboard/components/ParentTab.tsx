import React, { useState } from 'react'
import {
  Users,
  Loader2,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

interface ParentTabProps {
  childrenList: any[]
  isFetchingChildren: boolean
  totalAttendance: string | null
  fullName: string
  batchName: string
  onFetchChildren: () => void
  onPayChildFee: (feeType: string, feeAmount: string, childId?: string) => void
}

export const ParentTab: React.FC<ParentTabProps> = ({
  childrenList,
  isFetchingChildren,
  totalAttendance,
  fullName,
  batchName,
  onFetchChildren,
  onPayChildFee
}) => {
  // Track selected plan per child (keyed by child._id or index)
  const [selectedPlans, setSelectedPlans] = useState<Record<string, { type: string; amount: string }>>({})

  const FEE_PLANS = [
    { type: 'monthly', label: 'Monthly', amount: '3000' },
    { type: 'term', label: 'Quarterly', amount: '9000' },
    { type: 'annual', label: 'Annual', amount: '35000' }
  ]

  const getChildPlan = (key: string) => {
    return selectedPlans[key] || FEE_PLANS[0]
  }

  const setChildPlan = (key: string, plan: { type: string; amount: string }) => {
    setSelectedPlans((prev) => ({ ...prev, [key]: plan }))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Children & Fee Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor each ward's academic records and process tuition fees directly per student
          </p>
        </div>
        <button
          onClick={onFetchChildren}
          disabled={isFetchingChildren}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          {isFetchingChildren ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            '↻ Refresh Wards'
          )}
        </button>
      </div>

      {/* Children Cards List */}
      {childrenList && childrenList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {childrenList.map((child: any, idx: number) => {
            const childKey = child._id || String(idx)
            const childFirstName = child.firstName || 'Student'
            const childLastName = child.lastName || ''
            const childFullName = `${childFirstName} ${childLastName}`.trim()
            const childPic = child.profilPic || ''
            const currentPlan = getChildPlan(childKey)

            const handlePay = () => {
              onPayChildFee(currentPlan.type, currentPlan.amount, child._id)
            }

            return (
              <div
                key={childKey}
                className="bg-white dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 space-y-4 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                {/* Child Information Header */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm overflow-hidden shrink-0 border-2 border-white dark:border-slate-700 ring-2 ring-blue-100 dark:ring-blue-900/40">
                      {childPic ? (
                        <img
                          src={childPic}
                          alt={childFullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span>{childFirstName.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                        {childFullName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{child.email || 'student@gmail.com'}</span>
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Enrolled
                  </span>
                </div>

                {/* Info & Metrics Strip */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50/90 dark:bg-slate-700/50 p-2.5 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      Phone
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-1 truncate">
                      {child.phoneNumber || '+91 95555 93907'}
                    </span>
                  </div>
                  <div className="bg-slate-50/90 dark:bg-slate-700/50 p-2.5 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                      Attendance
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                      {totalAttendance ? `${totalAttendance}%` : '94.2%'}
                    </span>
                  </div>
                </div>

                {/* Address (if provided) */}
                {child.address && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-700/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{child.address}</span>
                  </div>
                )}

                {/* Embedded Fee Payment Portal for This Student */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-blue-950/40 p-3.5 sm:p-4 rounded-2xl border border-blue-100/70 dark:border-blue-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Pay Fee for {childFirstName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Razorpay Secure
                    </span>
                  </div>

                  {/* Plan Option Chips */}
                  <div className="grid grid-cols-3 gap-2">
                    {FEE_PLANS.map((plan) => {
                      const isSelected = currentPlan.type === plan.type
                      return (
                        <button
                          key={plan.type}
                          type="button"
                          onClick={() => setChildPlan(childKey, plan)}
                          className={`py-2 px-1 sm:px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-blue-300'
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
                            }`}
                          >
                            {plan.label}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold mt-0.5 whitespace-nowrap">
                            ₹{Number(plan.amount).toLocaleString('en-IN')}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Payment Button */}
                  <button
                    type="button"
                    onClick={handlePay}
                    className="w-full py-2.5 px-3.5 sm:py-3 sm:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span className="font-bold text-xs sm:text-sm truncate">Pay Fee Now</span>
                    </div>
                    <div className="flex items-center gap-1 font-extrabold text-xs sm:text-sm bg-white/20 px-2.5 py-1 rounded-lg shrink-0">
                      <span>₹{Number(currentPlan.amount).toLocaleString('en-IN')}</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/90 p-8 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">Child Information Synced</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Linked to student profile:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{fullName}</span> ({batchName})
          </p>
          <button
            onClick={() => onPayChildFee('monthly', '3000')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            Pay Student Fee (₹3,000)
          </button>
        </div>
      )}
    </div>
  )
}
