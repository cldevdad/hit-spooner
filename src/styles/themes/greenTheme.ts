import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const greenTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#F0FFF4", // Very light green for background
      "#E6F5E8", // Light green for secondary backgrounds
      "#BEE3B8", // Soft green for accents
      "#9AD89B", // Medium green for UI elements like borders
      "#78C37C", // Darker green for hover states
      "#56AF5F", // Main primary green for active states
      "#E6F5E8",
      "#3B9142", // Darker green for headings or emphasized text
      "#2E7235", // Deep green for text
      "#235828", // Very deep green for important text
    ],
    secondary: [
      "#78C37C", // Light green for accents
      "#56AF5F", // Slightly deeper green for active states
      "#3B9142", // Soft greenish-brown for emphasis
      "#2E7235", // Deeper greenish-brown for highlights
      "#235828", // Dark green for strong accents
      "#E53E3E", // Bright red for errors or warnings
      "#DD6B20", // Warm orange for alerts
      "#3182CE", // Cool blue for informational accents
      "#2B6CB0", // Deeper blue for emphasis
      "#2C5282", // Dark blue for important text
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main green shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#56AF5F", // Darker green for the top bar
    logoTextColor: "#78C37C", // Medium green for UI elements like borders
    filterBarBackground: "#F0FFF4", // Light green background for the filter bar
    hitBackground: "#E6F5E8", // Light green for card backgrounds
    hitBorder: "#BEE3B8", // Light green border for cards
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
    earningsPanelBackground: "#F0FFF4", // Light green background for the earnings panel
    earningsPanelTextColor: "#235828", // Deep green for text in the earnings panel
    chartPositiveColor: "#48BB78", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#3182CE", // Blue for neutral data points (total earnings)
    buttonColor: "#56AF5F", // Bright green for buttons
    buttonHoverColor: "#3B9142", // Darker green for hover state
    buttonActiveColor: "#2E7235", // Even darker green for active state
    okButtonColor: "#56AF5F", // Bright green for OK buttons
    okButtonHoverColor: "#3B9142", // Darker green for hover state
    okButtonActiveColor: "#2E7235", // Even darker green for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#78C37C", // Light green color for the favorite icon
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
  black: "#235828", // Deep green for text
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
          backgroundColor: theme.colors.primary[0], // Light green background
          color: theme.colors.primary[9], // Deep green text for readability
          borderColor: theme.colors.primary[2], // Subtle green border for cards
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
          color: theme.colors.primary[8], // Deep green for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Darker green for text
        },
      }),
    },
  },
};
