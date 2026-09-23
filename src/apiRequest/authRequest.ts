import { apiService } from "../api/apiServices"

export interface ISigninPayload {
    email: string;
    password: string;
    role: string;
}

export const loginApi = async (data: ISigninPayload | object) => {
    const payload = { ...data }
    const response = await apiService.post({
        url: `/signin`,
        payload
    })
    return response
}

export const signupApi = async (data: object) => {
    const payload = { ...data }
    const response = await apiService.post({
        url: `/signup`,
        payload
    })
    return response
}

export interface IForgotPasswordPayload {
    email: string;
    newpassword: string;
}

export const forgotPasswordApi = async (data: IForgotPasswordPayload | object) => {
    const payload = { ...data }
    const response = await apiService.post({
        url: `/forget-password`,
        payload
    })
    return response
}