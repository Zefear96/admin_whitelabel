import { Alert, Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import { useGetAgentLimits } from "../../../../hooks/limits/useGetAgentLimits";
import type { AgentLimitType } from "../../../../types/limit/limitType";
import { formatAmount } from "../../../../utils/amountFormatter";
import TableSkeleton from "../../dictionary/TableSkeleton";
import AgentLimitModal from "./AgentLimitModal";

export default function AdministrationPageLimitsAgent() {
    const { data: agentLimits, isLoading: isLoadingAgentLimits, error: errorAgentLimits } = useGetAgentLimits();

    const [isAgentLimitModalOpen, setIsAgentLimitModalOpen] = useState(false);
    const [editingAgentLimit, setEditingAgentLimit] = useState<AgentLimitType | null>(null);

    const agentLimitColumns: ColumnsType<AgentLimitType> = useMemo(
        () => [
            { title: "Agent", dataIndex: "agent", width: 120, sorter: (a, b) =>
                    String(a.agent ?? "").localeCompare(String(b.agent ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                defaultSortOrder: "ascend",
                sortDirections: ["ascend", "descend"],
            },
            { title: "Type", dataIndex: "transactionType", width: 160 },
            { title: "Service Name", dataIndex: "serviceName", width: 160 },
            { title: "Direction", dataIndex: "direction", width: 120, sorter: (a, b) =>
                    String(a.direction ?? "").localeCompare(String(b.direction ?? ""), undefined, {
                        sensitivity: "base",
                    }),
                sortDirections: ["ascend", "descend"],
            },
            { title: "Min amount", dataIndex: "minAmount", width: 120, render: (value: number | null | undefined) => formatAmount(value) },
            { title: "Max amount", dataIndex: "maxAmount", width: 120, render: (value: number | null | undefined) => formatAmount(value) },
            { title: "Currency", dataIndex: "currency", width: 90 },
        ],
        [],
    );

    const openCreateAgentLimit = () => {
        setEditingAgentLimit(null);
        setIsAgentLimitModalOpen(true);
    };

    const openEditAgentLimit = (row: AgentLimitType) => {
        setEditingAgentLimit(row);
        setIsAgentLimitModalOpen(true);
    };

    const closeAgentLimitModal = () => {
        setIsAgentLimitModalOpen(false);
        setEditingAgentLimit(null);
    };

    if (isLoadingAgentLimits) {
        return <TableSkeleton />;
    }

    return (
        <>
            <Card
                title="Лимиты агентов"
                extra={<ButtonCreate title="Добавить лимит агента" onClick={openCreateAgentLimit} />}
                style={{ margin: 20 }}
            >
                {errorAgentLimits && <Alert type="error" showIcon message="Ошибка загрузки лимитов агентов" />}
                <Table<AgentLimitType>
                    rowKey={(row) => row.id}
                    columns={agentLimitColumns}
                    loading={isLoadingAgentLimits}
                    dataSource={agentLimits ?? []}
                    pagination={{ pageSize: 20 }}
                    scroll={{ x: "max-content" }}
                    style={{ cursor: "pointer" }}
                    onRow={(record) => ({
                        onClick: () => openEditAgentLimit(record),
                    })}
                />

                <AgentLimitModal
                    open={isAgentLimitModalOpen}
                    editingAgentLimit={editingAgentLimit}
                    onClose={closeAgentLimitModal}
                />
            </Card>
        </>
    );
}
