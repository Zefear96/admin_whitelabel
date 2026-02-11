import { Card, Row, Col, Statistic, Progress, Table, Empty, Skeleton, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetAllTransactions } from "../../../../hooks/banking-gateway/useGetAllTransactions";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";

interface AgentAnalyticsRow {
    agent: string;
    transactionsCount: number;
    totalAmount: number;
    averageAmount: number;
    sharePercent: number;
}

interface PieSlice {
    label: string;
    value: number;
}

const PIE_COLORS = [
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#f5222d",
    "#13c2c2",
    "#722ed1",
    "#eb2f96",
    "#a0d911",
];

const PieChart = ({ data, title }: { data: PieSlice[]; title: string }) => {
    if (!data.length) {
        return (
            <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>{title}</div>
                <Empty description="Нет данных для диаграммы" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const size = 200;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const slices: { slice: PieSlice; dash: number; offset: number; color: string }[] = [];
    let cumulative = 0;

    data.forEach((slice, index) => {
        const fraction = slice.value / total;
        const dash = fraction * circumference;
        slices.push({
            slice,
            dash,
            offset: cumulative,
            color: PIE_COLORS[index % PIE_COLORS.length],
        });
        cumulative += dash;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{title}</div>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
                    <circle
                        r={radius}
                        fill="transparent"
                        stroke="#f0f0f0"
                        strokeWidth={24}
                    />
                    {slices.map(({ slice, dash, offset, color }) => (
                        <circle
                            key={slice.label}
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth={24}
                            strokeDasharray={`${dash} ${circumference}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                        />
                    ))}
                </g>
            </svg>
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", width: "100%", maxWidth: 260 }}>
                {slices.map(({ slice, color }) => {
                    const percent = (slice.value / total) * 100;
                    return (
                        <li
                            key={slice.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 12,
                                marginBottom: 4,
                            }}
                        >
                            <span
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 2,
                                    backgroundColor: color,
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {slice.label}
                            </span>
                            <span style={{ whiteSpace: "nowrap" }}>
                                {percent.toFixed(1)}% /{" "}
                                {slice.value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export const IncomingTransactionsAnalytics = () => {
    const { data, isLoading, error } = useGetAllTransactions(0, 200, "creationDate", "DESC");

    const transactions: IncomingTransactionType[] = data?.content ?? [];

    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount ?? 0), 0);
    const totalCount = transactions.length;

    const byAgentMap = transactions.reduce<
        Record<string, { count: number; totalAmount: number; successAmount: number; failedAmount: number }>
    >(
        (acc, tx) => {
            const key = tx.agent || "UNKNOWN";
            if (!acc[key]) {
                acc[key] = { count: 0, totalAmount: 0, successAmount: 0, failedAmount: 0 };
            }
            acc[key].count += 1;
            acc[key].totalAmount += tx.amount ?? 0;
            if (tx.status === "SUCCESS") {
                acc[key].successAmount += tx.amount ?? 0;
            } else {
                acc[key].failedAmount += tx.amount ?? 0;
            }
            return acc;
        },
        {}
    );

    const agentRows: AgentAnalyticsRow[] = Object.entries(byAgentMap)
        .map(([agent, value]) => ({
            agent,
            transactionsCount: value.count,
            totalAmount: value.totalAmount,
            averageAmount: value.count ? value.totalAmount / value.count : 0,
            sharePercent: totalAmount ? (value.totalAmount / totalAmount) * 100 : 0,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount);

    const successPieData: PieSlice[] = Object.entries(byAgentMap)
        .filter(([, value]) => value.successAmount > 0)
        .map(([agent, value]) => ({
            label: agent,
            value: value.successAmount,
        }));

    const failedPieData: PieSlice[] = Object.entries(byAgentMap)
        .filter(([, value]) => value.failedAmount > 0)
        .map(([agent, value]) => ({
            label: agent,
            value: value.failedAmount,
        }));

    const columns: ColumnsType<AgentAnalyticsRow> = [
        {
            title: "Агент",
            dataIndex: "agent",
            width: 200,
            render: (agent: string) => <Tag color="blue">{agent}</Tag>,
        },
        {
            title: "Количество транзакций",
            dataIndex: "transactionsCount",
            width: 180,
        },
        {
            title: "Сумма, KGS",
            dataIndex: "totalAmount",
            width: 160,
            render: (value: number) => value.toLocaleString("ru-RU", { maximumFractionDigits: 2 }),
        },
        {
            title: "Средний чек, KGS",
            dataIndex: "averageAmount",
            width: 180,
            render: (value: number) => value.toLocaleString("ru-RU", { maximumFractionDigits: 2 }),
        },
        {
            title: "Доля в общей сумме",
            dataIndex: "sharePercent",
            width: 260,
            render: (value: number) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Progress
                        percent={Number(value.toFixed(1))}
                        size="small"
                        showInfo={false}
                        strokeColor="#52c41a"
                        style={{ flex: 1 }}
                    />
                    <span style={{ minWidth: 60, textAlign: "right" }}>{value.toFixed(1)}%</span>
                </div>
            ),
        },
    ];

    return (
        <Card title="Аналитика входящих транзакций" style={{ margin: 20 }}>
            {error && <p style={{ color: "red" }}>Ошибка загрузки аналитики по транзакциям</p>}
            {isLoading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : !transactions.length ? (
                <Empty description="Нет данных по входящим транзакциям" />
            ) : (
                <>
                    <Row gutter={24} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} md={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Общее количество входящих транзакций"
                                    value={totalCount}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Общий объем входящих транзакций, KGS"
                                    value={totalAmount}
                                    precision={2}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Количество агентов с активными транзакциями"
                                    value={agentRows.length}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{ marginBottom: 24 }}>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ height: "100%" }}>
                                <PieChart
                                    data={successPieData}
                                    title="Распределение по агентам (успешные транзакции)"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ height: "100%" }}>
                                <PieChart
                                    data={failedPieData}
                                    title="Распределение по агентам (неуспешные транзакции)"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card
                        type="inner"
                        title="Топ агентов по объему входящих транзакций"
                        bodyStyle={{ paddingTop: 0 }}
                    >
                        <Table<AgentAnalyticsRow>
                            rowKey={(row) => row.agent}
                            columns={columns}
                            dataSource={agentRows}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </>
            )}
        </Card>
    );
};

