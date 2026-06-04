import type { ReactNode } from "react";
import { useState } from "react";
import { WalletOutlined } from "@ant-design/icons";
import { Card, Empty, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MurabahaBalanceDataType, MurabahaDataType } from "../../../../types/product/MurabahaDataType";
import { useGetMurabaha } from "../../../../hooks/product/useGetMurabaha";
import { useGetMurabahaBalance } from "../../../../hooks/product/useGetMurabahaBalance";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { formatAmount } from "../../../../utils/amountFormatter";
import { ClientProductSectionSkeleton } from "./ClientProductSectionSkeleton";

interface ClientMurabahaSectionProps {
  keycloakClientId: string;
  onRowClick?: (record: MurabahaDataType) => void;
  icon?: ReactNode;
}

export function ClientMurabahaSection({
  keycloakClientId,
  onRowClick,
  icon,
}: ClientMurabahaSectionProps) {
  const { data, isLoading, error } = useGetMurabaha(keycloakClientId);
  const [selectedMurabaha, setSelectedMurabaha] = useState<MurabahaDataType | null>(null);
  const { data: balanceMurabaha } = useGetMurabahaBalance(selectedMurabaha?.productCode);

  const columns: ColumnsType<MurabahaDataType> = [
    {
      title: "Наименование продукта",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Код продукта",
      dataIndex: "productCode",
      key: "productCode",
    },
    {
      title: "Дата открытия",
      dataIndex: "openDate",
      key: "openDate",
    },
    {
      title: "Дата закрытия",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Баланс",
      key: "balance",
      width: 160,
      render: (_, record) => <MurabahaBalanceCell productCode={record.productCode} currency={record.currency} />,
    },
  ];

  const list = (data as MurabahaDataType[] | undefined) ?? [];
  const murabahaExtraData = balanceMurabaha
    ? (Object.fromEntries(
        Object.entries(balanceMurabaha as unknown as Record<string, unknown>).filter(([key]) => key !== "murabahaId"),
      ) as Record<string, unknown>)
    : null;

  if (isLoading) {
    return <ClientProductSectionSkeleton header={<SectionHeader title="Мурабаха" icon={icon} />} />;
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Ошибка загрузки";
    return (
      <Card>
        <SectionHeader title="Мурабаха" icon={icon} />
        <Typography.Text type="danger">{message}</Typography.Text>
      </Card>
    );
  }

  if (!list.length) {
    return (
      <Card>
        <SectionHeader title="Мурабаха" icon={icon} />
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Мурабаха" icon={icon} />
      <Table<MurabahaDataType>
        size="small"
        rowKey={(row) => row.id}
        dataSource={list}
        columns={columns}
        pagination={list.length > 5 ? { pageSize: 5 } : false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedMurabaha(record);
            onRowClick?.(record);
          },
        })}
        style={{ cursor: "pointer" }}
      />

      <ProductDetailsModal
        title="Информация о мурабахе"
        open={!!selectedMurabaha}
        onClose={() => setSelectedMurabaha(null)}
        data={selectedMurabaha as unknown as Record<string, unknown>}
        extraData={murabahaExtraData}
      />
    </Card>
  );
}

function MurabahaBalanceCell({ productCode, currency }: { productCode: string; currency: string }) {
  const { data, isLoading, error } = useGetMurabahaBalance(productCode);

  if (isLoading) {
    return <span>...</span>;
  }

  if (error || !data) {
    return <span>-</span>;
  }

  const balance = (data as MurabahaBalanceDataType).outstandingAmount;

  return (
    <span>
      {formatAmount(balance)} {currency}
    </span>
  );
}

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      {icon ?? <WalletOutlined style={{ fontSize: 20, color: "#722ed1" }} />}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </div>
  );
}

