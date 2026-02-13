import { Button, Card, Descriptions, Modal, Table } from "antd";
import { useGetSwiftList } from "../../../../hooks/dictionary/swift/useGetSwiftList";
import type { ColumnsType } from "antd/es/table";
import type { SwiftType } from "../../../../types/dictionary/swiftType";
import TableSkeleton from "../accounts/TableSkeleton";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";

export default function DictionarySwiftPage() {
    const { data, isLoading, error } = useGetSwiftList();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<SwiftType | null>(null)
    const columns: ColumnsType<SwiftType> = [
        {
            title: "Swift-code",
            dataIndex: "swift"
        },
        {
            title: "BIC",
            dataIndex: "bic"
        },
        {
            title: "IBAN",
            dataIndex: "iban"
        },
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Country code",
            dataIndex: "countryCode"
        },
        {
            title: "Country name",
            dataIndex: "countryName"
        },
        {
            title: "Address",
            dataIndex: "address"
        },
        {
            title: "Correspond account",
            dataIndex: "correspondAccount"
        },
        {
            title: "INN",
            dataIndex: "inn"
        },
        {
            title: "Correspond bank",
            dataIndex: "correspondBank"
        },
    ]

    if (isLoading) {
        return <TableSkeleton />
    }

    return (
        <>
            <Card title="Справочник SWIFT">
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table
                    rowKey={(row) => row.id}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    onRow={(record) => ({
                        onClick: () => { setIsModalOpen(true); setSelectedRow(record) }
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
                <Button color="cyan" variant="solid" style={{ margin: "10px auto" }}>
                    Редактировать <EditOutlined />
                </Button>
                {selectedRow && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="SWIFT-code">
                            {selectedRow.swift ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="BIC">
                            {selectedRow.bic ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="IBAN">
                            {selectedRow.iban ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Name">
                            {selectedRow.name ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Country code">
                            {selectedRow.countryCode ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Country name">
                            {selectedRow.countryName ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Address">
                            {selectedRow.address ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Correspond account">
                            {selectedRow.correspondAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="INN">
                            {selectedRow.inn ?? "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Correspond bank">
                            {selectedRow.correspondBank ?? "—"}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </>
    )
}