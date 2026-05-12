import { useNavigate, useParams } from "react-router-dom"
import { Button, Tabs, type TabsProps } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { useGetTransactionsByAgent } from "../../../../hooks/banking-gateway/useGetAllTransactionsByAgent";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";
import { RollbackOutlined } from "@ant-design/icons";
import IncomingTransactionsTab from "./IncomingTransactionsTab";
import OutgoingTransactionsTab from "./OutgoingTransactionsTab";

export default function DetailsTransactionsBank() {
    const navigate = useNavigate();
    const { code } = useParams();
    const bankCode = code ?? "null";

    const [activeTab, setActiveTab] = useState<string>("1");

    const today = dayjs();
    const initialFrom = today.subtract(7, "day");

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([initialFrom, today]);

    const apiFromDate = (dateRange?.[0] ?? initialFrom).format("YYYY-MM-DD");
    const apiToDate = (dateRange?.[1] ?? today).format("YYYY-MM-DD");

    const fromDate = dateRange?.[0]?.toISOString();
    const toDate = dateRange?.[1]?.toISOString();

    const {
        data: IncomingTransactions,
        isLoading: isLoadingIncomingTransactions,
        error: errorIncomingTransactions,
    } = useGetTransactionsByAgent(bankCode, 0, 20, "creationDate", "DESC");
    const incomingTransactionsArray: IncomingTransactionType[] = (IncomingTransactions?.content ?? []) as IncomingTransactionType[];

    const items: TabsProps["items"] = [
        {
            label: "Исходящие транзакции",
            key: "1",
            children: (
                <OutgoingTransactionsTab
                    bankCode={bankCode}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            ),
        },
        {
            label: "Входящие транзакции",
            key: "2",
            children: (
                <IncomingTransactionsTab
                    bankCode={bankCode}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    incomingTransactions={incomingTransactionsArray}
                    isLoadingIncomingTransactions={isLoadingIncomingTransactions}
                    errorIncomingTransactions={errorIncomingTransactions}
                    fromDate={fromDate ?? ""}
                    toDate={toDate ?? ""}
                />
            ),
        },
    ]

    return (
        <>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <Button onClick={() => navigate(-1)}>
                    Назад <RollbackOutlined />
                </Button>
                
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                // type="card"
                size="large"
                items={items}
                className="activeTab"
            />
        </>
    )
}