import { Alert, Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import { useGetLimits } from "../../../../hooks/limits/useGetLimits";
import type {  LimitType } from "../../../../types/limit/limitType";
import { formatAmount } from "../../../../utils/amountFormatter";
import TableSkeleton from "../../dictionary/TableSkeleton";
import LimitCreateModal from "./LimitCreateModal";
import LimitEditModal from "./LimitEditModal";
import LimitViewModal from "./LimitViewModal";

export default function AdministrationPageLimitsRetail() {
    const { data: limits, isLoading: isLoadingLimits, error: errorLimits } = useGetLimits();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedLimit, setSelectedLimit] = useState<LimitType | null>(null);

    const limitColumns: ColumnsType<LimitType> = useMemo(
        () => [
            {
                title: "Operation",
                dataIndex: "operationType",
                width: 160,
                sorter: (a, b) =>
                    String(a.operationType ?? "").localeCompare(String(b.operationType ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                defaultSortOrder: "ascend",
                sortDirections: ["ascend", "descend"],
            },
            {
                title: "Описание",
                dataIndex: "description",
                width: 220,
                ellipsis: true,
                // sorter: (a, b) =>
                //     String(a.description ?? "").localeCompare(String(b.description ?? ""), undefined, {
                //         sensitivity: "base",
                //     }),
                // sortDirections: ["ascend", "descend"],
            },
            { title: "User type", dataIndex: "userType", width: 120 },
            { title: "Max count", dataIndex: "maxCount", width: 110 },
            {
                title: "Max amount",
                dataIndex: "maxAmount",
                width: 140,
                render: (value: number | null | undefined) => formatAmount(value),
            },
            { title: "Currency", dataIndex: "currency", width: 90 },
            { title: "Period", dataIndex: "period", width: 120, sorter: (a, b) =>
                    String(a.period ?? "").localeCompare(String(b.period ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                defaultSortOrder: "ascend",
                sortDirections: ["ascend", "descend"],
            },
        ],
        [],
    );

    const openCreateLimit = () => {
        setIsCreateOpen(true);
    };

    const openViewLimit = (row: LimitType) => {
        setSelectedLimit(row);
        setIsViewOpen(true);
    };

    const openEditFromView = () => {
        setIsViewOpen(false);
        setIsEditOpen(true);
    };

    const closeViewModal = () => {
        setIsViewOpen(false);
        setSelectedLimit(null);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedLimit(null);
    };

    if (isLoadingLimits) {
        return <TableSkeleton />;
    }

    return (
        <Card
            title="Лимиты физических лиц"
            extra={<ButtonCreate title="Добавить лимит" onClick={openCreateLimit} />}
            style={{ margin: 20 }}
        >
            {errorLimits && <Alert type="error" showIcon message="Ошибка загрузки лимитов" />}
            <Table<LimitType>
                rowKey={(row) => row.id}
                columns={limitColumns}
                loading={isLoadingLimits}
                dataSource={limits ?? []}
                pagination={{ pageSize: 20 }}
                scroll={{ x: "max-content" }}
                style={{ cursor: "pointer" }}
                onRow={(record) => ({
                    onClick: () => openViewLimit(record),
                })}
            />

            <LimitCreateModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <LimitViewModal
                open={isViewOpen}
                onClose={closeViewModal}
                onEdit={openEditFromView}
                limit={selectedLimit}
            />
            <LimitEditModal open={isEditOpen} onClose={closeEditModal} limit={selectedLimit} />
        </Card>
    );
}
