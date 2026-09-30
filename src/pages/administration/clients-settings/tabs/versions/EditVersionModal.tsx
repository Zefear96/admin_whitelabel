import { Button, Form, InputNumber, Modal, Switch } from "antd";
import { useEffect } from "react";
import { useNotificationMessage } from "../../../../../components/dataDisplay/NotificationMessage";
import Popconfirm from "../../../../../components/dataDisplay/Popconfirm";
import { useDeleteVersion } from "../../../../../hooks/version-service/useDeleteVersion";
import { useUpdateVersion } from "../../../../../hooks/version-service/useUpdateVersion";
import type { ModalPropsType } from "../../../../../types/components/modalPropsType";
import type { VersionType } from "../../../../../types/version-service/versionType";

export default function EditVersionModal({ isModalOpen, setIsModalOpen, data }: ModalPropsType<VersionType>) {
    const [form] = Form.useForm<VersionType>();
    const { mutateAsync, isPending } = useUpdateVersion();
    const { mutateAsync: deleteAsync, isPending: isDeleting } = useDeleteVersion();
    const { notify } = useNotificationMessage();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                major: data.major,
                minor: data.minor,
                patch: data.patch,
                build: data.build,
                forceUpdate: data.forceUpdate,
            });
        } else {
            form.resetFields();
        }
    }, [data, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        if (!data?.id) {
            return;
        }

        try {
            const values = await form.validateFields();
            await mutateAsync({
                id: data.id,
                version: {
                    major: values.major,
                    minor: values.minor,
                    patch: values.patch,
                    build: values.build,
                    forceUpdate: values.forceUpdate ?? false,
                },
            });
            notify({ type: "success", title: "Успешно", message: "Версия успешно обновлена" });
            handleCancel();
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "errorFields" in error) {
                return;
            }
            notify({
                type: "error",
                title: "Ошибка",
                message: error instanceof Error ? error.message : "Не удалось обновить версию",
            });
        }
    };

    const handleDelete = async () => {
        if (!data?.id) {
            return;
        }

        try {
            await deleteAsync(data.id);
            notify({ type: "success", title: "Успешно", message: "Версия успешно удалена" });
            handleCancel();
        } catch (error: unknown) {
            notify({
                type: "error",
                title: "Ошибка",
                message: error instanceof Error ? error.message : "Не удалось удалить версию",
            });
        }
    };

    return (
        <Modal open={isModalOpen} onCancel={handleCancel} title="Редактирование версии" footer={null}>
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: "160px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="left"
                style={{ marginTop: "20px" }}
            >
                <Form.Item label="Major" name="major" rules={[{ required: true, message: "Укажите major" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Minor" name="minor" rules={[{ required: true, message: "Укажите minor" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Patch" name="patch" rules={[{ required: true, message: "Укажите patch" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Build" name="build" rules={[{ required: true, message: "Укажите build" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Force update" name="forceUpdate" valuePropName="checked">
                    <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                </Form.Item>
                <Form.Item style={{ display: "flex", justifyContent: "space-between", marginTop: 16, width: "100%" }}>
                    <Popconfirm
                        title="Удалить версию?"
                        onConfirm={handleDelete}
                        okButtonProps={{ loading: isDeleting, danger: true }}
                    >
                        <Button danger style={{ marginRight: 8 }} disabled={!data?.id}>
                            Удалить
                        </Button>
                    </Popconfirm>
              
                    <Popconfirm
                        title="Сохранить изменения версии?"
                        onConfirm={handleSubmit}
                        okButtonProps={{ loading: isPending }}
                    >
                        <Button type="primary" disabled={!data?.id}>
                            Сохранить
                        </Button>
                    </Popconfirm>
                </Form.Item>
            </Form>
        </Modal>
    );
}
