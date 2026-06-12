import type { ModalPropsType } from "../../../types/components/modalPropsType";
import type { NotificationTemplateUpsertPayload } from "../../../types/pushNotification/notificationTemplateType";
import { Button, Form, Input, Modal, Select } from "antd";
import {
  NotificationTemplateCategoryEnum,
  NotificationTemplateContentBlockTypeEnum,
} from "../../../types/pushNotification/notificationTemplateType";
import { useCreateNotificationTemplate } from "../../../hooks/push-notification/useCreateNotificationTemplate";
import { useNotificationMessage } from "../../../components/dataDisplay/NotificationMessage";

const { TextArea } = Input;

export default function NotificationTemplateModalCreate({
  isModalOpen,
  setIsModalOpen,
}: ModalPropsType<NotificationTemplateUpsertPayload>) {
  const [form] = Form.useForm<NotificationTemplateUpsertPayload>();
  const { mutateAsync, isPending } = useCreateNotificationTemplate();
  const { notify } = useNotificationMessage();

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await mutateAsync({
        ...values,
        contentBlocks: values.contentBlocks?.length
          ? values.contentBlocks
          : [{ type: NotificationTemplateContentBlockTypeEnum.TEXT }],
      });

      notify({
        type: "success",
        title: "Успешно",
        message: "Шаблон уведомления создан",
      });
      handleCancel();
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }

      notify({
        type: "error",
        title: "Ошибка",
        message: error?.message || "Не удалось создать шаблон",
      });
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      title="Добавить шаблон уведомления"
      style={{ minWidth: "60%" }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit} loading={isPending}>
          Сохранить
        </Button>,
      ]}
    >
      <Form form={form}  layout="horizontal" labelCol={{ flex: '150px' }} wrapperCol={{ flex: 1 }} labelAlign="left" style={{ marginTop: "30px" }}>
        <Form.Item label="Код" name="code" rules={[{ required: true, message: "Введите код" }]}>
          <Input placeholder="PAYMENT_SUCCESS" />
        </Form.Item>

        <Form.Item
          label="Категория"
          name="category"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Select
            options={Object.values(NotificationTemplateCategoryEnum).map((value) => ({
              label: value,
              value,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Название сервиса"
          name="serviceName"
          rules={[{ required: true, message: "Введите название сервиса" }]}
        >
          <Input placeholder="EIB_APP" />
        </Form.Item>

        <Form.Item
          label="Заголовок (RU)"
          name="titleRu"
          rules={[{ required: false, message: "Введите заголовок на русском" }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Заголовок (KY)"
          name="titleKy"
          rules={[{ required: false, message: "Введите заголовок на кыргызском" }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Заголовок (EN)"
          name="titleEn"
          rules={[{ required: false, message: "Введите заголовок на английском" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          label="Текст (RU)"
          name="bodyRu"
          rules={[{ required: true, message: "Введите текст на русском" }]}
        >
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Текст (KY)"
          name="bodyKy"
          rules={[{ required: true, message: "Введите текст на кыргызском" }]}
        >
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Текст (EN)"
          name="bodyEn"
          rules={[{ required: true, message: "Введите текст на английском" }]}
        >
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}