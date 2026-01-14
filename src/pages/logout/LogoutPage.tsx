import { Result, Button, Typography, Space } from "antd";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/client/useAuth";

const { Text } = Typography;
export default function LogoutPage() {
    const {login} = useAuth();


    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%)",
            }}
        >
            <Result
                status="success"
                title="Вы успешно вышли из системы"
                subTitle="Ваша сессия завершена. Для продолжения работы войдите снова."
                icon={<LogoutOutlined style={{ color: "#1677ff" }} />}
                extra={
                    <Space direction="vertical" size="middle">
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            size="large"
                            onClick={login}
                        >
                            Войти снова
                        </Button>

                        
                    </Space>
                }
            />
        </div>
    )
}