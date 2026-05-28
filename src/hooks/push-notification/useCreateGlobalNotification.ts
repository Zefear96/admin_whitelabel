import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PushNotificationServiceApi } from "../../api/clients/pushNotificationServiceApi"
import type { GlobalNotificationType } from "../../types/pushNotification/GlobalNotificationType"

export const useCreateGlobalNotification = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: GlobalNotificationType) =>
            PushNotificationServiceApi.sendGlobalNotification(payload).then((response) => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dictionary", "agent"] })
        },
    })
}

