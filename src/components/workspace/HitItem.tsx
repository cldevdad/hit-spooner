import React, { useCallback, useMemo, useState } from "react";
import { keyframes, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { IHitProjectWithHourlyRate } from "@hit-spooner/api";
import { Tooltip } from "@mantine/core";
import {
  IconAlertCircle,
  IconStarFilled,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { GiSpoon } from "react-icons/gi";
import { MdOutlineQueuePlayNext } from "react-icons/md";
import { TbShovel } from "react-icons/tb";
import { useStore } from "../../hooks";
import { StyledTitle } from "../../styles";
import YesNoModal from "../modals/YesNoModal";

interface HitItemProps {
  hit: IHitProjectWithHourlyRate;
  hideRequester?: boolean;
  onRequesterClick?: (requesterId: string) => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const HitItemWrapper = styled.div<{ unavailable?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.theme.other.hitBackground};
  border: 1px solid ${(props) => props.theme.other.hitBorder};
  border-radius: 8px;
  padding: ${(props) => props.theme.spacing.xxs};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  opacity: ${(props) => (props.unavailable ? 0.6 : 1)};
  transition: transform 0.3s, box-shadow 0.3s, opacity 0.5s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    opacity: 1;
    transition: transform 0.3s, box-shadow 0.3s, opacity 0s ease-in-out;
  }
`;

const HitInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const BulletPoints = styled.ul`
  list-style-type: disc;
  padding-left: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.primary[7]};
  margin-top: ${(props) => props.theme.spacing.xxs};
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const TopSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: ${(props) => props.theme.spacing.sm};
`;

const RewardPanel = styled.div<{ rateColor?: string }>`
  background-color: ${(props) => props.rateColor};
  padding: ${(props) => props.theme.spacing.xs};
  border-radius: 6px;
  margin-bottom: ${(props) => props.theme.spacing.xxs};
  text-align: center;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RewardAmount = styled.div`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: bold;
  color: ${(props) => props.theme.other.hitRewardColor};
`;

const HourlyRate = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.xxs};
`;

const RequesterInfo = styled.div`
  flex: 1;
  text-align: right;
  cursor: pointer;
  padding-right: ${(props) => props.theme.spacing.xxs};
  color: ${(props) => props.theme.colors.primary[9]};
  font-size: ${(props) => props.theme.fontSizes.xs};

  &:hover {
    text-decoration: underline;
  }
`;

const Indicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSizes.md};
  padding: ${(props) => props.theme.spacing.xxs};
  border-radius: 4px;
  height: 40px;
`;

const StyledButton = styled.a<{ isVisible: boolean }>`
  color: ${(props) => props.theme.colors.primary[9]};
  padding: 0;
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 40px;
  text-decoration: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary[1]};
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[2]};
  }
`;

const IconOrText = styled.span`
  display: block;
  transition: opacity 0.3s;
`;

const AddToQueueIcon = styled(MdOutlineQueuePlayNext)`
  transition: opacity 0.3s;

  ${StyledButton}:hover & {
    opacity: 0;
  }
`;

const DoneIndicator = styled(Indicator)`
  color: ${(props) => props.theme.colors.primary[7]};
`;

const InQueueIndicator = styled(Indicator)`
  color: ${(props) => props.theme.colors.secondary[7]};
`;

const IconButton = styled.div<{ active?: boolean }>`
  cursor: pointer;
  color: ${(props) =>
    props.active
      ? props.theme.colors.secondary[2]
      : props.theme.colors.primary[7]};
  transition: color 0.3s;
  opacity: ${(props) => (props.active ? "1" : "0.2")};

  &:hover {
    color: ${(props) => props.theme.colors.primary[8]};
  }
`;

const DeleteIcon = styled(IconX)`
  cursor: pointer;
  color: ${(props) => props.theme.other.buttonColor};

  &:hover {
    color: ${(props) => props.theme.other.buttonHoverColor};
  }
`;

const LastSeenInfo = styled.div`
  margin-top: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.primary[9]};
  display: flex;
  align-items: center;

  & > svg {
    margin-right: ${(props) => props.theme.spacing.xxs};
  }
`;

