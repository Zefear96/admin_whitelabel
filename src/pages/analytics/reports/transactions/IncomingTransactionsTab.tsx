import { Alert, Card, DatePicker, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";
import { ButtonReportIncomingTransactions } from "./ButtonReportIncomingTransactions";

const { RangePicker } = DatePicker;

interface IncomingTransactionsTabProps {
  bankCode: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: Dispatch<SetStateAction<[Dayjs | null, Dayjs | null] | null>>;
  incomingTransactions: IncomingTransactionType[];
  isLoadingIncomingTransactions: boolean;
  errorIncomingTransactions: unknown;
  fromDate: string;
  toDate: string;
}

export default function IncomingTransactionsTab({
  bankCode,
  dateRange,
  setDateRange,
  incomingTransactions,
  isLoadingIncomingTransactions,
  errorIncomingTransactions,
  fromDate,
  toDate,
}: IncomingTransactionsTabProps) {
  const filteredIncomingTransactions = (incomingTransactions ?? []).filter((tx) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
    const [start, end] = dateRange;
    if (!start || !end) return true;
    const txDate = dayjs(tx.creationDate);
    if (!txDate.isValid()) return false;
    return (
      (txDate.isAfter(start, "day") || txDate.isSame(start, "day")) &&
      (txDate.isBefore(end, "day") || txDate.isSame(end, "day"))
    );
  });

  const columns: ColumnsType<IncomingTransactionType> = [
    {
      title: "ID",
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
        status === "SUCCESS" ? (
          <Tag color="green">SUCCESS</Tag>
        ) : (
          <Tag color="red">FAILED</Tag>
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
      />

      <ButtonReportIncomingTransactions
        transactions={filteredIncomingTransactions}
        bankCode={bankCode}
        fromDate={fromDate}
        toDate={toDate}
      />

      <Card title={`Входящие транзакции агента ${bankCode.toUpperCase()}`} style={{ margin: 20 }}>
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
          rowKey={(row) => row.id}
          columns={columns}
          loading={isLoadingIncomingTransactions}
          dataSource={filteredIncomingTransactions}
          pagination={{ pageSize: 10 }}
          style={{ cursor: "pointer" }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </>
  );
}

