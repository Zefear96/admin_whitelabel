import { useQuery } from "@tanstack/react-query";
import { ClientProfileApi } from "../api/clientProfileApi";
import { message } from "antd";
import type { CustomerProfileType } from "../types/customerProfile";
import type { AxiosError } from "axios";
import { useEffect } from "react";

export const useClientQuery = (absId?: string) => {
  const query = useQuery<CustomerProfileType, AxiosError>({
    queryKey: ["clientProfile", absId],
    queryFn: async () => {
      if(!absId) return null;
      const { data } = await ClientProfileApi.getClientByAbs(absId);
      return data;
    },
    enabled: !!absId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.error) {
      console.error("Ошибка при загрузке клиента:", query.error);
      const errorMessage = (query.error.response?.data as { message?: string })?.message 
        || "Ошибка при загрузке данных клиента";
      message.error(errorMessage);
    }
  }, [query.error]);

  return query;
}