import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const purpleTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#F8F0FF", // Very light lavender for background
      "#F0E0FF", // Light lavender for secondary backgrounds
      "#D8B3FF", // Soft lavender for accents
      "#BF88FF", // Medium lavender for UI elements like borders
      "#A659FF", // Darker lavender for hover states
      "#8D2BFF", // Main primary purple for active states
      "#F0E0FF",
      "#6A22B3", // Darker purple for headings or emphasized text
      "#551A88", // Deep purple for text
      "#42166B", // Very deep purple for important text
    ],
    secondary: [
      "#A659FF", // Light lavender for accents
      "#8D2BFF", // Slightly deeper lavender for active states
      "#6A22B3", // Soft purplish-brown for emphasis
      "#551A88", // Deeper purplish-brown for highlights
      "#42166B", // Dark purple for strong accents
      "#E53E3E", // Bright red for errors or warnings
      "#DD6B20", // Warm orange for alerts
      "#3182CE", // Cool blue for informational accents
      "#2B6CB0", // Deeper blue for emphasis
      "#2C5282", // Dark blue for important text
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main purple shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#8D2BFF", // Darker purple for the top bar
    logoTextColor: "#A659FF", // Medium lavender for UI elements like borders
    filterBarBackground: "#F8F0FF", // Light lavender background for the filter bar
    hitBackground: "#F0E0FF", // Light lavender for card backgrounds
    hitBorder: "#D8B3FF", // Light lavender border for cards
    hitRewardColor: "#48BB78", // Strong green
    hourlyRateColors: [
      "#ffd1d160", // Soft pastel red for low hourly rates
      "#ffb3b360", // Light pastel pink for slightly higher rates
      "#ff999960", // Softer pastel pink for mid-low rates
      "#ff808060", // Soft pastel coral for lower-mid rates
      "#ffe0b360", // Pastel orange-yellow for mid rates
      "#fff7b360", // Soft pastel yellow for mid-high rates
      "#d4f5d460", // Light pastel green for high rates
      "#a8e5a860", // Soft pastel green for good rates
      "#85d98560", // Gentle pastel green for very good rates
      "#6bcf6b60", // Subtle pastel green for the best rates
    ],
    hitStatus: {
      submitted: "#3182CE", // Cool blue for submitted status
      approved: "#48BB78", // Strong green for approved status
      paid: "#48BB78", // Strong green for paid status
      rejected: "#E53E3E", // Vivid red for rejected status
      pending: "#F6AD55", // Warm orange for pending status
    },
    earningsPanelBackground: "#F8F0FF", // Light lavender background for the earnings panel
    earningsPanelTextColor: "#42166B", // Deep purple for text in the earnings panel
    chartPositiveColor: "#48BB78", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#3182CE", // Blue for neutral data points (total earnings)
    buttonColor: "#8D2BFF", // Bright purple for buttons
    buttonHoverColor: "#6A22B3", // Darker purple for hover state
    buttonActiveColor: "#551A88", // Even darker purple for active state
    okButtonColor: "#8D2BFF", // Bright purple for OK buttons
    okButtonHoverColor: "#6A22B3", // Darker purple for hover state
    okButtonActiveColor: "#551A88", // Even darker purple for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#A659FF", // Light lavender color for the favorite icon
    turkerView: {
      danger: "#E53E3E", // Red for 'danger' class
      warning: "#DD6B20", // Orange for 'warning' class
      success: "#48BB78", // Green for 'success' class
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
  black: "#42166B", // Deep purple for text
  white: "#FFFFFF", // White background
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
          backgroundColor: theme.colors.primary[0], // Light lavender background
          color: theme.colors.primary[9], // Deep purple text for readability
          borderColor: theme.colors.primary[2], // Subtle purple border for cards
        },
      }),
    },
    Button: {
      styles: (theme: Theme) => ({
        root: {
          backgroundColor: theme.other.buttonColor,
          color: theme.white,
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
          color: theme.colors.primary[8], // Deep purple for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Darker purple for text
        },
      }),
    },
  },
};
