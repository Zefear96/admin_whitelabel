import { Card, Skeleton } from "antd";

export function NotificationTemplateSkeleton() {
    return (
        <Card title="Список шаблонов уведомлений">
            <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
    );
}
