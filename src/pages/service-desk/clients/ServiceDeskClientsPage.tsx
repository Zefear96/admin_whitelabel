import { Input, Space, Card, Descriptions, Skeleton } from 'antd';
import { useClientProfile } from '../../../hooks/client/useClientProfile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientList from './ClientList';
import useNotificationMessage from '../../../components/dataDisplay/NotificationMessage';

const { Search } = Input;

export default function ServiceDeskClientsPage() {
  const [absId, setAbsId] = useState<string>("")
  const { data: client, isLoading, error } = useClientProfile(absId);
  const navigate = useNavigate();
  const { notify } = useNotificationMessage();


  const isNotFound = error?.response?.status === 404;
  const hasRequestError = !!error && !isNotFound;

  useEffect(() => {
    if (isNotFound && absId) {
      notify({
        type: "info",
        title: "Поиск клиента",
        message: `Клиент с ABS ${absId} не найден`,
      });
    }
    if (hasRequestError) {
      notify({
        type: "error",
        title: "Ошибка загрузки",
        message: error?.message || "Не удалось загрузить данные клиента",
      });
    }
  }, [isNotFound, absId, notify]);

  if (isLoading) return <Skeleton/>;

  
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
        {client && !error && (
          <Card onClick={() => navigate(`/service-desk/clients/details/${client.absClientId}`)} title={`${client.firstName} ${client.lastName}`} style={{ marginTop: 16, cursor: 'pointer',  }} hoverable={true}>
            <Descriptions bordered column={1} style={{}}>
              <Descriptions.Item label="ABS number">{client.absClientId}</Descriptions.Item>
              <Descriptions.Item label="ID">{client.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
              <Descriptions.Item label="Телефон">{client.phoneNumber || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Space>
      {
        !client && <ClientList />
      }
      
      {/* <ClientDetails client={client || null} /> */}
    </>
  );
}
