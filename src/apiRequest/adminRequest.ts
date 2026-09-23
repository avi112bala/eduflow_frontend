import { apiService } from '../api/apiServices'
import type { IAdminAnalytics, IBatchItem } from '../types/dashboard'

export interface ICreateBatchPayload {
  batchName: string
  timing: string
  room: string
}

export interface IAssignBatchPayload {
  batchId: string
  studentId: string
}

export const getAdminAnalyticsApi = async (): Promise<{ data: IAdminAnalytics }> => {
  try {
    const response = await apiService.get('/admin/analytics')
    if (response?.data) {
      return response
    }
  } catch (err) {
    console.warn('Backend /admin/analytics not available, using fallback:', err)
  }

  return {
    data: {
      totalStudents: 486,
      totalTeachers: 28,
      overallAttendanceToday: 94.2,
      feesCollectedThisMonth: 845000,
      activeBatches: 8,
      pendingLeaves: 3
    }
  }
}

export const getBatchesApi = async (): Promise<{ data: IBatchItem[] }> => {
  try {
    const response = await apiService.get('/batches')
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /batches not available, using fallback:', err)
  }

  return {
    data: [
      {
        _id: 'b1',
        batchName: 'JEE Advanced Rankers 2026',
        timing: '08:00 AM - 01:00 PM',
        room: 'Lecture Hall A',
        studentCount: 65,
        activeSubjectCount: 3
      },
      {
        _id: 'b2',
        batchName: 'NEET Medical Achievers 2026',
        timing: '09:00 AM - 02:00 PM',
        room: 'Lecture Hall B',
        studentCount: 72,
        activeSubjectCount: 3
      },
      {
        _id: 'b3',
        batchName: 'Class 10 Foundation & Olympiad',
        timing: '04:00 PM - 07:30 PM',
        room: 'Room 201',
        studentCount: 45,
        activeSubjectCount: 4
      }
    ]
  }
}

export const createBatchApi = async (payload: ICreateBatchPayload) => {
  const response = await apiService.post({
    url: '/batch/create',
    payload
  })
  return response
}

export const assignStudentBatchApi = async (payload: IAssignBatchPayload) => {
  const response = await apiService.post({
    url: '/batch/assign-student',
    payload
  })
  return response
}

export const getFeeDefaultersApi = async (): Promise<{ data: any[] }> => {
  try {
    const response = await apiService.get('/admin/fees/defaulters')
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /admin/fees/defaulters not available, using fallback:', err)
  }

  return {
    data: [
      {
        studentId: 'std_101',
        studentName: 'Rohan Sharma',
        parentPhone: '+91 98765 43210',
        dueAmount: 15000,
        overdueDays: 14,
        batchName: 'JEE Advanced Rankers 2026'
      },
      {
        studentId: 'std_102',
        studentName: 'Kavita Singh',
        parentPhone: '+91 98234 56789',
        dueAmount: 3000,
        overdueDays: 5,
        batchName: 'NEET Medical Achievers 2026'
      }
    ]
  }
}
