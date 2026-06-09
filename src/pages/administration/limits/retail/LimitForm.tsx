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

interface LimitFormProps {
    form: FormInstance<LimitType>;
}

export default function LimitForm({ form }: LimitFormProps) {
    const { data: currencies, isLoading: isLoadingCurrencies } = useGetCurrencyList();

    const currencyOptions = useMemo(
        () => ((currencies ?? []) as CurrencyType[]).map((currency) => ({ label: currency.isoCode, value: currency.isoCode })),
        [currencies],
    );

    return (
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
            <Form.Item label="Operation type" name="operationType" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Описание" name="description" rules={[{ required: true }]}>
                <Input />
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
