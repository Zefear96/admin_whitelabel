import { Input, Space, Card, Descriptions } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import type { GetProps } from 'antd';
import { useClientQuery } from '../../../hooks/useClientProfileApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientDetails from './ClientDetails';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const suffix = <AudioOutlined style={{ fontSize: 16, color: '#1677ff' }} />;

export default function ServiceDeskClientsPage() {
  const [absId, setAbsId] = useState<string>("")
  const { data: client, isLoading, error } = useClientQuery(absId);
  const navigate = useNavigate();

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Search
          placeholder="Поиск клиента по АБС"
          onSearch={(value) => setAbsId(value)}
          size="large"
          enterButton
        // loading={loading}
        />
        {error && <p>Ошибка загрузки</p>}

        {client && (
          <Card onClick={() => navigate(`/service-desk/clients/details/${client.absClientId}`)} title={`${client.firstName} ${client.lastName}`} style={{ marginTop: 16, cursor: 'pointer' }} hoverable={true}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ABS number">{client.absClientId}</Descriptions.Item>
              <Descriptions.Item label="ID">{client.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
              <Descriptions.Item label="Телефон">{client.phoneNumber || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Space>
      {/* <ClientDetails client={client || null} /> */}
    </>
  );
}
