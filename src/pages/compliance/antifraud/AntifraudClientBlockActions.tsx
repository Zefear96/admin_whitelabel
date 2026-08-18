import { useState } from "react";
import { Button, Input, Modal, Space, Tag } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import type { AxiosError } from "axios";
import useNotificationMessage from "../../../components/dataDisplay/NotificationMessage";
import { useGetAntifraudStatusUser } from "../../../hooks/auth/useGetStatusUser";
import { useManualBlockUser } from "../../../hooks/auth/useManualBlockUser";
import { useManualUnblockUser } from "../../../hooks/auth/useManualUnblockUser";
import { REASON_TEXT_MAX_LENGTH } from "../../../types/auth/requestBodyAntifraud";

type AntifraudClientBlockActionsProps = {
  userId?: string;
};

type ReasonAction = "block" | "unblock";

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError?.response?.data?.message || axiosError?.message || fallback;
};

export default function AntifraudClientBlockActions({ userId }: AntifraudClientBlockActionsProps) {
  const { data, isLoading } = useGetAntifraudStatusUser(userId);
  const { mutateAsync: blockUser, isPending: isBlocking } = useManualBlockUser();
  const { mutateAsync: unblockUser, isPending: isUnblocking } = useManualUnblockUser();
  const { notify } = useNotificationMessage();

  const [reasonAction, setReasonAction] = useState<ReasonAction | null>(null);
  const [reasonText, setReasonText] = useState("");

  const isBlocked = !!data?.blocked;
  const isBusy = isBlocking || isUnblocking;
  const isBlockAction = reasonAction === "block";

  const closeReasonModal = () => {
    setReasonAction(null);
    setReasonText("");
  };

  const handleSubmitReason = async () => {
    if (!userId) return;

    const trimmedReason = reasonText.trim();
    if (!trimmedReason) {
      notify({
        type: "error",
        title: "Ошибка",
        message: "Укажите причину",
      });
      return;
    }

    try {
      if (isBlockAction) {
        await blockUser({ userId, requestBody: { reasonText: trimmedReason } });
        notify({
          type: "success",
          title: "Успешно",
          message: "Клиент заблокирован",
        });
      } else {
        await unblockUser({ userId, requestBody: { reasonText: trimmedReason } });
        notify({
          type: "success",
          title: "Успешно",
          message: "Клиент разблокирован",
        });
      }
      closeReasonModal();
    } catch (error) {
      notify({
        type: "error",
        title: "Ошибка",
        message: getErrorMessage(
          error,
          isBlockAction ? "Не удалось заблокировать клиента" : "Не удалось разблокировать клиента"
        ),
      });
    }
  };

  return (
    <>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Tag color={isBlocked ? "red" : "green"}>
          {isLoading ? "Загрузка статуса..." : isBlocked ? "Блок" : "Активен"}
        </Tag>
        {isBlocked ? (
          <Button
            icon={<UnlockOutlined />}
            loading={isBusy}
            disabled={!userId}
            onClick={() => setReasonAction("unblock")}
          >
            Разблокировать
          </Button>
        ) : (
          <Button
            danger
            icon={<LockOutlined />}
            loading={isBusy}
            disabled={!userId}
            onClick={() => setReasonAction("block")}
          >
            Заблокировать
          </Button>
        )}
      </Space>
      <Modal
        open={reasonAction !== null}
        title={isBlockAction ? "Заблокировать клиента" : "Разблокировать клиента"}
        okText={isBlockAction ? "Заблокировать" : "Разблокировать"}
        okButtonProps={{ danger: isBlockAction, loading: isBusy, disabled: !reasonText.trim() }}
        onOk={handleSubmitReason}
        onCancel={closeReasonModal}
        destroyOnHidden
      >
        <Input.TextArea
          value={reasonText}
          onChange={(event) => setReasonText(event.target.value.slice(0, REASON_TEXT_MAX_LENGTH))}
          placeholder="Укажите причину"
          maxLength={REASON_TEXT_MAX_LENGTH}
          showCount
          rows={4}
        />
      </Modal>
    </>
  );
}
