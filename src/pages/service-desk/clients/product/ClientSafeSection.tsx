import type { ReactNode } from "react";
import { useState } from "react";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { Card, Empty, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ResponseSafeType } from "../../../../types/product/responseSafeType";
import { useGetSafe } from "../../../../hooks/product/useGetSafe";
import { ProductDetailsModal } from "./ProductDetailsModal";

interface ClientSafeSectionProps {
  keycloakClientId: string;
  onRowClick?: (record: ResponseSafeType) => void;
  icon?: ReactNode;
}

export function ClientSafeSection({
  keycloakClientId,
  onRowClick,
  icon,
}: ClientSafeSectionProps) {
  const { data, isLoading, error } = useGetSafe(keycloakClientId);
  const [selectedSafe, setSelectedSafe] = useState<ResponseSafeType | null>(null);

  const columns: ColumnsType<ResponseSafeType> = [
    {
      title: "Номер ячейки",
      dataIndex: "cellNumber",
      key: "cellNumber",
    },
    {
      title: "Валюта аренды",
      dataIndex: "rentalCurrency",
      key: "rentalCurrency",
      width: 120,
    },
    {
      title: "Доступная сумма аренды",
      dataIndex: "availableRentAmount",
      key: "availableRentAmount",
    },
    {
      title: "Страховой резерв",
      dataIndex: "insuranceReserveAmount",
      key: "insuranceReserveAmount",
    },
    {
      title: "Последний визит",
      dataIndex: "lastVisitDate",
      key: "lastVisitDate",
    },
    {
      title: "Дата окончания аренды",
      dataIndex: "expireDate",
      key: "expireDate",
    },
  ];

  const list = (data as ResponseSafeType[] | undefined) ?? [];

  if (isLoading) {
    return (
      <Card>
        <SectionHeader title="Сейфовые ячейки" icon={icon} />
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Ошибка загрузки";
    return (
      <Card>
        <SectionHeader title="Сейфовые ячейки" icon={icon} />
        <Typography.Text type="danger">{message}</Typography.Text>
      </Card>
    );
  }

  if (!list.length) {
    return (
      <Card>
        <SectionHeader title="Сейфовые ячейки" icon={icon} />
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Сейфовые ячейки" icon={icon} />
      <Table<ResponseSafeType>
        size="small"
        rowKey={(row) => row.id}
        dataSource={list}
        columns={columns}
        pagination={list.length > 5 ? { pageSize: 5 } : false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedSafe(record);
            onRowClick?.(record);
          },
          style: onRowClick ? { cursor: "pointer" } : undefined,
        })}
      />

      <ProductDetailsModal
        title="Информация о сейфовой ячейке"
        open={!!selectedSafe}
        onClose={() => setSelectedSafe(null)}
        data={selectedSafe as unknown as Record<string, unknown>}
      />
    </Card>
  );
}

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      {icon ?? <SafetyCertificateOutlined style={{ fontSize: 20, color: "#13c2c2" }} />}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </div>
  );
}

