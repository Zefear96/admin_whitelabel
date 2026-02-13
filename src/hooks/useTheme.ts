import { createContext, useContext } from "react";
import type { ThemeContextType } from "../types/theme";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};