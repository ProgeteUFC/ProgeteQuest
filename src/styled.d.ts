import 'styled-components';
import { ThemeType } from './styles/themes/default';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {
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