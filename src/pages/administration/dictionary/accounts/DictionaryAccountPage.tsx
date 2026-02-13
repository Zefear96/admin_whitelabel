import { Button, Card, Descriptions, Modal, Table } from "antd";
import { useGetAccountList } from "../../../../hooks/dictionary/account/useGetAccountList";
import type { AccountEibType } from "../../../../types/dictionary/accountType";
import type { ColumnsType } from "antd/es/table";
import TableSkeleton from "./TableSkeleton";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";

export default function DictionaryAccountPage() {
    const { data, isLoading, error } = useGetAccountList();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<AccountEibType | null>(null);

    const columns: ColumnsType<AccountEibType> = [
        // {
        //     title: "ID",
        //     dataIndex: "id",
        //     width: 200,
        // },
        {
            title: "Тип транзакции",
            dataIndex: "transactionType",
        },
        {
            title: "Операция",
            dataIndex: "serviceName",
        },
        {
            title: "Счет KGS",
            dataIndex: "kgsAccount",
        },
        {
            title: "Счет USD",
            dataIndex: "usdAccount",
        },
        {
            title: "Счет EUR",
            dataIndex: "eurAccount",
        },
        {
            title: "Счет RUB",
            dataIndex: "rubAccount",
        },
        {
            title: "Счет CNY",
            dataIndex: "cnyAccount",
        },
        {
            title: "Счет KZT",
            dataIndex: "kztAccount",
        },
    ]

    if (isLoading) {
        return <TableSkeleton />
    }
    return (
        <>
            <Card title="Справочник счетов EIB">
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data ?? []}
                    loading={isLoading}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => { setIsModalOpen(true); setSelectedRow(record) },
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>

            <Modal
                title="Детали счета"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                style={{ minWidth: "60%" }}
                footer={false}
            >
                <Button color="cyan" variant="solid" style={{margin: "10px auto"}}>
                    Редактировать <EditOutlined />
                </Button>
                {selectedRow && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Тип транзакции">
                            {selectedRow.transactionType ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Операция">
                            {selectedRow.serviceName ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Счет KGS">
                            {selectedRow.kgsAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Счет USD">
                            {selectedRow.usdAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Счет EUR">
                            {selectedRow.eurAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Счет RUB">
                            {selectedRow.rubAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Счет CNY">
                            {selectedRow.cnyAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Счет KZT">
                            {selectedRow.kztAccount ?? "—"}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </>
    )
}