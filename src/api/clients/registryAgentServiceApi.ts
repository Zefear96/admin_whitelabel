import { apiClient } from "../axios/apiClient"

export const registryAgentServiceApi = {
    createOutgoingTransactionsRegistry(agent: string, dateFrom?: string, dateTo?: string) {
        const normalizedAgent = agent.toUpperCase();

        const params = new URLSearchParams({
            "agent": normalizedAgent,
            "dateFrom": dateFrom ?? "",
            "dateTo": dateTo ?? "",
        });

        return apiClient.post(`/admin-backend/transaction-history-service/api/v1/registry?${params.toString()}`)
    },
    getStatusRegistry(taskId: string) {
        return apiClient.get(`/admin-backend/transaction-history-service/api/v1/registry/status?taskId=${taskId}`)
    },
    getRegistryDataById(taskId: string, page?: number, size?: number, isSuccess?: boolean) {
        const params = new URLSearchParams({
            "taskId": taskId,
            "page": page?.toString() ?? "0",
            "size": size?.toString() ?? "20",
            "isSuccess": isSuccess?.toString() ?? "false",
        });

        return apiClient.get(`/admin-backend/transaction-history-service/api/v1/registry/items?${params.toString()}`)
    },
    async generateXlsxRegistry(taskId: string) {
        const response = await apiClient.post(
            `/admin-backend/transaction-history-service/api/v1/registry/generate-file/xlsx?taskId=${taskId}`,
            null,
            { responseType: "blob" },
        );

        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `registry_${taskId}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileUrl);

        return response;
    }
}
