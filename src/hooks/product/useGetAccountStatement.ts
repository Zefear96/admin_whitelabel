import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ProductServiceApi } from "../../api/clients/productServiceApi";
import { parseStatementPdfResponse } from "../../utils/parseStatementPdf";

export type StatementRequestParams = {
  accountId: string;
  userId: string;
  fromDate: string;
  toDate: string;
};

export const useGetAccountStatement = () => {
  return useMutation<Blob, AxiosError | Error, StatementRequestParams>({
    mutationFn: async ({ accountId, userId, fromDate, toDate }) => {
      const response = await ProductServiceApi.getAccountStatement(accountId, userId, fromDate, toDate);
      return parseStatementPdfResponse(response.data as Blob);
    },
  });
};
