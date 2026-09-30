import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { documentService } from "../../api/clients/documentServiceApi"
import type { DocumentResponseType } from "../../types/documentService/documentType"

type UpdateDocumentStatusPayload = {
    id: string
    status: DocumentResponseType["status"]
}

export const useUpdateDocumentStatus = () => {
    const queryClient = useQueryClient()

    return useMutation<AxiosResponse<DocumentResponseType>, AxiosError, UpdateDocumentStatusPayload>({
        mutationFn: ({ id, status }) => documentService.updateStatusDocument(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document-service", "documents"] }),
    })
}
