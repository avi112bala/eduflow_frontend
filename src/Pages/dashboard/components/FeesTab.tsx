import React from 'react'
import { CheckCircle2, CreditCard, Loader2, Download, Receipt } from 'lucide-react'
import type { IFeeOverview, IFeeTransaction } from '../../../types/dashboard'

interface FeesTabProps {
  isGeneratingPayment: boolean
  onPayFee: (feeType: string, feeAmount: string) => void
  feeOverview?: IFeeOverview
  transactions?: IFeeTransaction[]
}

export const FeesTab: React.FC<FeesTabProps> = ({
  isGeneratingPayment,
  onPayFee,
  feeOverview = {
    totalTuitionFee: 120000,
    paidAmount: 90000,
    dueAmount: 3000,
    nextDueDate: 'Oct 05, 2026'
  },
  transactions = [
    {
      transactionId: 'TXN-984210',
      feeType: 'Quarterly Installment #2',
      amount: 30000,
      status: 'PAID',
      paymentDate: 'Sept 01, 2026',
      paymentMethod: 'UPI / Online',
      receiptUrl: '#'
    },
    {
      transactionId: 'TXN-872341',
      feeType: 'Admission & Term 1 Tuition',
      amount: 60000,
      status: 'PAID',
      paymentDate: 'June 15, 2026',
      paymentMethod: 'Net Banking',
      receiptUrl: '#'
    }
  ]
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Tuition Fees & Invoices
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          View tuition payment schedules, dues, online portal payments, and transaction history
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Annual Tuition</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">₹{feeOverview.totalTuitionFee.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Amount Paid</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{feeOverview.paidAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Pending Due</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{feeOverview.dueAmount.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">Due by {feeOverview.nextDueDate}</p>
        </div>
      </div>

      {/* Pay Online Card */}
      {feeOverview.dueAmount > 0 && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
              Pending Installment
            </span>
            <h3 className="text-xl font-black mt-2">Monthly Installment Due (₹{feeOverview.dueAmount})</h3>
            <p className="text-xs text-blue-100 mt-1">
              Secure online payment via Razorpay, UPI, Credit/Debit Cards, or Netbanking
            </p>
          </div>

          <button
            onClick={() => onPayFee('monthly', String(feeOverview.dueAmount))}
            disabled={isGeneratingPayment}
            className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
          >
            {isGeneratingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                Connecting Payment Gateway...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-blue-600" />
                Pay Online Now (₹{feeOverview.dueAmount})
              </>
            )}
          </button>
        </div>
      )}

      {/* Transactions & Receipts Log */}
      <div className="bg-white dark:bg-slate-800/90 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Payment Receipts & Transaction Log
          </h3>
        </div>

        <div className="border border-slate-100 dark:border-slate-700/80 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
          {transactions.map((txn) => (
            <div
              key={txn.transactionId}
              className="p-4 bg-white dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">{txn.feeType}</p>
                  <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {txn.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ref: <span className="font-mono">{txn.transactionId}</span> • Paid on {txn.paymentDate} via{' '}
                  {txn.paymentMethod || 'Online'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-black text-slate-900 dark:text-white">₹{Number(txn.amount).toLocaleString()}</span>
                <button
                  onClick={() => alert(`Receipt downloaded for transaction ${txn.transactionId}`)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
