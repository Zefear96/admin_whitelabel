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
      primary: '#408ca5',
      secondary: '#fafafa',
      background: '#1d1d1d',
      text: '#f5f5f5',
      surface: '#aeaeb2',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '16px',
  },
  spacing: (factor: number) => `${8 * factor}px`,
};