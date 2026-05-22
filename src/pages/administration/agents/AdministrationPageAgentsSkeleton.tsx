import { Card, Skeleton } from "antd";

export function AdministrationPageAgentsSkeleton() {
    return (
        <Card title="Агенты" style={{ margin: 20 }}>
            <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
    );
}
