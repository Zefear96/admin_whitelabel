import { useNavigate } from "react-router-dom";
import { useGetAgentList } from "../../../hooks/dictionary/agent/useGetAgentList";
import type { AgentType } from "../../../types/dictionary/agentType";
import type { ColumnsType } from "antd/es/table";
import { Avatar, Button, Card, Descriptions, Modal, Table, Tag } from "antd";
import { EditOutlined, EyeOutlined, EyeTwoTone, PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import AgentCreateModal from "./AgentCreateModal";
import { AdministrationPageAgentsSkeleton } from "./AdministrationPageAgentsSkeleton";

export default function AdministrationPageAgents() {
    const { data, isLoading, error } = useGetAgentList();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<AgentType | null>(null)

    const columns: ColumnsType<AgentType> = [
        {
            title: "Logo",
            dataIndex: "logoUrl",
            width: 30,
            render: (url: string) => <Avatar shape="square" size="large" src={url} />
        },
        {
            title: "Agent",
            dataIndex: "agent",
            width: 250,
            render: (text: string, row) => <div>{text}</div>
        },
        {
            title: "BIC",
            dataIndex: "bic",
            width: 80,
            render: (text: string, row) => <div>{text}</div>
        },
        {
            title: "Account",
            dataIndex: "bankAccount",
            width: 100,
            render: (text: string, row) => <div>{text}</div>
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 80,
            render: (status: boolean, row) => status ? (<Tag color="green">Active</Tag>) : (<Tag color="red">Inactive</Tag>)
        },
        // {
        //     width: 10,
        //     render: () => (<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"><EyeTwoTone /></span>)
        // },
    ]

    if (isLoading) {
        return <AdministrationPageAgentsSkeleton />;
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            </div>
            <Card title="Агенты" style={{ margin: 20 }} extra={<Button variant="solid" color="cyan" onClick={() => setIsModalOpen(true)}>Добавить агента <PlusCircleOutlined /></Button>
            }>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}

                <AgentCreateModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={null} />
                <Table<AgentType>
                    rowClassName={() => "group"}
                    rowKey={(row) => row.id}
                    columns={columns}
                    dataSource={data ?? []}
                    pagination={false}
                    onRow={(record) => ({
                        // onClick: () => { setIsModalOpen(true); setSelectedRow(record) },
                        onClick: () => navigate(`/administration/agents/${record?.code}`)
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>
        </>
    )
}