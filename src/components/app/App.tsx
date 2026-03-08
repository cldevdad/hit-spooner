import {
  Theme as EmotionTheme,
  ThemeProvider as EmotionThemeProvider,
} from "@emotion/react";
import styled from "@emotion/styled";
import { MantineProvider, MantineTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Workspace from "../workspace/Workspace";
import HitCompletePage from "./HitCompletePage";
import { useStore } from "../../hooks";
import GlobalStyles from "../../styles/globalStyles";
import BottomBar from "./BottomBar";
import NoMoreHitsPage from "./NoMoreHitsPage";
import { initAudioContext } from "../../utils";

const ALERT_HEADING_SELECTOR = "#MainContent > div:nth-child(2) > div > div > div > div.mturk-alert-content > h3";
const RETURN_BUTTON_SELECTOR = "#MainContent > div.work-pipeline-bottom-bar.m-b-sm > div.action-buttons.text-xs-center > div > form > button";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const App: React.FC = () => {
  const { config, startUpdateIntervals, fetchAndUpdateHitsQueue, queue } = useStore();
  const theme = config.themes[config.theme] as EmotionTheme & MantineTheme;

  const isHitSpoonerUrl = useMemo(
    () => window.location.href.includes("hit-spooner"),
    []
  );

  const [showHitComplete, setShowHitComplete] = useState(false);
  const [showNoMoreHits, setShowNoMoreHits] = useState(false);
  const hasNavigatedRef = useRef(false);

  const goToNextHitInQueue = useCallback(() => {
    if (queue.length > 0) {
      const nextHit = queue[0];
      window.location.href = `https://worker.mturk.com/projects/${nextHit.project.hit_set_id}/tasks/${nextHit.task_id}?assignment_id=${nextHit.assignment_id}`;
    }
  }, [queue]);

  useEffect(() => {
    if (isHitSpoonerUrl) {
      startUpdateIntervals();
      return;
    }

    const getAlertText = () => 
      document.querySelector(ALERT_HEADING_SELECTOR)?.textContent?.trim();

    const hasReturnButton = () => 
      document.querySelector(RETURN_BUTTON_SELECTOR)?.textContent?.trim() === "Return";

    const checkConditions = () => {
      const alertText = getAlertText();
      
      if (alertText === "HIT Submitted") {
        if (hasReturnButton()) {
          setShowHitComplete(false);
        } else {
          setShowHitComplete(true);
          fetchAndUpdateHitsQueue();
        }
      } else if (alertText === "There are no more of these HITs available") {
        setShowNoMoreHits(true);
        fetchAndUpdateHitsQueue();
      }
    };

    checkConditions();

    const mainContent = document.querySelector("#MainContent");
    if (!mainContent) return;

    const observer = new MutationObserver(checkConditions);
    observer.observe(mainContent, { childList: true, subtree: true });

    // Always disconnect observer when effect cleans up, regardless of state
    return () => {
      observer.disconnect();
    };
  }, [isHitSpoonerUrl, startUpdateIntervals, fetchAndUpdateHitsQueue]);

  useEffect(() => {
    if (showHitComplete && queue.length > 0 && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      const timer = setTimeout(goToNextHitInQueue, 1500);
      return () => clearTimeout(timer);
    }
  }, [showHitComplete, queue, goToNextHitInQueue]);

  useEffect(() => {
    hasNavigatedRef.current = false;
  }, [queue]);

  if (!showHitComplete && !showNoMoreHits && !isHitSpoonerUrl) {
    return null;
  }

  return (
    <EmotionThemeProvider theme={theme}>
      <MantineProvider theme={theme}>
        <GlobalStyles />
        <Notifications position="top-right" />
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
