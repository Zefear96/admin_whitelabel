import type { ReactNode } from "react";
import { useState } from "react";
import { WalletOutlined } from "@ant-design/icons";
import { Card, Empty, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ResponseMudarabaBalanceType, ResponseMudarabaType } from "../../../../types/product/responseMudarabaType";
import { useGetMudaraba } from "../../../../hooks/product/useGetMudaraba";
import { useGetMudarabaBalance } from "../../../../hooks/product/useGetMudarabaBalance";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { formatAmount } from "../../../../utils/amountFormatter";

interface ClientMudarabaSectionProps {
  keycloakClientId: string;
  onRowClick?: (record: ResponseMudarabaType) => void;
  icon?: ReactNode;
}

export function ClientMudarabaSection({
  keycloakClientId,
  onRowClick,
  icon,
}: ClientMudarabaSectionProps) {
  const { data, isLoading, error } = useGetMudaraba(keycloakClientId);
  const [selectedMudaraba, setSelectedMudaraba] = useState<ResponseMudarabaType | null>(null);
  const { data: balanceMudaraba } = useGetMudarabaBalance(selectedMudaraba?.accountNumber);

  const columns: ColumnsType<ResponseMudarabaType> = [
    {
      title: "Номер счёта",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
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
      title: "Ставка",
      dataIndex: "rate",
      key: "rate",
      width: 100,
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
        render: (_, record) => <MudarabaBalanceCell accountNumber={record.accountNumber} currency={record.currency} />,
      },
  ];

  const list = (data as ResponseMudarabaType[] | undefined) ?? [];
  const mudarabaExtraData = balanceMudaraba
    ? (Object.fromEntries(
        Object.entries(balanceMudaraba as unknown as Record<string, unknown>).filter(([key]) => key !== "mudarabahId"),
      ) as Record<string, unknown>)
    : null;

  if (isLoading) {
    return (
      <Card>
        <SectionHeader title="Мудараба" icon={icon} />
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
        <SectionHeader title="Мудараба" icon={icon} />
        <Typography.Text type="danger">{message}</Typography.Text>
      </Card>
    );
  }

  if (!list.length) {
    return (
      <Card>
        <SectionHeader title="Мудараба" icon={icon} />
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Мудараба" icon={icon} />
      <Table<ResponseMudarabaType>
        size="small"
        rowKey={(row) => row.id}
        dataSource={list}
        columns={columns}
        pagination={list.length > 5 ? { pageSize: 5 } : false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedMudaraba(record);
            onRowClick?.(record);
          },
        })}
        style={{ cursor: "pointer" }}
      />

      <ProductDetailsModal
        title="Информация о мударабе"
        open={!!selectedMudaraba}
        onClose={() => setSelectedMudaraba(null)}
        data={selectedMudaraba as unknown as Record<string, unknown>}
        extraData={mudarabaExtraData}
      />
    </Card>
  );
}

function MudarabaBalanceCell({ accountNumber, currency }: { accountNumber: string; currency: string }) {
  const { data, isLoading, error } = useGetMudarabaBalance(accountNumber);

  if (isLoading) {
    return <span>...</span>;
  }

  if (error || !data) {
    return <span>-</span>;
  }

  const balance = (data as ResponseMudarabaBalanceType).availableAmount;

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
      {icon ?? <WalletOutlined style={{ fontSize: 20, color: "#fa8c16" }} />}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </div>
  );
}

