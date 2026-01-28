import { Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import ClientList from "../../service-desk/clients/ClientList";
import { useGetClientList } from "../../../hooks/client/useGetClientList";
import type { CustomerProfileType } from "../../../types/client/customerProfile";

const { Title, Text } = Typography;

export default function AnalyticsPageReportsClients() {
    // Загружаем "широкий" список клиентов для аналитики
    const { data, isLoading, error } = useGetClientList(0, 1000, "createdDate,ASC");

    const clients = data?.clients || [];
    const totalFromBackend = data?.totalElements ?? 0;
    const totalLoaded = clients.length;

    const activeClients = clients.filter(
        (c) => c.currentStatus?.status === "ACTIVE"
    );
    const blockedClients = clients.filter(
        (c) => c.currentStatus?.status === "BLOCKED"
    );
    const inactiveClients = clients.filter(
        (c) => c.currentStatus?.status === "INACTIVE"
    );

    const citizens = clients.filter((c) => c.isCitizen);
    const nonCitizens = clients.filter((c) => !c.isCitizen);

    const activeCount = activeClients.length;
    const blockedCount = blockedClients.length;
    const inactiveCount = inactiveClients.length;
    const otherCount =
        totalLoaded - activeCount - blockedCount - inactiveCount;

    const percent = (part: number, whole: number) =>
        whole > 0 ? Math.round((part / whole) * 100) : 0;

    const baseForPercent = totalFromBackend || totalLoaded;

    const statusSummaryData = [
        {
            key: "ACTIVE",
            status: "ACTIVE",
            label: "Активные",
            count: activeCount,
            percent: percent(activeCount, baseForPercent),
            color: "green",
        },
        {
            key: "INACTIVE",
            status: "INACTIVE",
            label: "Неактивные",
            count: inactiveCount,
            percent: percent(inactiveCount, baseForPercent),
            color: "default",
        },
        {
            key: "BLOCKED",
            status: "BLOCKED",
            label: "Заблокированные",
            count: blockedCount,
            percent: percent(blockedCount, baseForPercent),
            color: "red",
        },
        {
            key: "OTHER",
            status: "OTHER",
            label: "Другие статусы",
            count: otherCount,
            percent: percent(otherCount, baseForPercent),
            color: "blue",
        },
    ].filter((item) => item.count > 0);

    const lastClientsColumns: ColumnsType<CustomerProfileType> = [
        {
            title: "ABS number",
            dataIndex: "absClientId",
            width: 120,
        },
        {
            title: "Имя",
            dataIndex: "firstName",
        },
        {
            title: "Фамилия",
            dataIndex: "lastName",
        },
        {
            title: "Телефон",
            dataIndex: "phoneNumber",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Статус",
            dataIndex: "currentStatus",
            render: (value: CustomerProfileType["currentStatus"]) => (
                <Tag color={value?.status === "ACTIVE" ? "green" : "red"}>
                    {value?.status || "-"}
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
                Аналитика по клиентам мобильного приложения
            </Title>

            {error && (
                <Card style={{ marginBottom: 16 }} type="inner">
                    <Text type="danger">
                        Ошибка загрузки данных клиентов: {error.message}
                    </Text>
                </Card>
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Всего клиентов"
                            value={totalFromBackend || totalLoaded}
                        />
                        {totalFromBackend > 0 && totalFromBackend !== totalLoaded && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Загружено записей: {totalLoaded}
                            </Text>
                        )}
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Активные"
                            value={`${activeCount} чел. - `}
                            valueStyle={{ color: "#3f8600" }}
                            suffix={`${percent(activeCount, baseForPercent)}%`}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Неактивные"
                            value={`${inactiveCount} чел. - `}
                            valueStyle={{ color: "#595959" }}
                            suffix={`${percent(inactiveCount, baseForPercent)}%`}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Заблокированные"
                            value={`${blockedCount} чел. - `}
                            valueStyle={{ color: "#cf1322" }}
                            suffix={`${percent(blockedCount, baseForPercent)}%`}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card
                        title="Статусы клиентов"
                        loading={isLoading}
<<<<<<< HEAD
                    // extra={
                    //     <Text type="secondary" style={{ fontSize: 12 }}>
                    //         По загруженным данным
                    //     </Text>
                    // }
=======
                        // extra={
                        //     <Text type="secondary" style={{ fontSize: 12 }}>
                        //         По загруженным данным
                        //     </Text>
                        // }
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
                    >
                        <Table
                            size="small"
                            pagination={false}
                            rowKey="key"
                            dataSource={statusSummaryData}
                            columns={[
                                {
                                    title: "Статус",
                                    dataIndex: "label",
                                    render: (_: unknown, record) => (
                                        <Tag color={record.color}>{record.label}</Tag>
                                    ),
                                },
                                {
                                    title: "Количество",
                                    dataIndex: "count",
                                },
                                {
                                    title: "Доля",
                                    dataIndex: "percent",
                                    render: (value: number) => `${value}%`,
                                },
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title="Гражданство клиентов"
<<<<<<< HEAD

=======
                        bordered
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
                        loading={isLoading}
                    >
                        <Row justify="space-between" align="middle">
                            <Col span={12}>
                                <Statistic
                                    title={`Граждане Кыргызстана`}
                                    value={`${citizens.length} чел. - `}
                                    valueStyle={{ color: "#3f8600" }}
                                    suffix={`${percent(
                                        citizens.length,
                                        baseForPercent
                                    )}%`}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Иностранные граждане"
                                    value={`${nonCitizens.length} чел. - `}
                                    valueStyle={{ color: "#1890ff" }}
                                    suffix={`${percent(
                                        nonCitizens.length,
                                        baseForPercent
                                    )}%`}
                                />
                            </Col>
                        </Row>

                        <div style={{ marginTop: 24, textAlign: "center" }}>
                            <Progress
                                type="circle"
                                percent={percent(citizens.length, baseForPercent)}
                                format={(p) => `${p}% KG`}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* <Card
                title="Последние зарегистрированные клиенты"
                style={{ marginTop: 16 }}
<<<<<<< HEAD
                
=======
                bordered
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
                loading={isLoading}
            >
                <Table<CustomerProfileType>
                    size="small"
                    rowKey={(row) => row.id || row.absClientId}
                    dataSource={clients.slice(0, 10)}
                    columns={lastClientsColumns}
                    pagination={false}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Полный список клиентов доступен в разделе &quot;Service
                    Desk &gt; Клиенты&quot;.
                </Text>
            </Card> */}

            <Card
                title="Список всех клиентов"
                style={{ marginTop: 16 }}
<<<<<<< HEAD

=======
                bordered
>>>>>>> 94236feb5259e50984921a5dd09279e927edfaea
            >
                <ClientList />
            </Card>
        </div>
    );
}