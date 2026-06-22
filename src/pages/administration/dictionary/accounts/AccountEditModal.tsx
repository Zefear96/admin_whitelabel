import { Button, Form, Input, Modal, Select } from "antd";
import type { AccountEibType } from "../../../../types/dictionary/accountType";
import { useEffect, useMemo } from "react";
import { useUpdateAccount } from "../../../../hooks/dictionary/account/useUpdateAccount";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import { useGetTransactionTypeList } from "../../../../hooks/dictionary/transaction/useGetTransactionTypeList";
import type { TransactionType } from "../../../../types/dictionary/transactionType";

export default function AccountEditModal({ isModalOpen, setIsModalOpen, data }: ModalPropsType<AccountEibType>) {
    const [form] = Form.useForm<AccountEibType>();
    const { mutateAsync, isPending } = useUpdateAccount();
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

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                id: data.id,
                transactionType: data.transactionType,
                serviceName: data.serviceName,
                kgsAccount: data.kgsAccount ?? undefined,
                usdAccount: data.usdAccount ?? undefined,
                eurAccount: data.eurAccount ?? undefined,
                rubAccount: data.rubAccount ?? undefined,
                cnyAccount: data.cnyAccount ?? undefined,
                kztAccount: data.kztAccount ?? undefined,
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
        if (!data) return;

        try {
            const values = await form.validateFields();

            const payload: AccountEibType = {
                id: data.id,
                transactionType: values.transactionType,
                serviceName: values.serviceName,
                kgsAccount: values.kgsAccount ?? null,
                usdAccount: values.usdAccount ?? null,
                eurAccount: values.eurAccount ?? null,
                rubAccount: values.rubAccount ?? null,
                cnyAccount: values.cnyAccount ?? null,
                kztAccount: values.kztAccount ?? null,
            };

            await mutateAsync(payload);

            notify({
                type: "success",
                title: "Успешно",
                message: "Счёт успешно обновлён",
            });

            handleCancel();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: error?.message || "Не удалось обновить счёт",
            });
        }
    };

    return (
        <Modal
            title="Редактировать счет"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    label="Тип транзакции"
                    name="transactionType"
                    rules={[{ required: true, message: "Укажите тип транзакции" }]}
                >
                    <Select options={transactionTypeOptions} virtual={false} />
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
                    <Button type="primary" onClick={handleSubmit} loading={isPending} disabled={!data}>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
} 