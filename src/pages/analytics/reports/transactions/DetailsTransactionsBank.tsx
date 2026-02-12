import { useNavigate, useParams } from "react-router-dom"
import { useTxBanksHistory } from "../../../../hooks/useTxBanksHistory";
import type { TransactionBankReportType } from "../../../../types/transactionBankReportType";
import type { ColumnsType } from "antd/es/table";
import { Button, Card, Table, Tabs, Tag, type TabsProps } from "antd";
import { ButtonReportIncomingTransactions } from "./ButtonReportIncomingTransactions";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetTransactionsByAgent } from "../../../../hooks/banking-gateway/useGetAllTransactionsByAgent";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";
import { ButtonReportOutgoingTransactions } from "./ButtonReportOutgoingTransactions";
import { RollbackOutlined } from "@ant-design/icons";

export default function DetailsTransactionsBank() {
    const navigate = useNavigate();
    const { code } = useParams();
    const bankCode = code ?? "null";
    const { data: OutgoingTransactions, isLoading: isLoadingOutgoingTransactions, error: errorOutgoingTransactions } = useTxBanksHistory(bankCode);
    const { data: IncomingTransactions, isLoading: isLoadingIncomingTransactions, error: errorIncomingTransactions } = useGetTransactionsByAgent(bankCode, 0, 20, "creationDate", "DESC");
    const [activeTab, setActiveTab] = useState<string>("1");


    const columns: ColumnsType<TransactionBankReportType> = [

        {
            title: "ID",
            dataIndex: "paymentId",
            width: 300,
            render: (paymentID: string, row) => <div>{paymentID}</div>
        },
        {
            title: "Type",
            dataIndex: "transactionType",
            width: 80,
            render: (txType: string) => <div>{txType}</div>
        },
        {
            title: "Amount",
            dataIndex: "amount",
            width: 50,
            render: (text: string) => <div>{text}</div>
        },
        {
            title: "Currency",
            dataIndex: "currency",
            width: 30,
            render: (text: string) => <div>{text}</div>
        },
        {
            title: "Date",
            dataIndex: "date",
            width: 150,
            render: (date: string, row) => dayjs(date).format("DD.MM.YYYY HH:mm")
        },
        {
            title: "Receiver",
            dataIndex: "receiverAccount",
            width: 60,
            render: (text: string) => <div>{text}</div>
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 80,
            render: (status: boolean) => status ? (<Tag color="green">SUCCESS</Tag>) : (<Tag color="red">FAILED</Tag>)
        },
    ]

    const columnsIncoming: ColumnsType<IncomingTransactionType> = [

        {
            title: "ID",
            dataIndex: "id",
            width: 50,
            render: (id: string, row) => <div>{id}</div>
        },
        {
            title: "Type",
            dataIndex: "transactionType",
            width: 80,
            render: (txType: string) => <div>{txType}</div>
        },
        {
            title: "Amount",
            dataIndex: "amount",
            width: 50,
            render: (amount: number, row) => <div>{amount} {row.currency}</div>
        },
        {
            title: "Receiver",
            dataIndex: "receiver",
            width: 60,
            render: (receiver: string) => <div>{receiver}</div>
        },
        {
            title: "Agent",
            dataIndex: "agent",
            width: 60,
            render: (agent: string) => <div>{agent}</div>
        },
        {
            title: "Date Created",
            dataIndex: "creationDate",
            width: 150,
            render: (creationDate: string, row) => dayjs(creationDate).format("DD.MM.YYYY HH:mm")
        },
        {
            title: "Date Updated",
            dataIndex: "updateDate",
            width: 150,
            render: (updateDate: string, row) => dayjs(updateDate).format("DD.MM.YYYY HH:mm")
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 80,
            render: (status: string) => status === "SUCCESS" ? (<Tag color="green">SUCCESS</Tag>) : (<Tag color="red">FAILED</Tag>)
        },
        {
            title: "External ID",
            dataIndex: "externalId",
            width: 80,
            render: (externalId: string) => <div>{externalId}</div>
        },
        {
            title: "Bill",
            dataIndex: "bill",
            width: 80,
            render: (bill: string) => <div>{bill}</div>
        },
        {
            title: "Error Message",
            dataIndex: "error",
            width: 80,
            render: (error: any) => <div>{error}</div>
        },
    ]

    const items: TabsProps["items"] = [
        {
            label: "Исходящие транзакции",
            key: "1",
            children: <>
                <ButtonReportOutgoingTransactions transactions={OutgoingTransactions ?? []} bankCode={code ?? ""} />
                <Card title={`Исходящие транзакции агента ${code?.toUpperCase()}`} style={{ margin: 20 }}>
                    {errorOutgoingTransactions && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                    <Table<TransactionBankReportType>
                        rowKey={(row) => row.paymentId}
                        columns={columns}
                        loading={isLoadingOutgoingTransactions}
                        dataSource={OutgoingTransactions ?? []}
                        pagination={{ pageSize: 10 }}
                        // onRow={(record) => ({
                        //     onClick: () => navigate(`./${record.code}`),
                        // })}
                        style={{ cursor: "pointer" }}
                        scroll={{ x: 'max-content' }}
                    />
                </Card>
            </>

        },
        {
            label: "Входящие транзакции",
            key: "2",
            children: <>
                <ButtonReportIncomingTransactions transactions={IncomingTransactions?.content ?? []} bankCode={code ?? ""} />
                <Card title={`Входящие транзакции агента ${code?.toUpperCase()}`} style={{ margin: 20 }}>
                    {errorIncomingTransactions && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                    <Table<IncomingTransactionType>
                        rowKey={(row) => row.id}
                        columns={columnsIncoming}
                        loading={isLoadingIncomingTransactions}
                        dataSource={IncomingTransactions?.content ?? []}
                        pagination={{ pageSize: 10 }}
                        // onRow={(record) => ({
                        //     onClick: () => navigate(`./${record.code}`),
                        // })}
                        style={{ cursor: "pointer" }}
                        scroll={{ x: 'max-content' }}
                    />
                </Card>
            </>
        },
    ]

    return (
        <>
            <Button style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
                Назад <RollbackOutlined />
            </Button>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                // type="card"
                size="large"
                items={items}
                className="activeTab"
            />
        </>
    )
}