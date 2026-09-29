import { apiClient } from "../axios/apiClient"

export const registryAgentServiceApi = {
    createOutgoingTransactionsRegistry(agent: string, dateFrom?: string, dateTo?: string, force?: boolean) {
        const normalizedAgent = agent.toUpperCase();

        const params = new URLSearchParams({
            "agent": normalizedAgent,
            "dateFrom": dateFrom ?? "",
            "dateTo": dateTo ?? "",
            "force": 'true',
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
        });

        // ALL = без isSuccess; SUCCESS=true; FAILED=false
        if (typeof isSuccess === "boolean") {
            params.set("isSuccess", String(isSuccess));
        }

        return apiClient.get(`/admin-backend/transaction-history-service/api/v1/registry/items?${params.toString()}`)
    },
    async generateXlsxRegistry(
        taskId: string,
        agent: string,
        dateFrom: string,
        dateTo: string,
    ) {
        const response = await apiClient.post(
            `/admin-backend/transaction-history-service/api/v1/registry/generate-file/xlsx?taskId=${taskId}`,
            null,
            { responseType: "blob" },
        );

        const filename = `registry_${agent.toLowerCase()}-${dateFrom} - ${dateTo}.xlsx`;

        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileUrl);

        return response;
    }
}
