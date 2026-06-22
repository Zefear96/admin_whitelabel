import { useQuery } from "@tanstack/react-query";
import { AbsAdapterApi } from "../../api/clients/abs-adapter";

export const useGetMurabaha = (absId: string | undefined) => {
  return useQuery({
    queryKey: ["product", "murabaha", absId],
    queryFn: () =>
      AbsAdapterApi.getMurabahaListByAbsId(absId!).then((res) => res.data ?? []),
    enabled: !!absId,
  });
};
