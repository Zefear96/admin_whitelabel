import { Card, Skeleton } from "antd";

export default function TableSkeleton() {
    return (
        <Card>
            <Skeleton
                active
                title={{ width: "30%" }}
                paragraph={{ rows: 6 }}
            />
        </Card>
    )
}
