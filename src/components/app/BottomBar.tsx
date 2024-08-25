import React, { useState, useEffect } from "react";
import { FaBan, FaChartBar, FaCog, FaPause, FaPlay } from "react-icons/fa";
import styled from "@emotion/styled";
import { Tooltip } from "@mantine/core";
import SettingsModal from "../modals/SettingsModal";
import DashboardModal from "../modals/DashboardModal";
import BlockedRequestersModal from "../modals/BlockedRequestersModal";
import { useStore } from "../../hooks";
import HitSpoonerLogo from "./HitSpoonerLogo";
import { keyframes, useTheme } from "@emotion/react";
import packageJson from "../../../package.json"; // Import the version from package.json

/**
 * Keyframes for alternating fade between two messages.
 */
const fadeAlternate = keyframes`
  0%, 25% {
    opacity: 1;
  }
  50%, 75% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
`;

/**
 * Container for the bottom bar.
 */
const BottomBarContainer = styled.div<{ minimal?: boolean }>`
  bottom: 0;
  width: 100%;
  background-color: ${(props) => props.theme.colors.primary[1]};
  padding: ${(props) => props.theme.spacing.xxs};
  border-top: 2px solid ${(props) => props.theme.colors.primary[0]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  position: relative;

  ${(props) =>
    props.minimal &&
    `
    justify-content: center;
  `}
`;

/**
 * Styled container for the logo, ensuring it's centered.
 */
const CenteredLogoContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
`;

/**
 * Styled button icon with scaling animation.
 */
const IconButton = styled.div<{ paused?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
  color: ${(props) =>
    props.paused
      ? props.theme.colors.secondary[7]
      : props.theme.colors.primary[8]};

  &:hover {
    transform: scale(1.1);
    color: ${(props) => props.theme.colors.primary[8]};
  }
`;

/**
 * Styled text for pause status, with animation.
 */
const PauseText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.secondary[7]};
  display: flex;
  align-items: center;
  animation: ${fadeAlternate} 6s infinite;
  padding-top: 10%;
`;

/**
 * Styled container for the alternating text.
 */
const AlternatingTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 24px; /* Adjust based on your text height */
`;

/**
 * Styled panel for displaying available earnings.
 */
const EarningsPanel = styled.div`
  padding-left: ${(props) => props.theme.spacing.xs};
  padding-right: ${(props) => props.theme.spacing.xs};
  font-weight: bold;
`;

/**
 * Styled text for the earnings display.
 */
const EarningsText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.other.hitRewardColor};
  text-align: center;
  width: 100%;
`;

/**
 * Styled text for the version information.
 */
const VersionText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.primary[7]};
  margin-top: ${(props) => props.theme.spacing.xxs};
`;

/**
 * Properties for the BottomBar component.
 */
interface IBottomBarProps {
  minimal?: boolean;
}

/**
 * BottomBar component renders the bottom bar of the application.
 */
const BottomBar: React.FC<IBottomBarProps> = ({ minimal }) => {
  const theme = useTheme();
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isDashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [isBlockedModalOpen, setBlockedModalOpen] = useState(false);
  const [showPausedMessage, setShowPausedMessage] = useState(true);

  const toggleSettingsModal = () => setSettingsModalOpen((prev) => !prev);
  const toggleDashboardModal = () => setDashboardModalOpen((prev) => !prev);
  const toggleBlockedModal = () => setBlockedModalOpen((prev) => !prev);

  const availableEarnings = useStore(
    (state) => state.dashboard.data?.available_earnings?.amount_in_dollars || 0
  );
  const isPaused = useStore((state) => state.paused);
  const togglePause = useStore((state) => state.togglePause);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPausedMessage((prev) => !prev);
    }, 4000); // Alternate every 4 seconds (half of the animation duration)

    return () => clearInterval(interval);
  }, []);

  const customTooltipStyles = {
    tooltip: {
      backgroundColor: theme.colors.primary[1],
      color: theme.colors.primary[8],
      border: `1px solid ${theme.colors.primary[3]}`,
    },
    arrow: {
      borderColor: theme.colors.primary[1],
    },
  };

  return (
    <>
      <BottomBarContainer minimal={minimal}>
        {minimal ? (
          <HitSpoonerLogo />
        ) : (
          <>
            <div style={{ display: "flex", gap: "10px" }}>
              <Tooltip
                label="Settings"
                withArrow
                position="top"
                styles={customTooltipStyles}
              >
                <IconButton onClick={toggleSettingsModal}>
                  <FaCog size={24} />
                </IconButton>
              </Tooltip>

              <Tooltip
                label="Dashboard"
                withArrow
                position="top"
                styles={customTooltipStyles}
              >
                <IconButton onClick={toggleDashboardModal}>
                  <FaChartBar size={24} />
                </IconButton>
              </Tooltip>

              <Tooltip
                label="Blocked Requesters"
                withArrow
                position="top"
                styles={customTooltipStyles}
              >
                <IconButton onClick={toggleBlockedModal}>
                  <FaBan size={24} />
                </IconButton>
              </Tooltip>

              <Tooltip
                label={
                  isPaused ? "Resume HIT Gathering" : "Pause HIT Gathering"
                }
                withArrow
                position="top"
                styles={customTooltipStyles}
              >
                <IconButton onClick={togglePause} paused={isPaused}>
                  {isPaused ? <FaPlay size={24} /> : <FaPause size={24} />}
                </IconButton>
              </Tooltip>

              {isPaused && (
                <AlternatingTextContainer>
                  {showPausedMessage ? (
                    <PauseText>HIT Gathering Paused</PauseText>
                  ) : (
                    <PauseText>
                      Press <FaPlay size={16} style={{ marginLeft: "5px" }} />{" "}
                      to Resume
                    </PauseText>
                  )}
                </AlternatingTextContainer>
              )}
            </div>
            <CenteredLogoContainer>
              <HitSpoonerLogo />
              {/* <VersionText>v{packageJson.version}</VersionText> */}
            </CenteredLogoContainer>
            <EarningsPanel>
              <EarningsText>${availableEarnings.toFixed(2)}</EarningsText>
            </EarningsPanel>
          </>
        )}
      </BottomBarContainer>

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={toggleSettingsModal}
      />
      <DashboardModal
        isOpen={isDashboardModalOpen}
        onClose={toggleDashboardModal}
      />
      <BlockedRequestersModal
        isOpen={isBlockedModalOpen}
        onClose={toggleBlockedModal}
      />
    </>
  );
};

export default BottomBar;
