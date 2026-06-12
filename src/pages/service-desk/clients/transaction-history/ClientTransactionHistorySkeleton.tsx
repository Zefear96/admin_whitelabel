import { Card, Skeleton, Typography } from "antd";

export function ClientTransactionHistorySkeleton() {
  return (
    <Card>
      <Typography.Title level={5}>История транзакций клиента</Typography.Title>
      <Skeleton active title={false} paragraph={{ rows: 8 }} />
    </Card>
  );
}
