import { EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Modal } from "antd";
import type { LimitType } from "../../../../types/limit/limitType";
import { formatAmount } from "../../../../utils/amountFormatter";
import { formatRuDate } from "../../../../utils/dateFormatter";

interface LimitViewModalProps {
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
    limit: LimitType | null;
}

export default function LimitViewModal({ open, onClose, onEdit, limit }: LimitViewModalProps) {
    return (
        <Modal open={open} onCancel={onClose} title="Просмотр лимита" footer={null}>
            <Descriptions bordered column={1} size="middle" style={{ marginTop: 12 }}>
                <Descriptions.Item label="Operation type">{limit?.operationType ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Описание">{limit?.description ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Currency">{limit?.currency ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Max count">{limit?.maxCount ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Max amount">{formatAmount(limit?.maxAmount)}</Descriptions.Item>
                <Descriptions.Item label="Period">{limit?.period ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="User type">{limit?.userType ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Создан">{formatRuDate(limit?.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Обновлён">{formatRuDate(limit?.updatedAt)}</Descriptions.Item>
            </Descriptions>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <Button onClick={onClose}>Закрыть</Button>
                <Button color="cyan" variant="solid" onClick={onEdit}>
                    Редактировать <EditOutlined />
                </Button>
            </div>
        </Modal>
    );
}
