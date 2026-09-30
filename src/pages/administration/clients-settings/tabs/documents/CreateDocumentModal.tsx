import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select, Upload } from "antd";
import type { UploadFile } from "antd";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useNotificationMessage } from "../../../../../components/dataDisplay/NotificationMessage";
import { useCreateDocument } from "../../../../../hooks/document-service/useCreateDocument";
import { DOCUMENT_TYPE_LABELS, type DocumentRequestType } from "../../../../../types/documentService/documentType";

interface CreateDocumentModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

type CreateDocumentForm = {
    type: DocumentRequestType["type"];
};

const DOCUMENT_TYPE_OPTIONS = (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentRequestType["type"][]).map((value) => ({
    value,
    label: DOCUMENT_TYPE_LABELS[value],
}));

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || fallback;
};

export default function CreateDocumentModal({ isModalOpen, setIsModalOpen }: CreateDocumentModalProps) {
    const [form] = Form.useForm<CreateDocumentForm>();
    const [file, setFile] = useState<File | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { mutateAsync, isPending } = useCreateDocument();
    const { notify } = useNotificationMessage();

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFile(null);
        setFileList([]);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!file) {
                notify({
                    type: "error",
                    title: "Ошибка",
                    message: "Выберите файл документа",
                });
                return;
            }

            await mutateAsync({
                type: values.type,
                document: { file },
            });

            notify({
                type: "success",
                title: "Успешно",
                message: "Документ успешно загружен",
            });
            handleCancel();
        } catch (error) {
            if (typeof error === "object" && error !== null && "errorFields" in error) {
                return;
            }

            notify({
                type: "error",
                title: "Ошибка",
                message: getErrorMessage(error, "Не удалось загрузить документ"),
            });
        }
    };

    return (
        <Modal open={isModalOpen} onCancel={handleCancel} title="Загрузить документ" footer={null}>
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: "80px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="left"
                style={{ marginTop: "20px" }}
            >
                <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Выберите тип документа" }]}>
                    <Select placeholder="Выберите тип" options={DOCUMENT_TYPE_OPTIONS} />
                </Form.Item>
            </Form>

            <Upload.Dragger
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
                <p className="ant-upload-text">Перетащите файл сюда или нажмите для выбора</p>
            </Upload.Dragger>

            <div style={{ textAlign: "right", marginTop: 24 }}>
                <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                    Отмена
                </Button>
                <Button type="primary" onClick={handleSubmit} loading={isPending}>
                    Загрузить
                </Button>
            </div>
        </Modal>
    );
}
