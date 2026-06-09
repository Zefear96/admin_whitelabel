import { Descriptions, Modal, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { useState } from "react";
import dayjs from "dayjs";
import { useClientDevices } from "../../../../hooks/device/useClientDevices";
import type { DeviceHistoryItem } from "../../../../types/client/deviceType";
import { DeviceHistorySkeleton } from "./DeviceHistorySkeleton";

export default function DeviceHistory({ absId }: { absId: string }) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<DeviceHistoryItem | null>(null);
  const { data, isLoading, isFetching } = useClientDevices(absId, page, size, sortDirection);

  const columns: ColumnsType<DeviceHistoryItem> = [
    {
      title: "Устройство",
      key: "deviceName",
      render: (_: any, row: DeviceHistoryItem) => row.deviceFingerprint.deviceName,
    },
    {
      title: "Модель",
      key: "model",
      render: (_: any, row: DeviceHistoryItem) => row.deviceFingerprint.model,
    },
    {
      title: "OS",
      key: "os",
      render: (_: any, row: DeviceHistoryItem) =>
        `${row.deviceFingerprint.os} ${row.deviceFingerprint.osVersion}`,
    },
    {
      title: "IP",
      key: "ipAddress",
      render: (_: any, row: DeviceHistoryItem) => row.deviceFingerprint.ipAddress,
    },
    {
      title: "Сеть",
      key: "networkType",
      render: (_: any, row: DeviceHistoryItem) => row.deviceFingerprint.networkType,
    },
    {
      title: "Последняя активность",
      dataIndex: "lastSeenAt",
      sorter: true,
      render: (val: string) => dayjs(val).format("DD.MM.YYYY HH:mm:ss"),
    },
  ];

  const handleRowClick = (item: DeviceHistoryItem) => {
    setSelectedDevice(item);
    setIsModalOpen(true);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: Record<string, unknown>,
    sorter: SorterResult<DeviceHistoryItem> | SorterResult<DeviceHistoryItem>[],
  ) => {
    const nextSize = Number(pagination.pageSize ?? size);
    setSize(nextSize);
    setPage(nextSize !== size ? 0 : Math.max((pagination.current ?? 1) - 1, 0));

    const lastSeenSorter = Array.isArray(sorter) ? sorter.find((item) => item.field === "lastSeenAt") : sorter;
    if (lastSeenSorter?.order === "ascend") {
      setSortDirection("ASC");
      setPage(0);
      return;
    }
    if (lastSeenSorter?.order === "descend") {
      setSortDirection("DESC");
      setPage(0);
    }
  };

  if (isLoading) {
    return <DeviceHistorySkeleton />;
  }

  return (
    <>
      <Table<DeviceHistoryItem>
        rowKey={(row) => `${row.deviceFingerprint.deviceId}-${row.lastSeenAt}`}
        columns={columns}
        dataSource={data?.content || []}
        loading={isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          total: data?.totalElements ?? data?.total ?? 0,
          current: page + 1,
          pageSize: size,
          showSizeChanger: true,
          pageSizeOptions: [20, 30, 50],
          showTotal: (total) => `Всего ${total}`,
        }}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        style={{ cursor: "pointer" }}
      />
      <Modal
        title="Детали устройства"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        style={{ minWidth: "60%" }}
        footer={false}
      >
        {selectedDevice && (
          <Descriptions
            bordered
            column={1}
            size="small"
            layout="horizontal"
          // style={{ wordBreak: "break-word" }}
          >
            {Object.entries(selectedDevice.deviceFingerprint).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {value !== null ? String(value) : "-"}
              </Descriptions.Item>
            ))}
            <Descriptions.Item label="lastSeenAt">
              {dayjs(selectedDevice.lastSeenAt).format("DD.MM.YYYY HH:mm:ss")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
}
