import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import { parseStatementPdfResponse } from "../../utils/parseStatementPdf";

export type StatementRequestParams = {
  cardId: string;
  userId: string;
  fromDate: string;
  toDate: string;
};

export const useGetCardStatement = () => {
  return useMutation<Blob, AxiosError | Error, StatementRequestParams>({
    mutationFn: async ({ cardId, userId, fromDate, toDate }) => {
      const response = await ProductServiceApi.getCardStatement(cardId, userId, fromDate, toDate);
      return parseStatementPdfResponse(response.data as Blob);
    },
  });
};
