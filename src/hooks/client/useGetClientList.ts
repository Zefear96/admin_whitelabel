import { useQuery } from "@tanstack/react-query";
import { ClientProfileApi } from "../../api/clients/clientProfileApi";
<<<<<<< HEAD
<<<<<<< HEAD
import type { AxiosError } from "axios";
import type { CustomerListType } from "../../types/client/customerList";
=======
import type { CustomerListType } from "../../types/client/customerList";
import type { AxiosError } from "axios";
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
=======
import type { AxiosError } from "axios";
import type { CustomerListType } from "../../types/client/customerList";
>>>>>>> a7fd64bb483ae3b2a2690d4dbfe159a7ac41b6e4

export const useGetClientList = (page?: number, size?: number, sort?: string) => {
    return useQuery<CustomerListType, AxiosError>({
        queryKey: ['client-profile', 'list', page, size, sort],
        queryFn: async() => {
            const { data } = await ClientProfileApi.getClientList(page ?? 0, size ?? 20, sort ?? "createdDate,ASC");
            console.log('ClientProfileApi.getClientList response:', {
                clients: data.clients,
                clientsCount: data.clients?.length || 0,
                page: data.page,
                size: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                fullData: data
            });
            return data
        },
    })
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
=======
}
>>>>>>> a7fd64bb483ae3b2a2690d4dbfe159a7ac41b6e4
