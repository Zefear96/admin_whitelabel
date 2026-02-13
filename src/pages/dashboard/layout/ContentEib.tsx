import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";

export default function ContentEib() {
    const { colors } = useTheme();
    return (
        <Content
            style={{
                margin: '24px 16px 0',
                overflow: 'initial',
                height: "100vh",
                background: colors.background,
                color: colors.text,
            }}>
            <Outlet />
        </Content>
    )
}