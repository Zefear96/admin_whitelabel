import { Table, Tag, Alert } from "antd";
import { useGetAgentOperations } from "../../../hooks/dictionary/agent/useGetAgentOperations";
import type { ColumnsType } from "antd/es/table";
import type { AgentOperationType } from "../../../types/dictionary/agentOperationType";
import { formatRuDate } from "../../../utils/dateFormatter";

interface AgentOperationsPageProps {
    agent?: string;
}

export default function AgentOperationsPage({ agent }: AgentOperationsPageProps) {
    const { data, isLoading, error } = useGetAgentOperations(agent);
    const columns: ColumnsType<AgentOperationType> = [

        {
            title: "Agent",
            dataIndex: "agent",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "Direction",
            dataIndex: "direction",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "Status",
            dataIndex: "isEnabled",
            render: (status: boolean) => status ? (<Tag color="green">Active</Tag>) : (<Tag color="red">Inactive</Tag>)
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
        {
            title: "minAmount",
            dataIndex: "minAmount",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "maxAmount",
            dataIndex: "maxAmount",
            render: (text: string) => <span>{text}</span>
        },
        {
            title: "isArchived",
            dataIndex: "isArchived",
            render: (text: string) => <span>{text}</span>
        },
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
        <Table
            rowKey={(row) => row.id}
            columns={columns}
            loading={isLoading}
            dataSource={data ?? []}
            pagination={false}
            // onRow={(record) => ({
            //     onClick: () => navigate(`./${record.code}`),
            // })}
            style={{ cursor: "pointer" }}
            scroll={{ x: 'max-content' }}
        />
    )
}