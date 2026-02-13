import { useNavigate } from "react-router-dom";
import { useGetAgentList } from "../../../hooks/dictionary/agent/useGetAgentList";
import type { BankType } from "../../../types/dictionary/bankType";
import type { ColumnsType } from "antd/es/table";
import { Avatar, Button, Card, Descriptions, Modal, Table, Tag } from "antd";
import { EditOutlined, EyeOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";

export default function AdministrationPageAgents() {
    const { data, isLoading, error } = useGetAgentList();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<BankType | null>(null)

    const columns: ColumnsType<BankType> = [
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
        {
            width: 10,
            render: () => (<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"><EyeTwoTone /></span>)
        },
    ]
    return (
        <>
            <Card title="Агенты" style={{ margin: 20 }}>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table<BankType>
                    rowClassName={() => "group"}
                    rowKey={(row) => row.id}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    onRow={(record) => ({
                        // onClick: () => { setIsModalOpen(true); setSelectedRow(record) },
                        onClick:() => navigate(`/administration/agents/${record?.code}`)
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>

        </>
    )
}