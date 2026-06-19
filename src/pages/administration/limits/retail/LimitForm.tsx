import { Form, Input, InputNumber, Select, type FormInstance } from "antd";
import { useMemo } from "react";
import { useGetCurrencyList } from "../../../../hooks/dictionary/currency/useGetCurrencyList";
import type { CurrencyType } from "../../../../types/dictionary/currencyType";
import type { LimitType } from "../../../../types/limit/limitType";

export const PERIOD_OPTIONS = [
    { label: "ONETIME", value: "ONETIME" },
    { label: "DAY", value: "DAY" },
];

export const USER_TYPE_OPTIONS = [
    { label: "Online", value: "online" },
    { label: "Retail", value: "retail" },
    { label: "Private enterpreneur", value: "pe" },
    { label: "Corporate", value: "corporate" },
];

export const OPERATION_TYPE_OPTIONS = [
    { label: "ALL - Limit for all operations ", value: "ALL" },
    { label: "A2A_OWN - Account to account (between own clients)", value: "A2A_OWN" },
    { label: "A2C_OWN - Account to card (between own clients)", value: "A2C_OWN" },
    { label: "C2C_OWN - Card to card (between own clients)", value: "C2C_OWN" },
    { label: "C2A_OWN - Card to account (between own clients)", value: "C2A_OWN" },
    { label: "A2A - Account to account transfer (between other clients)", value: "A2A" },
    { label: "A2C - Account to card transfer (between own clients)", value: "A2C" },
    { label: "C2C - Card to card transfer (between other clients)", value: "C2C" },
    { label: "C2A - Card to account transfer (not own)", value: "C2A" },
    { label: "C2G - Payment for gov services with a bank card", value: "C2G" },
    { label: "A2G - Payment for gov services with a bank account", value: "A2G" },
    { label: "C2U - Payment for utilities with a bank card", value: "C2U" },
    { label: "A2U - Payment for utilities with a bank account", value: "A2U" },
    { label: "C2M - Payment for mobile services with a bank card", value: "C2M" },
    { label: "A2M - Payment for mobile services with a bank account", value: "A2M" }
];

interface LimitFormProps {
    form: FormInstance<LimitType>;
}

export default function LimitForm({ form }: LimitFormProps) {
    const { data: currencies, isLoading: isLoadingCurrencies } = useGetCurrencyList();

    const currencyOptions = useMemo(
        () => ((currencies ?? []) as CurrencyType[]).map((currency) => ({ label: currency.isoCode, value: currency.isoCode })),
        [currencies],
    );

    const handleValuesChange = (changedValues: Partial<LimitType>) => {
        if (!("operationType" in changedValues)) {
            return;
        }

        const selectedType = OPERATION_TYPE_OPTIONS.find((option) => option.value === changedValues.operationType);
        form.setFieldValue("description", selectedType?.label ?? "");
    };

    return (
        <Form form={form} layout="vertical" style={{ marginTop: 12 }} onValuesChange={handleValuesChange}>
            <Form.Item label="Operation type" name="operationType" rules={[{ required: true }]}>
                <Select options={OPERATION_TYPE_OPTIONS} virtual={false} />
            </Form.Item>
            <Form.Item label="Описание" name="description" rules={[{ required: true }]}>
                <Input disabled />
            </Form.Item>
            <Form.Item label="Currency" name="currency" rules={[{ required: true }]} style={{ cursor: "pointer" }}
            >
                <Select
                    options={currencyOptions}
                    loading={isLoadingCurrencies}
                    optionFilterProp="label"
                    virtual={false}
                />
            </Form.Item>
            <Form.Item label="Max count" name="maxCount" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Max amount" name="maxAmount" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Period" name="period" rules={[{ required: true }]}>
                <Select options={PERIOD_OPTIONS} />
            </Form.Item>
            <Form.Item label="User type" name="userType" rules={[{ required: true }]}>
                <Select options={USER_TYPE_OPTIONS} />
            </Form.Item>
        </Form>
    );
}
