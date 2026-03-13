import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";

export const useGetAccounts = (keycloakClientId: string | undefined) => {
  return useQuery({
    queryKey: ["product", "accounts", keycloakClientId],
    queryFn: () =>
      ProductServiceApi.getAccounts(keycloakClientId!).then((res) => res.data ?? []),
    enabled: !!keycloakClientId,
  });
};
