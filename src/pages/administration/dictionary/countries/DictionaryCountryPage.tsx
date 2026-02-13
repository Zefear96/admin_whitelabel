import { Card, Table } from "antd";
import { useGetSwiftList } from "../../../../hooks/dictionary/swift/useGetSwiftList";
import type { ColumnsType } from "antd/es/table";
import type { SwiftType } from "../../../../types/dictionary/swiftType";
import TableSkeleton from "../accounts/TableSkeleton";
import { useGetCountryList } from "../../../../hooks/dictionary/country/useGetCountryList";
import type { CountryType } from "../../../../types/dictionary/countryType";

export default function DictionaryCountryPage() {
    const { data, isLoading, error } = useGetCountryList();
    const columns: ColumnsType<CountryType> = [
        {
            title: "Наименование",
            dataIndex: "name"
        },
        {
            title: "ISO-код",
            dataIndex: "code"
        },
        {
            title: "Код",
            dataIndex: "litCode"
        },
    ]

    if (isLoading) {
        return <TableSkeleton />
    }

    return (
        <Card title="Справочник стран">
            {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
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