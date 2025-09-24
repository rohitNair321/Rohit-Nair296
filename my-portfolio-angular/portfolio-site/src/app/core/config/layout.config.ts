export interface LayoutConfig {
  appConfiguration: {
    type?: 'navbar' | 'sidebar';
    theme?: 'light' | 'dark';
    sidebarPosition?: 'right' | 'left';
    showSidebarToggle?: boolean;
    showAgentChat?: boolean;
    showUserProfileView?: boolean;
    collapsed?: boolean;
    isMobile: boolean;
    isFixed?: boolean;
  };
  theme: {
    name: 'theme-1' | 'theme-2' | 'theme-3' | 'theme-4' | 'theme-5';
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
  appConfiguration: {
    type: 'navbar', // or 'sidebar'
    theme: 'light',
    sidebarPosition: 'right',
    showSidebarToggle: false,
    showAgentChat: false,
    showUserProfileView: false,
    collapsed: false,
    isMobile: true,
    isFixed: true,
  },
  theme: {
    name: 'theme-1',
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