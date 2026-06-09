import { Button, Form, Modal } from "antd";
import { useEffect } from "react";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useCreateLimit } from "../../../../hooks/limits/useCreateLimit";
import type { LimitType } from "../../../../types/limit/limitType";
import LimitForm from "./LimitForm";

interface LimitCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LimitCreateModal({ open, onClose }: LimitCreateModalProps) {
    const { notify } = useNotificationMessage();
    const [limitForm] = Form.useForm<LimitType>();

    const { mutateAsync: createLimit, isPending } = useCreateLimit();

    useEffect(() => {
        if (open) limitForm.resetFields();
    }, [open, limitForm]);

    const handleClose = () => {
        limitForm.resetFields();
        onClose();
    };

    const submitLimit = async () => {
        try {
            const values = await limitForm.validateFields();
            const payload: LimitType = {
                ...values,
                id: values.id ?? "",
            };

            await createLimit(payload);
            notify({ type: "success", title: "Успешно", message: "Лимит создан" });
            handleClose();
        } catch (error: any) {
            if (error?.errorFields) return;
            notify({ type: "error", title: "Ошибка", message: error?.message || "Не удалось создать лимит" });
        }
    };

    return (
        <Modal open={open} onCancel={handleClose} title="Создать лимит" footer={null}>
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
