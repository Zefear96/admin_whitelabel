import { useNavigate } from "react-router-dom";
import { useGetAgentList } from "../../../hooks/dictionary/agent/useGetAgentList";
import type { BankType } from "../../../types/dictionary/bankType";
import type { ColumnsType } from "antd/es/table";
import { Avatar, Button, Card, Descriptions, Modal, Table, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
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
    ]
    return (
        <>
            <Card title="Агенты" style={{ margin: 20 }}>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table<BankType>
                    rowKey={(row) => row.id}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => { setIsModalOpen(true); setSelectedRow(record) },
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>

            <Modal
                title="Детали агента"
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
                        <Descriptions.Item label="ID">
                            {selectedRow.id ?? "—"}
                        </Descriptions.Item>
                        
                        <Descriptions.Item label="Logo">
                            {selectedRow.logoUrl ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Agent">
                            {selectedRow.agent ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="BIC">
                            {selectedRow.bic ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Account">
                            {selectedRow.bankAccount ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Status">
                            {selectedRow.isActive ? (<Tag color="green">Active</Tag>) : (<Tag color="red">Inactive</Tag>)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Bank code">
                            {selectedRow.code ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Updated by">
                            {selectedRow.username ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Change date">
                            {selectedRow.changeDate ?? "—"}
                        </Descriptions.Item>



                    </Descriptions>
                )}
            </Modal>
        </>
    )
}