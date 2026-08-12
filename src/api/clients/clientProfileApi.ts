import type { SearchClientsParams } from "../../types/client/customerProfile";
import {apiClient} from "../axios/apiClient";


export const ClientProfileApi = {
    getClientByAbs(absClientId: string) {
        return apiClient.get(`/admin-backend/client-profile/api/v1/client/${absClientId}/by-abs-id`)
    },
    searchClients({
        absNumber,
        inn,
        phoneNumber,
        firstName,
        lastName,
        page,
        size,
        sort,
    }: SearchClientsParams = {}) {
        const params = new URLSearchParams()

        if (absNumber) params.set("absNumber", absNumber)
        if (inn) params.set("inn", inn)
        if (phoneNumber) params.set("phoneNumber", phoneNumber)
        if (firstName) params.set("firstName", firstName)
        if (lastName) params.set("lastName", lastName)
        if (page !== undefined) params.set("page", page.toString())
        if (size !== undefined) params.set("size", size.toString())
        if (sort) params.set("sort", sort)

        const query = params.toString()
        return apiClient.get(
            `/admin-backend/client-profile/api/v1/client/search${query ? `?${query}` : ""}`,
        )
    },
    getClientList(page?: number, size?: number, sort?: string) {
        const params = new URLSearchParams({
            page: page?.toString() ?? "0",
            size: size?.toString() ?? "20",
            sort: sort ?? "createdDate,ASC"
        })
        return apiClient.get(`/admin-backend/client-profile/api/v1/client/list?${params.toString()}`)
    }
}
