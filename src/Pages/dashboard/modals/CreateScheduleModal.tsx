import React, { useState } from 'react'
import { X, Clock, Loader2 } from 'lucide-react'
import type { ISubjectClass } from '../../../apiRequest/studentRequest'
import type { IScheduleClassPayload } from '../../../apiRequest/scheduleRequest'

interface CreateScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  classList: ISubjectClass[]
  onSubmit: (payload: IScheduleClassPayload) => Promise<void>
  isSubmitting: boolean
}

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  classList,
  onSubmit,
  isSubmitting
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    classList[0]?._id || ''
  )
  const [topic, setTopic] = useState<string>('')
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [time, setTime] = useState<string>('10:00')
  const [room, setRoom] = useState<string>('Room 102')
  const [meetingLink, setMeetingLink] = useState<string>('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubjectId && classList.length > 0) {
      setSelectedSubjectId(classList[0]._id)
    }
    const finalSubjectId = selectedSubjectId || (classList[0]?._id ?? '')

    if (!finalSubjectId || !topic.trim() || !room.trim()) return

    // Convert date + time to unix timestamp in seconds for backend
    const combinedDateTime = new Date(`${date}T${time}:00`)
    const timestampSec = !isNaN(combinedDateTime.getTime())
      ? String(Math.floor(combinedDateTime.getTime() / 1000))
      : String(Math.floor(Date.now() / 1000))

    const payload: IScheduleClassPayload = {
      subjectId: finalSubjectId,
      date: timestampSec,
      topic: topic.trim(),
      startTime: timestampSec,
      room: room.trim(),
      meetingLink: meetingLink.trim()
    }

    await onSubmit(payload)
    setTopic('')
    setMeetingLink('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Schedule Class (/scheduleClass)</h3>
              <p className="text-xs text-slate-500">Publish lecture topic, timing, room & live meet link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject *
            </label>
            <select
              value={selectedSubjectId || classList[0]?._id || ''}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              {classList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.description ? `— ${c.description}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Lecture Topic *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Thermodynamics & Heat Transfer"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Class Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Room / Hall Allocation *
            </label>
            <input
              type="text"
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 102 / Lecture Hall B"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meeting Link (Google Meet / Zoom - Optional)
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz-abc-def"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Schedule...
                </>
              ) : (
                'Schedule Class'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
