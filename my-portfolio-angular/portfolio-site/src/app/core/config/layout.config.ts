export interface LayoutConfig {
  navigation: {
    type?: 'navbar' | 'sidebar';
    theme?: 'light' | 'dark';
    sidebarPosition?: 'right' | 'left';
    collapsed?: boolean;
    isMobile: boolean;
    isFixed?: boolean;
  };
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    darkMode: boolean;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };
}

export const defaultConfig: LayoutConfig = {
  navigation: {
    type: 'navbar', // or 'sidebar'
    theme: 'light',
    sidebarPosition: 'right',
    collapsed: false,
    isMobile: true,
    isFixed: true,
  },
  theme: {
    primary: '#2563eb',
    secondary: '#4f46e5',
    background: '#ffffff',
    text: '#1f2937',
    darkMode: false
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Inter', sans-serif"
  }
};