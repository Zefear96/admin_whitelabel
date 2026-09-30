import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import ButtonCreate from "../../../../../components/dataEntry/ButtonCreate";
import { useGetVersion } from "../../../../../hooks/version-service/useGetVersion";
import type { VersionType } from "../../../../../types/version-service/versionType";
import TableSkeleton from "../../../dictionary/TableSkeleton";
import CreateVersionModal from "./CreateVersionModal";
import EditVersionModal from "./EditVersionModal";

const formatVersion = (row: VersionType) => `${row.major}.${row.minor}.${row.patch}.${row.build}`;

export default function VersioningTab() {
    const { data, isLoading, error } = useGetVersion();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<VersionType | null>(null);

    const columns: ColumnsType<VersionType> = [
        {
            title: "Версия",
            key: "version",
            render: (_, row) => formatVersion(row),
        },
        {
            title: "Major",
            dataIndex: "major",
        },
        {
            title: "Minor",
            dataIndex: "minor",
        },
        {
            title: "Patch",
            dataIndex: "patch",
        },
        {
            title: "Build",
            dataIndex: "build",
        },
        {
            title: "Force update",
            dataIndex: "forceUpdate",
            render: (value: boolean) => (
                <Tag color={value ? "red" : "default"}>{value ? "Да" : "Нет"}</Tag>
            ),
        },
    ];

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <>
            <Card title="Версии мобильного приложения" extra={<ButtonCreate title="Добавить версию" onClick={() => setIsCreateModalOpen(true)} />}>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table
                    rowKey={(row) => row.id ?? formatVersion(row)}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data?.versions ?? []}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedRow(record);
                            setIsEditModalOpen(true);
                        },
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>
            <CreateVersionModal isModalOpen={isCreateModalOpen} setIsModalOpen={setIsCreateModalOpen} />
            <EditVersionModal
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                data={selectedRow}
            />
        </>
    );
}
