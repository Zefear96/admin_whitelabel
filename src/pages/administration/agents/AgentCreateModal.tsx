import { Button, Form, Input, Modal, Switch } from "antd";
import type { AgentType } from "../../../types/dictionary/agentType";
import { useCreateAgent } from "../../../hooks/dictionary/agent/useCreateAgent";
import { useAuth } from "../../../hooks/client/useAuth";
import Popconfirm from "../../../components/dataDisplay/Popconfirm";
import { useNotificationMessage } from "../../../components/dataDisplay/NotificationMessage";
import type { ModalPropsType } from "../../../types/components/modalPropsType";

export default function AgentCreateModal({ isModalOpen, setIsModalOpen }: ModalPropsType<AgentType>) {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useCreateAgent();
  const { user } = useAuth();
  const { notify } = useNotificationMessage();

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: AgentType = {
        id: "",
        code: values.code,
        agent: values.agent,
        bic: values.bic,
        bankAccount: values.bankAccount,
        logoUrl: values.logoUrl,
        isActive: values.isActive,
        changedBy: user?.name ?? "",
        changeDate: new Date().toISOString(),
      };

      await mutateAsync(payload);

      notify({
        type: "success",
        title: "Успешно",
        message: "Агент успешно создан",
      });

      handleCancel();
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }

      notify({
        type: "error",
        title: "Ошибка",
        message: error?.message || "Не удалось создать агента",
      });
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      title="Создание агента"
      style={{ minWidth: "40%" }}
      footer={null}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: "110px" }}
        wrapperCol={{ flex: 1 }}
        labelAlign="left"
        style={{ marginTop: "20px" }}
      >
        <Form.Item
          label="Имя агента"
          name="agent"
          rules={[{ required: true, message: "Введите наименование агента" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Код агента"
          name="code"
          rules={[{ required: true, message: "Введите код агента" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="БИК"
          name="bic"
          rules={[{ required: true, message: "Введите BIC" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Счет"
          name="bankAccount"
          rules={[{ required: true, message: "Введите счёт" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Logo"
          name="logoUrl"
          rules={[{ required: false, message: "Введите адрес ссылки логотипа" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Активен"
          name="isActive"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Да" unCheckedChildren="Нет" />
        </Form.Item>
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
        <Button onClick={handleCancel}>
          Отмена
        </Button>
        <Popconfirm
          title="Создать агента?"
          onConfirm={handleOk}
          okButtonProps={{ loading: isPending }}
        >
          <Button type="primary">
            Сохранить
          </Button>
        </Popconfirm>
      </div>
    </Modal>
  );
}