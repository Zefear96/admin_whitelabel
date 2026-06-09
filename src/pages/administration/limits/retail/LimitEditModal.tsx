import { Button, Form, Modal } from "antd";
import { useEffect } from "react";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useUpdateLimit } from "../../../../hooks/limits/useUpdateLimit";
import type { LimitType } from "../../../../types/limit/limitType";
import LimitForm from "./LimitForm";

interface LimitEditModalProps {
    open: boolean;
    onClose: () => void;
    limit: LimitType | null;
}

export default function LimitEditModal({ open, onClose, limit }: LimitEditModalProps) {
    const { notify } = useNotificationMessage();
    const [limitForm] = Form.useForm<LimitType>();

    const { mutateAsync: updateLimit, isPending } = useUpdateLimit();

    useEffect(() => {
        if (!open) return;
        if (limit) {
            limitForm.setFieldsValue(limit);
        } else {
            limitForm.resetFields();
        }
    }, [open, limit, limitForm]);

    const handleClose = () => {
        limitForm.resetFields();
        onClose();
    };

    const submitLimit = async () => {
        try {
            const values = await limitForm.validateFields();
            const payload: LimitType = {
                ...(limit ?? ({} as LimitType)),
                ...values,
                id: limit?.id ?? values.id ?? "",
            };

            await updateLimit(payload);
            notify({ type: "success", title: "Успешно", message: "Лимит обновлён" });
            handleClose();
        } catch (error: any) {
            if (error?.errorFields) return;
            notify({ type: "error", title: "Ошибка", message: error?.message || "Не удалось обновить лимит" });
        }
    };

    return (
        <Modal open={open} onCancel={handleClose} title="Редактировать лимит" footer={null}>
            <LimitForm form={limitForm} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="primary" loading={isPending} onClick={submitLimit}>
                    Сохранить
                </Button>
            </div>
        </Modal>
    );
}
