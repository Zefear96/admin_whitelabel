import { Input, Space, Card, Descriptions, Skeleton, Select, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotificationMessage from "../../../components/dataDisplay/NotificationMessage";
import { useSearchClients } from "../../../hooks/client/useSearchClients";
import type { CustomerProfileType, SearchClientsParams } from "../../../types/client/customerProfile";
import AntifraudClientTable from "./AntifraudClientTable";
import { AntifraudStatusCell, antifraudClientColumns } from "./antifraudClientColumns";

const { Search } = Input;
const DETAILS_PATH = "/compliance/antifraud/details";

type SearchField = keyof Pick<
  SearchClientsParams,
  "absNumber" | "inn" | "phoneNumber" | "firstName" | "lastName"
>;

const SEARCH_FIELD_OPTIONS: { value: SearchField; label: string; placeholder: string }[] = [
  { value: "absNumber", label: "АБС номер", placeholder: "Введите АБС номер клиента" },
  { value: "inn", label: "ИНН", placeholder: "Введите ИНН клиента" },
  { value: "phoneNumber", label: "Телефон", placeholder: "Введите номер телефона без кода страны" },
  { value: "firstName", label: "Имя", placeholder: "Введите имя клиента" },
  { value: "lastName", label: "Фамилия", placeholder: "Введите фамилию клиента" },
];

const SEARCH_FIELD_RULES: Record<
  SearchField,
  { maxLength: number; sanitize: (value: string) => string; errorMessage: string }
> = {
  absNumber: {
    maxLength: 7,
    sanitize: (value) => value.replace(/\D/g, "").slice(0, 7),
    errorMessage: "АБС номер: только цифры, максимум 7",
  },
  inn: {
    maxLength: 14,
    sanitize: (value) => value.replace(/\D/g, "").slice(0, 14),
    errorMessage: "ИНН: только цифры, максимум 14",
  },
  phoneNumber: {
    maxLength: 9,
    sanitize: (value) => value.replace(/\D/g, "").slice(0, 9),
    errorMessage: "Телефон: только цифры, максимум 9",
  },
  firstName: {
    maxLength: 100,
    sanitize: (value) => value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, "").slice(0, 100),
    errorMessage: "Имя: только буквы, максимум 100",
  },
  lastName: {
    maxLength: 100,
    sanitize: (value) => value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, "").slice(0, 100),
    errorMessage: "Фамилия: только буквы, максимум 100",
  },
};

export default function AntifraudClientList() {
  const [searchField, setSearchField] = useState<SearchField>("absNumber");
  const [searchValue, setSearchValue] = useState("");
  const [submittedParams, setSubmittedParams] = useState<SearchClientsParams>({});
  const navigate = useNavigate();
  const { notify } = useNotificationMessage();

  const { data, isLoading, isFetching, error } = useSearchClients(submittedParams);

  const hasActiveSearch = !!(
    submittedParams.absNumber ||
    submittedParams.inn ||
    submittedParams.phoneNumber ||
    submittedParams.firstName ||
    submittedParams.lastName
  );

  const clients = data?.clients ?? [];
  const fieldRule = SEARCH_FIELD_RULES[searchField];
  const placeholder = useMemo(
    () => SEARCH_FIELD_OPTIONS.find((option) => option.value === searchField)?.placeholder ?? "",
    [searchField],
  );

  useEffect(() => {
    if (!error) return;
    notify({
      type: "error",
      title: "Ошибка загрузки",
      message: error.message || "Не удалось загрузить данные клиента",
    });
  }, [error, notify]);

  const handleFieldChange = (value: SearchField) => {
    setSearchField(value);
    setSearchValue("");
    setSubmittedParams({});
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(SEARCH_FIELD_RULES[searchField].sanitize(value));
  };

  const handleSearch = (value: string) => {
    const sanitized = SEARCH_FIELD_RULES[searchField].sanitize(value).trim();
    setSearchValue(sanitized);

    if (!sanitized) {
      setSubmittedParams({});
      return;
    }

    if (sanitized !== value.trim()) {
      notify({
        type: "warning",
        title: "Некорректный ввод",
        message: fieldRule.errorMessage,
      });
      return;
    }

    setSubmittedParams({ [searchField]: sanitized });
  };

  const renderSearchResults = () => {
    if (!hasActiveSearch) return <AntifraudClientTable />;
    if (isLoading && !data) return <Skeleton />;
    if (error || clients.length === 0) return <Card>Клиент не найден</Card>;

    if (clients.length === 1) {
      const client = clients[0];
      return (
        <Card
          onClick={() => navigate(`${DETAILS_PATH}/${client.absClientId}`)}
          title={`${client.firstName} ${client.lastName}`}
          style={{ marginTop: 16, cursor: "pointer" }}
          hoverable
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ABS number">{client.absClientId}</Descriptions.Item>
            <Descriptions.Item label="ID">{client.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
            <Descriptions.Item label="Телефон">{client.phoneNumber || "-"}</Descriptions.Item>
            {/* <Descriptions.Item label="Статус">
              <AntifraudStatusCell userId={client.keycloakClientId} />
            </Descriptions.Item> */}
          </Descriptions>
        </Card>
      );
    }

    return (
      <Table<CustomerProfileType>
        rowKey={(row) => row.id || row.absClientId}
        onRow={(record) => ({
          onClick: () => navigate(`${DETAILS_PATH}/${record.absClientId}`),
        })}
        dataSource={clients}
        columns={antifraudClientColumns}
        style={{ marginTop: 16, cursor: "pointer" }}
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
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space.Compact style={{ width: "100%" }}>
        <Select
          value={searchField}
          onChange={handleFieldChange}
          options={SEARCH_FIELD_OPTIONS.map(({ value, label }) => ({ value, label }))}
          size="large"
          style={{ width: 140 }}
        />
        <Search
          value={searchValue}
          placeholder={placeholder}
          maxLength={fieldRule.maxLength}
          onChange={(event) => handleSearchChange(event.target.value)}
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
