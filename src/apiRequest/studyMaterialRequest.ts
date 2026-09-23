import { apiService } from '../api/apiServices'
import type { IStudyMaterial } from '../types/dashboard'

export interface ICreateMaterialPayload {
  subjectId: string
  title: string
  materialType: string
  duedate?: string
  resourseUrl?: string
  description?: string
}

export const getMaterialsApi = async (): Promise<{ message?: string; data: IStudyMaterial[] }> => {
  try {
    const response: any = await apiService.get('/getmaterials')
    let materialsList: any[] = []

    if (response?.data && Array.isArray(response.data)) {
      materialsList = response.data
    } else if (Array.isArray(response)) {
      materialsList = response
    }

    const normalized: IStudyMaterial[] = materialsList.map((item: any) => {
      const subjectName =
        typeof item.subjectId === 'object' && item.subjectId?.name
          ? item.subjectId.name
          : undefined

      return {
        _id: item._id || item.id || '',
        subjectId: item.subjectId,
        subjectName,
        title: item.title || 'Untitled Resource',
        materialType: item.materialType || 'notes',
        resourseUrl: item.resourseUrl || item.fileUrl || '',
        fileUrl: item.resourseUrl || item.fileUrl || '',
        description: item.description || '',
        duedate: item.duedate || item.dueDate || '',
        dueDate: item.duedate || item.dueDate || '',
        createdAt: item.createdAt || ''
      }
    })

    return {
      message: response?.message || 'Materials fetched successfully',
      data: normalized
    }
  } catch (err) {
    console.warn('Backend /getmaterials request error:', err)
  }

  // Zero static data fallback
  return {
    data: []
  }
}

export const createMaterialApi = async (payload: ICreateMaterialPayload) => {
  const response = await apiService.post({
    url: '/creatematerial',
    payload
  })
  return response
}

export const deleteMaterialApi = async (materialId: string) => {
  const response = await apiService.delete({
    url: `/deletematerial/${materialId}`
  })
  return response
}
