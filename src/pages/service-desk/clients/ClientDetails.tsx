import { useState } from 'react';
import type { TabsProps } from 'antd';
import { Button, Descriptions, Tabs, Tag } from 'antd';
import type { CustomerProfileType } from '../../../types/client/customerProfile';
import { useNavigate, useParams } from 'react-router-dom';
import { useClientProfile } from '../../../hooks/client/useClientProfile';
import { useClientDevices } from '../../../hooks/client/useClientDevices';
import DeviceHistory from './DeviceHistory';
import './style.css'
import { useTheme } from '../../../hooks/useTheme';
import { RollbackOutlined } from '@ant-design/icons';
import ClientProductPage from './product/ClientProductPage';
import ClientTransactionHistory from './ClientTransactionHistory';
import Title from 'antd/es/typography/Title';


export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, error } = useClientProfile(id)
  const [activeKey, setActiveKey] = useState('1');
  const { colors } = useTheme();
  const navigate = useNavigate();

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки клиента</p>;
  if (!client) return <p>Клиент не найден</p>;

  const items: TabsProps["items"] = [
    {
      label: "Общая информация",
      key: "1",
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
      key: "2",
      children: <DeviceHistory absId={client.absClientId} />,
    },
    {
      label: "Продукты клиента",
      key: "3",
      children: (
        <ClientProductPage keycloakClientId={client.keycloakClientId} />
      ),
    },
    {
      label: "История транзакций клиента",
      key: "4",
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
        onChange={setActiveKey}
        // type="card"
        size="large"
        items={items}
        className="activeTab"
      />
    </div>
  )
}