import { apiService } from '../api/apiServices'
import type { ILeaveItem } from '../types/dashboard'

export interface IApplyLeavePayload {
  studentId: string
  studentName?: string
  appliedBy: 'student' | 'parent'
  startDate: string
  endDate: string
  reason: string
}

export interface IUpdateLeaveStatusPayload {
  status: 'APPROVED' | 'REJECTED'
  remarks?: string
}

export const getStudentLeavesApi = async (studentId: string): Promise<{ data: ILeaveItem[] }> => {
  try {
    const response = await apiService.get(`/leave/student/${studentId}`)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /leave/student not available, using fallback:', err)
  }

  return {
    data: [
      {
        _id: 'l1',
        studentId,
        studentName: 'Alex Johnson',
        appliedBy: 'student',
        startDate: '2026-09-22',
        endDate: '2026-09-23',
        reason: 'Viral Fever & Medical Recovery',
        status: 'PENDING',
        createdAt: 'Sept 16, 2026'
      },
      {
        _id: 'l2',
        studentId,
        studentName: 'Alex Johnson',
        appliedBy: 'parent',
        startDate: '2026-08-15',
        endDate: '2026-08-16',
        reason: 'Family Event in Hometown',
        status: 'APPROVED',
        reviewedBy: 'Academic Head',
        remarks: 'Approved with note to complete missed assignments',
        createdAt: 'Aug 10, 2026'
      }
    ]
  }
}

export const getPendingLeavesApi = async (): Promise<{ data: ILeaveItem[] }> => {
  try {
    const response = await apiService.get('/leave/pending')
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /leave/pending not available, using fallback:', err)
  }

  return {
    data: [
      {
        _id: 'l1',
        studentId: 'std_1',
        studentName: 'Alex Johnson',
        appliedBy: 'student',
        startDate: '2026-09-22',
        endDate: '2026-09-23',
        reason: 'Viral Fever & Medical Recovery',
        status: 'PENDING',
        createdAt: 'Sept 16, 2026'
      },
      {
        _id: 'l3',
        studentId: 'std_2',
        studentName: 'Pooja Verma',
        appliedBy: 'parent',
        startDate: '2026-09-25',
        endDate: '2026-09-26',
        reason: 'Sister Wedding Ceremony',
        status: 'PENDING',
        createdAt: 'Sept 15, 2026'
      }
    ]
  }
}

export const applyLeaveApi = async (payload: IApplyLeavePayload) => {
  const response = await apiService.post({
    url: '/leave/apply',
    payload
  })
  return response
}

export const updateLeaveStatusApi = async (leaveId: string, payload: IUpdateLeaveStatusPayload) => {
  const response = await apiService.put({
    url: `/leave/update-status/${leaveId}`,
    payload
  })
  return response
}
