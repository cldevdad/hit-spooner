import { css, Global, useTheme } from "@emotion/react";
import React from "react";
import "normalize.css";

const GlobalStyles: React.FC = () => {
  const theme = useTheme();
  const primaryColor = theme.colors?.primary?.[0] || "#ffffff";
  const darkColor = theme.colors?.primary?.[8] || "#000000";
  const hitBackground = theme.other?.hitBackground || "#ffffff";
  const tooltipBackgroundColor = theme.colors?.primary?.[8] || "#333333";
  const tooltipTextColor = theme.colors?.primary?.[8] || "#ffffff";

  return (
    <Global
      styles={css`
        body,
        html {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          font-family: ${theme.fontFamily || "'Roboto', sans-serif"};
          background-color: ${primaryColor};
          color: ${darkColor};
          overflow: hidden;
        }

        #hitspooner-root {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${hitBackground};
          color: ${darkColor};
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Ensure all children of the filter bar have appropriate z-index */
        .mantine-Select-dropdown {
          z-index: 1100 !important;
        }

        .apex-chart-tooltip {
          background-color: ${tooltipBackgroundColor};
          color: ${tooltipTextColor};
          border-radius: 4px;
          padding: 10px;
          font-size: 12px;
          font-family: ${theme.fontFamily || "'Roboto', sans-serif"};
        }
      `}
    />
  );
};

export default GlobalStyles;
