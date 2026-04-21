import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { useEffect } from "react";
import type { AgentOperationDirection, AgentOperationTransactionType, AgentOperationType, AgentOperationUpsertPayload } from "../../../types/dictionary/agentOperationType";
import { useUpdateAgentOperation } from "../../../hooks/dictionary/agent/useUpdateAgentOperation";
import Popconfirm from "../../../components/dataDisplay/Popconfirm";
import { useNotificationMessage } from "../../../components/dataDisplay/NotificationMessage";

interface AgentOperationModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: AgentOperationType | null;
}

const transactionTypeOptions: { label: AgentOperationTransactionType; value: AgentOperationTransactionType }[] = [
    { label: "CARD_CREDIT", value: "CARD_CREDIT" },
    { label: "CARD_DEBIT", value: "CARD_DEBIT" },
    { label: "ACCOUNT_CREDIT", value: "ACCOUNT_CREDIT" },
    { label: "ACCOUNT_DEBET", value: "ACCOUNT_DEBET" },
    { label: "LOAN_PAYMENT", value: "LOAN_PAYMENT" },
    { label: "DEPOSIT_CREDIT", value: "DEPOSIT_CREDIT" },
];

const directionOptions: { label: AgentOperationDirection; value: AgentOperationDirection }[] = [
    { label: "INCOMING", value: "INCOMING" },
    { label: "OUTGOING", value: "OUTGOING" },
];

export default function AgentOperationModal({ isModalOpen, setIsModalOpen, data }: AgentOperationModalProps) {
    const [form] = Form.useForm();
    const { mutateAsync, isPending } = useUpdateAgentOperation();
    const { notify } = useNotificationMessage();

    useEffect(() => {
        if (isModalOpen && data) {
            form.setFieldsValue({
                transactionType: data.transactionType,
                direction: data.direction,
                serviceName: data.serviceName,
                isEnabled: data.isEnabled,
            });
            return;
        }

        form.resetFields();
    }, [isModalOpen, data, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOk = async () => {
        if (!data) return;

        try {
            const values = await form.validateFields();
            const isEnabled = values.isEnabled ?? data.isEnabled;

            const payload: AgentOperationUpsertPayload = {
                ...data,
                transactionType: values.transactionType,
                direction: values.direction,
                serviceName: values.serviceName.trim(),
                isEnabled,
                active: isEnabled,
            };

            await mutateAsync(payload);
            notify({
                type: "success",
                title: "Успешно",
                message: "Операция агента успешно обновлена",
            });
            handleCancel();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось обновить операцию агента",
            });
        }
    };

    return (
        <Modal open={isModalOpen} onCancel={handleCancel} title="Редактирование операции агента" footer={null}>
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: "140px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="left"
                style={{ marginTop: "30px" }}
            >
                <Form.Item label="Transaction Type" name="transactionType" rules={[{ required: true, message: "Введите тип транзакции" }]}>
                    <Select options={transactionTypeOptions} />
                </Form.Item>
                <Form.Item label="Direction" name="direction" rules={[{ required: true, message: "Выберите направление" }]}>
                    <Select options={directionOptions} />
                </Form.Item>
                <Form.Item label="Service Name" name="serviceName" rules={[{ required: true, message: "Введите название сервиса" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Активна" name="isEnabled" valuePropName="checked">
                    <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                </Form.Item>
            </Form>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Popconfirm
                    title="Сохранить изменения операции?"
                    onConfirm={handleOk}
                    okButtonProps={{ loading: isPending }}
                >
                    <Button type="primary" disabled={!data}>Сохранить</Button>
                </Popconfirm>
            </div>
        </Modal>
    )
}