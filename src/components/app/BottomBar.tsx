import React, { useState, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import styled from "@emotion/styled";
import { Tooltip, Menu, Text } from "@mantine/core";
import { IconMenu, IconSettings, IconChartBar, IconBan } from "@tabler/icons-react";
import SettingsModal from "../modals/SettingsModal";
import DashboardModal from "../modals/DashboardModal";
import BlockedRequestersModal from "../modals/BlockedRequestersModal";
import { useStore } from "../../hooks";
import HitSpoonerLogo from "./HitSpoonerLogo";
import { keyframes, useTheme } from "@emotion/react";


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
  background: linear-gradient(180deg, ${(props) => props.theme.colors.primary[2]} 0%, ${(props) => props.theme.colors.primary[1]} 100%);
  padding: 8px 16px;
  border-top: 1px solid ${(props) => props.theme.colors.primary[3]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  position: relative;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

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
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  color: ${(props) =>
    props.paused
      ? props.theme.colors.secondary[7]
      : props.theme.colors.primary[7]};
  background: ${(props) => props.theme.colors.primary[0]};

  &:hover {
    transform: scale(1.1);
    background: ${(props) => props.theme.colors.primary[2]};
    color: ${(props) => props.theme.colors.primary[9]};
  }

  &:active {
    transform: scale(0.95);
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
  animation-fill-mode: both;
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const EarningsText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.other.hitRewardColor};
  text-align: center;
  width: 100%;
`;

const PendingText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.primary[6]};
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
  const queue = useStore((state) => state.queue);

  const pendingEarnings = queue.reduce((sum, a) => sum + (a.project.monetary_reward?.amount_in_dollars || 0), 0);

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
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Menu
                shadow="md"
                width={200}
                position="top-start"
                styles={{
                  dropdown: {
                    backgroundColor: theme.colors.primary[0],
                    border: `1px solid ${theme.colors.primary[3]}`,
                  },
                  item: {
                    color: theme.colors.primary[9],
                    '&[data-hovered]': {
                      backgroundColor: theme.colors.primary[2],
                    },
                  },
                }}
              >
                <Menu.Target>
                  <Tooltip label="Menu" withArrow position="top" styles={customTooltipStyles}>
                    <IconButton>
                      <IconMenu size={24} />
                    </IconButton>
                  </Tooltip>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={toggleSettingsModal}
                    leftSection={<IconSettings size={18} />}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    onClick={toggleDashboardModal}
                    leftSection={<IconChartBar size={18} />}
                  >
                    Dashboard
                  </Menu.Item>
                  <Menu.Item
                    onClick={toggleBlockedModal}
                    leftSection={<IconBan size={18} />}
                  >
                    Blocked Requesters
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <div style={{ width: "1px", height: "24px", backgroundColor: theme.colors.primary[3] }} />

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
              {pendingEarnings > 0 && (
                <PendingText>+${pendingEarnings.toFixed(2)} pending</PendingText>
              )}
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

export default React.memo(BottomBar);
