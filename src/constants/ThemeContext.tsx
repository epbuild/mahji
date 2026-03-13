import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/*
 * DARK MODE — PRESERVED BUT DISABLED
 * To re-enable dark mode:
 * 1. Restore the useState default to read from localStorage (see below)
 * 2. Restore the toggle function to actually switch themes
 * 3. Re-add <ModeToggle /> to DesktopHeader and MobileHeader in Layout.tsx
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light mode — dark mode infrastructure preserved in colors.ts
  // Original: (localStorage.getItem('mahji-theme-v2') as Theme) || 'dark'
  const [theme] = useState<Theme>('light');

  const isDark = false; // hardcoded light

  // Toggle is a no-op while dark mode is disabled
  const toggle = () => {};

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
