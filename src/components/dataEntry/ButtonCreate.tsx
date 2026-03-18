import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface ButtonCreateProps {
    title: string;
    onClick: () => void;
}

export default function ButtonCreate({ title, onClick }: ButtonCreateProps) {
    return (
        <Button variant="solid" color="cyan" onClick={onClick}>
            {title} <PlusCircleOutlined />
        </Button>
    );
} 