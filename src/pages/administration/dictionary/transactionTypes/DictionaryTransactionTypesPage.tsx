import { Card, Table } from "antd";
import { useGetTransactionTypeList } from "../../../../hooks/dictionary/transaction/useGetTransactionTypeList"
import type { ColumnsType } from "antd/es/table";
import type { TransactionBankType } from "../../../../types/dictionary/transactionBankType";

export default function DictionaryTransactionTypesPage() {
    const { data, isLoading, error } = useGetTransactionTypeList();
    const columns: ColumnsType<TransactionBankType> = [
        // {
        //     title: "ID",
        //     dataIndex: "id",
        // },
        {
            title: "Тип транзакции",
            dataIndex: "transactionType",
        },
        {
            title: "Название операции",
            dataIndex: "serviceName",
        },
    ]
    return (
        <Card title="Типы транзакций">
            {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
            <Table
                rowKey={(row) => row.id}
                columns={columns}
                loading={isLoading}
                dataSource={data ?? []}
                pagination={false}
                style={{ cursor: "pointer" }}
            />
        </Card>
    )
}