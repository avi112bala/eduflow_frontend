import { apiService } from '../api/apiServices'
import type { IDoubtItem } from '../types/dashboard'

export interface ICreateDoubtPayload {
  subjectId: string
  userId: string
  title: string
  doubt: string
  media?: string
}

export interface IResolveDoubtPayload {
  explaination: string
  media?: string
}

export type IReplyDoubtPayload = IResolveDoubtPayload

export const getDoubtsApi = async (status?: string): Promise<{ message?: string; data: IDoubtItem[] }> => {
  try {
    const url = status && status !== 'all' ? `/getalldoubt?status=${encodeURIComponent(status)}` : '/getalldoubt'
    const response: any = await apiService.get(url)
    let rawList: any[] = []

    if (response?.data && Array.isArray(response.data)) {
      rawList = response.data
    } else if (Array.isArray(response)) {
      rawList = response
    }

    const normalized: IDoubtItem[] = rawList.map((item: any) => {
      const subjectName =
        typeof item.subjectId === 'object' && item.subjectId?.name
          ? item.subjectId.name
          : undefined

      const userName =
        typeof item.userId === 'object' && item.userId?.firstName
          ? `${item.userId.firstName} ${item.userId.lastName || ''}`.trim()
          : undefined

      return {
        _id: item._id || item.id || '',
        subjectId: item.subjectId,
        subjectName,
        userId: item.userId,
        userName,
        studentId: typeof item.userId === 'string' ? item.userId : item.userId?._id,
        studentName: userName,
        title: item.title || 'Untitled Doubt',
        doubt: item.doubt || item.questionText || '',
        questionText: item.doubt || item.questionText || '',
        doubtType: item.doubtType || item.status || 'pending',
        status: item.doubtType || item.status || 'pending',
        media: item.media || item.imageUrl || '',
        imageUrl: item.media || item.imageUrl || '',
        answerText: item.explaination || item.explanation || item.answerText || item.answer || undefined,
        answeredBy: item.answeredBy || (item.teacherId?.firstName ? `${item.teacherId.firstName} ${item.teacherId.lastName || ''}`.trim() : undefined),
        solutionImageUrl: item.solutionImageUrl || item.solutionMedia || (item.explaination && item.media ? item.media : undefined),
        createdAt: item.createdAt || '',
        __v: item.__v
      }
    })

    return {
      message: response?.message || 'all doubts',
      data: normalized
    }
  } catch (err) {
    console.warn('Backend /getalldoubt request error:', err)
  }

  // Zero static data fallback
  return {
    data: []
  }
}

export const createDoubtApi = async (payload: ICreateDoubtPayload) => {
  const response = await apiService.post({
    url: '/create-boubt',
    payload
  })
  return response
}

export const resolveDoubtApi = async (doubtId: string, payload: IResolveDoubtPayload) => {
  const response = await apiService.post({
    url: `/relove-doubt/${doubtId}`,
    payload
  })
  return response
}

export const deleteDoubtApi = async (doubtId: string) => {
  const response = await apiService.delete({
    url: `/deletedoubt/${doubtId}`
  })
  return response
}

