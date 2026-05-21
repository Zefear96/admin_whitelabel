import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Card, DatePicker, Empty, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useGetClientHistory } from "../../../../hooks/transaction-history/useGetClientHistory";
import type { TransactionHistoryItemType } from "../../../../types/transaction-history/transactionHistoryDataType";
import { formatAmount } from "../../../../utils/amountFormatter";
import { ProductDetailsModal } from "../product/ProductDetailsModal";
import { ClientTransactionHistorySkeleton } from "./ClientTransactionHistorySkeleton";

const { RangePicker } = DatePicker;

const formatDate = (date: Dayjs) => date.format("YYYY-MM-DD");

interface ClientTransactionHistoryProps {
  keycloakClientId: string;
}

export default function ClientTransactionHistory({ keycloakClientId }: ClientTransactionHistoryProps) {
  const [selectedTx, setSelectedTx] = useState<TransactionHistoryItemType | null>(null);
  const today = dayjs();
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([today, today]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const fromDate = formatDate(dates[0]);
  const toDate = formatDate(dates[1]);

  const { data, isLoading, error, isFetching } = useGetClientHistory(keycloakClientId, fromDate, toDate, page, pageSize);

  const columns: ColumnsType<TransactionHistoryItemType> = [
    {
      title: "Дата операции",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "Тип операции",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Подтип",
      dataIndex: "paymentSubType",
      key: "paymentSubType",
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
      render: (value: number, record) => (
        <span>
          {formatAmount(value)} {record.operationCurrency}
        </span>
      ),
    },
    {
      title: "Комиссия",
      dataIndex: "fee",
      key: "fee",
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
      render: (value: number, record) => (
        <span>
          {formatAmount(value)}
        </span>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "SUCCESS" ? "green" : status === "PENDING" ? "gold" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Направление",
      dataIndex: "direction",
      key: "direction",
    },
  ];

  const list = data?.content ?? [];

  const handleDateChange: Parameters<typeof RangePicker>[0]["onChange"] = (values) => {
    if (!values || !values[0] || !values[1]) {
      const now = dayjs();
      setDates([now, now]);
      setPage(0);
      return;
    }

    const nextFromDate = formatDate(values[0]);
    const nextToDate = formatDate(values[1]);
    setDates([values[0], values[1]] as [Dayjs, Dayjs]);
    if (nextFromDate !== fromDate || nextToDate !== toDate) {
      setPage(0);
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const nextPage = Math.max((pagination.current ?? 1) - 1, 0);
    const nextPageSize = Number(pagination.pageSize ?? pageSize);

    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize);
      setPage(0);
      return;
    }

    setPage(nextPage);
  };

  if (isLoading) {
    return <ClientTransactionHistorySkeleton />;
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Ошибка загрузки";
    return (
      <Card>
        <Typography.Title level={5}>История транзакций клиента</Typography.Title>
        <Typography.Text type="danger">{message}</Typography.Text>
      </Card>
    );
  }

  if (!list.length) {
    return (
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            История транзакций клиента
          </Typography.Title>
          <RangePicker value={dates} onChange={handleDateChange} />
        </div>
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        <ProductDetailsModal
          title="Детали транзакции"
          open={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          data={selectedTx as unknown as Record<string, unknown>}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          История транзакций клиента
        </Typography.Title>
        <RangePicker value={dates} onChange={handleDateChange} />
      </div>
      <Table<TransactionHistoryItemType>
        size="small"
        rowKey={(row) => row.transactionId}
        dataSource={list}
        columns={columns}
        loading={isFetching}
        scroll={{ x: "max-content" }}
        pagination={
          data && data.totalElements > 0
            ? {
                current: page + 1,
                pageSize,
                total: data.totalElements,
                showSizeChanger: true,
                pageSizeOptions: [20, 30, 50],
                showTotal: (total) => `Всего ${total}`,
              }
            : false
        }
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => setSelectedTx(record),
          style: { cursor: "pointer" },
        })}
      />
      <ProductDetailsModal
        title="Детали транзакции"
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        data={selectedTx as unknown as Record<string, unknown>}
      />
    </Card>
  );
}