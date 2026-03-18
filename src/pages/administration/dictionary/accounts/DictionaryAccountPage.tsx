import { Button, Card, Descriptions, Modal, Table } from "antd";
import { useGetAccountList } from "../../../../hooks/dictionary/account/useGetAccountList";
import type { AccountEibType } from "../../../../types/dictionary/accountType";
import type { ColumnsType } from "antd/es/table";
import TableSkeleton from "./TableSkeleton";
import { useState } from "react";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import AccountCreateModal from "./AccountCreateModal";
import AccountEditModal from "./AccountEditModal";
import { EditOutlined } from "@ant-design/icons";

export default function DictionaryAccountPage() {
    const { data, isLoading, error } = useGetAccountList();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            <Card title="Справочник счетов EIB" 
            extra={<ButtonCreate title="Добавить счет" onClick={() => setIsCreateModalOpen(true)} />}>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data ?? []}
                    loading={isLoading}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedRow(record);
                            setIsDetailsModalOpen(true);
                        },
                    })}
                    style={{ cursor: "pointer" }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
            <AccountCreateModal
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
            />
            <AccountEditModal
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                data={selectedRow}
            />
            <Modal
                title="Детали счета"
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                style={{ minWidth: "60%" }}
                footer={(
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={() => setIsDetailsModalOpen(false)}>Закрыть</Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsDetailsModalOpen(false);
                                setIsEditModalOpen(true);
                            }}
                            disabled={!selectedRow}
                        >
                            Редактировать
                        </Button>
                    </div>
                )}
            >
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