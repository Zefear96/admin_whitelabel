import { useQuery } from "@tanstack/react-query";
import { ClientProfileApi } from "../../api/clients/clientProfileApi";
import type { CustomerListType } from "../../types/client/customerList";
import type { AxiosError } from "axios";

export const useGetClientList = (page?: number, size?: number, sort?: string) => {
    return useQuery<CustomerListType, AxiosError>({
        queryKey: ['client-profile', 'list', page, size, sort],
        queryFn: async() => {
            const { data } = await ClientProfileApi.getClientList(page ?? 0, size ?? 20, sort ?? "createdDate,ASC");
            // console.log('ClientProfileApi.getClientList response:', {
            //     clients: data.clients,
            //     clientsCount: data.clients?.length || 0,
            //     page: data.page,
            //     size: data.size,
            //     totalElements: data.totalElements,
            //     totalPages: data.totalPages,
            //     fullData: data
            // });
            return data
        },
    })
}