import type { ReactNode } from "react";
import { useState } from "react";
import { BankOutlined } from "@ant-design/icons";
import { Card, Empty, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ResponseAccountBalanceType, ResponseAccountType } from "../../../../types/product/responseAccountType";
import { useGetAccounts } from "../../../../hooks/product/useGetAccounts";
import { useGetAccountBalance } from "../../../../hooks/product/useGetAccountBalance";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { formatAmount } from "../../../../utils/amountFormatter";
import { ClientProductSectionSkeleton } from "./ClientProductSectionSkeleton";

interface ClientAccountSectionProps {
  keycloakClientId: string;
  onRowClick?: (record: ResponseAccountType) => void;
  icon?: ReactNode;
}

export function ClientAccountSection({
  keycloakClientId,
  onRowClick,
  icon,
}: ClientAccountSectionProps) {
  const { data, isLoading, error } = useGetAccounts(keycloakClientId);
  const [selectedAccount, setSelectedAccount] = useState<ResponseAccountType | null>(null);
  const { data: balanceAccount } = useGetAccountBalance(selectedAccount?.accountNumber);

  const columns: ColumnsType<ResponseAccountType> = [
    {
      title: "Наименование продукта",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "IBAN",
      dataIndex: "iban",
      key: "iban",
    },
    {
      title: "Номер счёта",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Статус",
      key: "active",
      width: 90,
      render: (_, record) => <AccountStatusCell accountNumber={record.accountNumber} />,
    },
    {
      title: "Блокировка",
      key: "isAmountBlocked",
      width: 90,
      render: (_, record) => <AccountBlockedStatusCell accountNumber={record.accountNumber} />,
    },
    {
      title: "Баланс",
      key: "balance",
      width: 160,
      render: (_, record) => <AccountBalanceCell accountNumber={record.accountNumber} currency={record.currency} />,
    },
  ];

  const list = (data as ResponseAccountType[] | undefined) ?? [];
  const balanceExtraData = balanceAccount
    ? (Object.fromEntries(
        Object.entries(balanceAccount as unknown as Record<string, unknown>).filter(([key]) => key !== "accountId"),
      ) as Record<string, unknown>)
    : null;

  if (isLoading) {
    return <ClientProductSectionSkeleton header={<SectionHeader title="Банковские счета" icon={icon} />} />;
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Ошибка загрузки";
    return (
      <Card>
        <SectionHeader title="Банковские счета" icon={icon} />
        <Typography.Text type="danger">{message}</Typography.Text>
      </Card>
    );
  }

  if (!list.length) {
    return (
      <Card>
        <SectionHeader title="Банковские счета" icon={icon} />
        <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Счета до востребования" icon={icon} />
      <Table<ResponseAccountType>
        size="small"
        rowKey={(row) => row.id}
        dataSource={list}
        columns={columns}
        pagination={list.length > 10 ? { pageSize: 10 } : false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedAccount(record);
            onRowClick?.(record);
          },
        })}
        style={{ cursor: "pointer" }}
      />

      <ProductDetailsModal
        title="Информация о счете"
        open={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        data={selectedAccount as unknown as Record<string, unknown>}
        extraData={balanceExtraData}
      />
    </Card>
  );
}

function AccountBalanceCell({ accountNumber, currency }: { accountNumber: string; currency: string }) {
  const { data, isLoading, error } = useGetAccountBalance(accountNumber);

  if (isLoading) {
    return <span>...</span>;
  }

  if (error || !data) {
    return <span>-</span>;
  }

  const balance = (data as ResponseAccountBalanceType).availableAmount;

  return (
    <span>
      {formatAmount(balance)} {currency}
    </span>
  );
}

function AccountStatusCell({ accountNumber }: { accountNumber: string }) {
  const { data, isLoading, error } = useGetAccountBalance(accountNumber);

  if (isLoading) {
    return <span>...</span>;
  }

  if (error || !data) {
    return <Tag>Нет данных</Tag>;
  }

  const isActive = (data as ResponseAccountBalanceType).active;
  return isActive ? <Tag color="green">Активен</Tag> : <Tag color="red">Неактивен</Tag>;
}

function AccountBlockedStatusCell({ accountNumber }: { accountNumber: string }) {
  const { data, isLoading, error } = useGetAccountBalance(accountNumber);

  if (isLoading) {
    return <span>...</span>;
  }

  if (error || !data) {
    return <Tag>Нет данных</Tag>;
  }

  const isAmountBlocked = (data as ResponseAccountBalanceType).isAmountBlocked;
  return isAmountBlocked ? <Tag color="yellow">Блокирован</Tag> : <Tag color="green">Не блокирован</Tag>;
}

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      {icon ?? <BankOutlined style={{ fontSize: 20, color: "#1890ff" }} />}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </div>
  );
}

