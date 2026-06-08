import { useEffect, useState } from 'react';
import { Button, Divider, Menu, Skeleton, Switch } from 'antd';
import eibIcon from '../../../assets/images/eib-icon.svg';
import { useAuth } from '../../../hooks/client/useAuth';
import { mapSectionsToMenuItems } from '../../../utils/mapSectionsToMenu';
import { useTheme } from '../../../hooks/useTheme';
import { fetchMenuSections } from '../../../services/fetchMenuSections';
import { filterEnabledSections } from '../../../utils/filterEnabledSections';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function SidebarEib() {
  const { user, logout } = useAuth();
  const { colors, mode, spacing, menuMode } = useTheme();
  const [current, setCurrent] = useState('1');
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const serverSections = await fetchMenuSections();
        const allowedSections = filterEnabledSections(serverSections);
        const mapped = mapSectionsToMenuItems(allowedSections);
        setItems(mapped);
        // setLoading(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [user]);

  if (loading) return (
    <Skeleton
      active
      style={{
        margin: spacing(2),
        background: colors.surface,
        padding: spacing(2)
      }}
    />
  );

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    backgroundColor: colors.background,
    color: colors.text,

  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: colors.text,
      backgroundColor: colors.secondary,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        justifyContent: "space-between",
        cursor: "pointer"
      }}
        onClick={() => navigate("/")}
      >
        <img src={eibIcon} alt="EIB Logo"
          style={{
            width: '48px',
            height: '48px',
            margin: "10px"
          }} />
        <p style={{
          color: "#408CA5",
          fontWeight: "600",
          fontSize: "24px"
        }}>EcoIslamic</p>
      </div>
      <div style={{
        width: "60%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
      </div>
      <Menu
        // style={{
        //   color: colors.text,
        //   backgroundColor: colors.background,
        //   height: "100vh",
        //   position: 'sticky',
        //   fontWeight: "600"

        // }}
        // style={siderStyle}
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        style={{
          marginTop: "20px",
          border: "none",
          background: colors.secondary,
          color: colors.text,
          minWidth: "250px",
        }}
        mode={menuMode}
        items={items}
        theme={mode}
        key={mode} // Force re-render on theme change
      // selectedKeys={[location.pathname]}
      />
      <Divider style={{ borderColor: colors.surface }} />
      <Button href='https://bitrix.ecoislamicbank.kg/'
        target="_blank"
        type="text"
        style={{
          height: "40px",
          color: colors.text,
          width: "calc(100% - 8px)",
          paddingLeft: "24px",
          margin: "4px",
          borderRadius: "8px",
          justifyContent: "start"
        }}>Войти в Битрикс
      </Button>
      <Button href='http://10.206.36.53:7777/gni/f?p=GLBL:101::::::'
        target="_blank"
        type="text"
        style={{
          height: "40px",
          color: colors.text,
          width: "calc(100% - 8px)",
          paddingLeft: "24px",
          margin: "4px",
          borderRadius: "8px",
          justifyContent: "start"
        }}>Войти в АБС
      </Button>
      <Button href='https://10.100.101.126:8443/cms/apps/cms-1.26.91/card.jsp?bank_c=06&groupc=01'
        target="_blank"
        type="text"
        style={{
          height: "40px",
          color: colors.text,
          width: "calc(100% - 8px)",
          paddingLeft: "24px",
          margin: "4px",
          borderRadius: "8px",
          justifyContent: "start"
        }}>Войти в МПЦ
      </Button>
      <Divider style={{ borderColor: colors.surface }} />
      <Button onClick={logout}
        type="text" block
        style={{
          height: "40px",
          color: colors.text,
          width: "calc(100% - 8px)",
          paddingLeft: "24px",
          margin: "4px",
          borderRadius: "8px",
          justifyContent: "start"
        }}>Выйти</Button>
    </div>
  );
}