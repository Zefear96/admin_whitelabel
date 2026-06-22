import { apiClient } from "../axios/apiClient"

export const AbsAdapterApi = {
    getAccountInfoByNumber(accountNumber:string) {
        return apiClient.get(`/admin-backend/abs-adapter/account/${accountNumber}`)
    },
    getMurabahaListByAbsId(absId:string) {
        return apiClient.get(`/admin-backend/abs-adapter/murabaha/${absId}`)
    },
    getMurabahaStatusByCode(code:string) {
        return apiClient.get(`/admin-backend/abs-adapter/murabaha/code/${code}`)
    }
}