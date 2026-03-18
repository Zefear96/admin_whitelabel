import { Form, Input, Modal, message } from "antd";
import { useCreateTransactionType } from "../../../../hooks/dictionary/transaction/useCreateTransactionType";
import type { TransactionType } from "../../../../types/dictionary/transactionType";

interface CreateModalTransactionTypeProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function CreateModalTransactionType({ isModalOpen, setIsModalOpen }: CreateModalTransactionTypeProps) {
    const [form] = Form.useForm<TransactionType>();
    const { mutateAsync, isPending } = useCreateTransactionType();

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleFinish = async (values: Pick<TransactionType, "transactionType" | "serviceName">) => {
        try {
            await mutateAsync({
                id: "",
                transactionType: values.transactionType,
                serviceName: values.serviceName,
            });
            message.success("Тип транзакции успешно создан");
            handleCancel();
        } catch (error) {
            message.error("Не удалось создать тип транзакции");
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