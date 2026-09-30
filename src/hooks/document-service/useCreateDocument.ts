import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios"
import { documentService } from "../../api/clients/documentServiceApi"
import type { DocumentBodyType, DocumentRequestType, DocumentResponseType } from "../../types/documentService/documentType"

type CreateDocumentPayload = {
    type: DocumentRequestType["type"]
    document: DocumentBodyType
}

export const useCreateDocument = () => {
    const queryClient = useQueryClient()

    return useMutation<AxiosResponse<DocumentResponseType>, AxiosError, CreateDocumentPayload>({
        mutationFn: ({ type, document }) => documentService.createDocument(type, document),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document-service", "documents"] }),
    })
}
