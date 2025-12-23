import { Table, Card, Modal, Button, Descriptions, Skeleton } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useClientDevices } from "../../../hooks/client/useClientDevices";
import type { DeviceHistoryItem } from "../../../types/client/deviceType";
import type { DeviceHistoryType } from "../../../types/client/deviceType";
import DescriptionsItem from "antd/es/descriptions/Item";

export default function DeviceHistory({ absId }: { absId: string }) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<DeviceHistoryItem | null>(null);
  const { data, isLoading } = useClientDevices(absId, page, size, sortDirection);

  const columns = [
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

  return (
    <>
      <Table<DeviceHistoryItem>
        rowKey={(row) => row.lastSeenAt} // используем lastSeenAt как уникальный ключ
        columns={columns}
        dataSource={data?.content || []}
        loading={isLoading}
        pagination={{
          total: data?.total || 0,
          current: page + 1,
          pageSize: size,
          showSizeChanger: true,
          onChange: (p, s) => {
            setPage(p - 1);
            setSize(s);
          },
        }}
        onChange={(pagination, filters, sorter: any) => {
          if (sorter.order === "ascend") setSortDirection("ASC");
          else if (sorter.order === "descend") setSortDirection("DESC");
        }}
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
