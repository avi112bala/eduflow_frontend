import { apiService } from "../api/apiServices"

export interface ICreateSubjectPayload {
    name: string;
    description: string;
}

export const createSubjectApi = async (payload: ICreateSubjectPayload) => {
    const response = await apiService.post({
        url: `/create-subject`,
        payload
    })
    return response
}

export interface ICreateTestPayload {
    subjectID: string;
    testDuration: string;
    testName: string;
    testtype: string;
    totalmarks: string;
    date: string;
}

export const createTestApi = async (payload: ICreateTestPayload) => {
    const response = await apiService.post({
        url: `/create-test`,
        payload
    })
    return response
}

export interface ITeacherMarkAttendancePayload {
    status: 'present' | 'absent' | string;
    date: string;
}

export const teacherMarkAttendanceApi = async (userId: string, payload: ITeacherMarkAttendancePayload) => {
    const response = await apiService.post({
        url: `/teacher-markattandance/${userId}`,
        payload
    })
    return response
}

export const getAllStudentsApi = async () => {
    const response = await apiService.get('/getallstudents')
    return response
}

export const getStudentAttendanceApi = async () => {
    const response = await apiService.get('/getstudentAttandance')
    return response
}


