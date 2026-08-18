import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetAntifraudStatusUser } from "../../../hooks/auth/useGetStatusUser";
import type { CustomerProfileType } from "../../../types/client/customerProfile";

export function AntifraudStatusCell({ userId }: { userId?: string }) {
  const { data, isLoading } = useGetAntifraudStatusUser(userId);

  if (!userId) return <Tag>—</Tag>;
  if (isLoading) return <Tag>Загрузка...</Tag>;

  const isBlocked = !!data?.blocked;

  return (
    <Tag color={isBlocked ? "red" : "green"}>
      {isBlocked ? "Заблокирован" : "Активен"}
    </Tag>
  );
}

export const antifraudClientColumns: ColumnsType<CustomerProfileType> = [
  { title: "ABS number", dataIndex: "absClientId" },
  { title: "Имя", dataIndex: "firstName" },
  { title: "Фамилия", dataIndex: "lastName" },
  { title: "ИНН", dataIndex: "inn" },
  { title: "Email", dataIndex: "email" },
  { title: "Телефон", dataIndex: "phoneNumber" },
  // {
  //   title: "Статус",
  //   key: "blockStatus",
  //   render: (_value, record) => <AntifraudStatusCell userId={record.keycloakClientId} />,
  // },
];
