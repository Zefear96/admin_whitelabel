import { Button } from "antd";
import { useTheme } from "../../hooks/useTheme";

export default function ButtonLogin() {
    const {colors} = useTheme();
    
    return (
        <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{
                background: colors.primary
            }}
            >
            Войти
        </Button>
    )
}