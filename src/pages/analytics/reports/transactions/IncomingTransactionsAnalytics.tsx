import { Card, Row, Col, Statistic, Progress, Table, Empty, Skeleton, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useGetAllTransactions } from "../../../../hooks/banking-gateway/useGetAllTransactions";
import { useGetAgentList } from "../../../../hooks/dictionary/agent/useGetAgentList";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";
import type { AgentType } from "../../../../types/dictionary/agentType";

const ANALYTICS_PAGE_SIZE = 500;

const normalizeAgentKey = (value: string) => value.trim().toUpperCase();

const resolveAgentKey = (txAgent: string, agents: AgentType[]) => {
    const normalized = normalizeAgentKey(txAgent);
    const matched = agents.find(
        (a) =>
            normalizeAgentKey(a.code) === normalized ||
            normalizeAgentKey(a.agent) === normalized,
    );
    return matched ? normalizeAgentKey(matched.code) : normalized;
};

interface AgentStats {
    label: string;
    count: number;
    totalAmount: number;
    successAmount: number;
    failedAmount: number;
}

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

    const chartData = data.filter((d) => d.value > 0);
    const chartTotal = chartData.reduce((sum, d) => sum + d.value, 0);
    const size = 200;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const slices: { slice: PieSlice; dash: number; offset: number; color: string }[] = [];
    let cumulative = 0;

    const colorByLabel = new Map<string, string>();

    chartData.forEach((slice, index) => {
        const fraction = chartTotal > 0 ? slice.value / chartTotal : 0;
        const dash = fraction * circumference;
        const color = PIE_COLORS[index % PIE_COLORS.length];
        colorByLabel.set(slice.label, color);
        slices.push({
            slice,
            dash,
            offset: cumulative,
            color,
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
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", width: "100%", maxWidth: 320 }}>
                {data.map((slice) => {
                    const color = colorByLabel.get(slice.label) ?? "#d9d9d9";
                    const percent = chartTotal > 0 ? (slice.value / chartTotal) * 100 : 0;
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
                                {slice.value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} KGS
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export const IncomingTransactionsAnalytics = () => {
    const { data: agents, isLoading: isAgentsLoading } = useGetAgentList();
    const { data, isLoading: isTxLoading, error } = useGetAllTransactions(
        0,
        ANALYTICS_PAGE_SIZE,
        "creationDate",
        "DESC",
    );

    const isLoading = isAgentsLoading || isTxLoading;

    const activeAgents = useMemo(
        () => (agents ?? []).filter((agent: AgentType) => agent.isActive),
        [agents],
    );

    const transactions: IncomingTransactionType[] = data?.content ?? [];
    const totalFromApi = data?.total ?? transactions.length;

    const byAgentMap = useMemo(() => {
        const map: Record<string, AgentStats> = {};

        for (const agent of activeAgents) {
            const key = normalizeAgentKey(agent.code);
            map[key] = {
                label: agent.agent || agent.code,
                count: 0,
                totalAmount: 0,
                successAmount: 0,
                failedAmount: 0,
            };
        }

        for (const tx of transactions) {
            const key = resolveAgentKey(tx.agent || "UNKNOWN", activeAgents);
            if (!map[key]) {
                map[key] = {
                    label: tx.agent || key,
                    count: 0,
                    totalAmount: 0,
                    successAmount: 0,
                    failedAmount: 0,
                };
            }
            map[key].count += 1;
            map[key].totalAmount += tx.amount ?? 0;
            if (tx.status === "SUCCESS") {
                map[key].successAmount += tx.amount ?? 0;
            } else {
                map[key].failedAmount += tx.amount ?? 0;
            }
        }

        return map;
    }, [activeAgents, transactions]);

    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount ?? 0), 0);

    const agentRows: AgentAnalyticsRow[] = Object.values(byAgentMap)
        .map((value) => ({
            agent: value.label,
            transactionsCount: value.count,
            totalAmount: value.totalAmount,
            averageAmount: value.count ? value.totalAmount / value.count : 0,
            sharePercent: totalAmount ? (value.totalAmount / totalAmount) * 100 : 0,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount);

    const successPieData: PieSlice[] = Object.values(byAgentMap).map((value) => ({
        label: value.label,
        value: value.successAmount,
    }));

    const failedPieData: PieSlice[] = Object.values(byAgentMap).map((value) => ({
        label: value.label,
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
            ) : !activeAgents.length && !transactions.length ? (
                <Empty description="Нет данных по входящим транзакциям" />
            ) : (
                <>
                    <Row gutter={24} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Общее количество входящих транзакций"
                                    value={totalFromApi}
                                />
                                {totalFromApi > transactions.length && (
                                    <span style={{ fontSize: 12, color: "#888" }}>
                                        В выборке: {transactions.length}
                                    </span>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Общий объем входящих транзакций, KGS"
                                    value={totalAmount}
                                    precision={2}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Активных агентов / с транзакциями"
                                    value={`${activeAgents.length} / ${agentRows.filter((r) => r.transactionsCount > 0).length}`}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{ marginBottom: 24 }}>
                        <Col xs={24} md={12}>
                            <Card style={{ height: "100%" }}>
                                <PieChart
                                    data={successPieData}
                                    title="Распределение по агентам (успешные транзакции)"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card style={{ height: "100%" }}>
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

