import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";

export const useGetSafe = (keycloakClientId: string | undefined) => {
  return useQuery({
    queryKey: ["product", "safe", keycloakClientId],
    queryFn: () =>
      ProductServiceApi.getSafe(keycloakClientId!).then((res) => res.data ?? []),
    enabled: !!keycloakClientId,
  });
};
