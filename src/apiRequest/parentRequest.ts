import { apiService } from "../api/apiServices"

export const getAllChildrenApi = async () => {
    const response = await apiService.get('/getallchildren')
    return response
}
