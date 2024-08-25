import {
  Theme as EmotionTheme,
  ThemeProvider as EmotionThemeProvider,
} from "@emotion/react";
import styled from "@emotion/styled";
import { MantineProvider, MantineTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import React, { useEffect, useMemo, useState } from "react";
import Workspace from "../workspace/Workspace";
import HitCompletePage from "./HitCompletePage";
import { useStore } from "../../hooks";
import GlobalStyles from "../../styles/globalStyles";
import BottomBar from "./BottomBar";
import NoMoreHitsPage from "./NoMoreHitsPage";

// Styled container for the main layout
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

/**
 * Serves as the root component for the application. It manages the global theme
 * and sets up the structure of the app, including the TopBar, Workspace, and
 * BottomBar.
 *
 * @returns {JSX.Element | null} The rendered application structure with applied
 * themes or null if not a target URL.
 */
const App: React.FC = () => {
  const { config, startUpdateIntervals } = useStore();
  const theme = config.themes[config.theme] as EmotionTheme & MantineTheme;

  // Determine if the current URL is a HitSpooner URL
  const isHitSpoonerUrl = useMemo(
    () => window.location.href.includes("hit-spooner"),
    []
  );

  // State to track whether to show HitCompletePage or NoMoreHitsPage.
  const [showHitComplete, setShowHitComplete] = useState(false);
  const [showNoMoreHits, setShowNoMoreHits] = useState(false);

  useEffect(() => {
    if (isHitSpoonerUrl) {
      startUpdateIntervals();
    }

    // Function to check if the HIT Submitted message is present.
    const checkHitSubmitted = () => {
      const alertHeading = document.querySelector(
        "#MainContent > div:nth-child(2) > div > div > div > div.mturk-alert-content > h3"
      );

      return (
        alertHeading && alertHeading?.textContent?.trim() === "HIT Submitted"
      );
    };

    // Function to check if the "No More HITs" message is present.
    const checkNoMoreHits = () => {
      const alertHeading = document.querySelector(
        "#MainContent > div:nth-child(2) > div > div > div > div.mturk-alert-content > h3"
      );

      return (
        alertHeading &&
        alertHeading?.textContent?.trim() ===
          "There are no more of these HITs available"
      );
    };

    // Function to check if the "Return" button is present.
    const checkReturnButton = () => {
      const returnButton = document.querySelector(
        "#MainContent > div.work-pipeline-bottom-bar.m-b-sm > div.action-buttons.text-xs-center > div > form > button"
      );
      return returnButton && returnButton?.textContent?.trim() === "Return";
    };

    if (isHitSpoonerUrl) {
      return;
    }

    if (checkHitSubmitted()) {
      if (checkReturnButton()) {
        setShowHitComplete(false);
      } else {
        setShowHitComplete(true);
      }
    } else if (checkNoMoreHits()) {
      setShowNoMoreHits(true);
    }

    const observer = new MutationObserver(() => {
      if (checkHitSubmitted()) {
        if (checkReturnButton()) {
          setShowHitComplete(false);
        } else {
          setShowHitComplete(true);
        }
      } else if (checkNoMoreHits()) {
        setShowNoMoreHits(true);
      }
    });

    const mainContent = document.querySelector("#MainContent");
    if (mainContent) {
      observer.observe(mainContent, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [isHitSpoonerUrl, startUpdateIntervals]);

  if (!showHitComplete && !showNoMoreHits && !isHitSpoonerUrl) {
    return null;
  }

  return (
    <EmotionThemeProvider theme={theme}>
      <MantineProvider theme={theme}>
        <GlobalStyles />
        <MainContainer>
          {showHitComplete ? (
            <>
              <HitCompletePage />
              <BottomBar minimal />
            </>
          ) : showNoMoreHits ? (
            <>
              <NoMoreHitsPage />
              <BottomBar minimal />
            </>
          ) : (
            <>
              <Workspace />
              <BottomBar />
            </>
          )}
        </MainContainer>
      </MantineProvider>
    </EmotionThemeProvider>
  );
};

export default App;
