import { Alert, Card, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useGetBlockedUsers } from "../../hooks/auth/useGetBlockedUsers";
import type { BlockType, ResponseBlockedUserType } from "../../types/auth/afsType";
import TableSkeleton from "../administration/dictionary/TableSkeleton";

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
    ANTIFRAUD: "Антифрод",
    STAFF: "Сотрудник",
};

function getBlockTypes(row: ResponseBlockedUserType): BlockType[] {
    const raw =
        row.blockedtype ??
        (row as ResponseBlockedUserType & { blockedType?: BlockType[] | BlockType }).blockedType;

    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") return [raw];
    return [];
}

export default function CompliancePageBlacklist() {
    const { data, isLoading, error } = useGetBlockedUsers();

    const columns: ColumnsType<ResponseBlockedUserType> = useMemo(
        () => [
            {
                title: "ID пользователя",
                dataIndex: "userId",
                width: 240,
            },
            {
                title: "Тип блокировки",
                key: "blockedtype",
                render: (_value, record) => {
                    const types = getBlockTypes(record);
                    if (types.length === 0) return "—";

                    return (
                        <Space size={4} wrap>
                            {types.map((type) => (
                                <Tag key={type} color={type === "ANTIFRAUD" ? "red" : "orange"}>
                                    {BLOCK_TYPE_LABELS[type] ?? type}
                                </Tag>
                            ))}
                        </Space>
                    );
                },
            },
        ],
        [],
    );

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <Card title="Блэклист">
            {error && (
                <Alert
                    type="error"
                    showIcon
                    message="Ошибка загрузки списка заблокированных пользователей"
                    style={{ marginBottom: 16 }}
                />
            )}
            <Table<ResponseBlockedUserType>
                rowKey={(row) => String(row.userId)}
                columns={columns}
                dataSource={Array.isArray(data) ? data : []}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showTotal: (total) => `Всего ${total}`,
                }}
                locale={{ emptyText: "Нет заблокированных пользователей" }}
            />
        </Card>
    );
}
