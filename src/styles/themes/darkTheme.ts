import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const darkTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#1F2933", // Deep gray background
      "#323F4B", // Dark gray for secondary backgrounds
      "#3E4C59", // Darker gray for accents
      "#52606D", // Medium gray for UI elements like borders
      "#616E7C", // Lighter gray for hover states
      "#7B8794", // Main primary gray for active states
      "#3E4C59", // Soft gray for important buttons
      "#CBD2D9", // Lighter gray for emphasized text
      "#E1E5EA", // Light gray for text
      "#F5F7FA", // Light neutral text
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
    topBarBackground: "#3E4C59", // Darker gray for top bar
    logoTextColor: "#52606D", // Medium gray for UI elements like borders
    filterBarBackground: "#1F2933", // Dark neutral background for filter bar
    hitBackground: "#323F4B", // Dark gray for card backgrounds
    hitBorder: "#3E4C59", // Dark gray border for cards
    hitRewardColor: "#48BB78", // Strong green
    hourlyRateColors: [
      "#ffd1d150", // Soft pastel red for low hourly rates
      "#ffb3b350", // Light pastel pink for slightly higher rates
      "#ff999950", // Softer pastel pink for mid-low rates
      "#ff808050", // Soft pastel coral for lower-mid rates
      "#ffe0b350", // Pastel orange-yellow for mid rates
      "#fff7b350", // Soft pastel yellow for mid-high rates
      "#d4f5d450", // Light pastel green for high rates
      "#a8e5a850", // Soft pastel green for good rates
      "#85d98550", // Gentle pastel green for very good rates
      "#6bcf6b50", // Subtle pastel green for the best rates
    ],
    hitStatus: {
      submitted: "#3182CE", // Cool blue for submitted status
      approved: "#48BB78", // Strong green for approved status
      paid: "#48BB78", // Strong green for paid status
      rejected: "#E53E3E", // Vivid red for rejected status
      pending: "#F6AD55", // Warm orange for pending status
    },
    earningsPanelBackground: "#1F2933", // Dark neutral background for earnings panel
    earningsPanelTextColor: "#F5F7FA", // Light neutral text in the earnings panel
    chartPositiveColor: "#48BB78", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#3182CE", // Blue for neutral data points (total earnings)
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
  black: "#FFFFFF", // Inverted to white for dark mode text
  white: "#1F2933", // Dark background
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
          backgroundColor: theme.colors.primary[0], // Dark neutral background
          color: theme.colors.primary[9], // Light neutral text for readability
          borderColor: theme.colors.primary[2], // Subtle dark border for cards
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
          color: theme.colors.primary[8], // Light gray for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Light gray for text
        },
      }),
    },
  },
};
