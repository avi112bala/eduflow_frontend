import React, { useState } from 'react'
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  X,
  Zap
} from 'lucide-react'
import type { IQuizResultAnalysis } from '../../../types/dashboard'

interface QuizResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: IQuizResultAnalysis | null
  onOpenLeaderboard?: (testId: string, testName: string) => void
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onOpenLeaderboard
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all')

  if (!isOpen || !result) return null

  // Format time (seconds -> min:sec)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins}m ${rem}s`
  }

  const percentage = Math.round((result.marksObtained / (result.totalMarks || 1)) * 100)

  // Filter questions
  const filteredQuestions = result.questionReview.filter((item) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'correct') return item.isCorrect
    if (activeFilter === 'incorrect') {
      return !item.isCorrect && item.selectedOptionIndex !== undefined && item.selectedOptionIndex >= 0
    }
    if (activeFilter === 'unattempted') {
      return item.selectedOptionIndex === undefined || item.selectedOptionIndex === null || item.selectedOptionIndex < 0
    }
    return true
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <header className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                Evaluation Report & Analysis
              </span>
              <h2 className="text-lg font-black leading-tight text-white">
                {result.testName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLeaderboard && (
              <button
                onClick={() => {
                  onClose()
                  onOpenLeaderboard(result.testId, result.testName)
                }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm border border-white/20"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Live Leaderboard</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* Top Hero KPI Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Score */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-blue-100 dark:border-slate-700/80 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score Obtained</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{result.marksObtained}</span>
                <span className="text-xs font-bold text-slate-400">/ {result.totalMarks}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                {percentage}% Total Marks
              </p>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700/80 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accuracy Rate</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{result.accuracy}%</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                {result.correctAnswers} of {result.correctAnswers + result.incorrectAnswers} Attempted
              </p>
            </div>

            {/* Time Taken */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-amber-100 dark:border-slate-700/80 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time Spent</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {formatTime(result.timeSpentSeconds)}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                Pace: {(result.timeSpentSeconds / (result.totalQuestions || 1)).toFixed(0)}s / question
              </p>
            </div>

            {/* Question Breakdown */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-purple-100 dark:border-slate-700/80 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attempt Ratio</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                  +{result.correctAnswers}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-xs">
                  -{result.incorrectAnswers}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs">
                  {result.unattempted} Skip
                </span>
              </div>
            </div>
          </div>

          {/* AI / Smart Topic Diagnostics & Weak Topic Identification */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Topic Mastery & Performance Diagnostics
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {result.topicBreakdown.length} Topics Assessed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.topicBreakdown.map((t) => (
                <div
                  key={t.topic}
                  className={`p-4 rounded-2xl border transition-all ${
                    t.isWeak
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                      : t.accuracy >= 75
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {t.topic}
                        </span>
                        <span className="text-[10px] text-slate-400">({t.subject})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.correctCount} of {t.totalQuestions} questions correct
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          t.isWeak
                            ? 'bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300'
                            : t.accuracy >= 75
                            ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {t.accuracy}% Accuracy
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        t.isWeak ? 'bg-rose-500' : t.accuracy >= 75 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${t.accuracy}%` }}
                    />
                  </div>

                  {/* Actionable Advice */}
                  {t.isWeak && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-700 dark:text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Weak Area: Revise formulas and practice DPP exercises for this unit.</span>
                    </div>
                  )}
                  {t.accuracy >= 75 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Mastered: Excellent conceptual clarity on this topic!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Question-Wise Detailed Review */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Detailed Question-by-Question Review
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyze correct answers, chosen options, and step-by-step explanations
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      activeFilter === filter
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map(({ question: q, selectedOptionIndex, isCorrect }, idx) => {
                const isUnattempted = selectedOptionIndex === undefined || selectedOptionIndex === null || selectedOptionIndex < 0

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                        : isUnattempted
                        ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
                        : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          Q{idx + 1}.
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {q.topic}
                        </span>
                      </div>

                      <div>
                        {isCorrect ? (
                          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.points})
                          </span>
                        ) : isUnattempted ? (
                          <span className="text-[11px] font-black text-slate-400 flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" /> Skipped (0)
                          </span>
                        ) : (
                          <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect (-{q.negativePoints || 0})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Statement */}
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {q.question}
                    </p>

                    {/* Options Review */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectOption = optIdx === q.correctOptionIndex
                        const isUserOption = optIdx === selectedOptionIndex

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
                              isCorrectOption
                                ? 'bg-emerald-100/70 dark:bg-emerald-950/70 border-emerald-400 text-emerald-900 dark:text-emerald-100 font-bold'
                                : isUserOption
                                ? 'bg-rose-100/70 dark:bg-rose-950/70 border-rose-400 text-rose-900 dark:text-rose-100'
                                : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>
                              <strong className="mr-1.5">{String.fromCharCode(65 + optIdx)}.</strong>
                              {opt}
                            </span>
                            {isCorrectOption && (
                              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-900 rounded">
                                Correct
                              </span>
                            )}
                            {isUserOption && !isCorrectOption && (
                              <span className="text-[10px] font-black text-rose-700 dark:text-rose-300 uppercase px-1.5 py-0.5 bg-rose-200 dark:bg-rose-900 rounded">
                                Your Choice
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Step-by-step Solution */}
                    {q.explanation && (
                      <div className="mt-3.5 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs space-y-1">
                        <p className="font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Explanation & Solution:
                        </p>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400 font-semibold">
            Results automatically recorded in your student profile.
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    </div>
  )
}
