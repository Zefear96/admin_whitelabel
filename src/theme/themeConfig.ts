import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { ThemeMode } from '../types/theme';

export const themeConfig = {
  colors: {
    light: {
      primary: '#4a99b0',
      secondary: '#f5f5f5',
      background: '#ffffff',
      text: '#212121',
      surface: '#f5f5f5',
    },
    dark: {
      primary: '#4a99b0',
      // Глубокий фон страницы / внешнего layout
      secondary: '#171717',
      // Основной фон контента
      background: '#212121',
      text: '#ececf1',
      // Поверхности (карточки, шапка drawer, разделители)
      surface: '#2f2f2f',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '16px',
  },
  spacing: (factor: number) => `${8 * factor}px`,
};

/**
 * Конфигурация темы Ant Design.
 * Без ConfigProvider компоненты antd (Table, Card, Modal, Menu, Drawer)
 * остаются светлыми независимо от выбранного режима, поэтому переключаем
 * algorithm и прокидываем токены, синхронизированные с CSS‑переменными.
 */
export const getAntdTheme = (mode: ThemeMode): ThemeConfig => {
  const isDark = mode === 'dark';

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#4a99b0',
      fontFamily: themeConfig.typography.fontFamily,
      borderRadius: 8,
      ...(isDark
        ? {
            colorBgBase: '#212121',
            colorBgContainer: '#2f2f2f',
            colorBgElevated: '#2f2f2f',
            colorBgLayout: '#171717',
            colorText: '#ececf1',
            colorTextSecondary: '#b4b4b4',
            colorTextTertiary: '#8e8e8e',
            colorTextQuaternary: '#676767',
            colorBorder: 'rgba(255, 255, 255, 0.15)',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.10)',
          }
        : {}),
    },
    components: {
      Layout: isDark
        ? {
            headerBg: '#171717',
            siderBg: '#171717',
            bodyBg: '#212121',
            footerBg: '#171717',
            triggerBg: '#2f2f2f',
          }
        : {
            headerBg: '#f5f5f5',
            siderBg: '#ffffff',
            bodyBg: '#ffffff',
          },
      Menu: isDark
        ? {
            itemBg: 'transparent',
            itemColor: '#ececf1',
            itemHoverBg: '#3a3a3a',
            itemSelectedBg: '#424242',
            itemSelectedColor: '#ffffff',
            subMenuItemBg: 'transparent',
          }
        : {},
      Card: isDark
        ? {
            colorBgContainer: '#2f2f2f',
            headerBg: '#2f2f2f',
          }
        : {},
      Table: isDark
        ? {
            headerBg: '#2f2f2f',
            headerColor: '#ececf1',
            rowHoverBg: '#3a3a3a',
            colorBgContainer: '#2f2f2f',
            borderColor: 'rgba(255, 255, 255, 0.10)',
          }
        : {},
      Modal: isDark
        ? {
            contentBg: '#2f2f2f',
            headerBg: '#2f2f2f',
            footerBg: '#2f2f2f',
          }
        : {},
      Drawer: isDark
        ? {
            colorBgElevated: '#212121',
          }
        : {},
    },
  };
};
