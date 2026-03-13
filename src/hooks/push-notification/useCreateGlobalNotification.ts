import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PushNotificationServiceApi } from "../../api/clients/pushNotificationServiceApi"
import type { RequestBodyNotificationType } from "../../types/pushNotification/requestBodyNotificationType"

export const useCreateGlobalNotification = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: RequestBodyNotificationType) =>
            PushNotificationServiceApi.sendGlobalNotification(payload).then((response) => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dictionary", "agent"] })
        },
    })
}

