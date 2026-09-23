import React, { useState } from 'react'
import { X, Award, Loader2 } from 'lucide-react'
import type { ITestItem } from '../../../types/dashboard'

interface UploadMarksModalProps {
  isOpen: boolean
  onClose: () => void
  tests: ITestItem[]
  students: Array<{ _id: string; firstName: string; lastName: string }>
  onSubmit: (testId: string, marksData: Array<{ studentId: string; marksObtained: number; remarks?: string }>) => Promise<void>
  isSubmitting: boolean
}

export const UploadMarksModal: React.FC<UploadMarksModalProps> = ({
  isOpen,
  onClose,
  tests,
  students,
  onSubmit,
  isSubmitting
}) => {
  const [selectedTestId, setSelectedTestId] = useState(tests[0]?._id || '')
  const [marksState, setMarksState] = useState<Record<string, { marks: string; remarks: string }>>({})

  if (!isOpen) return null

  const handleMarkChange = (studentId: string, marks: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        marks
      }
    }))
  }

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { marks: '' }),
        remarks
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTestId) return

    const marksData = students.map((s) => ({
      studentId: s._id,
      marksObtained: Number(marksState[s._id]?.marks || 0),
      remarks: marksState[s._id]?.remarks || 'Evaluated'
    }))

    await onSubmit(selectedTestId, marksData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Enter Student Test Scores</h3>
              <p className="text-xs text-slate-500">Record marks obtained for batch evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Test *
            </label>
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            >
              {tests.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.testName} ({t.testtype} - Max Marks: {t.totalmarks})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Student Scores Roster ({students.length || 3} Students)
            </label>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {(students.length > 0
                ? students
                : [
                    { _id: 'std_1', firstName: 'Alex', lastName: 'Johnson' },
                    { _id: 'std_2', firstName: 'Rohan', lastName: 'Gupta' },
                    { _id: 'std_3', firstName: 'Sneha', lastName: 'Patel' }
                  ]
              ).map((s) => (
                <div key={s._id} className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="w-48">
                    <p className="text-xs font-extrabold text-slate-800">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {s._id}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      placeholder="Marks"
                      value={marksState[s._id]?.marks || ''}
                      onChange={(e) => handleMarkChange(s._id, e.target.value)}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Remarks (e.g. Good performance)"
                      value={marksState[s._id]?.remarks || ''}
                      onChange={(e) => handleRemarkChange(s._id, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
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
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Marks...
                </>
              ) : (
                'Submit All Marks'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
