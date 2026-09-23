import { apiService } from '../api/apiServices'
import type { ClassItem } from '../types/dashboard'

export interface IScheduleClassPayload {
  subjectId: string
  date: string // unix timestamp or string date
  topic: string
  startTime: string // timestamp or formatted time string
  room: string
  meetingLink?: string
}

export interface IScheduleClassItem {
  _id: string
  id?: string
  subjectId: string | { _id: string; name: string }
  subjectName?: string
  topic: string
  date: string | number
  startTime: string | number
  room: string
  meetingLink?: string
  teacherId?: string | { _id: string; firstName: string; lastName: string }
  createdAt?: string
}

const formatScheduleTime = (startTime: string | number): string => {
  if (!startTime) return '10:00 AM - 11:30 AM'
  const str = String(startTime).trim()

  // If it's already a formatted string like "10:00 AM"
  if (str.includes(':') || str.toLowerCase().includes('am') || str.toLowerCase().includes('pm')) {
    return str
  }

  // If it's a numeric unix timestamp
  const num = Number(str)
  if (!isNaN(num) && num > 0) {
    const d = new Date(num > 1e11 ? num : num * 1000)
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  return str
}

const formatScheduleDay = (dateVal: string | number): string => {
  if (!dateVal) return 'Today'
  const str = String(dateVal).trim()

  const num = Number(str)
  if (!isNaN(num) && num > 0) {
    const d = new Date(num > 1e11 ? num : num * 1000)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
    }
  }

  return str
}

export const getScheduleApi = async (): Promise<{ data: ClassItem[]; raw?: IScheduleClassItem[] }> => {
  try {
    const response: any = await apiService.get('/getscheduleclass')
    let rawList: any[] = []

    if (response?.data && Array.isArray(response.data)) {
      rawList = response.data
    } else if (Array.isArray(response)) {
      rawList = response
    }

    if (rawList.length > 0) {
      const normalized: ClassItem[] = rawList.map((item: any, idx: number) => {
        const subjectName =
          typeof item.subjectId === 'object' && item.subjectId?.name
            ? item.subjectId.name
            : item.subjectName || item.subject || 'General'

        const lowerName = subjectName.toLowerCase()
        const badgeBg = lowerName.includes('physic')
          ? 'bg-blue-100'
          : lowerName.includes('chem')
            ? 'bg-emerald-100'
            : lowerName.includes('math')
              ? 'bg-purple-100'
              : 'bg-indigo-100'

        const badgeText = lowerName.includes('physic')
          ? 'text-blue-700'
          : lowerName.includes('chem')
            ? 'text-emerald-700'
            : lowerName.includes('math')
              ? 'text-purple-700'
              : 'text-indigo-700'

        const barColor = lowerName.includes('physic')
          ? 'bg-blue-500'
          : lowerName.includes('chem')
            ? 'bg-emerald-500'
            : lowerName.includes('math')
              ? 'bg-purple-500'
              : 'bg-indigo-500'

        const teacherName =
          typeof item.teacherId === 'object' && item.teacherId?.firstName
            ? `${item.teacherId.firstName} ${item.teacherId.lastName || ''}`.trim()
            : item.teacherName || undefined

        return {
          id: item._id || item.id || String(idx),
          subject: subjectName,
          time: formatScheduleTime(item.startTime),
          title: item.topic || item.title || `${subjectName} Lecture`,
          location: item.room || item.location || 'Lecture Hall',
          color: `border-${lowerName.includes('chem') ? 'emerald' : lowerName.includes('math') ? 'purple' : 'blue'}-500`,
          badgeBg,
          badgeText,
          barColor,
          liveMeetingUrl: item.meetingLink || item.liveMeetingUrl || undefined,
          teacherName,
          dayOfWeek: formatScheduleDay(item.date)
        }
      })

      return { data: normalized, raw: rawList }
    }
  } catch (err) {
    console.warn('Backend /getscheduleclass request error:', err)
  }

  return {
    data: [],
    raw: []
  }
}

export const scheduleClassApi = async (payload: IScheduleClassPayload) => {
  const response = await apiService.post({
    url: '/scheduleClass',
    payload
  })
  return response
}

export const deleteScheduleApi = async (scheduleId: string) => {
  const response = await apiService.delete({
    url: `/deleteschedule/${scheduleId}`
  })
  return response
}
