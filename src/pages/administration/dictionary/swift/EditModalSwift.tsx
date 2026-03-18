import useNotificationMessage from "../../../../components/dataDisplay/NotificationMessage";
import Popconfirm from "../../../../components/dataDisplay/Popconfirm";
import { useUpdateSwift } from "../../../../hooks/dictionary/swift/useUpdateSwift";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import type { SwiftType } from "../../../../types/dictionary/swiftType";
import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";

export default function EditModalSwift({ isModalOpen, setIsModalOpen, data }: ModalPropsType<SwiftType>) {
    const [form] = Form.useForm<SwiftType>();
    const { mutateAsync, isPending } = useUpdateSwift();
    const { notify } = useNotificationMessage();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                swift: data.swift,
                bic: data.bic,
                iban: data.iban,
                name: data.name,
                countryCode: data.countryCode,
                countryName: data.countryName,
                address: data.address,
                correspondAccount: data.correspondAccount,
                inn: data.inn,
                correspondBank: data.correspondBank,
            });
        } else {
            form.resetFields();
        }
    }, [data, form]);
    console.log(data)
    
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload: SwiftType = {
                id: data?.id ?? "",
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

            console.log(payload)

            await mutateAsync(payload);

            notify({
                type: "success",
                title: "Успешно",
                message: "SWIFT счёт успешно обновлен",
            });

            handleCancel();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось обновить SWIFT счёт",
            });
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title="Редактирование SWIFT счёта"
            style={{ minWidth: "60%" }}
            footer={null}
        >
            {data && (
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ flex: "160px" }}
                    wrapperCol={{ flex: 1 }}
                    labelAlign="left"
                    style={{ marginTop: "20px" }}
                >
                    <Form.Item label="Swift-code" name="swift"
                        rules={[{ required: true, message: "Укажите Swift-code" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="BIC" name="bic"
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
                    <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            Отмена
                        </Button>
                        <Popconfirm
                            title="Сохранить изменения SWIFT счёта?"
                            onConfirm={handleSubmit}
                            okButtonProps={{ loading: isPending }}
                        >
                            <Button type="primary" disabled={!data}>
                                Сохранить
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    )
}