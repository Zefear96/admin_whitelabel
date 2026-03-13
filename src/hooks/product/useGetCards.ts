import { useQuery } from "@tanstack/react-query";
import { ProductServiceApi } from "../../api/clients/productServiceApi";

export const useGetCards = (keycloakClientId: string | undefined) => {
  return useQuery({
    queryKey: ["product", "cards", keycloakClientId],
    queryFn: () =>
      ProductServiceApi.getCards(keycloakClientId!).then((res) => res.data ?? []),
    enabled: !!keycloakClientId,
  });
};
