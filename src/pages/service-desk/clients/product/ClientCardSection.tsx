import type { ReactNode } from "react";
import { useState } from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import { Card, Empty, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CardDataType, CardBalanceDataType } from "../../../../types/product/CardDataType";
import { useGetCards } from "../../../../hooks/product/useGetCards";
import { useGetCardBalance } from "../../../../hooks/product/useGetCardBalance";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { formatAmount } from "../../../../utils/amountFormatter";
import { ClientProductSectionSkeleton } from "./ClientProductSectionSkeleton";

interface ClientCardSectionProps {
  keycloakClientId: string;
  onRowClick?: (record: CardDataType) => void;
  icon?: ReactNode;
}

export function ClientCardSection({
  keycloakClientId,
  onRowClick,
  icon,
}: ClientCardSectionProps) {
  const { data, isLoading, error } = useGetCards(keycloakClientId);
  const [selectedCard, setSelectedCard] = useState<CardDataType | null>(null);
  const { data: balanceCard } = useGetCardBalance(selectedCard?.id);

  const columns: ColumnsType<CardDataType> = [
    {
      title: "Номер карты",
      dataIndex: "cardNumber",
      key: "cardNumber",
      width:70
    },
    {
      title: "Срок действия",
      dataIndex: "expiry",
      key: "expiry",
      width: 120,
    },
    {
      title: "Статус",
      dataIndex: "active",
      key: "active",
      width: 90,
      render: (val: boolean) => (val ? <Tag color="green">Активен</Tag> : <Tag color="red">Неактивен</Tag>),
    },
    {
        title: "Баланс",
        key: "balance",
        width: 160,
        render: (_, record) => <CardBalanceCell cardId={record.id} currency={record.currency} />,
      },
  ];

  const list = (data as CardDataType[] | undefined) ?? [];

  if (isLoading) {
    return <ClientProductSectionSkeleton header={<SectionHeader title="Карты" icon={icon} />} />;
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Ошибка загрузки";
    return (
      <Card>
        <SectionHeader title="Карты" icon={icon} />
        <Typography.Text type="danger">{message}</Typography.Text>
      </Card>
    );
  }

  if (!list.length) {
    return (
      <Card>
        <SectionHeader title="Карты" icon={icon} />
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Карты" icon={icon} />
      <Table<CardDataType>
        size="small"
        rowKey={(row) => row.id}
        dataSource={list}
        columns={columns}
        pagination={list.length > 5 ? { pageSize: 5 } : false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedCard(record);
            onRowClick?.(record);
          },
        })}
        style={{ cursor: "pointer" }}
      />

      <ProductDetailsModal
        title="Информация о карте"
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        data={selectedCard as unknown as Record<string, unknown>}
        extraData={balanceCard as unknown as Record<string, unknown>}
        statementType="card"
        productId={selectedCard?.id}
        userId={keycloakClientId}
      />
    </Card>
  );
}

function CardBalanceCell({ cardId, currency }: { cardId: string; currency: string }) {
  const { data, isLoading, error } = useGetCardBalance(cardId);

  if (isLoading) {
    return <span>...</span>;
  }

  if (error || !data) {
    return <span>-</span>;
  }

  const balance = (data as CardBalanceDataType).availableAmount;

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
      {icon ?? <CreditCardOutlined style={{ fontSize: 20, color: "#52c41a" }} />}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </div>
  );
}

