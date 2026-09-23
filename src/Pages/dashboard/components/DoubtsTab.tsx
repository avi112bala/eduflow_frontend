import React, { useState } from 'react'
import {
  HelpCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Trash2,
  Image as ImageIcon
} from 'lucide-react'
import type { IDoubtItem } from '../../../types/dashboard'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'
import { DoubtsSkeleton } from '../../../components/skeletons/DashboardSkeleton'

interface DoubtsTabProps {
  doubts: IDoubtItem[]
  userRole: string
  classList?: ISubjectClass[]
  isLoading?: boolean
  onOpenAskDoubt: () => void
  onOpenReplyDoubt: (doubt: IDoubtItem) => void
  onDeleteDoubt?: (doubtId: string) => void
}

export const DoubtsTab: React.FC<DoubtsTabProps> = ({
  doubts,
  userRole,
  classList = [],
  isLoading = false,
  onOpenAskDoubt,
  onOpenReplyDoubt,
  onDeleteDoubt
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL')
  const normalizedRole = userRole.toLowerCase()
  const isTeacher = normalizedRole === 'teacher'
  const isTeacherOrAdmin = normalizedRole === 'teacher' || normalizedRole === 'admin'

  const filteredDoubts = doubts.filter((d) => {
    const type = (d.doubtType || d.status || 'pending').toLowerCase()
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'PENDING') return type === 'pending' || type === 'open'
    if (activeFilter === 'RESOLVED') return type === 'resolved'
    return true
  })

  const getSubjectDisplay = (doubt: IDoubtItem) => {
    if (typeof doubt.subjectId === 'object' && doubt.subjectId?.name) {
      return doubt.subjectId.name
    }
    const match = classList.find((c) => c._id === (typeof doubt.subjectId === 'string' ? doubt.subjectId : ''))
    return match?.name || doubt.subjectName || 'Subject'
  }

  const getStudentDisplay = (doubt: IDoubtItem) => {
    if (typeof doubt.userId === 'object' && doubt.userId?.firstName) {
      return `${doubt.userId.firstName} ${doubt.userId.lastName || ''}`.trim()
    }
    return doubt.userName || doubt.studentName || 'Student'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            Doubt Clearing & Q&A Desk
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ask concept questions, get faculty step-by-step explanations, and review solutions
          </p>
        </div>

        {!isTeacherOrAdmin && (
          <button
            onClick={onOpenAskDoubt}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Ask a Doubt
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'PENDING', 'RESOLVED'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {filter === 'ALL' ? 'All Doubts' : filter === 'PENDING' ? 'Pending Doubts' : 'Resolved'}
          </button>
        ))}
      </div>

      {/* Doubts List */}
      {isLoading && doubts.length === 0 ? (
        <DoubtsSkeleton />
      ) : filteredDoubts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No doubts posted yet</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
            {!isTeacherOrAdmin
              ? 'Have a question? Click "Ask a Doubt" above to post your first doubt to faculty.'
              : 'No student doubts pending for resolution right now.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => {
            const isResolved =
              (doubt.doubtType || doubt.status || '').toLowerCase() === 'resolved'
            const mediaUrl = doubt.media || doubt.imageUrl || ''
            const doubtContent = doubt.doubt || doubt.questionText || ''

            return (
              <div
                key={doubt._id}
                className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                  isResolved
                    ? 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-700/80 hover:border-slate-200'
                    : 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60 shadow-xs'
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      {getSubjectDisplay(doubt)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">
                      Asked by <b className="text-slate-700 dark:text-slate-200">{getStudentDisplay(doubt)}</b>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Answer
                      </span>
                    )}

                    {onDeleteDoubt && (
                      <button
                        onClick={() => onDeleteDoubt(doubt._id)}
                        title="Delete Doubt (/deletedoubt)"
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Doubt Body */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{doubt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 leading-relaxed font-normal">
                    {doubtContent}
                  </p>
                  {mediaUrl && (
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 mt-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      View Attached Problem Screenshot &rarr;
                    </a>
                  )}
                </div>

                {/* Solution Section (if answered) */}
                {isResolved && doubt.answerText && (
                  <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Faculty Explanation ({doubt.answeredBy || 'Faculty'})
                      </span>
                      {doubt.answeredAt && (
                        <span className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400">
                          {doubt.answeredAt}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-100 leading-relaxed font-normal whitespace-pre-wrap">
                      {doubt.answerText}
                    </p>
                    {doubt.solutionImageUrl && (
                      <a
                        href={doubt.solutionImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline block pt-1"
                      >
                        View Solution Image &rarr;
                      </a>
                    )}
                  </div>
                )}

                {/* Teacher Answer Button (Only for Teacher) */}
                {isTeacher && !isResolved && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onOpenReplyDoubt(doubt)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Resolve Doubt
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