export const HitItem: React.FC<HitItemProps> = ({
  hit,
  hideRequester = false,
  onRequesterClick,
}) => {
  const theme = useTheme();
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { acceptHit, deleteHit } = useStore(
    useCallback(
      (state) => ({
        acceptHit: state.acceptHit,
        deleteHit: state.deleteHit,
      }),
      []
    )
  );

  const { blockRequester, toggleFavoriteRequester, favoriteRequesters } =
    useStore(
      useCallback(
        (state) => ({
          blockRequester: state.blockRequester,
          toggleFavoriteRequester: state.toggleFavoriteRequester,
          favoriteRequesters: state.favoriteRequesters,
        }),
        []
      )
    );

  const { addOrUpdateHit } = useStore(
    useCallback(
      (state) => ({
        addOrUpdateHit: state.addOrUpdateHit,
      }),
      []
    )
  );

  const handleScoopToggle = useCallback(
    async (scoopType: "scoop" | "shovel" | undefined) => {
      const updatedScoop = hit.scoop === scoopType ? undefined : scoopType;
      addOrUpdateHit({ ...hit, scoop: updatedScoop });
    },
    [hit, addOrUpdateHit]
  );

  const handleAcceptHit = useCallback(async () => {
    if (hit.caller_meets_requirements) {
      setButtonVisible(false);
      await acceptHit(hit);
      setTimeout(() => {
        setButtonVisible(true);
      }, 2000);
    } else if (hit.qualifications?.length) {
      const qualification = hit.qualifications.find(
        (q) => q.caller_meets_requirement === false
      );
      if (qualification && qualification.qualification_request_url) {
        window.open(
          `https://worker.mturk.com${qualification.qualification_request_url}`,
          "_blank"
        );
      }
    }
  }, [acceptHit, hit]);

  const handleDeleteHit = useCallback(async () => {
    deleteHit(hit.hit_set_id);
    setDeleteModalOpen(false);
  }, [hit.hit_set_id, deleteHit]);

  const cleanTitle = useMemo(() => {
    return hit.title.replace(/\s*\(.*?\)\s*/g, " ").trim();
  }, [hit.title]);

  const bulletPoints = useMemo(() => {
    const regex = /\((.*?)\)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(hit.title)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }, [hit.title]);

  const hourlyRateColor = useMemo(() => {
    if (!hit.hourlyRate) return "transparent";
    const rateValue = parseFloat(hit.hourlyRate.replace(/[^0-9.-]+/g, ""));
    if (isNaN(rateValue)) {
      return "transparent";
    } else if (rateValue < 5) {
      return theme.other.hourlyRateColors[0];
    } else if (rateValue < 10) {
      return theme.other.hourlyRateColors[3];
    } else if (rateValue < 15) {
      return theme.other.hourlyRateColors[5];
    } else if (rateValue < 20) {
      return theme.other.hourlyRateColors[7];
    } else {
      return theme.other.hourlyRateColors[9];
    }
  }, [hit.hourlyRate, theme.other.hourlyRateColors]);

  const isFavorite = useMemo(() => {
    return favoriteRequesters.some((r) => r.id === hit.requester_id);
  }, [favoriteRequesters, hit.requester_id]);

  const handleDeleteIconClick = () => {
    setDeleteModalOpen(true);
  };

  const deleteModalMessage = (
    <div>
      <p>Are you sure you want to delete this HIT?</p>
      <HitItemWrapper unavailable={hit.unavailable}>
        <TopSection>
          <LeftSection>
            <RewardPanel rateColor={hourlyRateColor}>
              <RewardAmount>
                ${hit.monetary_reward.amount_in_dollars.toFixed(2)}
              </RewardAmount>
              {!hideRequester && <HourlyRate>{hit.hourlyRate}</HourlyRate>}
            </RewardPanel>
          </LeftSection>
          <HitInfo>
            <StyledTitle order={5}>{cleanTitle}</StyledTitle>
            {bulletPoints.length > 0 && (
              <BulletPoints>
                {bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </BulletPoints>
            )}
          </HitInfo>
        </TopSection>
      </HitItemWrapper>
    </div>
  );

  return (
    <>
      <HitItemWrapper unavailable={hit.unavailable}>
        <TopSection>
          <LeftSection>
            <RewardPanel rateColor={hourlyRateColor}>
              <RewardAmount>
                ${hit.monetary_reward.amount_in_dollars.toFixed(2)}
              </RewardAmount>
              {!hideRequester && <HourlyRate>{hit.hourlyRate}</HourlyRate>}
            </RewardPanel>
          </LeftSection>
          <HitInfo>
            <StyledTitle order={5}>{cleanTitle}</StyledTitle>
            {bulletPoints.length > 0 && (
              <BulletPoints>
                {bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </BulletPoints>
            )}
          </HitInfo>
          {hit.unavailable ? (
            <DeleteIcon onClick={handleDeleteIconClick} />
          ) : (
            <StyledButton onClick={handleAcceptHit} isVisible={isButtonVisible}>
              <IconOrText>
                {hit.caller_meets_requirements ? (
                  <AddToQueueIcon size={20} />
                ) : (
                  "Qualify"
                )}
              </IconOrText>
            </StyledButton>
          )}
        </TopSection>
        <BottomSection>
          <div style={{ display: "flex", gap: theme.spacing.sm }}>
            <Tooltip
              label="Scoop HIT"
              position="bottom"
              style={{
                color: theme.colors.primary[8],
                backgroundColor: theme.other.hitBackground,
              }}
            >
              <IconButton
                active={hit.scoop === "scoop"}
                onClick={() => handleScoopToggle("scoop")}
                style={{ transform: "scaleX(-1)" }}
              >
                <GiSpoon size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip
              label="Shovel HIT"
              position="bottom"
              style={{
                color: theme.colors.primary[8],
                backgroundColor: theme.other.hitBackground,
              }}
            >
              <IconButton
                active={hit.scoop === "shovel"}
                onClick={() => handleScoopToggle("shovel")}
              >
                <TbShovel size={20} />
              </IconButton>
            </Tooltip>
          </div>
          {!hideRequester && (
            <RequesterInfo onClick={() => onRequesterClick?.(hit.requester_id)}>
              {hit.requester_name}{" "}
              {isFavorite ? (
                <IconStarFilled
                  size={18}
                  color={theme.other.favoriteIcon}
                  style={{ position: "relative", top: "3px" }}
                />
              ) : (
                <IconUser size={18} />
              )}
            </RequesterInfo>
          )}
        </BottomSection>
        {hit.unavailable && hit.last_updated_time && (
          <LastSeenInfo>
            <IconAlertCircle size={16} />
            Last seen: {format(new Date(hit.last_updated_time), "PPPpp")} (
            {formatDistanceToNow(new Date(hit.last_updated_time), {
              addSuffix: true,
            })}
            )
          </LastSeenInfo>
        )}
      </HitItemWrapper>

      <YesNoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteHit}
        message={deleteModalMessage}
      />
    </>
  );
};

export default React.memo(HitItem);
