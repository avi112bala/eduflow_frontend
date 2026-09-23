import React, { useState } from 'react'
import { X, FileText, Loader2 } from 'lucide-react'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'
import type { ICreateMaterialPayload } from '../../../apiRequest/studyMaterialRequest'

interface UploadStudyMaterialModalProps {
  isOpen: boolean
  onClose: () => void
  classList: ISubjectClass[]
  onSubmit: (payload: ICreateMaterialPayload) => Promise<void>
  isSubmitting: boolean
}

export const UploadStudyMaterialModal: React.FC<UploadStudyMaterialModalProps> = ({
  isOpen,
  onClose,
  classList,
  onSubmit,
  isSubmitting
}) => {
  const [subjectId, setSubjectId] = useState<string>(classList[0]?._id || '')
  const [title, setTitle] = useState<string>('')
  const [materialType, setMaterialType] = useState<string>('notes')
  const [duedate, setDuedate] = useState<string>('')
  const [resourseUrl, setResourseUrl] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalSubjectId = subjectId || (classList[0]?._id ?? '')
    if (!finalSubjectId || !title.trim()) return

    const payload: ICreateMaterialPayload = {
      subjectId: finalSubjectId,
      title: title.trim(),
      materialType,
      duedate: duedate || '',
      resourseUrl: resourseUrl.trim(),
      description: description.trim()
    }

    await onSubmit(payload)
    setTitle('')
    setResourseUrl('')
    setDescription('')
    setDuedate('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Upload Study Material</h3>
              <p className="text-xs text-slate-500">Distribute notes, formula sheets, or DPP assignments (/creatematerial)</p>
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics - Thermodynamic Chapter Notes"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Material Type
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="notes">Class Notes / PDF</option>
                <option value="dpp">Daily Practice Problem (DPP)</option>
                <option value="assignment">Graded Assignment</option>
                <option value="video_link">Lecture Video URL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={duedate}
                onChange={(e) => setDuedate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Resource URL / File Link
            </label>
            <input
              type="url"
              value={resourseUrl}
              onChange={(e) => setResourseUrl(e.target.value)}
              placeholder="https://... or PDF / Drive URL"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide notes description or practice instructions..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-all"
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Material'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
