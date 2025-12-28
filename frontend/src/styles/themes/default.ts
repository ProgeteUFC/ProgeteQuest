export const defaultTheme = {
  colors: {
    kingfisherDaisy: '#2c0383',
    indigo: '#4f4192',
    white: '#ffffff',
    primary: '#534bcf',
    primaryDark: '#2C0383', // Adicionei essa propriedade que estava faltando
    primaryLight: '#F9FAFB',
    secondary: '#4f4192',
    muted: '#c1c5cd',
    border: '#E5E7EB',
    xpBlue: '#3b82f6',
    challengeOrange: '#f97316',
    rewardGold: '#eab308',
    secondaryHover: '#e6c200'
  },
  fontSize: {
    p10: 10,
    p12: 12,
    p14: 14,
    m16: 16,
    m19: 19,
    g24: 24,
    g34: 34,
    g41: 41,
    g45: 45
  },
    typography: {
    // Títulos
    heading: {
      xl: '2.8125rem',   // 45px (g45)
      lg: '2.5625rem',    // 41px (g41)
      md: '2.125rem',     // 34px (g34)
      sm: '1.5rem',       // 24px (g24)
    },
    
    // Textos/Parágrafos
    text: {
      lead: '1.1875rem',  // 19px (m19)
      base: '1rem',       // 16px (m16)
      small: '0.875rem',  // 14px (p14)
      extraSmall: '0.75rem' // 12px (p12)
    },
    
    // Componentes UI
    ui: {
      button: '1rem',     // 16px (m16)
      label: '0.75rem',   // 12px (p12)
      input: '1rem'       // 16px (m16)
    },
    
    // Microtipografia
    micro: {
      tiny: '0.625rem'    // 10px (p10)
    }
  }
} as const; // <-- Note o 'as const' para tipos literais

export type ThemeType = typeof defaultTheme;