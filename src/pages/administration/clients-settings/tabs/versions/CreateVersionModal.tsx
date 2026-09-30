import { Button, Form, InputNumber, Modal, Switch } from "antd";
import type { AxiosError } from "axios";
import { useNotificationMessage } from "../../../../../components/dataDisplay/NotificationMessage";
import { useCreateVersion } from "../../../../../hooks/version-service/useCreateVersion";
import type { VersionType } from "../../../../../types/version-service/versionType";

interface CreateVersionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function CreateVersionModal({ isModalOpen, setIsModalOpen }: CreateVersionModalProps) {
    const [form] = Form.useForm<VersionType>();
    const { mutateAsync, isPending } = useCreateVersion();
    const { notify } = useNotificationMessage();

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload: VersionType = {
                major: values.major,
                minor: values.minor,
                patch: values.patch,
                build: values.build,
                forceUpdate: values.forceUpdate ?? false,
            };
            await mutateAsync(payload);
            notify({ type: "success", title: "Успешно", message: "Версия успешно добавлена" });
            handleCancel();
        } catch (error) {
            if (typeof error === "object" && error !== null && "errorFields" in error) {
                return;
            }
            notify({
                type: "error",
                title: "Ошибка",
                message: (error as AxiosError).message || "Не удалось добавить версию",
            });
        }
    };

    return (
        <Modal open={isModalOpen} onCancel={handleCancel} title="Добавить версию" footer={null}>
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: "160px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="left"
                style={{ marginTop: "20px" }}
                initialValues={{ forceUpdate: false }}
            >
                <Form.Item label="Major" name="major" rules={[{ required: true, message: "Укажите major", type: "number" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Minor" name="minor" rules={[{ required: true, message: "Укажите minor", type: "number" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Patch" name="patch" rules={[{ required: true, message: "Укажите patch", type: "number" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Build" name="build" rules={[{ required: true, message: "Укажите build", type: "number" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Force Update" name="forceUpdate" valuePropName="checked">
                    <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                    <Button style={{ marginRight: 8, marginTop: "20px" }} onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button type="primary" onClick={handleSubmit} loading={isPending}>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
