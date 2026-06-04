import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CurrencyType } from "../../../../types/dictionary/currencyType";
import { useGetCurrencyList } from "../../../../hooks/dictionary/currency/useGetCurrencyList";
import TableSkeleton from "../TableSkeleton";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import { useState } from "react";
import CreateCurrencyModal from "./CreateCurrencyModal";

export default function DictionaryCurrenciesPage() {
    const {data, isLoading, error} = useGetCurrencyList();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<CurrencyType | null>(null);

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
        <Card title="Справочник валют" extra={<ButtonCreate title="Добавить валюту" onClick={() => setIsCreateModalOpen(true)} />}>
            {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
            <Table
                rowKey={(row) => row.id}
                columns={columns}
                loading={isLoading}
                dataSource={data ?? []}
                pagination={false}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedRow(record);
                    },
                })}
                style={{ cursor: "pointer" }}/>
            <CreateCurrencyModal isModalOpen={isCreateModalOpen} setIsModalOpen={setIsCreateModalOpen} />
        </Card>
    )
}