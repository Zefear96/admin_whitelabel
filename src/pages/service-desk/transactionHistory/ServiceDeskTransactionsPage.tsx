import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Table, Tag, Card, DatePicker, Typography, Empty, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useHistoryTransactions } from "../../../hooks/transaction-history/useHistoryTransactions";
import type { TransactionHistoryItemType } from "../../../types/history/responseTransactionType";
import { formatAmount } from "../../../utils/amountFormatter";
import { ProductDetailsModal } from "../clients/product/ProductDetailsModal";

const { RangePicker } = DatePicker;

const formatDate = (date: Dayjs) => date.format("YYYY-MM-DD");

export default function ServiceDeskTransactionsPage() {
    const today = dayjs();
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([today, today]);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistoryItemType | null>(null);

    const fromDate = formatDate(dates[0]);
    const toDate = formatDate(dates[1]);

    const { data, isLoading, error } = useHistoryTransactions(fromDate, toDate);
    const list = data?.content ?? [];

    const columns: ColumnsType<TransactionHistoryItemType> = [
        {
            title: "Дата операции",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            render: (value: string) => dayjs(value).format("DD.MM.YYYY HH:mm"),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: "Тип операции",
            dataIndex: "paymentType",
            key: "paymentType",
            width: 120,
        },
        {
            title: "Подтип",
            dataIndex: "paymentSubType",
            key: "paymentSubType",
            width: 120,
        },
        {
            title: "Отправитель",
            dataIndex: "senderRequisite",
            key: "senderRequisite",
        },
        {
            title: "Получатель",
            dataIndex: "recipientRequisite",
            key: "recipientRequisite",
        },
        {
            title: "Сумма",
            dataIndex: "amount",
            key: "amount",
            width: 140,
            render: (value: number, record) => (
                <span style={{ color: record.direction === "INCOMING" ? "green" : "red" }}>
                    {record.direction === "INCOMING" ? "+" : "-"}
                    {formatAmount(value)} {record.operationCurrency}
                </span>
            ),
        },
        {
            title: "Комиссия",
            dataIndex: "fee",
            key: "fee",
            width: 120,
            render: (value: number, record) => (
                <span>
                    {formatAmount(value)} {record.feeCurrency || record.operationCurrency}
                </span>
            ),
        },
        {
            title: "Итого",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 120,
            render: (value: number) => <span>{formatAmount(value)}</span>,
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => (
                <Tag color={status === "SUCCESS" ? "green" : status === "PENDING" ? "gold" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Направление",
            dataIndex: "direction",
            key: "direction",
            width: 110,
        },
    ];

    const handleDateChange: Parameters<typeof RangePicker>[0]["onChange"] = (values) => {
        if (!values || !values[0] || !values[1]) {
            const now = dayjs();
            setDates([now, now]);
            return;
        }
        setDates([values[0], values[1]] as [Dayjs, Dayjs]);
    };

    if (isLoading) {
        return (
            <Card title="История транзакций" style={{ margin: 20 }}>
                <div style={{ textAlign: "center", padding: 24 }}>
                    <Spin />
                </div>
            </Card>
        );
    }

    if (error) {
        const message = error instanceof Error ? error.message : "Ошибка загрузки";
        return (
            <Card title="История транзакций" style={{ margin: 20 }}>
                <Typography.Text type="danger">{message}</Typography.Text>
            </Card>
        );
    }

    return (
        <Card title="История транзакций" style={{ margin: 20 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <RangePicker value={dates} onChange={handleDateChange} />
            </div>

            {!list.length ? (
                <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <Table<TransactionHistoryItemType>
                    rowKey="transactionId"
                    columns={columns}
                    dataSource={list}
                    scroll={{ x: "max-content" }}
                    pagination={
                        data && data.totalElements > 10
                            ? { pageSize: data.size || 10, total: data.totalElements }
                            : { pageSize: 10 }
                    }
                    onRow={(record) => ({
                        onClick: () => setSelectedTransaction(record),
                        style: { cursor: "pointer" },
                    })}
                />
            )}

            <ProductDetailsModal
                title="Детали транзакции"
                open={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                data={selectedTransaction as unknown as Record<string, unknown>}
            />
        </Card>
    );
}
