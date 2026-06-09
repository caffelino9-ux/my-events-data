// Premium Coffee Theme Design System

export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    cream: '#F7F1E8',
    creamLight: '#FAF8F4',
    darkCream: '#F0E8DB',

    // Coffee Browns
    coffeeDark: '#2C1810',
    coffeeMedium: '#6F4E37',
    coffeeLight: '#9B7653',
    coffeeLighter: '#D4A574',

    // Accents
    gold: '#D4AF37',
    goldLight: '#E8C547',
    goldDark: '#B8860B',

    // Status Colors
    success: '#4CAF50',
    successLight: '#E8F5E9',
    warning: '#FF9800',
    warningLight: '#FFF3E0',
    error: '#F44336',
    errorLight: '#FFEBEE',
    info: '#2196F3',
    infoLight: '#E3F2FD',

    // Neutral
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',

    // Transparent variations
    coffeeOverlay: 'rgba(44, 24, 16, 0.8)',
    goldOverlay: 'rgba(212, 175, 55, 0.1)',
  },

  // Gradients
  gradients: {
    primaryGradient: 'linear-gradient(135deg, #6F4E37 0%, #9B7653 100%)',
    goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #E8C547 100%)',
    accentGradient: 'linear-gradient(135deg, #6F4E37 0%, #D4AF37 100%)',
    darkGradient: 'linear-gradient(135deg, #2C1810 0%, #6F4E37 100%)',
  },

  // Typography
  typography: {
    fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    fontFamilyMono: "'Monaco', 'Courier New', monospace",

    // Font Sizes
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },

    // Font Weights
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    // Line Heights
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // Spacing
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    base: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(44, 24, 16, 0.05)',
    base: '0 1px 3px 0 rgba(44, 24, 16, 0.1), 0 1px 2px 0 rgba(44, 24, 16, 0.06)',
    md: '0 4px 6px -1px rgba(44, 24, 16, 0.1), 0 2px 4px -1px rgba(44, 24, 16, 0.06)',
    lg: '0 10px 15px -3px rgba(44, 24, 16, 0.1), 0 4px 6px -2px rgba(44, 24, 16, 0.05)',
    xl: '0 20px 25px -5px rgba(44, 24, 16, 0.1), 0 10px 10px -5px rgba(44, 24, 16, 0.04)',
    '2xl': '0 25px 50px -12px rgba(44, 24, 16, 0.25)',
    none: 'none',
  },

  // Z-Index
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    slowest: '700ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Component Sizes
  componentSizes: {
    sidebarWidth: '280px',
    sidebarWidthCollapsed: '80px',
    headerHeight: '72px',
    cardPadding: '24px',
    containerMaxWidth: '1400px',
  },
};

export type Theme = typeof theme;
