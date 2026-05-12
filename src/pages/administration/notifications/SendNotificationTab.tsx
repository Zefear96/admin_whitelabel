import { Button, Form, Input, Card } from "antd";
import { useCreateGlobalNotification } from "../../../hooks/push-notification/useCreateGlobalNotification";
import { useNotificationMessage } from "../../../components/dataDisplay/NotificationMessage";
import type { RequestBodyNotificationType } from "../../../types/pushNotification/requestBodyNotificationType";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;


export default function SendNotificationTab() {
    const [form] = Form.useForm();
    const { mutateAsync, isPending } = useCreateGlobalNotification();
    const { notify } = useNotificationMessage();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload: RequestBodyNotificationType = {
                // notificationType: "GLOBAL_EIB_NEWS",
                title: values.title,
                body: values.body,
                // imageUrl: values.imageUrl || null,
            };

            await mutateAsync(payload);

            notify({
                type: "success",
                title: "Успешно",
                message: "Глобальное уведомление отправлено",
            });

            form.resetFields();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось отправить уведомление",
            });
        }
    };
    return (
        <Card title="Отправка глобального уведомления">
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="Заголовок"
                    name="title"
                    rules={[{ required: true, message: "Введите заголовок" }]}
                >
                    <Input placeholder="Введите заголовок" />
                </Form.Item>

                <Form.Item
                    label="Текст"
                    name="body"
                    rules={[{ required: true, message: "Введите текст уведомления" }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Введите текст уведомления"
                    />
                </Form.Item>

                {/* <Form.Item
            label="URL изображения (необязательно)"
            name="imageUrl"
            rules={[{ type: "url", warningOnly: true, message: "Введите корректный URL" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item> */}

                <Form.Item>
                    <Button
                        variant="solid" color="cyan" onClick={handleSubmit}
                        loading={isPending}
                        icon={<SendOutlined />}
                    >
                        Отправить
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}