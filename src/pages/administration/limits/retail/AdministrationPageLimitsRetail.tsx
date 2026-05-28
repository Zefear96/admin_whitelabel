import { Alert, Button, Card, Form, Input, InputNumber, Modal, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useGetLimits } from "../../../../hooks/limits/useGetLimits";
import { useCreateLimit } from "../../../../hooks/limits/useCreateLimit";
import { useUpdateLimit } from "../../../../hooks/limits/useUpdateLimit";
import type {  LimitType } from "../../../../types/limit/limitType";
import { formatAmount } from "../../../../utils/amountFormatter";

export default function AdministrationPageLimitsRetail() {
    const { notify } = useNotificationMessage();

    const { data: limits, isLoading: isLoadingLimits, error: errorLimits } = useGetLimits();

    const { mutateAsync: createLimit, isPending: isCreatingLimit } = useCreateLimit();
    const { mutateAsync: updateLimit, isPending: isUpdatingLimit } = useUpdateLimit();

    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [editingLimit, setEditingLimit] = useState<LimitType | null>(null);
    const [limitForm] = Form.useForm<LimitType>();

    const limitColumns: ColumnsType<LimitType> = useMemo(
        () => [
            {
                title: "Operation",
                dataIndex: "operationType",
                width: 160,
                sorter: (a, b) =>
                    String(a.operationType ?? "").localeCompare(String(b.operationType ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                defaultSortOrder: "ascend",
                sortDirections: ["ascend", "descend"],
            },
            {
                title: "Описание",
                dataIndex: "description",
                width: 220,
                ellipsis: true,
                // sorter: (a, b) =>
                //     String(a.description ?? "").localeCompare(String(b.description ?? ""), undefined, {
                //         sensitivity: "base",
                //     }),
                // sortDirections: ["ascend", "descend"],
            },
            { title: "User type", dataIndex: "userType", width: 120 },
            { title: "Max count", dataIndex: "maxCount", width: 110 },
            {
                title: "Max amount",
                dataIndex: "maxAmount",
                width: 140,
                render: (value: number | null | undefined) => formatAmount(value),
            },
            { title: "Currency", dataIndex: "currency", width: 90 },
            { title: "Period", dataIndex: "period", width: 120, sorter: (a, b) =>
                    String(a.period ?? "").localeCompare(String(b.period ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                defaultSortOrder: "ascend",
                sortDirections: ["ascend", "descend"],
            },
        ],
        [],
    );

    const openCreateLimit = () => {
        setEditingLimit(null);
        limitForm.resetFields();
        setIsLimitModalOpen(true);
    };

    const openEditLimit = (row: LimitType) => {
        setEditingLimit(row);
        limitForm.setFieldsValue(row);
        setIsLimitModalOpen(true);
    };

    const submitLimit = async () => {
        try {
            const values = await limitForm.validateFields();
            const payload: LimitType = {
                ...(editingLimit ?? ({} as LimitType)),
                ...values,
                id: editingLimit?.id ?? values.id ?? "",
            };

            if (editingLimit) {
                await updateLimit(payload);
                notify({ type: "success", title: "Успешно", message: "Лимит обновлён" });
            } else {
                await createLimit(payload);
                notify({ type: "success", title: "Успешно", message: "Лимит создан" });
            }

            setIsLimitModalOpen(false);
            limitForm.resetFields();
            setEditingLimit(null);
        } catch (error: any) {
            if (error?.errorFields) return;
            notify({ type: "error", title: "Ошибка", message: error?.message || "Не удалось сохранить лимит" });
        }
    };

    return (
        <Card
            title="Лимиты физических лиц"
            extra={<ButtonCreate title="Добавить лимит" onClick={openCreateLimit} />}
            style={{ margin: 20 }}
        >
            {errorLimits && <Alert type="error" showIcon message="Ошибка загрузки лимитов" />}
            <Table<LimitType>
                rowKey={(row) => row.id}
                columns={limitColumns}
                loading={isLoadingLimits}
                dataSource={limits ?? []}
                pagination={{ pageSize: 20 }}
                scroll={{ x: "max-content" }}
                style={{ cursor: "pointer" }}
                onRow={(record) => ({
                    onClick: () => openEditLimit(record),
                })}
            />

            <Modal
                open={isLimitModalOpen}
                onCancel={() => {
                    setIsLimitModalOpen(false);
                    limitForm.resetFields();
                    setEditingLimit(null);
                }}
                title={editingLimit ? "Редактировать лимит" : "Создать лимит"}
                footer={null}
            >
                <Form
                    form={limitForm}
                    layout="vertical"
                    style={{ marginTop: 12 }}
                >
                    <Form.Item label="Operation type" name="operationType" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Описание" name="description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Max count" name="maxCount" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                    <Form.Item label="Max amount" name="maxAmount" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                    <Form.Item label="Period" name="period" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: "ONETIME", value: "ONETIME" },
                                // { label: "MINUTE", value: "MINUTE" },
                                // { label: "HOUR", value: "HOUR" },
                                { label: "DAY", value: "DAY" },
                                // { label: "MONTH", value: "MONTH" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="User type" name="userType" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: "Online", value: "online" },
                                { label: "Retail", value: "retail" },
                                { label: "Private enterprener", value: "pe" },
                                { label: "Corporate", value: "corporate" },
                                { label: "Any", value: "ANY" },
                            ]}
                        />
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                        <Button
                            onClick={() => {
                                setIsLimitModalOpen(false);
                                limitForm.resetFields();
                                setEditingLimit(null);
                            }}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="primary"
                            loading={isCreatingLimit || isUpdatingLimit}
                            onClick={submitLimit}
                        >
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
}
