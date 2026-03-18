import { Button, Form, Input, Modal } from "antd";
import type { CurrencyType } from "../../../../types/dictionary/currencyType";
import { useCreateCurrency } from "../../../../hooks/dictionary/currency/useCreateCurrency";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import type { AxiosError } from "axios";

export default function CreateCurrencyModal({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (isModalOpen: boolean) => void }) {
    const [form] = Form.useForm<CurrencyType>();
    const { mutateAsync, isPending } = useCreateCurrency();
    const { notify } = useNotificationMessage();
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload: CurrencyType = {
                id: "",
                isoCode: values.isoCode.trim().toUpperCase(),
                numericCode: values.numericCode.trim(),
                name: values.name.trim(),
            };
            await mutateAsync(payload);
            notify({ type: "success", title: "Успешно", message: "Валюта успешно добавлена" });
            handleCancel();
        } catch (error) {
            notify({ type: "error", title: "Ошибка", message: (error as AxiosError).message || "Не удалось добавить валюту" });
        }
    };
    return (
        <Modal open={isModalOpen} onCancel={handleCancel} title="Добавить валюту" footer={null}>
            <Form form={form} layout="horizontal" labelCol={{ flex: "160px" }} wrapperCol={{ flex: 1 }} labelAlign="left" style={{ marginTop: "20px" }}>
                <Form.Item label="Наименование" name="name" rules={[{ required: true, message: "Укажите наименование" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="ISO-код" name="isoCode" rules={[{ required: true, message: "Укажите ISO-код" }]}>
                    <Input maxLength={3} style={{ textTransform: "uppercase" }} />
                </Form.Item>
                <Form.Item label="Цифровой код" name="numericCode" rules={[{ required: true, message: "Укажите цифровой код" }, { pattern: /^[0-9]{3}$/, message: "Цифровой код содержит 3 цифры" }]}>
                    <Input maxLength={3} />
                </Form.Item>
                <Form.Item style={{ textAlign: "right", }}>
                    <Button style={{ marginRight: 8, marginTop: "20px" }} onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button type="primary" onClick={handleSubmit} loading={isPending}>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}