import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ClientProfileApi } from "../../api/clients/clientProfileApi";
import type { SearchClientsParams } from "../../types/client/customerProfile";
import type { CustomerListType } from "../../types/client/customerList";

const hasSearchField = (params: SearchClientsParams) =>
    !!(params.absNumber || params.inn || params.phoneNumber || params.firstname || params.surName);

export const useSearchClients = (params: SearchClientsParams = {}) => {
    const query = useQuery<CustomerListType, AxiosError>({
        queryKey: [
            "search-clients",
            params.absNumber,
            params.inn,
            params.phoneNumber,
            params.firstname,
            params.surName,
            params.page,
            params.size,
            params.sort,
        ],
        queryFn: async () => {
            const { data } = await ClientProfileApi.searchClients(params);
            return data;
        },
        enabled: hasSearchField(params),
        refetchOnMount: "always",
    });

    return query;
};
