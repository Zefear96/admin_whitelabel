import { Table, Tag, Alert, Button } from "antd";
import { useGetAgentOperations } from "../../../hooks/dictionary/agent/useGetAgentOperations";
import type { ColumnsType } from "antd/es/table";
import type { AgentOperationType } from "../../../types/dictionary/agentOperationType";
import { formatRuDate } from "../../../utils/dateFormatter";
import { useState } from "react";
import AgentOperationModal from "./AgentOperationModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import AgentOperationCreateModal from "./AgentOperationCreateModal";

interface AgentOperationsPageProps {
    agent?: string;
}

export default function AgentOperationsPage({ agent }: AgentOperationsPageProps) {
    const { data, isLoading, error } = useGetAgentOperations(agent);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<AgentOperationType | null>(null);

    const openEditModal = (operation: AgentOperationType) => {
        setSelectedOperation(operation);
        setIsEditModalOpen(true);
    };

    const columns: ColumnsType<AgentOperationType> = [

        {
            title: "Agent",
            dataIndex: "agent",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "Direction",
            dataIndex: "direction",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "Service Name",
            dataIndex: "serviceName",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "ChangeDate",
            dataIndex: "changeDate",
            render: (text: string) => <span>{formatRuDate(text)}</span>
        },
        {
            title: "changedBy",
            dataIndex: "changedBy",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "startDate",
            dataIndex: "startDate",
            render: (text: string) => <span>{formatRuDate(text)}</span>
        },
        {
            title: "endDate",
            dataIndex: "endDate",
            render: (text: string) => <span>{formatRuDate(text)}</span>
        },
        // {
        //     title: "minAmount",
        //     dataIndex: "minAmount",
        //     render: (text: string) => <span>{text}</span>
        // },
        // {
        //     title: "maxAmount",
        //     dataIndex: "maxAmount",
        //     render: (text: string) => <span>{text}</span>
        // },
        // {
        //     title: "isArchived",
        //     dataIndex: "isArchived",
        //     render: (text: string) => <span>{text}</span>
        // },
        {
            title: "Status",
            dataIndex: "active",
            render: (status: boolean) => status ? (<Tag color="green">Active</Tag>) : (<Tag color="red">Inactive</Tag>)
        },
    ]

    if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных';
        return <Alert message="Ошибка загрузки данных" description={errorMessage} type="error" showIcon />;
    }

    return (
        <>
            <Table
                rowKey={(row) => row.id}
                columns={columns}
                loading={isLoading}
                dataSource={data ?? []}
                pagination={false}
                onRow={(record) => ({
                    onClick: () => openEditModal(record),
                })}
                style={{ cursor: "pointer" }}
                scroll={{ x: 'max-content' }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "30px auto" }}>
                <Button color="cyan" variant="solid" onClick={() => setIsCreateModalOpen(true)}>Добавить операцию <PlusCircleOutlined /></Button>
            </div>
            <AgentOperationCreateModal
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                agent={agent ?? ""}
            />
            <AgentOperationModal
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                data={selectedOperation}
            />
        </>
    )
}