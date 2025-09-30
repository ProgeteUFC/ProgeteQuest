import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      kingfisherDaisy: string;
      indigo: string;
      white: string;
      primary: string;
      primaryDark: string;
      primaryLight: string;
      secondary: string;
      muted: string;
      border: string;
      xpBlue: string;
      challengeOrange: string;
      rewardGold: string;
      secondaryHover: string;
    }
    fontSize: {
      p10: number;
      p12: number;
      p14: number;
      m16: number;
      m19: number;
      g24: number;
      g34: number;
      g41: number;
      g45: number;
    };

    typography: {
      heading: {
        xl: string;
        lg: string;
        md: string;
        sm: string;
      };
      text: {
        lead: string;
        base: string;
        small: string;
        extraSmall: string;
      };
      ui: {
        button: string;
        label: string;
        input: string;
      };
      micro: {
        tiny: string;
      };
    };
  }
}