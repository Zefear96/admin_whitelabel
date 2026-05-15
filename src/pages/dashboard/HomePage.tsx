import { Card, Divider } from "antd";
import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import HeaderEib from "./layout/HeaderEib";
import SidebarEib from "./layout/SidebarEib";
import { useTheme } from "../../hooks/useTheme";
import { Outlet } from "react-router-dom";
import { mapSectionsToRoutes } from "../../utils/mapSectionsToRoutes";
import { fetchMenuSections } from "../../services/fetchMenuSections";
import type { SectionMenuType } from "../../types/sections";
import ContentEib from "./layout/ContentEib";
import { ENV } from "../../config/env";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

export default function HomePage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { colors } = useTheme();
  const [sections, setSection] = useState<SectionMenuType[]>([]);
  const appVersion = import.meta.env.VITE_APP_VERSION;

  useEffect(() => {
    fetchMenuSections().then((data) => setSection(data));
  }, []);


  return (
    <Layout hasSider>
      <SidebarEib />
      <Layout style={{
        background: colors.secondary
      }}>
        <HeaderEib />
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
            background: colors.background,
            borderRadius: borderRadiusLG,
            padding: "20px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}>
          <Outlet />
        </Content>
        {/* <ContentEib /> */}
        <Footer
          style={{
            textAlign: 'center',
          }}>
          <p style={{
            fontWeight: 600,
            color: colors.primary
          }}>ЭкоИсламикБанк ©{new Date().getFullYear()}
          </p>
          <p style={{
            color: colors.primary,
            fontSize: "12px",
            textAlign: "center",
          }}>{ENV.APP_NAME} v{ENV.APP_VERSION === "dev" ? "dev" : `${ENV.APP_VERSION}`}</p>
        </Footer>
      </Layout>
    </Layout>
  )
}