import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";

export const useGetMudaraba = (keycloakClientId: string | undefined) => {
  return useQuery({
    queryKey: ["product", "mudaraba", keycloakClientId],
    queryFn: () =>
      ProductServiceApi.getMudaraba(keycloakClientId!).then((res) => res.data ?? []),
    enabled: !!keycloakClientId,
  });
};
