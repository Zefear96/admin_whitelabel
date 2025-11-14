import { useState } from 'react';
import type { TabsProps } from 'antd';
import {  Descriptions, Tabs, Tag } from 'antd';
import type { CustomerProfileType } from '../../../types/customerProfile';
import { useParams } from 'react-router-dom';
import { useClientQuery } from '../../../hooks/useClientProfileApi';


export default function ClientDetails() {
  const {id} = useParams<{id: string}>();
  const {data:client, isLoading, error} = useClientQuery(id)
  const [activeKey, setActiveKey] = useState('1');

  
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки клиента</p>;
  if (!client) return <p>Клиент не найден</p>;

  const items: TabsProps["items"] = [
    {
      label: "Общая информация",
      key: "1",
      children: client ? (
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="ID">{client.id}</Descriptions.Item>
          <Descriptions.Item label="ABS ID">{client.absClientId}</Descriptions.Item>
          <Descriptions.Item label="MPC ID">{client.mpcClientId || "-"}</Descriptions.Item>
          <Descriptions.Item label="Keycloak ID">{client.keycloakClientId}</Descriptions.Item>
          <Descriptions.Item label="ИНН">{client.inn}</Descriptions.Item>
          <Descriptions.Item label="Имя">{client.firstName}</Descriptions.Item>
          <Descriptions.Item label="Фамилия">{client.lastName}</Descriptions.Item>
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
      label: "Устройства",
      key: "2",
      children: (
        <div>
          <h3>Страница в разработке</h3>
        </div>
      ),
    },
    // {
    //   label: "Роли",
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
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        type="card"
        size="large"
        items={items}
      />
    </div>
  )
}