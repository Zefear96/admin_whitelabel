import type { TabsProps } from 'antd';
import { Button, Descriptions, Tabs, Tag } from 'antd';
import type { CustomerProfileType } from '../../../types/client/customerProfile';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useClientProfile } from '../../../hooks/client/useClientProfile';
import { useClientDevices } from '../../../hooks/device/useClientDevices';
import DeviceHistory from './device-history/DeviceHistory';
import './style.css'
import { useTheme } from '../../../hooks/useTheme';
import { RollbackOutlined } from '@ant-design/icons';
import ClientProductPage from './product/ClientProductPage';
import ClientTransactionHistory from './transaction-history/ClientTransactionHistory';
import Title from 'antd/es/typography/Title';
import { ClientDetailsSkeleton } from './ClientDetailsSkeleton';


const TAB_KEYS = ['info', 'device-history', 'products', 'transaction-history'] as const;
const DEFAULT_TAB = 'info';

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, error } = useClientProfile(id)
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeKey = TAB_KEYS.includes(tabParam as (typeof TAB_KEYS)[number])
    ? (tabParam as string)
    : DEFAULT_TAB;
  const { colors } = useTheme();
  const navigate = useNavigate();

  const onTabChange = (key: string) => {
    setSearchParams(
      (prev) => {
        prev.set('tab', key);
        return prev;
      },
      { replace: true }
    );
  };

  if (isLoading) return <ClientDetailsSkeleton />;
  if (error) return <p>Ошибка загрузки клиента</p>;
  if (!client) return <p>Клиент не найден</p>;

  const items: TabsProps["items"] = [
    {
      label: "Общая информация",
      key: "info",
      children: client ? (
        <Descriptions bordered column={1} size="middle" style={{ backgroundColor: colors.background, color: colors.text }}>
          <Descriptions.Item label="ID">{client.id}</Descriptions.Item>
          <Descriptions.Item label="Имя">{client.firstName}</Descriptions.Item>
          <Descriptions.Item label="Фамилия">{client.lastName}</Descriptions.Item>
          <Descriptions.Item label="ИНН">{client.inn}</Descriptions.Item>
          <Descriptions.Item label="ABS ID">{client.absClientId}</Descriptions.Item>
          <Descriptions.Item label="MPC ID">{client.mpcClientId || "-"}</Descriptions.Item>
          <Descriptions.Item label="Keycloak ID">{client.keycloakClientId}</Descriptions.Item>
          <Descriptions.Item label="Дата рождения">
            {client.birthDate ? new Date(client.birthDate).toLocaleDateString() : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Телефон">{client.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
          <Descriptions.Item label="Устройство">{client.deviceInfo || "-"}</Descriptions.Item>
          <Descriptions.Item label="Гражданин Кыргызстана">
            {client.isCitizen ? "Да" : "Нет"}
          </Descriptions.Item>
          <Descriptions.Item label="Дата подтверждения оферты">
            {client.confirmOfferAgreementDate
              ? new Date(client.confirmOfferAgreementDate).toLocaleString()
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Статус">
            <Tag color={client.currentStatus?.status === "ACTIVE" ? "green" : "red"}>
              {client.currentStatus?.status}
            </Tag>
            <div style={{ marginTop: 4, fontSize: 12, color: "#666" }}>
              {client.currentStatus?.comment}
              <br />
              Изменил: {client.currentStatus?.changedBy}
              <br />
              {client.currentStatus?.createdAt &&
                new Date(client.currentStatus.createdAt).toLocaleString()}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Дата создания">
            {new Date(client.createDate).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Дата обновления">
            {new Date(client.updateDate).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <h3>Нет данных о клиенте</h3>
      ),
    },
    {
      label: "История входов",
      key: "device-history",
      children: <DeviceHistory absId={client.absClientId} />,
    },
    {
      label: "Продукты клиента",
      key: "products",
      children: (
        <ClientProductPage keycloakClientId={client.keycloakClientId} />
      ),
    },
    {
      label: "История транзакций клиента",
      key: "transaction-history",
      children: (
        <ClientTransactionHistory keycloakClientId={client.keycloakClientId} />
      ),
    },
    // {
    //   label: "Роли", // В дальнейших разработках
    //   key: "3",
    //   children: (
    //     <div>
    //       <h3>Страница в разработке</h3>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent:"space-between" }}>
        <Button style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
          Назад <RollbackOutlined />
        </Button>
        <Title level={3}> {client.firstName} {client.lastName} </Title>
      </div>
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        // type="card"
        size="large"
        items={items}
        className="activeTab"
      />
    </div>
  )
}