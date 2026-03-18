import { Card, Table } from "antd";
import { useGetSwiftList } from "../../../../hooks/dictionary/swift/useGetSwiftList";
import type { ColumnsType } from "antd/es/table";
import type { SwiftType } from "../../../../types/dictionary/swiftType";
import TableSkeleton from "../accounts/TableSkeleton";
import { useState } from "react";
import EditModalSwift from "./EditModalSwift";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import CreateModalSwift from "./CreateModalSwift";
import DetailsModalSwift from "./DetailsModalSwift";

export default function DictionarySwiftPage() {
    const { data, isLoading, error } = useGetSwiftList();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<SwiftType | null>(null);
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
            <Card title="Справочник SWIFT"
                extra={<ButtonCreate title="Добавить SWIFT счет" onClick={() => setIsCreateModalOpen(true)} />
                }>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}

                <Table
                    rowKey={(row) => row.id}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedRow(record);
                            setIsDetailsModalOpen(true);
                        }
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>
            <DetailsModalSwift
                isModalOpen={isDetailsModalOpen}
                setIsModalOpen={setIsDetailsModalOpen}
                data={selectedRow}
                onEditClick={() => setIsEditModalOpen(true)}
            />
            <EditModalSwift
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                data={selectedRow}
            />
            <CreateModalSwift
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                data={null}
            />
        </>
    )
}