import React from 'react'
import { X, Trophy, Medal } from 'lucide-react'
import type { ILeaderboardEntry } from '../../../types/dashboard'

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
  testName: string
  leaderboard: ILeaderboardEntry[]
  isLoading?: boolean
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  testName,
  leaderboard,
  isLoading
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Batch Leaderboard</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px] sm:max-w-xs">{testName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading standings...</div>
          ) : leaderboard.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No ranks recorded for this test yet.</div>
          ) : (
            leaderboard.map((entry) => {
              const isTop3 = entry.rank <= 3
              const rankBg =
                entry.rank === 1
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : entry.rank === 2
                  ? 'bg-slate-200 text-slate-800 border-slate-300'
                  : entry.rank === 3
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-100'

              return (
                <div
                  key={entry.rank}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    entry.studentName.includes('You')
                      ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border shrink-0 ${rankBg}`}
                    >
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        {entry.studentName}
                        {isTop3 && <Medal className="w-3.5 h-3.5 text-amber-500" />}
                      </p>
                      <p className="text-[10px] text-slate-400">Total Marks: {entry.totalMarks}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-slate-900">{entry.score}</span>
                    <span className="text-[10px] font-bold text-slate-400 block">Marks</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
