import React, { useState } from 'react'
import {
  Award,
  Trophy,
  PlusCircle,
  CheckCircle2,
  PlayCircle,
  Clock,
  Sparkles
} from 'lucide-react'
import type { ITestResult, ITestItem } from '../../../types/dashboard'

interface TestsTabProps {
  userRole: string
  testResults: ITestResult[]
  testsList: ITestItem[]
  onOpenLeaderboard: (testId: string, testName: string) => void
  onOpenUploadMarks?: () => void
  onOpenCreateTest?: () => void
  onOpenManageQuestions?: (testId?: string) => void
  onStartQuiz: (testItem: ITestItem) => void
}

export const TestsTab: React.FC<TestsTabProps> = ({
  userRole,
  testResults,
  testsList,
  onOpenLeaderboard,
  onOpenUploadMarks,
  onOpenCreateTest,
  onOpenManageQuestions,
  onStartQuiz
}) => {
  const normalizedRole = userRole.toLowerCase()
  const isTeacherOrAdmin = normalizedRole === 'teacher' || normalizedRole === 'admin'
  const [activeSection, setActiveSection] = useState<'available' | 'results'>('available')

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Online Tests & Performance Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Take timed MCQ exams with live auto-grading, instant rankings, and weak-topic analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isTeacherOrAdmin && (
            <>
              {onOpenCreateTest && (
                <button
                  onClick={onOpenCreateTest}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create Test
                </button>
              )}
              {onOpenManageQuestions && (
                <button
                  onClick={() => onOpenManageQuestions()}
                  className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800/60"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Questions
                </button>
              )}
              {onOpenUploadMarks && (
                <button
                  onClick={onOpenUploadMarks}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  Upload Marks
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation Pills (Available Tests vs Past Results) */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSection('available')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'available'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active & Live Quizzes ({testsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('results')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'results'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Past Evaluations & Reports ({testResults.length})</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tests Completed</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{testResults.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Best Rank</p>
          <p className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">
            #{testResults.length > 0 ? Math.min(...testResults.map((t) => t.rank || 999), 1) : '-'}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg. Percentile</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {testResults.length > 0
              ? (
                  testResults.reduce((acc, t) => acc + (t.percentile || 90), 0) /
                  testResults.length
                ).toFixed(1)
              : '0.0'}
            %
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg. Accuracy</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {testResults.length > 0
              ? (
                  testResults.reduce((acc, t) => acc + (t.accuracy || 90), 0) /
                  testResults.length
                ).toFixed(1)
              : '0.0'}
            %
          </p>
        </div>
      </div>

      {/* SECTION 1: Active & Live Quizzes */}
      {activeSection === 'available' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-emerald-500" />
              Available Quizzes Ready to Take
            </h3>
            <span className="text-xs text-slate-400">Timed MCQ Engine with Instant Grading</span>
          </div>

          {testsList.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No active tests scheduled right now
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isTeacherOrAdmin
                  ? 'Click "Create Test" at the top to publish a new mock or unit test for your students.'
                  : 'Your faculty will publish upcoming tests and quizzes here. Please check back soon.'}
              </p>
              {isTeacherOrAdmin && onOpenCreateTest && (
                <button
                  onClick={onOpenCreateTest}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create a New Test
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testsList.map((test) => {
                return (
                  <div
                    key={test._id || test.id || test.testName}
                    className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                          {test.subjectName || 'Science & Math'}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          {test.testtype || 'Live Test'}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {test.testName}
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>{test.testDuration || '60Min'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{test.totalmarks || 100} Marks</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenLeaderboard(test._id || test.id || 't1', test.testName)}
                          className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
                        >
                          Leaderboard
                        </button>
                        {isTeacherOrAdmin && onOpenManageQuestions && (
                          <button
                            onClick={() => onOpenManageQuestions(test._id || test.id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            Add MCQs
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => onStartQuiz(test)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Start Test
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Completed Test Results */}
      {activeSection === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              Completed Test Results & Reports
            </h3>
            <span className="text-xs text-slate-400">{testResults.length} Evaluations</span>
          </div>

          {testResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No evaluations or test scores yet
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Take an active quiz or wait for teacher evaluations to view your detailed scorecards, percentiles, and rankings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map((result) => (
                <div
                  key={result.testId}
                  className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-700/60">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                        {result.subject}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                        {result.testName}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Completed on {result.date}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {result.rank && (
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          Rank #{result.rank}
                        </span>
                      )}
                      <button
                        onClick={() => onOpenLeaderboard(result.testId, result.testName)}
                        className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer"
                      >
                        View Leaderboard &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Score Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100/80 dark:border-slate-700/60">
                      <p className="text-[10px] font-bold text-slate-400">Score</p>
                      <p className="font-black text-slate-900 dark:text-white text-sm mt-0.5">
                        {result.marksObtained}/{result.totalMarks}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100/80 dark:border-slate-700/60">
                      <p className="text-[10px] font-bold text-slate-400">Percentile</p>
                      <p className="font-black text-blue-600 dark:text-blue-400 text-sm mt-0.5">
                        {result.percentile}%
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100/80 dark:border-slate-700/60">
                      <p className="text-[10px] font-bold text-slate-400">Accuracy</p>
                      <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                        {result.accuracy}%
                      </p>
                    </div>
                  </div>

                  {result.remarks && (
                    <p className="text-xs text-slate-600 dark:text-slate-200 bg-blue-50/40 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-100/50 dark:border-blue-900/40 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{result.remarks}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

