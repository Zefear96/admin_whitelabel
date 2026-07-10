import { useEffect } from "react";
import type { ModalPropsType } from "../../../../types/components/modalPropsType";
import type {
  NotificationTemplateType,
  NotificationTemplateUpdatePayload,
} from "../../../../types/pushNotification/notificationTemplateType";
import { Button, Form, Input, Modal } from "antd";
import { NotificationTemplateContentBlockTypeEnum } from "../../../../types/pushNotification/notificationTemplateType";
import { useNotificationMessage } from "../../../../components/dataDisplay/NotificationMessage";
import { useUpdateNotificationTemplate } from "../../../../hooks/push-notification/useUpdateNotificationTemplate";

const { TextArea } = Input;

export default function NotificationTemplateModalUpdate({
  isModalOpen,
  setIsModalOpen,
  data,
}: ModalPropsType<NotificationTemplateType>) {
  const [form] = Form.useForm<NotificationTemplateUpdatePayload>();
  const { mutateAsync, isPending } = useUpdateNotificationTemplate();
  const { notify } = useNotificationMessage();

  useEffect(() => {
    if (isModalOpen && data) {
      form.setFieldsValue({
        titleRu: data.titleRu,
        titleKy: data.titleKy,
        titleEn: data.titleEn,
        bodyRu: data.bodyRu,
        bodyKy: data.bodyKy,
        bodyEn: data.bodyEn,
        contentBlocks: data.contentBlocks,
      });
    } else if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, data, form]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (!data?.id) return;

    try {
      const values = await form.validateFields();
      await mutateAsync({
        id: data.id,
        payload: {
          titleRu: values.titleRu,
          titleKy: values.titleKy,
          titleEn: values.titleEn,
          bodyRu: values.bodyRu,
          bodyKy: values.bodyKy,
          bodyEn: values.bodyEn,
          contentBlocks: values.contentBlocks?.length
            ? values.contentBlocks
            : data.contentBlocks?.length
              ? data.contentBlocks
              : [{ type: NotificationTemplateContentBlockTypeEnum.TEXT }],
        },
      });

      notify({
        type: "success",
        title: "Успешно",
        message: "Шаблон уведомления обновлён",
      });
      handleCancel();
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }

      notify({
        type: "error",
        title: "Ошибка",
        message: error?.message || "Не удалось обновить шаблон",
      });
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      title="Редактировать шаблон уведомления"
      style={{ minWidth: "60%" }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSubmit}
          loading={isPending}
          disabled={!data}
        >
          Сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: "150px" }}
        wrapperCol={{ flex: 1 }}
        labelAlign="left"
        style={{ marginTop: "30px" }}
      >
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
