import React, { useState } from 'react'
import {
  Download,
  UploadCloud,
  PlusCircle,
  BookOpen,
  Calendar,
  Layers,
  Trash2
} from 'lucide-react'
import type { IStudyMaterial } from '../../../types/dashboard'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'

interface StudyMaterialTabProps {
  materials: IStudyMaterial[]
  classList: ISubjectClass[]
  userRole: string
  onOpenUploadModal?: () => void
  onDeleteMaterial?: (materialId: string) => void
  onSubmitAssignment?: (assignmentId: string) => void
}

export const StudyMaterialTab: React.FC<StudyMaterialTabProps> = ({
  materials,
  classList,
  userRole,
  onOpenUploadModal,
  onDeleteMaterial
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const normalizedRole = userRole.toLowerCase()
  const isTeacherOrAdmin = normalizedRole === 'teacher' || normalizedRole === 'admin'

  const filteredMaterials = materials.filter((m) => {
    const itemSubId = typeof m.subjectId === 'object' ? m.subjectId?._id : m.subjectId
    const matchSubject = selectedSubjectId === 'all' || itemSubId === selectedSubjectId
    const matchType = filterType === 'all' || m.materialType === filterType
    return matchSubject && matchType
  })

  const getSubjectDisplay = (mat: IStudyMaterial) => {
    if (typeof mat.subjectId === 'object' && mat.subjectId?.name) {
      return mat.subjectId.name
    }
    const match = classList.find((c) => c._id === (typeof mat.subjectId === 'string' ? mat.subjectId : ''))
    return match?.name || mat.subjectName || 'Study Material'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Study Materials & DPP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Access chapter notes, formula sheets, video lecture recordings, and assignments
          </p>
        </div>

        {isTeacherOrAdmin && onOpenUploadModal && (
          <button
            onClick={onOpenUploadModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Upload New Resource
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubjectId === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Subjects
          </button>
          {classList.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedSubjectId(c._id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubjectId === c._id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Material Types</option>
            <option value="notes">Class Notes / Handouts</option>
            <option value="dpp">Daily Practice Problems (DPP)</option>
            <option value="assignment">Assignments</option>
            <option value="video_link">Recorded Videos</option>
          </select>
        </div>
      </div>

      {/* Material Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-100 dark:border-slate-700/80 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No study materials found</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 max-w-sm mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Upload New Resource" above to distribute your first notes or assignment.'
              : 'Your faculty has not uploaded study materials for this subject yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => {
            const typeBadge =
              mat.materialType === 'dpp'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                : mat.materialType === 'assignment'
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                : mat.materialType === 'video_link'
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'

            const resourceUrl = mat.resourseUrl || mat.fileUrl || ''
            const dueDateText = mat.duedate || mat.dueDate

            return (
              <div
                key={mat._id}
                className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${typeBadge}`}>
                        {mat.materialType || 'notes'}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-200 px-2 py-0.5 rounded-md">
                        {getSubjectDisplay(mat)}
                      </span>
                    </div>

                    {isTeacherOrAdmin && onDeleteMaterial && (
                      <button
                        onClick={() => onDeleteMaterial(mat._id)}
                        title="Delete Material (/deletematerial)"
                        className="p-1.5 text-slate-300 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">{mat.title}</h3>

                  {mat.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2">{mat.description}</p>
                  )}

                  {dueDateText && (
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due on {dueDateText}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  {resourceUrl ? (
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      View / Download Resource
                    </a>
                  ) : (
                    <span className="flex-1 py-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                      No Resource Link Attached
                    </span>
                  )}

                  {mat.materialType === 'assignment' && (
                    <button
                      onClick={() => alert(`Homework submission window opened for ${mat.title}`)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Submit
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
