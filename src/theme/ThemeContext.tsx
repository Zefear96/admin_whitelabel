// src/theme/ThemeContext.tsx
import { useEffect, useState, useMemo } from 'react';
import type { ReactNode } from "react";
import { ConfigProvider } from 'antd';
import type { ThemeMode, MenuMode } from '../types/theme';
import { ThemeContext } from '../hooks/useTheme';
import { themeConfig, getAntdTheme } from './themeConfig';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';

    const stored = window.localStorage.getItem('theme') as ThemeMode | null;
    return stored === 'dark' ? 'dark' : 'light';
  });

  const [menuMode, setMenuMode] = useState<MenuMode>(() => {
    if (typeof window === 'undefined') return 'inline';

    const stored = window.localStorage.getItem('menuMode') as MenuMode | null;
    return stored === 'inline' ? 'inline' : 'vertical';
  });

  const theme = useMemo(() => ({
    mode: themeMode,
    colors: themeConfig.colors[themeMode],
    typography: themeConfig.typography,
    spacing: themeConfig.spacing,
    menuMode,
    toggleTheme: () => {
      setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    },
    toggleMenuMode: () => {
      setMenuMode((prev) => prev === 'vertical' ? 'inline' : 'vertical');
    }
  }), [themeMode, menuMode]);

  useEffect(() => {
    window.localStorage.setItem('theme', themeMode);
    document.body.setAttribute('data-theme', themeMode);

    // Apply CSS variables
    const root = document.documentElement;

    // Переключаем класс `dark`, чтобы активировались :root.dark переменные
    root.classList.toggle('dark', themeMode === 'dark');

    const themeColors = themeConfig.colors[themeMode];
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    Object.entries(themeConfig.typography).forEach(([key, value]) => {
      root.style.setProperty(`--typography-${key}`, value);
    });
  }, [themeMode]);

  useEffect(() => {
    window.localStorage.setItem('menuMode', menuMode);
  }, [menuMode]);

  return (
    <ThemeContext.Provider value={theme}>
      <ConfigProvider theme={getAntdTheme(themeMode)}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
