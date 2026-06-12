import { EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Modal } from "antd";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import type { CountryType } from "../../../../types/dictionary/countryType";

interface DetailsCountryModalProps extends ModalPropsType<CountryType> {
    onEditClick: () => void;
}

export default function DetailsCountryModal({
    isModalOpen,
    setIsModalOpen,
    data,
    onEditClick,
}: DetailsCountryModalProps) {
    const handleEdit = () => {
        setIsModalOpen(false);
        onEditClick();
    };

    return (
        <Modal
            title="Детали страны"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} disabled={!data}>
                        Редактировать
                    </Button>
                </div>
            }
        >
            {data && (
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Наименование">
                        {data.name ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="ISO-код">
                        {data.code ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Код">
                        {data.litCode ?? "-"}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    )
}
