import { Button, Form, Input, Modal, Select } from "antd";
import type { AccountEibType } from "../../../../types/dictionary/accountType";
import { useCreateAccount } from "../../../../hooks/dictionary/account/useCreateAccount";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useGetTransactionTypeList } from "../../../../hooks/dictionary/transaction/useGetTransactionTypeList";
import { useMemo } from "react";
import type { TransactionType } from "../../../../types/dictionary/transactionType";

interface AccountCreateModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function AccountCreateModal({ isModalOpen, setIsModalOpen }: AccountCreateModalProps) {
    const [form] = Form.useForm<AccountEibType>();
    const { mutateAsync, isPending } = useCreateAccount();
    const { data: transactionTypes } = useGetTransactionTypeList();
    const transactionTypeOptions = useMemo(() => ((transactionTypes ?? []) as TransactionType[]).map((transactionType) => ({ label: transactionType.transactionType, value: transactionType.transactionType })), [transactionTypes]);
    const { notify } = useNotificationMessage();

    const handleValuesChange = (changedValues: Partial<AccountEibType>) => {
        if (!("transactionType" in changedValues)) {
            return;
        }

        const selectedType = ((transactionTypes ?? []) as TransactionType[]).find(
            (type) => type.transactionType === changedValues.transactionType,
        );

        form.setFieldValue("serviceName", selectedType?.serviceName ?? "");
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload: AccountEibType = {
                id: "",
                transactionType: values.transactionType.toUpperCase().trim(),
                serviceName: values.serviceName.trim(),
                kgsAccount: values.kgsAccount?.trim() ?? null,
                usdAccount: values.usdAccount?.trim() ?? null,
                eurAccount: values.eurAccount?.trim() ?? null,
                rubAccount: values.rubAccount?.trim() ?? null,
                cnyAccount: values.cnyAccount?.trim() ?? null,
                kztAccount: values.kztAccount?.trim() ?? null,
            };

            await mutateAsync(payload);

            notify({
                type: "success",
                title: "Успешно",
                message: "Счёт успешно создан",
            });

            handleCancel();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось создать счёт",
            });
        }
    };

    return (
        <Modal
            title="Добавить счет"
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
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    label="Тип транзакции"
                    name="transactionType"
                    rules={[{ required: true, message: "Укажите тип транзакции" }]}
                >
                    <Select options={transactionTypeOptions} virtual={false}/>
                </Form.Item>
                <Form.Item
                    label="Операция"
                    name="serviceName"
                    rules={[{ required: true, message: "Укажите операцию" }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Счет KGS" name="kgsAccount">
                    <Input />
                </Form.Item>
                <Form.Item label="Счет USD" name="usdAccount">
                    <Input />
                </Form.Item>
                <Form.Item label="Счет EUR" name="eurAccount">
                    <Input />
                </Form.Item>
                <Form.Item label="Счет RUB" name="rubAccount">
                    <Input />
                </Form.Item>
                <Form.Item label="Счет CNY" name="cnyAccount">
                    <Input />
                </Form.Item>
                <Form.Item label="Счет KZT" name="kztAccount">
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
    );
} 