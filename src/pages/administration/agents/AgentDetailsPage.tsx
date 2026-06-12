import { Button, Card, Descriptions, Tabs, Tag, type TabsProps } from "antd";
import { useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { useGetAgentList } from "../../../hooks/dictionary/agent/useGetAgentList";
import AgentOperationsPage from "./operations/AgentOperationsPage";
import { EditOutlined } from "@ant-design/icons";
import { useParams, useSearchParams } from "react-router-dom";
import type { AgentType } from "../../../types/dictionary/agentType";
import { formatRuDate } from "../../../utils/dateFormatter";
import ButtonBack from "../../../components/dataEntry/ButtonBack";
import AgentEditModal from "./AgentEditModal";
import Title from "antd/es/typography/Title";

const TAB_KEYS = ['info', 'operations'] as const;
const DEFAULT_TAB = 'info';

export default function AgentDetailsPage() {
    const { agent } = useParams<{ agent: string }>()
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const activeKey = TAB_KEYS.includes(tabParam as (typeof TAB_KEYS)[number])
        ? (tabParam as string)
        : DEFAULT_TAB;
    const { data: agentsList, isLoading, error } = useGetAgentList()
    const { colors } = useTheme()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onTabChange = (key: string) => {
        setSearchParams(
            (prev) => {
                prev.set('tab', key);
                return prev;
            },
            { replace: true }
        );
    };

    // Находим конкретного агента по code из URL параметра
    const agentData = agentsList?.find((agentItem: AgentType) => agentItem.code === agent)

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <h3>Ошибка загрузки данных</h3>;
    if (!agentData) return <h3>Данные агента отсутствуют</h3>;

    const items: TabsProps["items"] = [
        {
            label: "Общая информация",
            key: "info",
            children: agent ? (
                <>
                    <Card>
                        <Descriptions bordered column={1} size="middle" style={{ backgroundColor: colors.background, color: colors.text }}>
                            <Descriptions.Item label="ID">
                                {agentData.id ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Logo">
                                {agentData.logoUrl ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Agent">
                                {agentData.agent ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="BIC">
                                {agentData.bic ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Account">
                                {agentData.bankAccount ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Status">
                                {agentData.isActive ? (<Tag color="green">Active</Tag>) : (<Tag color="red">Inactive</Tag>)}
                            </Descriptions.Item>

                            <Descriptions.Item label="Bank code">
                                {agentData.code ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Updated by">
                                {agentData.changedBy ?? "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Change date">
                                {formatRuDate(agentData.changeDate) ?? "—"}
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
                            <Button color="cyan" variant="solid" onClick={() => setIsModalOpen(true)} >
                                Редактировать <EditOutlined />
                            </Button>
                        </div>
                    </Card>
                </>
            ) : (
                <h3>Данные агента отсутствуют</h3>
            ),
        },
        {
            label: "Операции агента",
            key: "operations",
            children: <AgentOperationsPage agent={agent} />,
        }
    ];
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent:"space-between" }}>
                <ButtonBack />
                <Title level={3}> {agentData.agent} </Title>
            </div>
            <Tabs
                activeKey={activeKey}
                onChange={onTabChange}
                // type="card"
                size="large"
                items={items}
                className="activeTab"
            />
            <AgentEditModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                data={agentData}
            />
        </>
    )
}