import { Alert, Card, DatePicker, Empty, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";
import { useGetTransactionsByAgent } from "../../../../hooks/banking-gateway/useGetAllTransactionsByAgent";
import { ButtonReportIncomingTransactions } from "./ButtonReportIncomingTransactions";

const { RangePicker } = DatePicker;

type StatusFilter = "" | "SUCCESS" | "DECLINED" | "PENDING" | "FAILED" | "FAILURE";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "Все", value: "" },
  { label: "Успешные", value: "SUCCESS" },
  { label: "Отклонённые", value: "DECLINED" },
  { label: "Ожидающие", value: "PENDING" },
  // { label: "Неуспешные", value: "FAILED" },
  { label: "Неуспешные", value: "FAILURE" },
];

const toApiDateTime = (value: Dayjs) => {
  // Как в API: creationDateMin/Max = YYYY-MM-DDT00:00:00Z
  return `${value.format("YYYY-MM-DD")}T00:00:00Z`;
};

const toApiStatus = (statusFilter: StatusFilter) => {
  // Пустой статус = все транзакции (параметр status не отправляется)
  if (!statusFilter) return "";
  return statusFilter.toUpperCase();
};

interface IncomingTransactionsTabProps {
  bankCode: string;
  agentName: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: Dispatch<SetStateAction<[Dayjs | null, Dayjs | null] | null>>;
}

export default function IncomingTransactionsTab({
  bankCode,
  agentName,
  dateRange,
  setDateRange,
}: IncomingTransactionsTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUCCESS");

  const fallbackFrom = dayjs().subtract(7, "day");
  const fallbackTo = dayjs();
  const fromDate = dateRange?.[0] ?? fallbackFrom;
  const toDate = dateRange?.[1] ?? fallbackTo;

  const creationDateMin = toApiDateTime(fromDate);
  const creationDateMax = toApiDateTime(toDate);
  const statusParam = toApiStatus(statusFilter);

  const {
    data: IncomingTransactions,
    isLoading: isLoadingIncomingTransactions,
    error: errorIncomingTransactions,
  } = useGetTransactionsByAgent(
    bankCode,
    0,
    20,
    "creationDate",
    "DESC",
    creationDateMin,
    creationDateMax,
    statusParam,
  );

  const incomingTransactions: IncomingTransactionType[] =
    (IncomingTransactions?.content ?? []) as IncomingTransactionType[];

  const columns: ColumnsType<IncomingTransactionType> = [
    {
      title: "ID платежа",
      dataIndex: "id",
      width: 50,
      render: (id: string) => <div>{id}</div>,
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      width: 80,
      render: (txType: string) => <div>{txType}</div>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 50,
      render: (amount: number, row) => <div>{amount} {row.currency}</div>,
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      width: 60,
      render: (receiver: string) => <div>{receiver}</div>,
    },
    {
      title: "Agent",
      dataIndex: "agent",
      width: 60,
      render: (agent: string) => <div>{agent}</div>,
    },
    {
      title: "Date Created",
      dataIndex: "creationDate",
      width: 150,
      render: (creationDate: string) =>
        dayjs(creationDate).format("DD.MM.YYYY HH:mm:ss"),
    },
    {
      title: "Date Updated",
      dataIndex: "updateDate",
      width: 150,
      render: (updateDate: string) =>
        dayjs(updateDate).format("DD.MM.YYYY HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 80,
      render: (status: string) =>
        String(status).toUpperCase() === "SUCCESS" ? (
          <Tag color="green">SUCCESS</Tag>
        ) : (
          <Tag color="red">{String(status).toUpperCase()}</Tag>
        ),
    },
    {
      title: "External ID",
      dataIndex: "externalId",
      width: 80,
      render: (externalId: string) => <div>{externalId}</div>,
    },
    {
      title: "Bill",
      dataIndex: "bill",
      width: 80,
      render: (bill: string) => <div>{bill}</div>,
    },
    {
      title: "Error Message",
      dataIndex: "error",
      width: 80,
      render: (error: any) => <div>{error}</div>,
    },
  ];

  return (
    <>
      <RangePicker
        value={dateRange}
        onChange={(value) => setDateRange(value)}
        allowClear
        style={{ margin: "20px", color: "black", cursor: "pointer" }}
        placeholder={["Дата начала", "Дата окончания"]}
        format="DD.MM.YYYY"
        disabledDate={(current) => current && current > dayjs().endOf("day")}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 20px 12px" }}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          style={{ width: 180 }}
          placeholder="Статус"
        />
        <ButtonReportIncomingTransactions
          transactions={incomingTransactions}
          bankCode={bankCode}
          agentName={agentName}
          fromDate={fromDate.toISOString()}
          toDate={toDate.toISOString()}
        />
      </div>

      <Card title={`Входящие транзакции агента ${agentName}`} style={{ margin: 20 }}>
        {Boolean(errorIncomingTransactions) && (
          <Alert
            type="error"
            showIcon
            message="Ошибка загрузки"
            description={String(errorIncomingTransactions)}
            style={{ marginBottom: 12 }}
          />
        )}
        <Table<IncomingTransactionType>
          locale={{ emptyText: <Empty description="Нет данных" /> }}  
          rowKey={(row) => row.id}
          columns={columns}
          loading={isLoadingIncomingTransactions}
          dataSource={incomingTransactions}
          pagination={{ pageSize: 10 }}
          style={{ cursor: "pointer" }}
          scroll={{ x: "max-content" }}

        />
      </Card>
    </>
  );
}
