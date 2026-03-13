import { RollbackOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function ButtonBack() {
    const navigate = useNavigate();

    return (
        <Button style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
            Назад <RollbackOutlined />
        </Button>
    )
}