import { useParams } from "react-router-dom"
import { useTxBanksHistory } from "../../../hooks/useTxBanksHistory";
import type { TransactionBankReportType } from "../../../types/transactionBankReportType";
import type { ColumnsType } from "antd/es/table";
import { Card, Table, Tag } from "antd";
import { ButtonReportsTxBanks } from "./ButtonReportsTxBanks";
import dayjs from "dayjs";

export default function DetailsTransactionsBank() {
    const { code } = useParams();
    const bankCode = code ?? "null";
    const { data, isLoading, error } = useTxBanksHistory(bankCode);
    // const firstKey = Object.keys(data)[0];
    // const arrayData = data[firstKey] || [];

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
    return (
        <>
            <ButtonReportsTxBanks transactions={data ?? []} bankCode={code ?? ""} />
            <Card title={`Транзакции агента ${code?.toUpperCase()}`} style={{ margin: 20 }}>
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table<TransactionBankReportType>
                    rowKey={(row) => row.paymentId}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={{ pageSize: 10 }}
                    // onRow={(record) => ({
                    //     onClick: () => navigate(`./${record.code}`),
                    // })}
                    style={{ cursor: "pointer" }}
                />
            </Card>

        </>
    )
}