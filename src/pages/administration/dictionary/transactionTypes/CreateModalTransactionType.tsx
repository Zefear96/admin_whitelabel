import { Form, Input, Modal } from "antd";
import { useCreateTransactionType } from "../../../../hooks/dictionary/transaction/useCreateTransactionType";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import type { TransactionType } from "../../../../types/dictionary/transactionType";

interface CreateModalTransactionTypeProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function CreateModalTransactionType({ isModalOpen, setIsModalOpen }: CreateModalTransactionTypeProps) {
    const [form] = Form.useForm<TransactionType>();
    const { mutateAsync, isPending } = useCreateTransactionType();
    const { notify } = useNotificationMessage();

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleFinish = async (values: Pick<TransactionType, "transactionType" | "serviceName">) => {
        try {
            await mutateAsync({
                id: "",
                transactionType: values.transactionType.toUpperCase().trim(),
                serviceName: values.serviceName.trim(),
            });
            notify({
                type: "success",
                title: "Успешно",
                message: "Тип транзакции успешно создан",
            });
            handleCancel();
        } catch (error: any) {
            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось создать тип транзакции",
            });
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title="Добавить тип транзакции"
            okText="Сохранить"
            cancelText="Отмена"
            onOk={() => form.submit()}
            confirmLoading={isPending}
        >
            <Form form={form} layout="horizontal" onFinish={handleFinish}
             labelCol={{ flex: "160px" }}
             wrapperCol={{ flex: 1 }}
             labelAlign="left"
             style={{ marginTop: "20px" }}
            >
                <Form.Item
                    label="Тип транзакции"
                    name="transactionType"
                    normalize={(value) => value?.toUpperCase()}
                    rules={[{ required: true, message: "Укажите тип транзакции" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Название операции"
                    name="serviceName"
                    rules={[{ required: true, message: "Укажите название операции" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}