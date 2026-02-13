import React, { useState } from 'react';
import { Badge, Button, List, Popover } from 'antd';
import { useTheme } from '../../hooks/useTheme';
import { BellOutlined } from '@ant-design/icons';



export default function PopoverNotif() {

    const [open, setOpen] = useState(false);
    const { colors } = useTheme();

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <Popover
            content={<a onClick={hide}><List /></a>}
            // title="Уведомления"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <a href="#"
                style={{
                    margin: "auto 20px",
                    display: "flex",
                    alignItems: "center",
                }}>
                <Badge count={5} color={colors.primary}
                    style={{
                        fontSize: 14
                    }}>
                    <BellOutlined style={{
                        color: colors.primary,
                    }}
                        height={34}
                        width={34} />
                </Badge>
            </a>
            {/* <List
                // dataSource={notifications}
                // locale={{ emptyText: "Нет уведомлений" }}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                        // title={item.title}
                        // description={item.description}
                        />
                    </List.Item>
                )}
            /> */}
        </Popover>
    )
}
