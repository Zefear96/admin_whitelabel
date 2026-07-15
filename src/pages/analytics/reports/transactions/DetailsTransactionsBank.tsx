import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Button, Tabs, type TabsProps } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { useGetAgentList } from "../../../../hooks/dictionary/agent/useGetAgentList";
import type { AgentType } from "../../../../types/dictionary/agentType";
import { RollbackOutlined } from "@ant-design/icons";
import IncomingTransactionsTab from "./IncomingTransactionsTab";
import OutgoingTransactionsTab from "./OutgoingTransactionsTab";

const TAB_KEYS = ['outgoing', 'incoming'] as const;
const DEFAULT_TAB = 'outgoing';

export default function DetailsTransactionsBank() {
    const navigate = useNavigate();
    const { code } = useParams();
    const bankCode = code ?? "null";

    const { data: agentList } = useGetAgentList();

    // Имя агента ищем по `code` из URL в словаре агентов, чтобы избежать проблем
    // с несовпадающим/несвежим `location.state`.
    const agentListTyped = agentList as AgentType[] | undefined;
    const agentNameFromCode = agentListTyped?.find((a) => a.code === bankCode)?.agent;
    const agentName = agentNameFromCode ?? bankCode.toUpperCase();

    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const activeTab = TAB_KEYS.includes(tabParam as (typeof TAB_KEYS)[number])
        ? (tabParam as string)
        : DEFAULT_TAB;

    const onTabChange = (key: string) => {
        setSearchParams(
            (prev) => {
                prev.set('tab', key);
                return prev;
            },
            { replace: true }
        );
    };

    const today = dayjs();
    const initialFrom = today.subtract(7, "day");

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([initialFrom, today]);

    const items: TabsProps["items"] = [
        {
            label: "Исходящие транзакции",
            key: "outgoing",
            children: (
                <OutgoingTransactionsTab
                    bankCode={bankCode}
                    agentName={agentName}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            ),
        },
        {
            label: "Входящие транзакции",
            key: "incoming",
            children: (
                <IncomingTransactionsTab
                    bankCode={bankCode}
                    agentName={agentName}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            ),
        },
    ]

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Button onClick={() => navigate(-1)}>
                    Назад <RollbackOutlined />
                </Button>
                <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{agentName}</h1>
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={onTabChange}
                // type="card"
                size="large"
                items={items}
                className="activeTab"
            />
        </>
    )
}
