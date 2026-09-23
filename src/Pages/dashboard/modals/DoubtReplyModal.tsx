import React, { useState } from 'react'
import { X, CheckCircle2, Loader2 } from 'lucide-react'
import type { IDoubtItem } from '../../../types/dashboard'
import type { IReplyDoubtPayload } from '../../../apiRequest/doubtRequest'

interface DoubtReplyModalProps {
  isOpen: boolean
  onClose: () => void
  doubt: IDoubtItem | null
  teacherId?: string
  teacherName?: string
  onSubmit: (doubtId: string, payload: IReplyDoubtPayload) => Promise<void>
  isSubmitting: boolean
}

export const DoubtReplyModal: React.FC<DoubtReplyModalProps> = ({
  isOpen,
  onClose,
  doubt,
  onSubmit,
  isSubmitting
}) => {
  const [explaination, setExplaination] = useState('')
  const [media, setMedia] = useState('')

  if (!isOpen || !doubt) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!explaination.trim()) return

    await onSubmit(doubt._id, {
      explaination: explaination.trim(),
      media: media.trim() || undefined
    })

    setExplaination('')
    setMedia('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Resolve Student Doubt</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Provide official explanation & answer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Question Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-400">
              <span>{doubt.subjectName}</span>
              <span>Asked by {doubt.studentName}</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{doubt.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{doubt.questionText}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Faculty Explanation & Solution *
            </label>
            <textarea
              required
              rows={5}
              value={explaination}
              onChange={(e) => setExplaination(e.target.value)}
              placeholder="Type detailed step-by-step solution or reference (e.g. you can see my previous lecture the same problem i resolved in that lecture)..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Solution Resource / Diagram / Video Link (Optional)
            </label>
            <input
              type="url"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              placeholder="https://... (diagram, video, or lecture link)"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resolving...
                </>
              ) : (
                'Post Solution'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
