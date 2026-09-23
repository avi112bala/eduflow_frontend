import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Clock,
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react'
import type { IQuizQuestion, ITestItem } from '../../../types/dashboard'

interface QuizPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  testItem: ITestItem | null
  questions: IQuizQuestion[]
  isLoadingQuestions: boolean
  onSubmitQuiz: (answers: Record<string, number>, timeSpentSeconds: number) => void
}

export const QuizPlayerModal: React.FC<QuizPlayerModalProps> = ({
  isOpen,
  onClose,
  testItem,
  questions,
  isLoadingQuestions,
  onSubmitQuiz
}) => {
  // Parse test duration in minutes (e.g., "60Min", "180Min", 30, etc.)
  const durationMinutes = useMemo(() => {
    if (!testItem?.testDuration) return 15
    const parsed = parseInt(testItem.testDuration.replace(/[^0-9]/g, ''), 10)
    return isNaN(parsed) || parsed <= 0 ? 15 : Math.min(parsed, 180)
  }, [testItem?.testDuration])

  const totalDurationSeconds = durationMinutes * 60

  const [timeRemaining, setTimeRemaining] = useState<number>(totalDurationSeconds)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false)

  // Reset state when opening a new quiz
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(totalDurationSeconds)
      setCurrentIndex(0)
      setAnswers({})
      setMarkedForReview({})
      setShowConfirmSubmit(false)
    }
  }, [isOpen, totalDurationSeconds, testItem?._id])

  const timeSpentSeconds = totalDurationSeconds - timeRemaining

  const handleFinalSubmit = useCallback(() => {
    onSubmitQuiz(answers, timeSpentSeconds)
  }, [answers, timeSpentSeconds, onSubmitQuiz])

  // Timer Tick & Auto-Submit
  useEffect(() => {
    if (!isOpen || isLoadingQuestions || questions.length === 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinalSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, isLoadingQuestions, questions.length, handleFinalSubmit])

  if (!isOpen || !testItem) return null

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`
  }

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== null
  ).length
  const reviewCount = Object.keys(markedForReview).filter((k) => markedForReview[k]).length
  const unattemptedCount = Math.max(0, totalQuestions - answeredCount)

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }))
  }

  const handleClearResponse = () => {
    if (!currentQuestion) return
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[currentQuestion.id]
      return copy
    })
  }

  const handleToggleReview = () => {
    if (!currentQuestion) return
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }))
  }

  // Timer Color logic
  const isUrgent = timeRemaining < 120 // < 2 min
  const isWarning = timeRemaining < 300 // < 5 min

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[96vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <header className="px-4 sm:px-6 py-3.5 bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  {testItem.testtype || 'Live Exam'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {testItem.subjectName || 'Online Quiz'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                {testItem.testName}
              </h2>
            </div>
          </div>

          {/* Center Timer Display */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono text-sm font-black border transition-all ${
                isUrgent
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                  : isWarning
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
              {isUrgent && <span className="text-[10px] font-sans font-bold uppercase ml-1">Ending Soon!</span>}
            </div>

            {/* Submit Action */}
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Test
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="Exit Test"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Loading State */}
        {isLoadingQuestions ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Loading test paper and questions...
            </p>
          </div>
        ) : totalQuestions === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No questions found for this test
            </h3>
            <p className="text-xs text-slate-400">
              The teacher has not added questions yet. Please check back later.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold text-xs"
            >
              Go Back
            </button>
          </div>
        ) : (
          /* Main Interactive Test Area */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left/Main Column: Question & Options */}
            <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
              <div className="space-y-5">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-slate-500 dark:text-slate-400">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                      #{currentQuestion?.topic || 'Concept'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                      +{currentQuestion?.points || 4} Marks
                    </span>
                    {(currentQuestion?.negativePoints || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-200 dark:border-rose-800/60">
                        -{currentQuestion?.negativePoints} Negative
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                    {currentQuestion?.question}
                  </p>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3 pt-1">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Select Your Answer:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQuestion?.options.map((optionText, optIdx) => {
                      const isSelected = answers[currentQuestion.id] === optIdx
                      const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer group ${
                            isSelected
                              ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20 shadow-sm'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                            }`}
                          >
                            {optionLetters[optIdx] || optIdx + 1}
                          </div>
                          <span className="text-sm font-semibold leading-normal flex-1">
                            {optionText}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleReview}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      markedForReview[currentQuestion?.id]
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {markedForReview[currentQuestion?.id] ? 'Marked for Review' : 'Mark for Review'}
                  </button>

                  {answers[currentQuestion?.id] !== undefined && (
                    <button
                      onClick={handleClearResponse}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      Next Question
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      Finish & Review
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Question Matrix Palette */}
            <aside className="w-full lg:w-80 p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col justify-between shrink-0 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Question Navigator
                  </h3>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {answeredCount}/{totalQuestions} Answered
                  </span>
                </div>

                {/* Status Chips */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black">
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 p-2 rounded-xl">
                    <p className="text-base font-black leading-none mb-0.5">{answeredCount}</p>
                    <span>Answered</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 p-2 rounded-xl">
                    <p className="text-base font-black leading-none mb-0.5">{reviewCount}</p>
                    <span>Review</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 p-2 rounded-xl">
                    <p className="text-base font-black leading-none mb-0.5">{unattemptedCount}</p>
                    <span>Left</span>
                  </div>
                </div>

                {/* Interactive Number Matrix */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-400 mb-2">Jump to Question:</p>
                  <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
                    {questions.map((q, idx) => {
                      const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null
                      const isMarked = markedForReview[q.id]
                      const isActive = currentIndex === idx

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-10 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer relative ${
                            isActive
                              ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 z-10'
                              : ''
                          } ${
                            isAnswered
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                              : isMarked
                              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {idx + 1}
                          {isMarked && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-white dark:border-slate-900" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Legend Help */}
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span>Unattempted Question</span>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 text-amber-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Ready to Submit Exam?
                </h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between font-semibold">
                  <span>Total Questions:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{totalQuestions}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Answered:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Marked for Review:</span>
                  <span className="font-bold text-amber-500">{reviewCount}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Unattempted:</span>
                  <span className="font-bold text-rose-500">{unattemptedCount}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Once submitted, your answers will be automatically graded and your rank will be computed.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Continue Test
                </button>
                <button
                  onClick={() => {
                    setShowConfirmSubmit(false)
                    handleFinalSubmit()
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
