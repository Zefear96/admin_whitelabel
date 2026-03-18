import { Button, Form, Input, Modal } from "antd";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import type { SwiftType } from "../../../../types/dictionary/swiftType";
import useNotificationMessage from "../../../../components/dataDisplay/NotificationMessage";
import { useCreateSwift } from "../../../../hooks/dictionary/swift/useCreateSwift";

export default function CreateModalSwift({ isModalOpen, setIsModalOpen }: ModalPropsType<SwiftType>) {

    const [form] = Form.useForm<SwiftType>()
    const { mutateAsync, isPending } = useCreateSwift();
    const { notify } = useNotificationMessage();

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload: SwiftType = {
                id: "",
                swift: values.swift.trim().toUpperCase(),
                bic: values.bic.trim(),
                iban: values.iban.trim(),
                name: values.name.trim().toUpperCase(),
                countryCode: values.countryCode.trim(),
                countryName: values.countryName.trim(),
                address: values.address.trim(),
                correspondAccount: values.correspondAccount.trim(),
                inn: values.inn.trim(),
                correspondBank: values.correspondBank.trim().toUpperCase(),
            };

            await mutateAsync(payload);

            notify({
                type: "success",
                title: "Успешно",
                message: "SWIFT счет успешно создан",
            });

            handleCancel();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось создать SWIFT счет",
            });
        }
    };

    return (
        <Modal
            title="Добавить SWIFT счет"
            open={isModalOpen}
            onCancel={handleCancel}
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
                    label="Swift-code"
                    name="swift"
                    rules={[{ required: true, message: "Укажите Swift-code" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="BIC"
                    name="bic"
                    rules={[{ required: true, message: "Укажите BIC" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="IBAN" name="iban"
                    rules={[{ required: true, message: "Укажите IBAN" }]}

                >
                    <Input />
                </Form.Item>
                <Form.Item label="Name" name="name"
                    rules={[{ required: true, message: "Укажите Name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Country code" name="countryCode"
                    rules={[{ required: true, message: "Укажите Country code" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Country name" name="countryName"
                    rules={[{ required: true, message: "Укажите Country name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Address" name="address"
                    rules={[{ required: true, message: "Укажите Address" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Correspond account" name="correspondAccount"
                    rules={[{ required: true, message: "Укажите Correspond account" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="INN" name="inn"
                    rules={[{ required: true, message: "Укажите INN" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Correspond bank" name="correspondBank"
                    rules={[{ required: true, message: "Укажите Correspond bank" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                    <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button type="primary" onClick={handleSubmit} loading={isPending}>
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}