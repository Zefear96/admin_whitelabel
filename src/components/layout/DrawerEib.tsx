import React, { useContext, useState } from 'react';
import { Avatar, Button, Col, Divider, Drawer, List, Row } from 'antd';
import { AuthContext } from '../../store/AuthProvider';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import SwitchThemeEib from '../dataEntry/SwitchThemeEib';
import ButtonLogout from '../dataEntry/ButtonLogout';
import SwitchModeEib from '../dataEntry/SwitchModeEib';

interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div style={{ color: 'var(--color-text)' }}>
        <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{title}:</p>
        {content}
    </div>
);

export default function DrawerEib() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const { logout } = useAuth();
    const { colors } = useTheme();
    console.log(user?.roles)

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: 8
            }}>
                <div style={{
                    fontWeight: 'bold',
                    color: colors.primary
                }}>
                    {user?.firstName || "User"}
                </div>
                <Avatar
                    src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                    onClick={showDrawer}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: colors.primary
                    }}
                    size="large"
                />
            </div>
            <Drawer
                width={340}
                placement="right"
                closable={false}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        background: colors.background,
                        color: colors.text
                    },
                    header: {
                        background: colors.surface,
                        borderBottom: `1px solid ${colors.primary}`
                    }
                }}
            >
                <p style={{
                    marginBottom: 24,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: colors.primary
                }}>
                    Персональные данные
                </p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Имя" content={user?.firstName || "-"} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Фамилия" content={user?.secondName || "-"} />
                    </Col>
                </Row>
                <Divider style={{ borderColor: colors.surface }} />
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Роли" content={user?.roles} />
                    </Col>
                    {/* <Col span={12}>
                        <DescriptionItem title="Responsibilities" content="Coding" />
                    </Col> */}
                </Row>
                <Divider style={{ borderColor: colors.surface }} />
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Email" content={user?.email} />
                    </Col>
                </Row>
                <Divider style={{ borderColor: colors.surface }} />
                <p style={{
                    marginBottom: 24,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: colors.primary
                }}>
                    Настройки приложения
                </p>
                <p style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: "10px"
                }}>Тема</p>
                <Row>
                    <SwitchThemeEib />
                </Row>
                <Divider style={{ borderColor: colors.surface }} />
                <p style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: "10px"
                }}>Направление меню</p>
                <Row>
                    <SwitchModeEib />
                </Row>
                <Divider style={{ borderColor: colors.surface }} />
                <Row>
                    <ButtonLogout />
                </Row>
            </Drawer>
        </>
    );
}