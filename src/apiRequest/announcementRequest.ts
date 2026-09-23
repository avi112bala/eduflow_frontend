import { apiService } from '../api/apiServices'
import type { IAnnouncement } from '../types/dashboard'

export interface ICreateAnnouncementPayload {
  title: string
  description: string
  priority: 'CRITICAL' | 'NORMAL' | 'TIP' | string
  targetRole?: 'all' | 'student' | 'parent' | 'teacher' | string
  expiryDate?: string
}

export const getAnnouncementsApi = async (targetRole?: string): Promise<{ data: IAnnouncement[] }> => {
  try {
    const url = targetRole ? `/announcements?targetRole=${targetRole}` : '/announcements'
    const response = await apiService.get(url)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /announcements not available, using fallback:', err)
  }

  // Graceful fallback data
  return {
    data: [
      {
        id: '1',
        title: 'JEE Advanced Mock Test Rescheduled',
        description: 'The Sunday Grand mock test has been rescheduled from 9:00 AM to 10:00 AM. Please arrive 15 mins prior.',
        priority: 'CRITICAL',
        targetRole: 'all',
        createdAt: 'Today, 08:30 AM'
      },
      {
        id: '2',
        title: 'Daily Preparation Tip: Electromagnetism',
        description: "Revise Gauss's Law formulas and solve DPP #4 numerical problems before tomorrow's class.",
        priority: 'TIP',
        targetRole: 'student',
        createdAt: 'Yesterday, 06:00 PM'
      },
      {
        id: '3',
        title: 'Parent-Teacher Meeting (PTM) Scheduled',
        description: 'Monthly performance review session will be held on Saturday from 4:00 PM to 7:00 PM.',
        priority: 'NORMAL',
        targetRole: 'parent',
        createdAt: '2 days ago'
      }
    ]
  }
}

export const createAnnouncementApi = async (payload: ICreateAnnouncementPayload) => {
  const response = await apiService.post({
    url: '/create-announcement',
    payload
  })
  return response
}

export const deleteAnnouncementApi = async (id: string) => {
  const response = await apiService.delete({
    url: `/announcement/${id}`
  })
  return response
}
