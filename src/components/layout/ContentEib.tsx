import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

export default function ContentEib() {
    return (
        <Content
            style={{
                margin: '24px 16px 0',
                overflow: 'initial',
                height: "100vh",
                background: "#fff",
            }}>
            <Outlet />
        </Content>
    )
}