import { Skeleton } from "antd";

export function ClientListSkeleton() {
    return <Skeleton active paragraph={{ rows: 8 }} style={{ marginTop: 16 }} />;
}
