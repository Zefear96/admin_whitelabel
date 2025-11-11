// src/theme/ThemeContext.tsx
import React, { useEffect, useState, useMemo } from 'react';
import type { ReactNode } from "react";
import type { ThemeMode } from '../types/theme';
import { ThemeContext } from '../hooks/useTheme';
import { themeConfig } from './themeConfig';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [menuMode, setMenuMode] = useState<'vertical' | 'inline'>('inline');

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
    localStorage.setItem('theme', themeMode);
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

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
