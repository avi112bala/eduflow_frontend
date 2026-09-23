import { apiService } from "../api/apiServices"

export interface ISubjectAttendance {
    totalClasses: number;
    presentCount: number;
    absentCount: number;
    subjectID: string;
    percentage: number;
}

export interface IUserData {
    _id: string;
    email: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    role: string;
    profilPic?: string;
    address?: string;
    parentInfo?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
}

export const getTotalAttendanceApi = async (userId: string) => {
    const response = await apiService.get(`/gettotalattandance/${userId}`)
    return response
}

export const getSubjectAttendanceApi = async (userId: string) => {
    const response = await apiService.get(`/getsubjectattandance/${userId}`)
    return response
}

export const getUserDetailsApi = async (userId: string) => {
    const response = await apiService.get(`/userDetails/${userId}`)
    return response
}

export interface ISubjectClass {
    _id: string;
    name: string;
    description?: string;
    status?: boolean;
}

export const getClassApi = async () => {
    const response = await apiService.get('/class')
    return response
}

export interface IMarkAttendancePayload {
    subjectID: string;
    status: 'present' | 'absent' | string;
    date: string;
}

export const markAttendanceApi = async (userId: string, payload: IMarkAttendancePayload) => {
    const response = await apiService.post({
        url: `/markattandance/${userId}`,
        payload
    })
    return response
}

export interface IUpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilPic?: string;
    address?: string;
    phoneNumber?: string;
    newpassword?: string;
}

export const updateProfileApi = async (userId: string, payload: IUpdateProfilePayload) => {
    const response = await apiService.post({
        url: `/update/profile/${userId}`,
        payload
    })
    return response
}
