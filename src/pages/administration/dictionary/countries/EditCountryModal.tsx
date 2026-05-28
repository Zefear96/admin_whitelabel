import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import useNotificationMessage from "../../../../components/dataDisplay/NotificationMessage";
import Popconfirm from "../../../../components/dataDisplay/Popconfirm";
import { useUpdateCountry } from "../../../../hooks/dictionary/country/useUpdateCountry";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import type { CountryType } from "../../../../types/dictionary/countryType";

type CountryFormValues = Pick<CountryType, "name" | "code" | "litCode">;

export default function EditCountryModal({ isModalOpen, setIsModalOpen, data }: ModalPropsType<CountryType>) {
    const [form] = Form.useForm<CountryFormValues>();
    const { mutateAsync, isPending } = useUpdateCountry();
    const { notify } = useNotificationMessage();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data.name,
                code: data.code,
                litCode: data.litCode,
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
        if (!data) {
            return;
        }

        try {
            const values = await form.validateFields();

            await mutateAsync({
                id: data.id,
                name: values.name.trim(),
            });

            notify({
                type: "success",
                title: "Успешно",
                message: "Страна успешно обновлена",
            });

            handleCancel();
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "errorFields" in error) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error instanceof Error ? error.message : "Не удалось обновить страну",
            });
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title="Редактирование страны"
            footer={null}
        >
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: "160px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="left"
                style={{ marginTop: "20px" }}
            >
                <Form.Item
                    label="Наименование"
                    name="name"
                    rules={[{ required: true, message: "Укажите наименование" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="ISO-код" name="code">
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Код" name="litCode">
                    <Input disabled />
                </Form.Item>
                <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        Отмена
                    </Button>
                    <Popconfirm
                        title="Сохранить изменения страны?"
                        onConfirm={handleSubmit}
                        okButtonProps={{ loading: isPending }}
                    >
                        <Button type="primary" disabled={!data}>
                            Сохранить
                        </Button>
                    </Popconfirm>
                </Form.Item>
            </Form>
        </Modal>
    )
}
