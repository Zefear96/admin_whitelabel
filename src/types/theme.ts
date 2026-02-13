export type ThemeMode = 'light' | 'dark';
export type MenuMode =  'inline' | 'vertical';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  surface: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: string;
}

export interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: (factor: number) => string;
  toggleTheme: () => void;
  menuMode: MenuMode;
  toggleMenuMode: () => void;
}