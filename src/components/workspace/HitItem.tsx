import React, { useCallback, useMemo, useState } from "react";
import { keyframes, useTheme, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { IHitProjectWithHourlyRate } from "@hit-spooner/api";
import { Tooltip } from "@mantine/core";
import {
  IconAlertCircle,
  IconEye,
  IconStarFilled,
  IconUser,
  IconX,
  IconCurrencyDollar,
  IconSpeakerphone,
  IconClock,
  IconPercentage,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { GiSpoon } from "react-icons/gi";
import { MdOutlineQueuePlayNext } from "react-icons/md";
import { TbShovel } from "react-icons/tb";
import { useStore } from "../../hooks";
import { playSound } from "../../utils";
import { StyledTitle } from "../../styles";
import YesNoModal from "../modals/YesNoModal";

interface HitItemProps {
  hit: IHitProjectWithHourlyRate;
  hideRequester?: boolean;
  onRequesterClick?: (requesterId: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onAccept?: () => void;
  onPreview?: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const getRewardBorderColor = (amount: number): string => {
  if (amount >= 1.0) return "#22c55e";
  if (amount >= 0.50) return "#3b82f6";
  if (amount >= 0.25) return "#eab308";
  return "#9ca3af";
};

const HitItemWrapper = styled.div<{ unavailable?: boolean; isSelected?: boolean; rewardAmount?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.theme.other.hitBackground};
  border: 2px solid ${(props) => props.isSelected ? props.theme.colors.primary[5] : props.theme.other.hitBorder};
  border-left: 4px solid ${(props) => props.rewardAmount ? getRewardBorderColor(props.rewardAmount) : props.theme.other.hitBorder};
  border-radius: 8px;
  padding: ${(props) => props.theme.spacing.xxs};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  opacity: ${(props) => (props.unavailable ? 0.6 : 1)};
  transition: transform 0.3s, box-shadow 0.3s, opacity 0.5s ease-in-out, border-color 0.2s;
  cursor: pointer;

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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${(props) => props.theme.spacing.xxs};

  &:hover {
    text-decoration: underline;
  }
`;

const RequesterNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xxs};
`;

const RatingsContainer = styled.div<{ expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xxs};
  align-items: flex-end;
`;

const PrimaryRatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xxs};
`;

const DetailedRatingsContainerBase = styled.div<{ expanded: boolean }>`
  display: flex;
  gap: ${(props) => props.theme.spacing.xxs};
  flex-wrap: wrap;
  justify-content: flex-end;
  overflow: hidden;
  max-height: ${(props) => props.expanded ? "80px" : "0"};
  opacity: ${(props) => props.expanded ? "1" : "0"};
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;
const DetailedRatingsContainer: React.FC<{ expanded: boolean; children?: React.ReactNode }> = ({ expanded, children }) => (
  <DetailedRatingsContainerBase expanded={expanded}>{children}</DetailedRatingsContainerBase>
);

const ExpandToggleBase = styled.div<{ expanded: boolean }>`
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary[7]};
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary[8]};
  }

  span {
    transition: transform 0.2s ease-in-out;
    transform: rotate(${(props) => props.expanded ? "180deg" : "0deg"});
  }
`;
const ExpandToggle: React.FC<{ expanded: boolean; onClick?: React.MouseEventHandler; children?: React.ReactNode }> = ({ expanded, onClick, children }) => (
  <ExpandToggleBase expanded={expanded} onClick={onClick}>{children}</ExpandToggleBase>
);

const RatingBadge = styled.div<{ ratingClass?: keyof Theme["other"]["turkerView"] }>`
  font-size: ${(props) => props.theme.fontSizes.xs};
  padding: 2px 6px;
  height: auto;
  line-height: 1.2;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background-color: ${(props) => {
    if (!props.ratingClass) return props.theme.colors.primary[3];
    return props.theme.other.turkerView[props.ratingClass] || props.theme.colors.primary[3];
  }};
  color: ${(props) => props.theme.colors.primary[0]};
  border: none;
  cursor: pointer;
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

const AddToQueueIcon = styled(MdOutlineQueuePlayNext)`
  transition: opacity 0.3s;
  ${StyledButton}:hover & { opacity: 0; }
`;

const IconButton = styled.div<{ active?: boolean; scoopType?: "scoop" | "shovel" }>`
  cursor: pointer;
  color: ${(props) => {
    if (props.active) {
      if (props.scoopType === "scoop") return props.theme.other.scoopIconColor || props.theme.colors.secondary[0];
      if (props.scoopType === "shovel") return props.theme.other.shovelIconColor || props.theme.colors.secondary[2];
    }
    return props.theme.colors.primary[7];
  }};
  transition: color 0.3s;
  opacity: ${(props) => (props.active ? "1" : "0.3")};

  &:hover {
    color: ${(props) => props.active ? props.theme.other.favoriteIcon : props.theme.colors.primary[8]};
  }
`;

const DeleteIcon = styled(IconX)`
  cursor: pointer;
  color: ${(props) => props.theme.other.buttonColor};
  &:hover { color: ${(props) => props.theme.other.buttonHoverColor}; }
`;

const LastSeenInfo = styled.div`
  margin-top: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.primary[9]};
  display: flex;
  align-items: center;
  & > svg { margin-right: ${(props) => props.theme.spacing.xxs}; }
`;

const TOOLTIP_STYLE = { color: undefined as unknown as string, backgroundColor: undefined as unknown as string };

const getHourlyRateColor = (hourlyRate: string | undefined, colors: string[]): string => {
  if (!hourlyRate) return "transparent";
  const rateValue = parseFloat(hourlyRate.replace(/[^0-9.-]+/g, ""));
  if (isNaN(rateValue)) return "transparent";
  if (rateValue < 5) return colors[0];
  if (rateValue < 10) return colors[3];
  if (rateValue < 15) return colors[5];
  if (rateValue < 20) return colors[7];
  return colors[9];
};

export const HitItem: React.FC<HitItemProps> = ({
  hit,
  hideRequester = false,
  onRequesterClick,
  isSelected = false,
  onSelect,
  onAccept,
  onPreview,
}) => {
  const theme = useTheme();
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [areRatingsExpanded, setRatingsExpanded] = useState(false);

  const { acceptHit, deleteHit, addOrUpdateHit, addHitToAccept, removeHitFromAccept, favoriteRequesters } = useStore(
    useCallback((state) => ({
      acceptHit: state.acceptHit,
      deleteHit: state.deleteHit,
      addOrUpdateHit: state.addOrUpdateHit,
      addHitToAccept: state.addHitToAccept,
      removeHitFromAccept: state.removeHitFromAccept,
      favoriteRequesters: state.favoriteRequesters,
    }), [])
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect();
  }, [onSelect]);

  const handleDoubleClick = useCallback(() => {
    if (onAccept) onAccept();
  }, [onAccept]);

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreview) onPreview();
  }, [onPreview]);

  const handleScoopToggle = useCallback((scoopType: "scoop" | "shovel" | undefined) => {
    const updatedScoop = hit.scoop === scoopType ? undefined : scoopType;
    addOrUpdateHit({ ...hit, scoop: updatedScoop });
    if (updatedScoop) {
      addHitToAccept({ ...hit, scoop: updatedScoop });
    } else {
      removeHitFromAccept(hit.hit_set_id);
    }
  }, [hit, addOrUpdateHit, addHitToAccept, removeHitFromAccept]);

  const handleAcceptHit = useCallback(() => {
    if (hit.caller_meets_requirements) {
      setButtonVisible(false);
      playSound('chime');
      acceptHit(hit);
      setTimeout(() => setButtonVisible(true), 2000);
    } else if (hit.qualifications?.length) {
      const qualification = hit.qualifications.find((q) => !q.caller_meets_requirement);
      if (qualification?.qualification_request_url) {
        window.open(`https://worker.mturk.com${qualification.qualification_request_url}`, "_blank");
      }
    }
  }, [acceptHit, hit]);

  const handleDeleteHit = useCallback(() => {
    deleteHit(hit.hit_set_id);
    setDeleteModalOpen(false);
  }, [hit.hit_set_id, deleteHit]);

  const cleanTitle = useMemo(() => hit.title.replace(/\s*\(.*?\)\s*/g, " ").trim(), [hit.title]);

  const bulletPoints = useMemo(() => {
    const matches = hit.title.match(/\((.*?)\)/g);
    return matches ? matches.map(m => m.slice(1, -1)) : [];
  }, [hit.title]);

  const hourlyRateColor = useMemo(
    () => getHourlyRateColor(hit.hourlyRate, theme.other.hourlyRateColors),
    [hit.hourlyRate, theme.other.hourlyRateColors]
  );

  const isFavorite = useMemo(
    () => favoriteRequesters.some((r) => r.id === hit.requester_id),
    [favoriteRequesters, hit.requester_id]
  );

  const tooltipStyle = { ...TOOLTIP_STYLE, color: theme.colors.primary[8], backgroundColor: theme.other.hitBackground };

  return (
    <>
      <HitItemWrapper unavailable={hit.unavailable} isSelected={isSelected} rewardAmount={hit.monetary_reward?.amount_in_dollars || 0} onClick={handleClick} onDoubleClick={handleDoubleClick}>
        <TopSection>
          <LeftSection>
            <RewardPanel rateColor={hourlyRateColor}>
              <RewardAmount>${hit.monetary_reward.amount_in_dollars.toFixed(2)}</RewardAmount>
              {!hideRequester && <HourlyRate>{hit.hourlyRate}</HourlyRate>}
            </RewardPanel>
          </LeftSection>
          <HitInfo>
            <StyledTitle order={5}>{cleanTitle}</StyledTitle>
            {bulletPoints.length > 0 && (
              <BulletPoints>
                {bulletPoints.map((point, index) => <li key={index}>{point}</li>)}
              </BulletPoints>
            )}
          </HitInfo>
          {hit.unavailable ? (
            <DeleteIcon onClick={() => setDeleteModalOpen(true)} />
          ) : (
            <StyledButton onClick={handleAcceptHit} isVisible={isButtonVisible}>
              {hit.caller_meets_requirements ? <AddToQueueIcon size={20} /> : "Qualify"}
            </StyledButton>
          )}
        </TopSection>
        <BottomSection>
          <div style={{ display: "flex", gap: theme.spacing.sm }}>
            <Tooltip label="Preview HIT" position="bottom" style={tooltipStyle}>
              <IconButton active onClick={(e) => { e.stopPropagation(); window.open(`https://www.mturk.com/mturk/preview?groupId=${hit.hit_set_id}`, "_blank"); }}>
                <IconEye size={22} />
              </IconButton>
            </Tooltip>
            <Tooltip label="Scoop HIT" position="bottom" style={tooltipStyle}>
              <IconButton active={hit.scoop === "scoop"} scoopType="scoop" onClick={(e) => { e.stopPropagation(); handleScoopToggle("scoop"); }} style={{ transform: "scaleX(-1)" }}>
                <GiSpoon size={24} />
              </IconButton>
            </Tooltip>
            <Tooltip label="Shovel HIT" position="bottom" style={tooltipStyle}>
              <IconButton active={hit.scoop === "shovel"} scoopType="shovel" onClick={(e) => { e.stopPropagation(); handleScoopToggle("shovel"); }}>
                <TbShovel size={24} />
              </IconButton>
            </Tooltip>
          </div>
          {!hideRequester && (
            <RequesterInfo>
              <RequesterNameRow onClick={(e) => { e.stopPropagation(); onRequesterClick?.(hit.requester_id); }}>
                {hit.requester_name}{" "}
                {isFavorite ? (
                  <IconStarFilled size={18} color={theme.other.favoriteIcon} style={{ position: "relative", top: "3px" }} />
                ) : (
                  <IconUser size={18} />
                )}
              </RequesterNameRow>
              {(hit.requesterInfo?.taskApprovalRate || hit.requesterRatings) && (
                <RatingsContainer>
                  <PrimaryRatingRow>
                    {hit.requesterInfo?.taskApprovalRate && (
                      <Tooltip label={`MTurk Approval Rate: ${hit.requesterInfo.taskApprovalRate}`} position="top" style={tooltipStyle}>
                        <RatingBadge
                          ratingClass={parseFloat(hit.requesterInfo.taskApprovalRate.replace(/[^0-9.]/g, '') || "0") >= 99 ? "success" : parseFloat(hit.requesterInfo.taskApprovalRate.replace(/[^0-9.]/g, '') || "0") >= 95 ? "warning" : "danger"}
                        >
                          <IconPercentage size={12} />
                          {hit.requesterInfo.taskApprovalRate}
                        </RatingBadge>
                      </Tooltip>
                    )}
                    {hit.requesterRatings && (
                      <ExpandToggle expanded={areRatingsExpanded} onClick={() => setRatingsExpanded(!areRatingsExpanded)}>
                        <span>{areRatingsExpanded ? "▼" : "▶"}</span>
                        {areRatingsExpanded ? "Hide" : "More"}
                      </ExpandToggle>
                    )}
                  </PrimaryRatingRow>
                  {hit.requesterRatings && (
                    <DetailedRatingsContainer expanded={areRatingsExpanded}>
                      <Tooltip label={`Pay: ${hit.requesterRatings.pay.text}`} position="top" style={tooltipStyle}>
                        <RatingBadge
                          ratingClass={hit.requesterRatings.pay.class as keyof Theme["other"]["turkerView"]}
                        >
                          <IconCurrencyDollar size={12} />
                          {hit.requesterRatings.pay.text}
                        </RatingBadge>
                      </Tooltip>
                      <Tooltip label={`Communication: ${hit.requesterRatings.comm.text}`} position="top" style={tooltipStyle}>
                        <RatingBadge
                          ratingClass={hit.requesterRatings.comm.class as keyof Theme["other"]["turkerView"]}
                        >
                          <IconSpeakerphone size={12} />
                          {hit.requesterRatings.comm.text}
                        </RatingBadge>
                      </Tooltip>
                      <Tooltip label={`Speed: ${hit.requesterRatings.fast.text}`} position="top" style={tooltipStyle}>
                        <RatingBadge
                          ratingClass={hit.requesterRatings.fast.class as keyof Theme["other"]["turkerView"]}
                        >
                          <IconClock size={12} />
                          {hit.requesterRatings.fast.text}
                        </RatingBadge>
                      </Tooltip>
                    </DetailedRatingsContainer>
                  )}
                </RatingsContainer>
              )}
            </RequesterInfo>
          )}
        </BottomSection>
        {hit.unavailable && hit.last_updated_time && (
          <LastSeenInfo>
            <IconAlertCircle size={16} />
            <Tooltip label={format(new Date(hit.last_updated_time), "PPPpp")} position="top" style={tooltipStyle}>
              <span>Last seen: {formatDistanceToNow(new Date(hit.last_updated_time), { addSuffix: true })}</span>
            </Tooltip>
          </LastSeenInfo>
        )}
      </HitItemWrapper>

      <YesNoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteHit}
        message={<div><p>Are you sure you want to delete this HIT?</p><HitItemWrapper unavailable={hit.unavailable}><TopSection><LeftSection><RewardPanel rateColor={hourlyRateColor}><RewardAmount>${hit.monetary_reward.amount_in_dollars.toFixed(2)}</RewardAmount>{!hideRequester && <HourlyRate>{hit.hourlyRate}</HourlyRate>}</RewardPanel></LeftSection><HitInfo><StyledTitle order={5}>{cleanTitle}</StyledTitle>{bulletPoints.length > 0 && (<BulletPoints>{bulletPoints.map((point, index) => <li key={index}>{point}</li>)}</BulletPoints>)}</HitInfo></TopSection></HitItemWrapper></div>}
      />
    </>
  );
};

export default React.memo(HitItem);
