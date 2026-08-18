import { Button, Space, Tag } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import type { AxiosError } from "axios";
import Popconfirm from "../../../components/dataDisplay/Popconfirm";
import useNotificationMessage from "../../../components/dataDisplay/NotificationMessage";
import { useGetAntifraudStatusUser } from "../../../hooks/auth/useGetStatusUser";
import { useManualBlockUser } from "../../../hooks/auth/useManualBlockUser";
import { useManualUnblockUser } from "../../../hooks/auth/useManualUnblockUser";

type AntifraudClientBlockActionsProps = {
  userId?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError?.response?.data?.message || axiosError?.message || fallback;
};

export default function AntifraudClientBlockActions({ userId }: AntifraudClientBlockActionsProps) {
  const { data, isLoading } = useGetAntifraudStatusUser(userId);
  const { mutateAsync: blockUser, isPending: isBlocking } = useManualBlockUser();
  const { mutateAsync: unblockUser, isPending: isUnblocking } = useManualUnblockUser();
  const { notify } = useNotificationMessage();

  const isBlocked = !!data?.blocked;
  const isBusy = isBlocking || isUnblocking;

  const handleBlock = async () => {
    if (!userId) return;

    try {
      await blockUser({ userId, requestBody: { reasonText: "Блокировка клиента" } });
      notify({
        type: "success",
        title: "Успешно",
        message: "Клиент заблокирован",
      });
    } catch (error) {
      notify({
        type: "error",
        title: "Ошибка",
        message: getErrorMessage(error, "Не удалось заблокировать клиента"),
      });
    }
  };

  const handleUnblock = async () => {
    if (!userId) return;

    try {
      await unblockUser({ userId, requestBody: { reasonText: "Разблокировка клиента" } });
      notify({
        type: "success",
        title: "Успешно",
        message: "Клиент разблокирован",
      });
    } catch (error) {
      notify({
        type: "error",
        title: "Ошибка",
        message: getErrorMessage(error, "Не удалось разблокировать клиента"),
      });
    }
  };

  return (
    <Space style={{ width: "100%", justifyContent: "space-between" }}>
      <Tag color={isBlocked ? "red" : "green"}>
        {isLoading ? "Загрузка статуса..." : isBlocked ? "Блок" : "Активен"}
      </Tag>
      {isBlocked ? (
        <Popconfirm
          title="Разблокировать клиента?"
          onConfirm={handleUnblock}
          okButtonProps={{ loading: isUnblocking }}
          disabled={!userId}
        >
          <Button icon={<UnlockOutlined />} loading={isBusy} disabled={!userId}>
            Разблокировать
          </Button>
        </Popconfirm>
      ) : (
        <Popconfirm
          title="Заблокировать клиента?"
          onConfirm={handleBlock}
          okButtonProps={{ loading: isBlocking, danger: true }}
          disabled={!userId}
        >
          <Button danger icon={<LockOutlined />} loading={isBusy} disabled={!userId}>
            Заблокировать
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
}
