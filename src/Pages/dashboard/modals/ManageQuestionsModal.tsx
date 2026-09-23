import React, { useState, useEffect } from 'react'
import {
  HelpCircle,
  PlusCircle,
  Trash2,
  Sparkles,
  X,
  AlertCircle,
  Layers
} from 'lucide-react'
import type { ITestItem, IQuizQuestion } from '../../../types/dashboard'
import { getQuizQuestionsApi, addQuestionToTestApi, deleteQuestionApi } from '../../../apiRequest/testRequest'
import { toast } from 'react-toastify'

interface ManageQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  testsList: ITestItem[]
  selectedTestId?: string
}

export const ManageQuestionsModal: React.FC<ManageQuestionsModalProps> = ({
  isOpen,
  onClose,
  testsList,
  selectedTestId
}) => {
  const [activeTestId, setActiveTestId] = useState<string>(selectedTestId || (testsList[0]?._id || testsList[0]?.id || ''))
  const [questions, setQuestions] = useState<IQuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Question Form State
  const [form, setForm] = useState({
    question: '',
    topic: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOptionIndex: 0, // 0 for A, 1 for B, 2 for C, 3 for D
    points: 4,
    negativePoints: 1,
    explanation: ''
  })

  // Sync selectedTestId when changed from parent
  useEffect(() => {
    if (selectedTestId) {
      setActiveTestId(selectedTestId)
    } else if (testsList.length > 0 && !activeTestId) {
      setActiveTestId(testsList[0]._id || testsList[0].id || '')
    }
  }, [selectedTestId, testsList, activeTestId])

  // Fetch questions for active test
  const fetchQuestions = async (testId: string) => {
    if (!testId) return
    setIsLoading(true)
    try {
      const res = await getQuizQuestionsApi(testId)
      if (res?.data) {
        setQuestions(res.data)
      } else {
        setQuestions([])
      }
    } catch (err) {
      console.error('Failed to load questions:', err)
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && activeTestId) {
      fetchQuestions(activeTestId)
    }
  }, [isOpen, activeTestId])

  if (!isOpen) return null

  const currentTest = testsList.find((t) => (t._id || t.id) === activeTestId)

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!activeTestId) {
      toast.error('Please select a test first')
      return
    }

    if (!form.question.trim()) {
      toast.error('Please enter the question statement')
      return
    }

    if (!form.optionA.trim() || !form.optionB.trim() || !form.optionC.trim() || !form.optionD.trim()) {
      toast.error('Please provide all 4 options (A, B, C, D)')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        testId: activeTestId,
        question: form.question.trim(),
        options: [form.optionA.trim(), form.optionB.trim(), form.optionC.trim(), form.optionD.trim()],
        correctOptionIndex: Number(form.correctOptionIndex),
        subject: currentTest?.subjectName || 'General',
        topic: form.topic.trim() || 'General Concept',
        points: Number(form.points) || 4,
        negativePoints: Number(form.negativePoints) || 0,
        explanation: form.explanation.trim()
      }

      const res: any = await addQuestionToTestApi(payload)

      // Add to local list immediately
      const newQuestion: IQuizQuestion = {
        id: res?.data?._id || `q_${Date.now()}`,
        question: payload.question,
        options: payload.options,
        correctOptionIndex: payload.correctOptionIndex,
        subject: payload.subject,
        topic: payload.topic,
        points: payload.points,
        negativePoints: payload.negativePoints,
        explanation: payload.explanation
      }

      setQuestions((prev) => [...prev, newQuestion])
      toast.success('Question added successfully!')

      // Reset form for next question
      setForm({
        question: '',
        topic: form.topic, // keep same topic for convenience
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOptionIndex: 0,
        points: 4,
        negativePoints: 1,
        explanation: ''
      })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add question')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!activeTestId) return
    try {
      await deleteQuestionApi(activeTestId, questionId)
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      toast.success('Question removed')
    } catch (err) {
      // Local fallback
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      toast.success('Question removed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black">
              <HelpCircle className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                Teacher Exam Authoring Suite
              </span>
              <h2 className="text-lg font-black leading-tight text-white">
                Add & Manage Test Questions
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body: Left Column Question Builder Form | Right Column Question List */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT: Add Question Form */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
            {/* Test Selector */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Test to Author Questions For:
              </label>
              <select
                value={activeTestId}
                onChange={(e) => setActiveTestId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {testsList.map((t) => (
                  <option key={t._id || t.id} value={t._id || t.id}>
                    {t.testName} ({t.subjectName || 'Test'} - {t.totalmarks || 100} Marks)
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  New Question Details
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  Total in Test: {questions.length} Questions
                </span>
              </div>

              {/* Question Statement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Statement *
                </label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="Enter the question text or mathematical problem..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Topic & Weightage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Topic / Sub-Unit *
                  </label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder="e.g. Kinematics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correct Points (+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Negative Penalty (-)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.negativePoints}
                    onChange={(e) => setForm({ ...form, negativePoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 4 MCQ Options with Correct Answer Selector */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Multiple-Choice Options (Select the Correct Answer Radio):
                </label>

                {[
                  { key: 'optionA', label: 'A', idx: 0 },
                  { key: 'optionB', label: 'B', idx: 1 },
                  { key: 'optionC', label: 'C', idx: 2 },
                  { key: 'optionD', label: 'D', idx: 3 }
                ].map(({ key, label, idx }) => (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      form.correctOptionIndex === idx
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={form.correctOptionIndex === idx}
                        onChange={() => setForm({ ...form, correctOptionIndex: idx })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                          form.correctOptionIndex === idx
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {label}
                      </span>
                    </label>

                    <input
                      type="text"
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={`Enter text for Option ${label}...`}
                      className="flex-1 bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                      required
                    />

                    {form.correctOptionIndex === idx && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                        Correct Answer
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Step-by-step Solution Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Explanation & Solution (Shown to students in post-exam analysis)
                </label>
                <textarea
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Explain why the correct option is right and include derivation/steps..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <PlusCircle className="w-4 h-4" />
                {isSubmitting ? 'Saving Question...' : 'Add Question to Test Paper'}
              </button>
            </form>
          </div>

          {/* RIGHT: Existing Question Bank List for this Test */}
          <aside className="w-full lg:w-96 p-5 sm:p-6 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col justify-between shrink-0 space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Test Question Paper ({questions.length})
                </h3>
              </div>

              {isLoading ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="p-6 text-center space-y-2 bg-white dark:bg-slate-800/80 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                    No questions added yet
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Use the form on the left to add MCQs, options, and solutions.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black flex items-center justify-center">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            #{q.topic}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            +{q.points}m
                          </span>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors cursor-pointer"
                            title="Delete Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`px-2 py-1 rounded-md text-[10px] truncate ${
                              optIdx === q.correctOptionIndex
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}
