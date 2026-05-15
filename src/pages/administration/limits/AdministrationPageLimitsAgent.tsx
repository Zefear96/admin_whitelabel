import { Alert, Button, Card, Form, Input, InputNumber, Modal, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import ButtonCreate from "../../../components/dataEntry/ButtonCreate";
import { useNotificationMessage } from "../../../components/dataDisplay/NotificationMessage";
import { useGetAgentLimits } from "../../../hooks/limits/useGetAgentLimits";
import { useCreateAgentLimit } from "../../../hooks/limits/useCreateAgentLimit";
import { useUpdateAgentLimit } from "../../../hooks/limits/useUpdateAgentLimit";
import type { AgentLimitType } from "../../../types/limit/limitType";

export default function AdministrationPageLimitsAgent() {
    const { notify } = useNotificationMessage();

    const { data: agentLimits, isLoading: isLoadingAgentLimits, error: errorAgentLimits } = useGetAgentLimits();

    const { mutateAsync: createAgentLimit, isPending: isCreatingAgentLimit } = useCreateAgentLimit();
    const { mutateAsync: updateAgentLimit, isPending: isUpdatingAgentLimit } = useUpdateAgentLimit();

    const [isAgentLimitModalOpen, setIsAgentLimitModalOpen] = useState(false);
    const [editingAgentLimit, setEditingAgentLimit] = useState<AgentLimitType | null>(null);
    const [agentLimitForm] = Form.useForm<AgentLimitType>();

    const agentLimitColumns: ColumnsType<AgentLimitType> = useMemo(
        () => [
            { title: "Agent", dataIndex: "agent", width: 120, sorter: (a, b) =>
                    String(a.agent ?? "").localeCompare(String(b.agent ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                defaultSortOrder: "ascend",
                sortDirections: ["ascend", "descend"],
            },
            { title: "Type", dataIndex: "transactionType", width: 160 },
            { title: "Direction", dataIndex: "direction", width: 120 },
            { title: "Min amount", dataIndex: "minAmount", width: 120 },
            { title: "Max amount", dataIndex: "maxAmount", width: 120 },
            { title: "Currency", dataIndex: "currency", width: 90 },
        ],
        [],
    );

    const openCreateAgentLimit = () => {
        setEditingAgentLimit(null);
        agentLimitForm.resetFields();
        setIsAgentLimitModalOpen(true);
    };

    const openEditAgentLimit = (row: AgentLimitType) => {
        setEditingAgentLimit(row);
        agentLimitForm.setFieldsValue(row);
        setIsAgentLimitModalOpen(true);
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

            setIsAgentLimitModalOpen(false);
            agentLimitForm.resetFields();
            setEditingAgentLimit(null);
        } catch (error: any) {
            if (error?.errorFields) return;
            notify({ type: "error", title: "Ошибка", message: error?.message || "Не удалось сохранить лимит агента" });
        }
    };

    return (
        <>
            <Card
                title="Лимиты агентов"
                extra={<ButtonCreate title="Добавить лимит агента" onClick={openCreateAgentLimit} />}
                style={{ margin: 20 }}
            >
                {errorAgentLimits && <Alert type="error" showIcon message="Ошибка загрузки лимитов агентов" />}
                <Table<AgentLimitType>
                    rowKey={(row) => row.id}
                    columns={agentLimitColumns}
                    loading={isLoadingAgentLimits}
                    dataSource={agentLimits ?? []}
                    pagination={{ pageSize: 20 }}
                    scroll={{ x: "max-content" }}
                    style={{ cursor: "pointer" }}
                    onRow={(record) => ({
                        onClick: () => openEditAgentLimit(record),
                    })}
                />

                <Modal
                    open={isAgentLimitModalOpen}
                    onCancel={() => {
                        setIsAgentLimitModalOpen(false);
                        agentLimitForm.resetFields();
                        setEditingAgentLimit(null);
                    }}
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
                                options={[
                                    { label: "CARD CREDIT", value: "CARD_CREDIT" },
                                    { label: "CARD DEBIT", value: "CARD_DEBIT" },
                                    { label: "ACCOUNT CREDIT", value: "ACCOUNT_CREDIT" },
                                    { label: "ACCOUNT DEBET", value: "ACCOUNT_DEBET" },
                                    { label: "LOAN PAYMENT", value: "LOAN_PAYMENT" },
                                    { label: "DEPOSIT CREDIT", value: "DEPOSIT_CREDIT" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Direction" name="direction" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { label: "INCOMING", value: "INCOMING" },
                                    { label: "OUTGOING", value: "OUTGOING" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Min amount" name="minAmount" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>
                        <Form.Item label="Max amount" name="maxAmount" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                            <Button
                                onClick={() => {
                                    setIsAgentLimitModalOpen(false);
                                    agentLimitForm.resetFields();
                                    setEditingAgentLimit(null);
                                }}
                            >
                                Отмена
                            </Button>
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
            </Card>
        </>
    );
}
