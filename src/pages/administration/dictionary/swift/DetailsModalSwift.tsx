import { Button, Descriptions, Modal } from "antd";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import type { SwiftType } from "../../../../types/dictionary/swiftType";
import { EditOutlined } from "@ant-design/icons";

interface DetailsModalSwiftProps extends ModalPropsType<SwiftType> {
  onEditClick: () => void;
}

export default function DetailsModalSwift({
  isModalOpen,
  setIsModalOpen,
  data,
  onEditClick,
}: DetailsModalSwiftProps) {
  const handleEdit = () => {
    setIsModalOpen(false);
    onEditClick();
  };

  return (
    <Modal
      title="Детали SWIFT счёта"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      style={{ minWidth: "60%" }}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={() => setIsModalOpen(false)}>Закрыть</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} disabled={!data}>
            Редактировать
          </Button>
        </div>
      }
    >
      {data && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="SWIFT-code">
            {data.swift ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="BIC">
            {data.bic ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="IBAN">
            {data.iban ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Name">
            {data.name ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Country code">
            {data.countryCode ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Country name">
            {data.countryName ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Address">
            {data.address ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Correspond account">
            {data.correspondAccount ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="INN">
            {data.inn ?? "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Correspond bank">
            {data.correspondBank ?? "—"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

