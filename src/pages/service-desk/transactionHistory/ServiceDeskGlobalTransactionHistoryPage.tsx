import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Table, Tag, Card, DatePicker, Typography, Empty, Spin, Input, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetClientHistory } from "../../../hooks/transaction-history/useGetClientHistory";
import type { TransactionHistoryItemType } from "../../../types/transaction-history/transactionHistoryDataType";
import { formatAmount } from "../../../utils/amountFormatter";
import { ProductDetailsModal } from "../clients/product/ProductDetailsModal";

const { RangePicker } = DatePicker;

const formatDate = (date: Dayjs) => date.format("YYYY-MM-DD");

export default function ServiceDeskGlobalTransactionHistoryPage() {
    const today = dayjs();
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([today, today]);
    const [userId, setUserId] = useState("");
    const [submittedUserId, setSubmittedUserId] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(30);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistoryItemType | null>(null);

    const fromDate = formatDate(dates[0]);
    const toDate = formatDate(dates[1]);

    const { data, isLoading, error, isFetching } = useGetClientHistory(
        submittedUserId || undefined,
        fromDate,
        toDate,
        page,
        pageSize,
    );

    const list = data?.content ?? [];
    const isInitialLoading = isLoading && !data;

    useEffect(() => {
        setPage(0);
    }, [submittedUserId, fromDate, toDate]);

    const columns: ColumnsType<TransactionHistoryItemType> = [
        {
            title: "Дата операции",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            render: (value: string) => dayjs(value).format("DD.MM.YYYY HH:mm"),
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

    const handlePaginationChange = (nextPage: number, nextPageSize?: number) => {
        const nextSize = Number(nextPageSize ?? pageSize);
        if (nextSize !== pageSize) {
            setPageSize(nextSize);
            setPage(0);
            return;
        }
        setPage(Math.max(nextPage - 1, 0));
    };

    const handleSearch = (value: string) => {
        const trimmed = value.trim();
        setUserId(trimmed);
        setSubmittedUserId(trimmed);
    };

    return (
        <Card title="История транзакций клиента" style={{ margin: 20 }}>
            <Space direction="vertical" size={16} style={{ width: "100%", marginBottom: 16 }}>
                <Input.Search
                    placeholder="Keycloak ID клиента (userId)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onSearch={handleSearch}
                    enterButton="Найти"
                    allowClear
                    onClear={() => {
                        setUserId("");
                        setSubmittedUserId("");
                    }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <RangePicker value={dates} onChange={handleDateChange} />
                </div>
            </Space>

            {!submittedUserId ? (
                <Empty description="Введите Keycloak ID клиента для поиска" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : error ? (
                <Typography.Text type="danger">
                    {error instanceof Error ? error.message : "Ошибка загрузки"}
                </Typography.Text>
            ) : isInitialLoading ? (
                <div style={{ textAlign: "center", padding: 24 }}>
                    <Spin />
                </div>
            ) : (
                <Table<TransactionHistoryItemType>
                    rowKey="transactionId"
                    columns={columns}
                    dataSource={list}
                    loading={isFetching}
                    scroll={{ x: "max-content" }}
                    locale={{ emptyText: "Нет данных" }}
                    pagination={{
                        current: page + 1,
                        pageSize,
                        total: data?.totalElements ?? 0,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 30, 50],
                        onChange: handlePaginationChange,
                    }}
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
