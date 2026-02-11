import type { ColumnsType } from "antd/es/table";
import { useGetAgentList } from "../../../../hooks/dictionary/agent/useGetAgentList"
import type { BankType } from "../../../../types/dictionary/bankType";
import { Table, Tag, Avatar, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { IncomingTransactionsAnalytics } from "./IncomingTransactionsAnalytics";

export default function AnalyticsPageReportsTransactions() {
    const { data, isLoading, error } = useGetAgentList();
    const navigate = useNavigate();

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
            <IncomingTransactionsAnalytics />
            <Card title="Агенты" style={{ margin: 20 }}>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table<BankType>
                    rowKey={(row) => row.id}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => navigate(`./${record.code}`),
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>
        </>
    )
}