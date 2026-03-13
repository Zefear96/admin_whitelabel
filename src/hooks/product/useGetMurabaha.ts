import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";

export const useGetMurabaha = (keycloakClientId: string | undefined) => {
  return useQuery({
    queryKey: ["product", "murabaha", keycloakClientId],
    queryFn: () =>
      ProductServiceApi.getMurabaha(keycloakClientId!).then((res) => res.data ?? []),
    enabled: !!keycloakClientId,
  });
};
