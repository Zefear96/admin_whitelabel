import {  Card, Table } from "antd";
import { useGetTransactionTypeList } from "../../../../hooks/dictionary/transaction/useGetTransactionTypeList"
import type { ColumnsType } from "antd/es/table";
import type { TransactionType } from "../../../../types/dictionary/transactionType";
import { useState } from "react";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import CreateModalTransactionType from "./CreateModalTransactionType";

export default function DictionaryTransactionTypesPage() {
    const { data, isLoading, error } = useGetTransactionTypeList();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const columns: ColumnsType<TransactionType> = [
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
        <>
        <Card title="Типы транзакций"
        extra={<ButtonCreate title="Добавить тип" onClick={() => setIsModalOpen(true)} />}
        >
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
        <CreateModalTransactionType isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
    )
}