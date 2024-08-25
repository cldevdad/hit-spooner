import { Theme, css } from "@emotion/react";

/**
 * Generates custom themed scrollbar styles for use in styled components.
 *
 * @param {Theme} theme - The theme object with colors and other design tokens.
 * @returns {ReturnType<typeof css>} The CSS styles for a custom scrollbar.
 */
export const themedScrollbarStyles = (theme: Theme) => css`
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.primary[1]};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primary[7]};
    border-radius: 10px;
    border: 3px solid ${theme.colors.primary[1]};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.colors.primary[8]};
  }
`;

/**
 * Generates custom themed styles for modals, including scrollbar and
 * modal-specific styles.
 *
 * @param {Theme} theme - The theme object with colors and other design tokens.
 * @returns {ReturnType<typeof css>} The CSS styles for a custom themed modal.
 */
export const themedModalStyles = (theme: Theme) => css`
  .mantine-Modal-content {
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    overflow: hidden;
  }

  .mantine-Modal-header {
    flex-shrink: 0; /* Prevent the header from shrinking */
    color: ${theme.black};
    background-color: ${theme.other.topBarBackground};
  }

  .mantine-Modal-title {
    color: ${theme.black};
    font-size: ${theme.fontSizes.lg};
  }

  .mantine-Modal-close {
    color: ${theme.colors.primary[8]};
    border: none;
    outline: none;
  }

  .mantine-Modal-body {
    flex: 1; /* Allow the body to take up remaining space */
    overflow-y: auto; /* Enable vertical scrolling */
    padding-top: 20px;
    background-color: ${theme.colors.primary[0]};
    ${themedScrollbarStyles(theme)};
  }
`;

/**
 * Generates the styles for the Accordion component based on the provided theme.
 *
 * @param {Theme} theme - The theme object containing colors, spacing, and other
 * style properties.
 * @returns {Record<string, any>} An object containing the styles for the
 * Accordion component.
 */
export const themedAccordinStyles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.colors.primary[1],
    border: "none",
    "&[data-active]": {
      backgroundColor: theme.colors.primary[2],
    },
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
    },
  },
  itemTitle: {
    backgroundColor: theme.colors.primary[1],
    border: "none",
    outline: "none",
    "&[data-active]": {
      backgroundColor: theme.colors.primary[2],
    },
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
    },
    "&:focus": {
      outline: "none",
    },
  },
  item: {
    backgroundColor: theme.colors.primary[1],
    border: "none",
    outline: "none",
    "&[data-active]": {
      backgroundColor: theme.colors.primary[2],
    },
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
    },
    "&:focus": {
      outline: "none",
    },
  },
  label: {
    backgroundColor: theme.colors.primary[1],
    border: "none",
    outline: "none",
    "&[data-active]": {
      backgroundColor: theme.colors.primary[2],
    },
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
    },
    "&:focus": {
      outline: "none",
    },
  },
  control: {
    backgroundColor: theme.colors.primary[1],
    color: theme.colors.primary[9],
    outline: "none",
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
      color: theme.colors.primary[8],
    },
    "&:focus": {
      outline: "none",
    },
  },
  panel: {
    color: theme.colors.primary[9],
    backgroundColor: theme.colors.primary[0],
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
    },
  },
  chevron: {
    backgroundColor: theme.colors.primary[1],
    color: theme.colors.primary[8],
    "&:hover": {
      backgroundColor: theme.colors.primary[1],
    },
  },
});

/**
 * Generates custom themed styles for input components, including Select,
 * Checkbox, and TextInput.
 *
 * @param {Theme} theme - The theme object with colors and other design tokens.
 * @returns The CSS styles for a custom themed input component.
 */
export const themedInputStyles = (theme: Theme) => ({
  dropdown: {
    backgroundColor: theme.colors.primary[0],
    outline: "none",
  },
  item: {
    color: theme.colors.primary[7],
  },
  input: {
    color: theme.colors.primary[7],
    backgroundColor: theme.colors.primary[0],
    outline: "none",
    borderColor: theme.colors.primary[2],
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
  },
  label: {
    color: theme.colors.primary[8],
  },
});

/**
 * Generates custom themed styles for slider components.
 *
 * @param {Theme} theme - The theme object with colors and other design tokens.
 * @returns The CSS styles for a custom themed slider component.
 */
export const themedSliderStyles = (theme: Theme): object => ({
  root: {
    width: "15%",
  },
  track: {
    backgroundColor: theme.colors.primary[3],
  },
  bar: {
    backgroundColor: theme.colors.primary[4],
  },
  thumb: {
    backgroundColor: theme.colors.primary[0],
    border: `2px solid ${theme.colors.primary[8]}`,
  },
  label: {
    backgroundColor: theme.colors.primary[7],
    color: theme.white,
    zIndex: 9999,
  },
});
