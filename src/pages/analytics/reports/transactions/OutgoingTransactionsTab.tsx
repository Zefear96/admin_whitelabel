import { Button, Card, DatePicker, Empty, Menu, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { registryAgentServiceApi } from "../../../../api/clients/registryAgentServiceApi";
import type { Content } from "../../../../types/registry/registryTransactionsDataType";
import { useCreateOutgoingRegistryTask } from "../../../../hooks/registry/useCreateOutgoingRegistryTask";
import { isTerminalStatus, useGetRegistryStatus } from "../../../../hooks/registry/useGetRegistryStatus";
import { useGetRegistryDataById } from "../../../../hooks/registry/useGetRegistryDataById";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

interface OutgoingTransactionsTabProps {
  bankCode: string;
  agentName: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: Dispatch<SetStateAction<[Dayjs | null, Dayjs | null] | null>>;
}

export default function OutgoingTransactionsTab({
  bankCode,
  agentName,
  dateRange,
  setDateRange,
}: OutgoingTransactionsTabProps) {
  const { notify } = useNotificationMessage();
  const [submittedTask, setSubmittedTask] = useState<{
    taskId: string;
    dateFrom: string;
    dateTo: string;
    initialStatus?: string;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "FAILED">("ALL");
  const [registryPage, setRegistryPage] = useState(0);
  const [registryPageSize, setRegistryPageSize] = useState(20);

  const apiFromDate = useMemo(() => {
    const fallback = dayjs().subtract(1, "day");
    return (dateRange?.[0] ?? fallback).format("YYYY-MM-DD");
  }, [dateRange]);

  const apiToDate = useMemo(() => {
    const fallback = dayjs().subtract(1, "day");
    return (dateRange?.[1] ?? fallback).format("YYYY-MM-DD");
  }, [dateRange]);

  const {
    mutateAsync: createRegistryTask,
    isPending: isCreatingRegistryTask,
    error: errorRegistryTask,
  } = useCreateOutgoingRegistryTask();

  const taskId = submittedTask?.taskId;
  const initialStatus = submittedTask?.initialStatus;

  const { data: registryStatus } = useGetRegistryStatus(taskId, initialStatus);
  const currentStatus = registryStatus?.status ?? initialStatus ?? "";
  const normalizedStatus = currentStatus.toUpperCase();
  const isDoneStatus = normalizedStatus === "DONE";
  const isPendingStatus = normalizedStatus === "PENDING";
  const isActualDateRangeTask =
    submittedTask?.dateFrom === apiFromDate &&
    submittedTask?.dateTo === apiToDate;
  const canLoadRegistryData = isTerminalStatus(currentStatus);
  const isSuccessFilterParam =
    statusFilter === "SUCCESS" ? true : statusFilter === "FAILED" ? false : undefined;

  const {
    data: registryData,
    isLoading: isLoadingRegistryData,
    error: errorRegistryData,
  } = useGetRegistryDataById(
    taskId,
    registryPage,
    registryPageSize,
    isSuccessFilterParam,
    canLoadRegistryData && isActualDateRangeTask,
  );

  const rows: Content[] = registryData?.items?.content ?? [];
  const itemsMeta = registryData?.items;
  const statusTagColor =
    normalizedStatus === "DONE"
      ? "green"
      : ["FAILED", "ERROR"].includes(normalizedStatus)
        ? "red"
        : normalizedStatus
          ? "blue"
          : "default";

  const columns: ColumnsType<Content> = [
    {
      title: "ID платежа",
      dataIndex: "transactionId",
      width: 220,
      render: (transactionId: string) => <div>{transactionId}</div>,
    },
    {
      title: "Дата",
      dataIndex: "transactionDate",
      width: 160,
      render: (transactionDate: string) => dayjs(transactionDate).format("DD.MM.YYYY HH:mm:ss"),
    },
    {
      title: "Получатель",
      dataIndex: "recipientName",
      width: 180,
      render: (recipientName: string) => <div>{recipientName}</div>,
    },
    {
      title: "Реквизит получателя",
      dataIndex: "recipientRequisite",
      width: 220,
      render: (recipientRequisite: string) => <div>{recipientRequisite}</div>,
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      width: 120,
      render: (amount: number, row) => (
        <div>
          {amount} {row.operationCurrency}
        </div>
      ),
    },
    {
      title: "Комиссия",
      dataIndex: "fee",
      width: 120,
      render: (fee: number, row) => (
        <div>
          {fee} {row.feeCurrency}
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      width: 120,
      filters: [
        { text: "Все", value: "ALL" },
        { text: "Успешные", value: "SUCCESS" },
        { text: "Неуспешные", value: "FAILED" }
      ],
      filteredValue: [statusFilter],
      filterMultiple: false,
      filterDropdown:({setSelectedKeys, selectedKeys, confirm}) => (
        <Menu
          selectable
          selectedKeys={(selectedKeys as string[]) ?? [statusFilter]}
          items={[
            { key: "ALL", label: "Все" },
            { key: "SUCCESS", label: "Успешные" },
            { key: "FAILED", label: "Неуспешные" },
          ]}
          onClick={({ key }) => {
            setSelectedKeys([key]);
            confirm({ closeDropdown: true });
          }}
        />
      ),
      render: (status: string) =>
        String(status).toUpperCase() === "SUCCESS" ? (
          <Tag color="green">SUCCESS</Tag>
        ) : (
          <Tag color="red">{String(status).toUpperCase()}</Tag>
        ),
    },
  ];

  return (
    <>
      <RangePicker
        value={dateRange}
        onChange={(value) => {
          setDateRange(value);
          setSubmittedTask(null);
          setRegistryPage(0);
        }}
        allowClear
        style={{ margin: "20px", color: "black", cursor: "pointer" }}
        placeholder={["Дата начала", "Дата окончания"]}
        format="DD.MM.YYYY"
        disabledDate={(current) => current && current > dayjs().endOf("day")}
      />
      <Button
        type="primary"
        style={{ marginLeft: 20, marginBottom: 12 }}
        loading={isCreatingRegistryTask}
        onClick={async () => {
          try {
            const response = await createRegistryTask({
              bankCode,
              dateFrom: apiFromDate,
              dateTo: apiToDate,
            });
            setSubmittedTask({
              taskId: response.task.id,
              dateFrom: apiFromDate,
              dateTo: apiToDate,
              initialStatus: response.task.status,
            });
            setRegistryPage(0);
          } catch (error) {
            notify({
              type: "error",
              title: "Ошибка",
              message: "Не удалось создать реестр",
            });
          }
        }}
      >
        Сформировать реестр
      </Button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 20px 8px" }}>
        <Button
          variant="outlined"
          color="cyan"
          disabled={!taskId || !isDoneStatus}
          onClick={async () => {
            if (!taskId || !isDoneStatus || !submittedTask) return;
            try {
              await registryAgentServiceApi.generateXlsxRegistry(
                taskId,
                bankCode,
                submittedTask.dateFrom,
                submittedTask.dateTo,
              );
            } catch (error: any) {
              if (error?.response?.status === 409) {
                notify({
                  type: "warning",
                  title: "Ошибка",
                  message: "Файл не может быть сформирован, так как не содержит данных",
                });
                return;
              }

              notify({
                type: "error",
                title: "Ошибка",
                message: "Не удалось скачать файл",
              });
            }
          }}
        >
          Скачать XLSX <DownloadOutlined/>
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#8c8c8c" }}>Статус:</span>
          <Tag color={statusTagColor}>{normalizedStatus || "-"}</Tag>
        </div>
      </div>

      <Card title={`Исходящие транзакции агента ${agentName}`} style={{ margin: 20 }}>
        {(errorRegistryTask || errorRegistryData) && <p style={{ color: "red" }}>Ошибка загрузки</p>}
        <Table<Content>
          locale={{ emptyText: <Empty description="Нет данных" /> }}
          rowKey={(row) => `${row.taskId}-${row.id}`}
          columns={columns}
          loading={isCreatingRegistryTask || isLoadingRegistryData || isPendingStatus}
          dataSource={isDoneStatus && isActualDateRangeTask ? rows : []}
          pagination={{
            current: (itemsMeta?.number ?? registryPage) + 1,
            pageSize: itemsMeta?.size ?? registryPageSize,
            total: itemsMeta?.totalElements ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Всего ${total}`,
            onChange: (tablePage, tablePageSize) => {
              if (tablePageSize !== registryPageSize) {
                setRegistryPageSize(tablePageSize);
                setRegistryPage(0);
                return;
              }
              setRegistryPage(tablePage - 1);
            },
          }}
          style={{ cursor: "pointer" }}
          scroll={{ x: "max-content" }}
          onChange={(_, filters) => {
            const selected = filters.status?.[0];
            const nextFilter: "ALL" | "SUCCESS" | "FAILED" =
              selected === "SUCCESS" || selected === "FAILED" || selected === "ALL"
                ? selected
                : "ALL";
            if (nextFilter !== statusFilter) {
              setRegistryPage(0);
            }
            setStatusFilter(nextFilter);
          }}
        />
      </Card>
    </>
  );
}

