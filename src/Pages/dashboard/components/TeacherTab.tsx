import React from 'react'
import {
  GraduationCap,
  BookOpen,
  PlusCircle,
  Award,
  ClipboardList,
  UserCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
  CalendarDays
} from 'lucide-react'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'

interface TeacherTabProps {
  userRole: string
  classList: ISubjectClass[]
  onOpenCreateSubject: () => void
  onOpenCreateTest: () => void
  onOpenManageQuestions?: () => void
  onOpenTeacherAttendance: () => void
  onOpenSelfAttendance: () => void
  onOpenUploadMarks?: () => void
  onOpenUploadMaterial?: () => void
  onOpenDoubts?: () => void
  onOpenLeaves?: () => void
}

export const TeacherTab: React.FC<TeacherTabProps> = ({
  userRole,
  classList,
  onOpenCreateSubject,
  onOpenCreateTest,
  onOpenManageQuestions,
  onOpenTeacherAttendance,
  onOpenSelfAttendance,
  onOpenUploadMarks,
  onOpenUploadMaterial,
  onOpenDoubts,
  onOpenLeaves
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Teacher Management Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage academic subjects, tests, MCQs, student attendance, marks grading, study material, and doubt resolution
          </p>
        </div>
        <span className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full w-fit">
          Role: {userRole}
        </span>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Create Subject */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Subject</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
              Add a new academic subject with descriptions (/create-subject)
            </p>
          </div>
          <button
            onClick={onOpenCreateSubject}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            New Subject
          </button>
        </div>

        {/* 2. Create Test */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Test</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
              Publish unit tests or mock tests (/create-test)
            </p>
          </div>
          <button
            onClick={onOpenCreateTest}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            New Test
          </button>
        </div>

        {/* 2b. Author Questions & Options */}
        {onOpenManageQuestions && (
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Author Questions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                Add MCQs, options, correct answers & explanations to any test
              </p>
            </div>
            <button
              onClick={onOpenManageQuestions}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Manage Questions
            </button>
          </div>
        )}

        {/* 3. Mark Student Attendance */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Attendance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
              Record student presence or absence (/teacher-markattandance)
            </p>
          </div>
          <button
            onClick={onOpenTeacherAttendance}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            Mark Student
          </button>
        </div>

        {/* 4. Teacher Self Attendance Check-In */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty Attendance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
              Mark your own lecture presence (/teacher-markattandance)
            </p>
          </div>
          <button
            onClick={onOpenSelfAttendance}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Self Attendance
          </button>
        </div>

        {/* 5. Upload Marks */}
        {onOpenUploadMarks && (
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Marks</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                Grade student test submissions and publish scorecards
              </p>
            </div>
            <button
              onClick={onOpenUploadMarks}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              Grade Students
            </button>
          </div>
        )}

        {/* 6. Upload Study Materials */}
        {onOpenUploadMaterial && (
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Study Materials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                Upload chapter PDFs, DPP practice sheets & notes
              </p>
            </div>
            <button
              onClick={onOpenUploadMaterial}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Upload Resource
            </button>
          </div>
        )}

        {/* 7. Doubts Desk */}
        {onOpenDoubts && (
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Doubt Clearing Desk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                Resolve unanswered questions posted by students
              </p>
            </div>
            <button
              onClick={onOpenDoubts}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Answer Doubts
            </button>
          </div>
        )}

        {/* 8. Leave Requests */}
        {onOpenLeaves && (
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Leaves</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                Review, approve, or reject student absence applications
              </p>
            </div>
            <button
              onClick={onOpenLeaves}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" />
              Review Leaves
            </button>
          </div>
        )}
      </div>

      {/* Current Subjects Overview */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Active Subjects ({classList.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {classList.map((cls) => (
            <div key={cls._id} className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{cls.name}</span>
              <p className="text-xs text-slate-600 dark:text-slate-200 mt-1 line-clamp-2">
                {cls.description || 'Core curriculum'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-1.5 truncate">
                ID: {cls._id}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
