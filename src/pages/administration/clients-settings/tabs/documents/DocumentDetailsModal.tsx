import { Button, Descriptions, Modal, Tag } from "antd";
import type { AxiosError } from "axios";
import dayjs from "dayjs";
import Popconfirm from "../../../../../components/dataDisplay/Popconfirm";
import { useNotificationMessage } from "../../../../../components/dataDisplay/NotificationMessage";
import { useUpdateDocumentStatus } from "../../../../../hooks/document-service/useUpdateDocumentStatus";
import {
    DOCUMENT_STATUS_LABELS,
    DOCUMENT_TYPE_LABELS,
    type DocumentResponseType,
} from "../../../../../types/documentService/documentType";

interface DocumentDetailsModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: DocumentResponseType | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || fallback;
};

export default function DocumentDetailsModal({ isModalOpen, setIsModalOpen, data }: DocumentDetailsModalProps) {
    const { mutateAsync, isPending } = useUpdateDocumentStatus();
    const { notify } = useNotificationMessage();
    const nextStatus: DocumentResponseType["status"] = data?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleStatusChange = async () => {
        if (!data) return;

        try {
            await mutateAsync({ id: data.id, status: nextStatus });
            notify({
                type: "success",
                title: "Успешно",
                message: `Статус изменён на «${DOCUMENT_STATUS_LABELS[nextStatus]}»`,
            });
            handleCancel();
        } catch (error) {
            notify({
                type: "error",
                title: "Ошибка",
                message: getErrorMessage(error, "Не удалось изменить статус документа"),
            });
        }
    };

    return (
        <Modal open={isModalOpen} onCancel={handleCancel} title="Документ" footer={null}>
            {data && (
                <>
                    <Descriptions column={1} style={{ marginTop: 16 }}>
                        <Descriptions.Item label="Тип">{DOCUMENT_TYPE_LABELS[data.type]}</Descriptions.Item>
                        <Descriptions.Item label="Версия">{data.version}</Descriptions.Item>
                        <Descriptions.Item label="Файл">
                            <a href={data.url} target="_blank" rel="noreferrer">
                                {data.fileName}
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Статус">
                            <Tag color={data.status === "ACTIVE" ? "green" : "default"}>
                                {DOCUMENT_STATUS_LABELS[data.status]}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Создан">
                            {data.createdAt ? dayjs(data.createdAt).format("DD.MM.YYYY HH:mm") : "—"}
                        </Descriptions.Item>
                    </Descriptions>
                    <div style={{ textAlign: "right", marginTop: 24 }}>
                        <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                            Закрыть
                        </Button>
                        <Popconfirm
                            title={`Сделать документ «${DOCUMENT_STATUS_LABELS[nextStatus]}»?`}
                            onConfirm={handleStatusChange}
                            okButtonProps={{ loading: isPending }}
                        >
                            <Button type="primary" loading={isPending}>
                                {nextStatus === "ACTIVE" ? "Активировать" : "Деактивировать"}
                            </Button>
                        </Popconfirm>
                    </div>
                </>
            )}
        </Modal>
    );
}
