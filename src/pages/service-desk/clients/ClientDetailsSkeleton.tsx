import { Skeleton } from "antd";

export function ClientDetailsSkeleton() {
  return (
    <div>
      <Skeleton.Button active style={{ marginBottom: 16 }} />
      <Skeleton active paragraph={{ rows: 10 }} />
    </div>
  );
}
