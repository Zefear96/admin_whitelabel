import { EditOutlined } from "@ant-design/icons";
import type { ModalPropsType } from "../../../types/components/modalPropsType";
import type { NotificationTemplateType } from "../../../types/pushNotification/notificationTemplateType";
import { Button, Card, Descriptions, Modal, Tag } from "antd";

export default function NotificationTemplateModal({
    isModalOpen,
    setIsModalOpen,
    data,
}: ModalPropsType<NotificationTemplateType>) {
    return (
        <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            title="Просмотр шаблона уведомления"
            style={{ minWidth: "60%" }}
        >
            <Card>
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Код">{data?.code ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Категория">
                        {data?.category ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Сервис">{data?.serviceName ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Заголовок (RU)">{data?.titleRu ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Заголовок (KY)">{data?.titleKy ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Заголовок (EN)">{data?.titleEn ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Текст (RU)">{data?.bodyRu ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Текст (KY)">{data?.bodyKy ?? "-"}</Descriptions.Item>
                    <Descriptions.Item label="Текст (EN)">{data?.bodyEn ?? "-"}</Descriptions.Item>
                </Descriptions>
            </Card>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
                <Button variant="solid" color="cyan" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)}>Редактировать</Button>
            </div>
        </Modal>
    );
}