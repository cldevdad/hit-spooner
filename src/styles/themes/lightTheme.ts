import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const lightTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#F5F7FA", // Light neutral background
      "#E1E5EA", // Soft gray for secondary backgrounds
      "#CBD2D9", // Lighter gray for accents
      "#9AA5B1", // Medium gray for UI elements like borders
      "#7B8794", // Darker gray for hover states
      "#616E7C", // Main primary gray for active states
      "#9AA5B1",
      "#3E4C59", // Darker gray for headings or emphasized text
      "#323F4B", // Dark gray for text
      "#1F2933", // Deep gray for important text
    ],
    secondary: [
      "#F0B429", // Modern warm yellow for accents
      "#D69E2E", // Slightly deeper yellow for active states
      "#B7791F", // Warm brown-yellow for emphasis
      "#975A16", // Deeper brown for highlights
      "#744210", // Dark brown for strong accents
      "#E53E3E", // Bright red for errors or warnings
      "#DD6B20", // Warm orange for alerts
      "#3182CE", // Cool blue for informational accents
      "#2B6CB0", // Deeper blue for emphasis
      "#2C5282", // Dark blue for important text
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main gray shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#7B8794", // Medium gray for top bar
    logoTextColor: "#9AA5B1", // Medium gray for UI elements like borders
    filterBarBackground: "#F5F7FA", // Light neutral background for filter bar
    hitBackground: "#E1E5EA", // Soft gray for card backgrounds
    hitBorder: "#CBD2D9", // Light gray border for cards
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
    earningsPanelBackground: "#F7FAFC", // Light neutral background for earnings panel
    earningsPanelTextColor: "#1F2933", // Deep gray for text in the earnings panel
    chartPositiveColor: "#48BB78", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#2B6CB0", // Blue for neutral data points (total earnings)
    buttonColor: "#3182CE", // Cool blue for buttons
    buttonHoverColor: "#2B6CB0", // Darker blue for hover state
    buttonActiveColor: "#2C5282", // Even darker blue for active state
    okButtonColor: "#2B6CB0", // Blue for OK buttons
    okButtonHoverColor: "#2C5282", // Darker blue for hover state
    okButtonActiveColor: "#1E3A8A", // Even darker blue for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#F0B429", // Warm yellow color for favorite icon
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
  black: "#1F2933", // Deep gray for text
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
          backgroundColor: theme.colors.primary[0], // Light neutral background
          color: theme.colors.primary[9], // Darker gray text for readability
          borderColor: theme.colors.primary[2], // Subtle gray border for cards
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
          color: theme.colors.primary[8], // Darker gray for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Darker gray for text
        },
      }),
    },
  },
};
