import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const newsTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#F5F5F5", // Very light gray for background
      "#E0E0E0", // Light gray for secondary backgrounds
      "#CCCCCC", // Soft gray for accents
      "#B3B3B3", // Medium gray for UI elements like borders
      "#999999", // Darker gray for hover states
      "#808080", // Main primary gray for active states
      "#666666", // Dark gray for text and important elements
      "#4D4D4D", // Darker gray for headings or emphasized text
      "#333333", // Deep gray for text
      "#1A1A1A", // Very deep gray for important text
    ],
    secondary: [
      "#FFFFFF", // White for strong contrasts
      "#E53E3E", // Red for errors or warnings (some color for urgency)
      "#DD6B20", // Orange for alerts (some color for visibility)
      "#3182CE", // Cool blue for informational accents (minimal use)
      "#2B6CB0", // Deeper blue for emphasis (minimal use)
      "#2C5282", // Dark blue for important text (minimal use)
      "#48BB78", // Green for pay amounts (highlighted color)
      "#FFB6C1", // Light pink for subtle highlights
      "#F6E05E", // Soft yellow for minor accents
      "#CBD2D9", // Light gray for muted elements
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main gray shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#333333", // Deep gray for the top bar
    logoTextColor: "#666666", // Medium gray for UI elements like borders
    filterBarBackground: "#F5F5F5", // Light gray background for the filter bar
    hitBackground: "#E0E0E0", // Light gray for card backgrounds
    hitBorder: "#CCCCCC", // Soft gray border for cards
    hitRewardColor: "#48BB78", // Strong green for pay amounts
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
      submitted: "#808080", // Main gray for submitted status
      approved: "#48BB78", // Green for approved status
      paid: "#48BB78", // Green for paid status
      rejected: "#E53E3E", // Vivid red for rejected status
      pending: "#999999", // Dark gray for pending status
    },
    earningsPanelBackground: "#F5F5F5", // Light gray background for the earnings panel
    earningsPanelTextColor: "#333333", // Deep gray for text in the earnings panel
    chartPositiveColor: "#48BB78", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#999999", // Gray for neutral data points (total earnings)
    buttonColor: "#808080", // Gray for buttons
    buttonHoverColor: "#666666", // Darker gray for hover state
    buttonActiveColor: "#4D4D4D", // Even darker gray for active state
    okButtonColor: "#808080", // Gray for OK buttons
    okButtonHoverColor: "#666666", // Darker gray for hover state
    okButtonActiveColor: "#4D4D4D", // Even darker gray for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#CCCCCC", // Light gray color for the favorite icon
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
  black: "#1A1A1A", // Very deep gray for text
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
          backgroundColor: theme.colors.primary[0], // Light gray background
          color: theme.colors.primary[9], // Deep gray text for readability
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
          color: theme.colors.primary[8], // Deep gray for titles
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
