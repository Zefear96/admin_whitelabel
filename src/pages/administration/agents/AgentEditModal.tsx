import { Form, Input, Modal, Switch, Tabs, type TabsProps, Button } from "antd";
import { useEffect, useState } from "react";
import AgentOperationsPage from "./AgentOperationsPage";
import type { AgentType } from "../../../types/dictionary/agentType";
import { useUpdateAgent } from "../../../hooks/dictionary/agent/useUpdateAgent";
import Popconfirm from "../../../components/dataDisplay/Popconfirm";
import { useNotificationMessage } from "../../../components/dataDisplay/NotificationMessage";
import type { ModalPropsType } from "../../../types/components/modalPropsType";

export default function AgentEditModal({ isModalOpen, setIsModalOpen, data }: ModalPropsType<AgentType>) {
    const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState("1");
    const { mutateAsync, isPending } = useUpdateAgent();
    const { notify } = useNotificationMessage();

    useEffect(() => {
        if (isModalOpen && data) {
            form.setFieldsValue({
                agent: data.agent,
                bic: data.bic,
                bankAccount: data.bankAccount,
                isActive: data.isActive,
            });
        }
    }, [isModalOpen, data, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const payload: AgentType = {
                ...data as AgentType,
                agent: values.agent,
                bic: values.bic,
                bankAccount: values.bankAccount,
                isActive: values.isActive,
                // changedBy: user?.name ?? agentData.changedBy,
                // changeDate: new Date().toISOString(),
            };

            await mutateAsync(payload);
            notify({
                type: "success",
                title: "Успешно",
                message: "Данные агента успешно обновлены",
            });
            handleCancel();
        } catch (error: any) {
            // console.log("error", error);
            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось обновить данные агента",
            });
        }
    };

    const items: TabsProps["items"] = [
        {
            label: "Общая информация",
            key: "1",
            children: (
                <Form form={form} layout="horizontal" labelCol={{ flex: '110px' }} wrapperCol={{ flex: 1 }} labelAlign="left" style={{ marginTop: "10px" }}>
                    <Form.Item label="Имя агента" name="agent" rules={[{ required: true, message: "Введите наименование агента" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="БИК" name="bic" rules={[{ required: true, message: "Введите BIC" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Счет" name="bankAccount" rules={[{ required: true, message: "Введите счёт" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Активен" name="isActive" valuePropName="checked">
                        <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                    </Form.Item>
                </Form>
            ),
        },
        {
            label: "Операции агента",
            key: "2",
            children: <AgentOperationsPage agent={data?.code ?? "" as string} />,
        },
    ];

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title="Редактирование агента"
            style={{ minWidth: "60%" }}
            footer={null}
        >
            <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
                size="large"
                items={items}
                className="activeTab"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
                <Button onClick={handleCancel}>
                    Отмена
                </Button>
                <Popconfirm
                    title="Сохранить изменения агента?"
                    onConfirm={handleOk}
                    okButtonProps={{ loading: isPending }}
                >
                    <Button type="primary">
                        Сохранить
                    </Button>
                </Popconfirm>
            </div>
        </Modal>
    );
}