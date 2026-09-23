import React, { useState } from 'react'
import { X, HelpCircle, Loader2 } from 'lucide-react'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'
import type { ICreateDoubtPayload } from '../../../apiRequest/doubtRequest'

interface AskDoubtModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  classList: ISubjectClass[]
  onSubmit: (payload: ICreateDoubtPayload) => Promise<void>
  isSubmitting: boolean
}

export const AskDoubtModal: React.FC<AskDoubtModalProps> = ({
  isOpen,
  onClose,
  studentId,
  classList,
  onSubmit,
  isSubmitting
}) => {
  const [subjectId, setSubjectId] = useState<string>(classList[0]?._id || '')
  const [title, setTitle] = useState<string>('')
  const [doubt, setDoubt] = useState<string>('')
  const [media, setMedia] = useState<string>('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalSubjectId = subjectId || (classList[0]?._id ?? '')
    if (!finalSubjectId || !title.trim() || !doubt.trim()) return

    const payload: ICreateDoubtPayload = {
      subjectId: finalSubjectId,
      userId: studentId,
      title: title.trim(),
      doubt: doubt.trim(),
      media: media.trim()
    }

    await onSubmit(payload)
    setTitle('')
    setDoubt('')
    setMedia('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Ask a Doubt (/create-boubt)</h3>
              <p className="text-xs text-slate-500">Post your questions directly to your faculty</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject *
            </label>
            <select
              value={subjectId || classList[0]?._id || ''}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            >
              {classList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.description ? `— ${c.description}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Doubt Title / Subject Topic *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics - Thermodynamics query"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Doubt Details & Problem Description *
            </label>
            <textarea
              required
              rows={4}
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              placeholder="Describe where you are getting stuck, what steps you tried..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Media / Problem Screenshot URL (Optional)
            </label>
            <input
              type="url"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              placeholder="https://... (image link of problem / handwritten doubt)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting Doubt...
                </>
              ) : (
                'Post Doubt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
