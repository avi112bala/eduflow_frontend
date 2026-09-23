import React from 'react'
import {
  CreditCard,
  ShieldCheck,
  Loader2,
  Lock,
  ExternalLink
} from 'lucide-react'
import type { PaymentMeta } from '../../../types/dashboard'

interface PaymentModalProps {
  show: boolean
  paymentUrl: string | null
  paymentMeta: PaymentMeta | null
  onClose: () => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  paymentUrl,
  paymentMeta,
  onClose
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg md:max-w-xl h-[88vh] sm:h-[84vh] max-h-[780px] rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between border border-slate-100 ring-1 ring-slate-200">
        {/* Dark Professional Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <CreditCard className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                EduFlow Checkout
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-Bit SSL
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                Complete your payment securely
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-sm cursor-pointer flex items-center justify-center transition-colors border border-white/10"
            aria-label="Close Payment Modal"
          >
            ✕
          </button>
        </div>

        {/* Order Summary Strip */}
        {paymentMeta && (
          <div className="bg-slate-50/90 px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-extrabold text-slate-800 capitalize">
                {paymentMeta.feeType} Installment Fee
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">
                Amount Payable:
              </span>
              <span className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/80">
                ₹{paymentMeta.feeAmount}
              </span>
            </div>
          </div>
        )}

        {/* Embedded Payment iFrame Container */}
        <div className="flex-1 w-full bg-slate-100/50 relative overflow-hidden flex flex-col justify-center items-center">
          {paymentUrl ? (
            <iframe
              src={paymentUrl}
              title="Payment Portal"
              className="w-full h-full min-h-[380px] border-0 shadow-inner"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Connecting to Secure Payment Gateway...
              </p>
            </div>
          )}
        </div>

        {/* Professional Footer & Controls */}
        <div className="bg-white p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-500 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-slate-600">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> PCI-DSS Compliant
            </span>
            {paymentUrl && (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-1 transition-colors"
              >
                Open in New Window <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            Close Payment Portal
          </button>
        </div>
      </div>
    </div>
  )
}
