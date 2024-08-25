import {
  css,
  Theme as EmotionTheme,
  ThemeProvider as EmotionThemeProvider,
  Global,
} from "@emotion/react";
import styled from "@emotion/styled";
import { Button, MantineProvider, MantineTheme } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import packageJson from "../../package.json";
import { useStore } from "../hooks";

/**
 * Styled container for the Popup component.
 */
const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.primary[0]};
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

/**
 * Styled text for the app name.
 */
const AppName = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.colors.primary[9]};
  margin: 0;
`;

/**
 * Styled text for the version information.
 */
const VersionText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary[7]};
  margin: ${(props) => props.theme.spacing.xxs} 0;
`;

/**
 * Styled footer container.
 */
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.lg};
`;

/**
 * Styled text for the footer information.
 */
const FooterText = styled.p`
  font-size: ${(props) =>
    props.theme.fontSizes.xs}; /* Make footer text smaller */
  color: ${(props) => props.theme.colors.primary[6]};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

/**
 * Popup component that displays the name of the app, its version, and a link to
 * open HitSpooner.
 *
 * @component
 */
export const Popup: React.FC = () => {
  const [themeName, setThemeName] = useState("light");

  useEffect(() => {
    chrome.storage.sync.get("theme", (data) => {
      if (data.theme) {
        setThemeName(data.theme);
      }
    });
  }, []);

  const { config } = useStore();
  const theme = config.themes[themeName] as EmotionTheme & MantineTheme;

  /**
   * Opens the HitSpooner page or switches to it if already open.
   */
  const openHitSpooner = () => {
    chrome.tabs.query({}, (tabs) => {
      const existingTab = tabs.find((tab) =>
        tab.url?.includes("https://worker.mturk.com/hit-spooner")
      );

      if (existingTab && existingTab.id) {
        chrome.tabs.update(existingTab.id, { active: true });
      } else {
        chrome.tabs.create({ url: "https://worker.mturk.com/hit-spooner" });
      }
    });
  };

  return (
    <EmotionThemeProvider theme={theme}>
      <MantineProvider theme={theme}>
        <Global
          styles={css`
            body,
            html {
              margin: 0;
              padding: 0;
              width: 200px;
              height: 300px;
              font-family: ${theme.fontFamily || "'Roboto', sans-serif"};
              background-color: ${theme.colors?.primary?.[0]};
              color: ${theme.colors?.primary?.[8]};
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}
        />
        <PopupContainer>
          <AppName>HitSpooner</AppName>
          <VersionText>v{packageJson.version}</VersionText>{" "}
          <Footer>
            <Button
              onClick={openHitSpooner}
              fullWidth
              style={{
                backgroundColor: theme.colors.primary[7],
                color: theme.white,
                marginTop: theme.spacing.sm,
                cursor: "pointer",
              }}
            >
              Open HitSpooner
              <IconExternalLink size={18} style={{ marginLeft: "8px" }} />
            </Button>
            <FooterText>Created by DevDad</FooterText>
          </Footer>
        </PopupContainer>
      </MantineProvider>
    </EmotionThemeProvider>
  );
};

export default Popup;
