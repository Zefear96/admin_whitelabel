import { InboxOutlined } from "@ant-design/icons";
import { Button, Modal, Upload } from "antd";
import type { UploadFile } from "antd";
import { useState } from "react";
import useNotificationMessage from "../../../../components/dataDisplay/NotificationMessage";
import { useImportCountries } from "../../../../hooks/dictionary/country/useImportCountries";

interface ImportCountriesModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function ImportCountriesModal({ isModalOpen, setIsModalOpen }: ImportCountriesModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { mutateAsync, isPending } = useImportCountries();
    const { notify } = useNotificationMessage();

    const handleCancel = () => {
        setIsModalOpen(false);
        setFile(null);
        setFileList([]);
    };

    const handleSubmit = async () => {
        if (!file) {
            notify({
                type: "error",
                title: "Ошибка",
                message: "Выберите Excel-файл со странами",
            });
            return;
        }

        try {
            await mutateAsync(file);

            notify({
                type: "success",
                title: "Успешно",
                message: "Страны успешно импортированы",
            });

            handleCancel();
        } catch (error: unknown) {
            notify({
                type: "error",
                title: "Ошибка",
                message: error instanceof Error ? error.message : "Не удалось импортировать страны",
            });
        }
    };

    return (
        <Modal
            title="Импорт стран"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Upload.Dragger
                accept=".xlsx,.xls"
                beforeUpload={(selectedFile) => {
                    setFile(selectedFile);
                    setFileList([selectedFile]);
                    return false;
                }}
                fileList={fileList}
                maxCount={1}
                onRemove={() => {
                    setFile(null);
                    setFileList([]);
                    return true;
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Перетащите Excel-файл сюда или нажмите для выбора
                </p>
                <p className="ant-upload-hint">
                    Поддерживаются файлы .xlsx и .xls
                </p>
            </Upload.Dragger>

            <div style={{ textAlign: "right", marginTop: 24 }}>
                <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                    Отмена
                </Button>
                <Button type="primary" onClick={handleSubmit} loading={isPending}>
                    Импортировать
                </Button>
            </div>
        </Modal>
    )
}
