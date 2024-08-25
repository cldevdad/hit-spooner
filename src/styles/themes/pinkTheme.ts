import { Theme } from "@emotion/react";
import { MantineThemeOverride } from "@mantine/core";

export const pinkTheme: MantineThemeOverride = {
  colors: {
    primary: [
      "#FFF5F7", // Very light pink for background
      "#FFEBEF", // Light pink for secondary backgrounds
      "#FFC4C9", // Soft pink for accents
      "#FF94A3", // Medium pink for UI elements like borders
      "#FF6B82", // Darker pink for hover states
      "#FF4561", // Main primary pink for active states
      "#FFEBEF",
      "#D92644", // Darker pink for headings or emphasized text
      "#B11E38", // Deep pink for text
      "#8B162D", // Very deep pink for important text
    ],
    secondary: [
      "#F4A1B1", // Light rose for accents
      "#D88E9F", // Slightly deeper rose for active states
      "#BD7389", // Soft pinkish-brown for emphasis
      "#A25773", // Deeper pinkish-brown for highlights
      "#883C5D", // Dark pinkish-brown for strong accents
      "#E53E3E", // Bright red for errors or warnings
      "#DD6B20", // Warm orange for alerts
      "#3182CE", // Cool blue for informational accents
      "#2B6CB0", // Deeper blue for emphasis
      "#2C5282", // Dark blue for important text
    ],
  },
  primaryColor: "primary",
  primaryShade: 5, // Main pink shade for primary components
  headings: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600", // Ensure headings are bold enough to stand out
  },
  other: {
    topBarBackground: "#FF4561", // Darker pink for top bar
    logoTextColor: "#FF94A3", // Medium pink for UI elements like borders
    filterBarBackground: "#FFF5F7", // Light pink background for filter bar
    hitBackground: "#FFEBEF", // Light pink for card backgrounds
    hitBorder: "#FFC4C9", // Light pink border for cards
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
    earningsPanelBackground: "#FFF5F7", // Light pink background for earnings panel
    earningsPanelTextColor: "#8B162D", // Deep pink for text in the earnings panel
    chartPositiveColor: "#48BB78", // Green for positive data points (approved HITs, bonuses)
    chartNegativeColor: "#E53E3E", // Red for negative data points (rejected HITs)
    chartNeutralColor: "#3182CE", // Blue for neutral data points (total earnings)
    buttonColor: "#FF4561", // Bright pink for buttons
    buttonHoverColor: "#FF2D51", // Darker pink for hover state
    buttonActiveColor: "#D92644", // Even darker pink for active state
    okButtonColor: "#FF2D51", // Bright pink for OK buttons
    okButtonHoverColor: "#D92644", // Darker pink for hover state
    okButtonActiveColor: "#B11E38", // Even darker pink for active state
    negativeButtonColor: "#E53E3E", // Red for negative buttons
    negativeButtonHoverColor: "#C53030", // Darker red for hover state
    negativeButtonActiveColor: "#9B2C2C", // Even darker red for active state
    favoriteIcon: "#F4A1B1", // Light rose color for favorite icon
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
  black: "#8B162D", // Deep pink for text
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
          backgroundColor: theme.colors.primary[0], // Light pink background
          color: theme.colors.primary[9], // Deep pink text for readability
          borderColor: theme.colors.primary[2], // Subtle pink border for cards
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
          color: theme.colors.primary[8], // Deep pink for titles
        },
      }),
    },
    Text: {
      styles: (theme: Theme) => ({
        root: {
          color: theme.colors.primary[7], // Darker pink for text
        },
      }),
    },
  },
};
