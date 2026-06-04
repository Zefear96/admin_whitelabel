import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useMemo } from "react";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useCreateAgentLimit } from "../../../../hooks/limits/useCreateAgentLimit";
import { useUpdateAgentLimit } from "../../../../hooks/limits/useUpdateAgentLimit";
import { useGetTransactionTypeList } from "../../../../hooks/dictionary/transaction/useGetTransactionTypeList";
import type { AgentLimitType } from "../../../../types/limit/limitType";
import type { TransactionType } from "../../../../types/dictionary/transactionType";

interface AgentLimitModalProps {
    open: boolean;
    editingAgentLimit: AgentLimitType | null;
    onClose: () => void;
}

export default function AgentLimitModal({ open, editingAgentLimit, onClose }: AgentLimitModalProps) {
    const { notify } = useNotificationMessage();
    const [agentLimitForm] = Form.useForm<AgentLimitType>();

    const { data: transactionTypes, isLoading: isLoadingTransactionTypes } = useGetTransactionTypeList();

    const { mutateAsync: createAgentLimit, isPending: isCreatingAgentLimit } = useCreateAgentLimit();
    const { mutateAsync: updateAgentLimit, isPending: isUpdatingAgentLimit } = useUpdateAgentLimit();

    const transactionTypeOptions = useMemo(
        () =>
            ((transactionTypes ?? []) as TransactionType[]).map((type) => ({
                label: type.transactionType,
                value: type.transactionType,
            })),
        [transactionTypes],
    );

    useEffect(() => {
        if (!open) return;
        if (editingAgentLimit) {
            agentLimitForm.setFieldsValue(editingAgentLimit);
        } else {
            agentLimitForm.resetFields();
        }
    }, [open, editingAgentLimit, agentLimitForm]);

    const handleClose = () => {
        agentLimitForm.resetFields();
        onClose();
    };

    const submitAgentLimit = async () => {
        try {
            const values = await agentLimitForm.validateFields();
            const payload: AgentLimitType = {
                ...(editingAgentLimit ?? ({} as AgentLimitType)),
                ...values,
                id: editingAgentLimit?.id ?? values.id ?? "",
            };

            if (editingAgentLimit) {
                await updateAgentLimit(payload);
                notify({ type: "success", title: "Успешно", message: "Лимит агента обновлён" });
            } else {
                await createAgentLimit(payload);
                notify({ type: "success", title: "Успешно", message: "Лимит агента создан" });
            }

            handleClose();
        } catch (error: any) {
            if (error?.errorFields) return;
            notify({ type: "error", title: "Ошибка", message: error?.message || "Не удалось сохранить лимит агента" });
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={editingAgentLimit ? "Редактировать лимит агента" : "Создать лимит агента"}
            footer={null}
        >
            <Form form={agentLimitForm} layout="vertical" style={{ marginTop: 12 }}>
                <Form.Item label="Agent" name="agent" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Transaction type" name="transactionType" rules={[{ required: true }]}>
                    <Select
                        options={transactionTypeOptions}
                        loading={isLoadingTransactionTypes}
                        showSearch
                        optionFilterProp="label"
                        virtual={false}
                        listHeight={256}
                        getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
                    />
                </Form.Item>
                <Form.Item label="Direction" name="direction" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { label: "INCOMING", value: "INCOMING" },
                            { label: "OUTGOING", value: "OUTGOING" },
                        ]}
                        getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
                    />
                </Form.Item>
                <Form.Item label="Min amount" name="minAmount" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
                <Form.Item label="Max amount" name="maxAmount" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button
                        type="primary"
                        loading={isCreatingAgentLimit || isUpdatingAgentLimit}
                        onClick={submitAgentLimit}
                    >
                        Сохранить
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
