import { Table, Tag, Avatar, Card, Space, Modal, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import SearchInput from "../../../components/dataEntry/SearchInput";
import type { TransactionHistoryType } from "../../../types/transactionHistoryTypes";
import dayjs from "dayjs";
import { useState } from "react";
import { useHistoryTransactions } from "../../../hooks/useHistoryTransactions";
import { DatePicker } from 'antd';


export default function ServiceDeskTransactionsPage() {
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const { data, isLoading, error } = useHistoryTransactions(fromDate, toDate);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistoryType | null>(null);
    const [isModalTransactionHistoryDetails, setIsModalTransactionHistoryDetails] = useState(false);

    const columns: ColumnsType<TransactionHistoryType> = [
        {
            title: "Logo",
            dataIndex: "imageUrl",
            width: 30,
            render: (url: string, row) => <Avatar shape="square" size="large" src={url} />,
        },
        {
            title: "Описание",
            dataIndex: "description",
            render: (text: string, row) => (
                <div>
                    <b>{text}</b>
                    <div style={{ fontSize: 12, color: "#888" }}>
                        {row.senderShortName} → {row.receiverShortName}
                    </div>
                </div>
            ),
        },
        {
            title: "Тип",
            dataIndex: "paymentType",
            width: 110,
            render: (type: string, row) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: "Сумма",
            dataIndex: "amount",
            width: 120,
            render: (value: number, row) => (
                <span style={{ color: row.direction === "INCOMING" ? "green" : "red" }}>
                    {row.direction === "INCOMING" ? "+" : "-"}
                    {value} {row.operationCurrency}
                </span>
            ),
        },
        {
            title: "Кому/От кого",
            dataIndex: "receiverShortName",
            width: 180,
            render: (_, row) => (
                <span>
                    {row.direction === "INCOMING"
                        ? row.senderShortName
                        : row.receiverShortName}
                </span>
            ),
        },
        {
            title: "Дата",
            dataIndex: "createdAt",
            width: 180,
            render: (value: string, row) => dayjs(value).format("DD.MM.YYYY HH:mm"),
            sorter: (a, b) =>
                dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: "Статус",
            dataIndex: "status",
            width: 120,
            render: (status: string, row) =>
                status === "SUCCESS" ? (
                    <Tag color="green">Успешно</Tag>
                ) : (
                    <Tag color="red">Ошибка</Tag>
                ),
        },
    ];

    const handleDetailsClick = (item: TransactionHistoryType) => {
        setIsModalTransactionHistoryDetails(true);
        setSelectedTransaction(item);
    }

    return (
        <Card title="История транзакций" style={{ margin: 20 }}>
            <Space direction="vertical" style={{ width: "100%" }} size={20}>

                <Space>
                    <div>
                        <div style={{ marginBottom: 6 }}>От</div>
                        <DatePicker
                            onChange={(v) => setFromDate(v?.toISOString() ?? "")}
                            showTime
                            placeholder="Выберите дату"
                        />
                    </div>

                    <div className=" d-flex">
                        <div style={{ marginBottom: 6 }}>До</div>
                        <DatePicker
                            onChange={(v) => setToDate(v?.toISOString() ?? "")}
                            showTime
                            placeholder="Выберите дату"
                        />
                    </div>
                </Space>

                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}

                <Table<TransactionHistoryType>
                    rowKey="transactionId"
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => handleDetailsClick(record),
                    })}
                    style={{ cursor: "pointer" }}
                />
                <Modal
                    title="Детали транзакции"
                    open={isModalTransactionHistoryDetails}
                    onCancel={() => setIsModalTransactionHistoryDetails(false)}
                    style={{ minWidth: "60%" }}
                    footer={false}>
                    {/* <h1 style={{margin:"20px auto"}}>Детали транзакции</h1> */}
                    {
                        
                        selectedTransaction && (
                            <Descriptions
                                bordered
                                column={1}
                                size="small"
                                layout="horizontal"
                                labelStyle={{ width: "30%", fontWeight: 600 }}     // фиксируем ширину колонки ключей
                                contentStyle={{ wordBreak: "break-word" }}         // перенос значений
                            >
                                {Object.entries(selectedTransaction).map(([key, value]) => (
                                    <Descriptions.Item key={key} label={key}>
                                        {value != null ? String(value) : "-"}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        )
                    }
                </Modal>
            </Space>
        </Card>
    )
}