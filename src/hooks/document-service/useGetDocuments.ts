import { useQuery } from "@tanstack/react-query"
import { documentService } from "../../api/clients/documentServiceApi"

export const useGetDocuments = () => {
    return useQuery({
        queryKey: ["document-service", "documents"],
        queryFn: () => documentService.getDocuments().then((res) => res.data),
        staleTime: 1000 * 30,
        refetchOnMount: "always",
    })
}
