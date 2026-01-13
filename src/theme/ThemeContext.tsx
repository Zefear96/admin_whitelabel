// src/theme/ThemeContext.tsx
import React, { useEffect, useState, useMemo } from 'react';
import type { ReactNode } from "react";
import type { ThemeMode, MenuMode } from '../types/theme';
import { ThemeContext } from '../hooks/useTheme';
import { themeConfig } from './themeConfig';

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
      {children}
    </ThemeContext.Provider>
  );
};
