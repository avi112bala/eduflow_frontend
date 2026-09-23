import React from 'react'
import { Award, Calendar } from 'lucide-react'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'

interface CreateTestModalProps {
  show: boolean
  testForm: {
    subjectID: string
    testDuration: string
    testName: string
    testtype: string
    totalmarks: string
    date: string
  }
  setTestForm: React.Dispatch<
    React.SetStateAction<{
      subjectID: string
      testDuration: string
      testName: string
      testtype: string
      totalmarks: string
      date: string
    }>
  >
  classList: ISubjectClass[]
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export const CreateTestModal: React.FC<CreateTestModalProps> = ({
  show,
  testForm,
  setTestForm,
  classList,
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
              <Award className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Create Test
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-300" /> Exam Portal
                </span>
              </h3>
              <p className="text-xs text-blue-100/80 font-medium">
                Schedule mock & unit assessments
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
              Select Subject
            </label>
            <select
              value={testForm.subjectID}
              onChange={(e) =>
                setTestForm((p) => ({ ...p, subjectID: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              {classList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Test Name / Title
            </label>
            <input
              type="text"
              value={testForm.testName}
              onChange={(e) =>
                setTestForm((p) => ({ ...p, testName: e.target.value }))
              }
              placeholder="e.g. Unit Test #3 - Electrostatics"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={testForm.testDuration}
                onChange={(e) =>
                  setTestForm((p) => ({ ...p, testDuration: e.target.value }))
                }
                placeholder="60Min"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Marks
              </label>
              <input
                type="text"
                value={testForm.totalmarks}
                onChange={(e) =>
                  setTestForm((p) => ({ ...p, totalmarks: e.target.value }))
                }
                placeholder="100"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 cursor-pointer disabled:opacity-70 transition-all flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Test'}
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
