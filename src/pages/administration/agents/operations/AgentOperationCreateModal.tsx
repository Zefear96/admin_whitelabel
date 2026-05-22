import { Button, Form, Input, Modal, Select, Switch } from "antd";
import type { AgentOperationDirection, AgentOperationTransactionType, AgentOperationUpsertPayload } from "../../../../types/dictionary/agentOperationType";
import { useCreateAgentOperation } from "../../../../hooks/dictionary/agent/useCreateAgentOperation";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useAuth } from "../../../../hooks/client/useAuth";
import Popconfirm from "../../../../components/dataDisplay/Popconfirm";

interface AgentOperationCreateModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    agent: string;
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

export default function AgentOperationCreateModal({ isModalOpen, setIsModalOpen, agent }: AgentOperationCreateModalProps) {
    const [form] = Form.useForm();
    const { mutateAsync, isPending } = useCreateAgentOperation();
    const { notify } = useNotificationMessage();
    const { user } = useAuth();

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const nowIso = new Date().toISOString();
            const isEnabled = values.isEnabled ?? true;

            const payload: AgentOperationUpsertPayload = {
                // id: "",
                agent,
                transactionType: values.transactionType,
                direction: values.direction,
                serviceName: values.serviceName.trim(),
                isEnabled: isEnabled ? true : false,
                changeDate: nowIso,
                changedBy: user?.name ?? "",
                startDate: nowIso,
                endDate: "",
                minAmount: 0,
                maxAmount: 0,
                isArchived: "N",
                active: isEnabled ? true : false,
            };

            await mutateAsync(payload);
            notify({
                type: "success",
                title: "Успешно",
                message: "Операция агента успешно создана",
            });
            handleCancel();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось создать операцию агента",
            });
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title="Создание операции агента"
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: "140px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="left"
                style={{ marginTop: "10px" }}
                initialValues={{ isEnabled: true }}
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
                    title="Создать операцию?"
                    onConfirm={handleOk}
                    okButtonProps={{ loading: isPending }}
                >
                    <Button type="primary">Сохранить</Button>
                </Popconfirm>
            </div>
        </Modal>
    )
}