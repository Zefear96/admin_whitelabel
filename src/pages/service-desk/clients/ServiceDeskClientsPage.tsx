import { Input, Space, Card, Descriptions, Skeleton, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientList from './ClientList';
import useNotificationMessage from '../../../components/dataDisplay/NotificationMessage';
import { useSearchClients } from '../../../hooks/client/useSearchClients';
import type { CustomerProfileType, SearchClientsParams } from '../../../types/client/customerProfile';

const { Search } = Input;

type SearchField = keyof Pick<
  SearchClientsParams,
  'absNumber' | 'inn' | 'phoneNumber' | 'firstname' | 'surName'
>;

const SEARCH_FIELD_OPTIONS: { value: SearchField; label: string; placeholder: string }[] = [
  { value: 'absNumber', label: 'АБС', placeholder: 'Поиск клиента по АБС' },
  { value: 'inn', label: 'ИНН', placeholder: 'Поиск клиента по ИНН' },
  { value: 'phoneNumber', label: 'Телефон', placeholder: 'Поиск клиента по телефону' },
  { value: 'firstname', label: 'Имя', placeholder: 'Поиск клиента по имени' },
  { value: 'surName', label: 'Фамилия', placeholder: 'Поиск клиента по фамилии' },
];

const columns: ColumnsType<CustomerProfileType> = [
  { title: 'ABS number', dataIndex: 'absClientId' },
  { title: 'Имя', dataIndex: 'firstName' },
  { title: 'Фамилия', dataIndex: 'lastName' },
  { title: 'ИНН', dataIndex: 'inn' },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Телефон', dataIndex: 'phoneNumber' },
];

export default function ServiceDeskClientsPage() {
  const [searchField, setSearchField] = useState<SearchField>('absNumber');
  const [submittedParams, setSubmittedParams] = useState<SearchClientsParams>({});
  const navigate = useNavigate();
  const { notify } = useNotificationMessage();

  const { data, isLoading, isFetching, error, isSuccess } = useSearchClients(submittedParams);

  const hasActiveSearch = !!(
    submittedParams.absNumber ||
    submittedParams.inn ||
    submittedParams.phoneNumber ||
    submittedParams.firstname ||
    submittedParams.surName
  );

  const clients = data?.clients ?? [];
  const placeholder = useMemo(
    () => SEARCH_FIELD_OPTIONS.find((o) => o.value === searchField)?.placeholder ?? '',
    [searchField],
  );

  useEffect(() => {
    if (!hasActiveSearch || !isSuccess || isFetching) return;

    if (clients.length === 0) {
      // notify({
      //   type: 'info',
      //   title: 'Поиск клиента',
      //   message: 'Клиент не найден',
      // });
      
    }
  }, [hasActiveSearch, isSuccess, isFetching, clients.length, notify]);

  useEffect(() => {
    if (!error) return;
    notify({
      type: 'error',
      title: 'Ошибка загрузки',
      message: error.message || 'Не удалось загрузить данные клиента',
    });
  }, [error, notify]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setSubmittedParams({});
      return;
    }
    setSubmittedParams({ [searchField]: trimmed });
  };

  const renderSearchResults = () => {
    if (!hasActiveSearch) return <ClientList />;
    if (isLoading && !data) return <Skeleton />;
    if (error || clients.length === 0) return <Card>Клиент не найден</Card>;

    if (clients.length === 1) {
      const client = clients[0];
      return (
        <Card
          onClick={() => navigate(`/service-desk/clients/details/${client.absClientId}`)}
          title={`${client.firstName} ${client.lastName}`}
          style={{ marginTop: 16, cursor: 'pointer' }}
          hoverable
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ABS number">{client.absClientId}</Descriptions.Item>
            <Descriptions.Item label="ID">{client.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
            <Descriptions.Item label="Телефон">{client.phoneNumber || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      );
    }

    return (
      <Table<CustomerProfileType>
        rowKey={(row) => row.id || row.absClientId}
        onRow={(record) => ({
          onClick: () => navigate(`/service-desk/clients/details/${record.absClientId}`),
        })}
        dataSource={clients}
        columns={columns}
        style={{ marginTop: 16, cursor: 'pointer' }}
        bordered
        size="small"
        pagination={{
          pageSize: data?.size ?? 20,
          current: (data?.page ?? 0) + 1,
          total: data?.totalElements ?? clients.length,
          showTotal: (total) => `Всего ${total} клиентов`,
        }}
      />
    );
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Select
          value={searchField}
          onChange={(value: SearchField) => setSearchField(value)}
          options={SEARCH_FIELD_OPTIONS.map(({ value, label }) => ({ value, label }))}
          size="large"
          style={{ width: 140 }}
        />
        <Search
          placeholder={placeholder}
          onSearch={handleSearch}
          size="large"
          enterButton
          allowClear
          loading={hasActiveSearch && (isLoading || isFetching)}
          style={{ flex: 1 }}
        />
      </Space.Compact>
      {renderSearchResults()}
    </Space>
  );
}
