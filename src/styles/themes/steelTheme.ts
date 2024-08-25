import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const steelTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#1A242F", // Dark steel for main background
      "#253141", // Slightly lighter dark steel for secondary backgrounds
      "#2F3D4E", // Darker steel for accents
      "#394958", // Medium steel for UI elements like borders
      "#445564", // Lighter steel for hover states
      "#516276", // Main steel for active states
      "#394958", // Repeating for consistency
      "#A3B0C3", // Light steel for emphasized text
      "#C0CFDE", // Light steel for text
      "#E0E6ED", // Light neutral steel for text
    ],
    secondary: [
      "#C0A96A", // Muted gold for highlights and accents
      "#A4884D", // Deep gold for active states
      "#876A32", // Warm brown-gold for emphasis
      "#6A4E20", // Dark brown-gold for strong accents
      "#523F14", // Dark steel-brown for background highlights
      "#E53E3E", // Bright red for errors or warnings
      "#DD6B20", // Warm orange for alerts
      "#4F83A5", // Cool steel blue for informational accents
      "#3A6E91", // Darker steel blue for emphasis
      "#2B5770", // Dark steel blue for important text
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main steel shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#2F3D4E", // Darker steel for top bar
    logoTextColor: "#394958", // Medium steel for UI elements like borders
    filterBarBackground: "#1A242F", // Dark steel background for filter bar
    hitBackground: "#253141", // Dark steel for card backgrounds
    hitBorder: "#2F3D4E", // Dark steel border for cards
    hitRewardColor: "#4CAF50", // Strong green for rewards
    hourlyRateColors: [
      "#ff999950", // Soft pastel red for low hourly rates
      "#ffb3b350", // Light pastel pink for slightly higher rates
      "#ffcc9950", // Soft pastel orange for mid-low rates
      "#ffcc8050", // Soft pastel coral for lower-mid rates
      "#ffeb9950", // Pastel orange-yellow for mid rates
      "#fff1b350", // Soft pastel yellow for mid-high rates
      "#d4f5d450", // Light pastel green for high rates
      "#a8e5a850", // Soft pastel green for good rates
      "#85d98550", // Gentle pastel green for very good rates
      "#6bcf6b50", // Subtle pastel green for the best rates
    ],
    hitStatus: {
      submitted: "#4F83A5", // Cool steel blue for submitted status
      approved: "#4CAF50", // Strong green for approved status
      paid: "#4CAF50", // Strong green for paid status
      rejected: "#E53E3E", // Vivid red for rejected status
      pending: "#F6AD55", // Warm orange for pending status
    },
    earningsPanelBackground: "#1A242F", // Dark steel background for earnings panel
    earningsPanelTextColor: "#E0E6ED", // Light neutral text in the earnings panel
    chartPositiveColor: "#4CAF50", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#4F83A5", // Steel blue for neutral data points (total earnings)
    buttonColor: "#4F83A5", // Cool steel blue for buttons
    buttonHoverColor: "#3A6E91", // Darker steel blue for hover state
    buttonActiveColor: "#2B5770", // Even darker steel blue for active state
    okButtonColor: "#4F83A5", // Steel blue for OK buttons
    okButtonHoverColor: "#3A6E91", // Darker steel blue for hover state
    okButtonActiveColor: "#2B5770", // Even darker steel blue for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#C0A96A", // Muted gold for favorite icon
    turkerView: {
      danger: "#E53E3E", // Red for 'danger' class
      warning: "#DD6B20", // Orange for 'warning' class
      success: "#4CAF50", // Green for 'success' class
      muted: "#CBD2D9", // Gray for 'muted' class
    },
  },
  fontFamily: "Roboto, sans-serif",
  fontSizes: {
    xxs: "0.25rem",
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
  black: "#FFFFFF", // Inverted to white for dark mode text
  white: "#1A242F", // Dark steel background
  spacing: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem",
  },
  components: {
    Card: {
      styles: (theme: Theme) => ({
        root: {
          backgroundColor: theme.colors.primary[0], // Dark steel background
          color: theme.colors.primary[9], // Light neutral text for readability
          borderColor: theme.colors.primary[2], // Subtle steel border for cards
        },
      }),
    },
    Button: {
      styles: (theme: Theme) => ({
        root: {
          backgroundColor: theme.other.buttonColor,
          color: theme.black,
          "&:hover": {
            backgroundColor: theme.other.buttonHoverColor,
          },
          "&:active": {
            backgroundColor: theme.other.buttonActiveColor,
          },
        },
      }),
    },
    Title: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[8], // Light steel for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Light steel for text
        },
      }),
    },
  },
};
