import { PushNotificationServiceApi } from "../../api/clients/pushNotificationServiceApi";
import type { NotificationTemplateUpdatePayload } from "../../types/pushNotification/notificationTemplateType";
import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { queryClient } from "../../utils/queryClient";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateNotificationTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: NotificationTemplateUpdatePayload }) => {
            return PushNotificationServiceApi.updateNotificationTemplate(id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["push-notification", "templates"] });
            // toast.success("Шаблон уведомления успешно обновлен");
        },
        onError: (error) => {
            // toast.error(error.message);
            console.error(error);
        },
    });  
};