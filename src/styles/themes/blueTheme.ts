import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const blueTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#F0F4F8", // Light blue-gray background
      "#D9E2EC", // Softer blue-gray for secondary backgrounds
      "#BCCCDC", // Light steel blue for accents
      "#9FB3C8", // Medium steel blue for UI elements like borders
      "#829AB1", // Darker blue-gray for hover states
      "#627D98", // Main primary steel blue for active states
      "#486581", // Deep steel blue for headings or emphasized text
      "#334E68", // Dark blue-gray for text
      "#243B53", // Deeper blue-gray for important text
      "#102A43", // Deepest steel blue for strong accents
    ],
    secondary: [
      "#2A4365", // Dark blue-gray for secondary accents
      "#2C5282", // Slightly deeper blue for active states
      "#2B6CB0", // Cool blue for informational accents
      "#3182CE", // Bright blue for highlights
      "#4299E1", // Lighter blue for emphasis
      "#E53E3E", // Bright red for errors or warnings
      "#DD6B20", // Warm orange for alerts
      "#38B2AC", // Cool teal for success or positive accents
      "#2C7A7B", // Dark teal for emphasis
      "#285E61", // Deep teal for important text
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main steel blue shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#486581", // Deep steel blue for top bar
    logoTextColor: "#9FB3C8", // Medium steel blue for UI elements like borders
    filterBarBackground: "#F0F4F8", // Light blue-gray background for filter bar
    hitBackground: "#D9E2EC", // Softer blue-gray for card backgrounds
    hitBorder: "#BCCCDC", // Light steel blue border for cards
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
      submitted: "#2B6CB0", // Cool blue for submitted status
      approved: "#38B2AC", // Cool teal for approved status
      paid: "#38B2AC", // Cool teal for paid status
      rejected: "#E53E3E", // Vivid red for rejected status
      pending: "#D69E2E", // Warm yellow for pending status
    },
    earningsPanelBackground: "#F0F4F8", // Light blue-gray for earnings panel
    earningsPanelTextColor: "#243B53", // Deep blue-gray for text in the earnings panel
    chartPositiveColor: "#38B2AC", // Teal for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#2B6CB0", // Blue for neutral data points (total earnings)
    buttonColor: "#2C5282", // Dark blue for buttons
    buttonHoverColor: "#2B6CB0", // Bright blue for hover state
    buttonActiveColor: "#2A4365", // Deep blue-gray for active state
    okButtonColor: "#3182CE", // Cool blue for OK buttons
    okButtonHoverColor: "#2B6CB0", // Bright blue for hover state
    okButtonActiveColor: "#2C5282", // Darker blue for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#38B2AC", // Cool teal color for favorite icon
    turkerView: {
      danger: "#E53E3E", // Red for 'danger' class
      warning: "#DD6B20", // Orange for 'warning' class
      success: "#38B2AC", // Cool teal for 'success' class
      muted: "#BCCCDC", // Steel blue-gray for 'muted' class
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
          backgroundColor: theme.colors.primary[0], // Light blue-gray background
          color: theme.colors.primary[9], // Deep blue-gray for readability
          borderColor: theme.colors.primary[2], // Steel blue border for cards
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
          color: theme.colors.primary[8], // Deep blue-gray for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Darker blue-gray for text
        },
      }),
    },
  },
};
