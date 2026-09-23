import React from 'react'
import { BookOpen, PlusCircle } from 'lucide-react'

interface CreateSubjectModalProps {
  show: boolean
  subjectForm: { name: string; description: string }
  setSubjectForm: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({
  show,
  subjectForm,
  setSubjectForm,
  isSubmitting,
  onSubmit,
  onClose
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 ring-1 ring-slate-200">
        {/* Dark Premium Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Create Subject
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <PlusCircle className="w-3 h-3 text-blue-300" /> Faculty
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                Add a new course curriculum subject
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

        {/* Modal Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Physics, Chemistry, Mathematics"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Syllabus & Description
            </label>
            <textarea
              value={subjectForm.description}
              onChange={(e) =>
                setSubjectForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Subject curriculum overview, topics covered..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-70 transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Subject'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
