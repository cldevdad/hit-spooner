import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string[];
      secondary: string[];
    };
    primaryColor: string;
    primaryShade: number;
    headings: {
      fontFamily: string;
      fontWeight: string;
    };
    other: {
      topBarBackground: string;
      logoTextColor: string;
      filterBarBackground: string;
      hitBackground: string;
      hitBorder: string;
      hitRewardColor: string;
      hourlyRateColors: string[];
      buttonColor: string;
      buttonHoverColor: string;
      buttonActiveColor: string;
      okButtonColor: string;
      okButtonHoverColor: string;
      okButtonActiveColor: string;
      negativeButtonColor: string;
      negativeButtonHoverColor: string;
      negativeButtonActiveColor: string;
      favoriteIcon: string;
      earningsPanelBackground: string;
      earningsPanelTextColor: string;
      chartPositiveColor: string;
      chartNegativeColor: string;
      chartNeutralColor: string;
      hitStatus: {
        submitted: string;
        approved: string;
        rejected: string;
        pending: string;
        paid: string;
      };
      turkerView: {
        danger: string;
        warning: string;
        success: string;
        muted: string;
      };
    };
    fontFamily: string;
    fontSizes: {
      xxs: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    black: string;
    white: string;
    spacing: {
      xxs: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    components: {
      Card: {
        styles: (theme: Theme) => any;
      };
      Button: {
        styles: (theme: Theme) => any;
      };
      Title: {
        styles: (theme: Theme) => any;
      };
      Text: {
        styles: (theme: Theme) => any;
      };
    };
  }
}
