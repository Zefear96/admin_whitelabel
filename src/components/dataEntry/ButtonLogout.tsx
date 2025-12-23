import { Button } from "antd";
import { useAuth } from "../../hooks/client/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function ButtonLogout() {
    const { logout } = useAuth();
    const { colors } = useTheme();

    return (
        <Button
            onClick={logout}
            size="large"
            style={{
                background: colors.primary,
                color: 'white'
            }}
        >
            Выйти
        </Button>
    )
}