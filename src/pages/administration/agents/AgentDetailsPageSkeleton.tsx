import { Card, Skeleton } from "antd";
import ButtonBack from "../../../components/dataEntry/ButtonBack";

export function AgentDetailsPageSkeleton() {
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <ButtonBack />
                <Skeleton.Input active size="small" style={{ width: 240, height: 32 }} />
            </div>
            <Card style={{ marginTop: 16 }}>
                <Skeleton active title={false} paragraph={{ rows: 10 }} />
            </Card>
        </>
    );
}
