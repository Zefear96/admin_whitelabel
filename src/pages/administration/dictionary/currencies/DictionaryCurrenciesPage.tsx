import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CurrencyType } from "../../../../types/dictionary/currencyType";
import { useGetCurrencyList } from "../../../../hooks/dictionary/currency/useGetCurrencyList";
import TableSkeleton from "../accounts/TableSkeleton";

export default function DictionaryCurrenciesPage() {
    const {data, isLoading, error} = useGetCurrencyList();
    const columns: ColumnsType<CurrencyType> = [
        {
            title: "Валюта",
            dataIndex: "name"
        },
        {
            title: "ISO-код",
            dataIndex: "isoCode"
        },
        {
            title: "Цифровой код",
            dataIndex: "numericCode"
        },
    ]

    if(isLoading) {
        return <TableSkeleton/>
    }
    return (
        <Card>
            <Table
                rowKey={(row) => row.id}
                columns={columns}
                loading={isLoading}
                dataSource={data ?? []}
                pagination={false}
            />
        </Card>
    )
}