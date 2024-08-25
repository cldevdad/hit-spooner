import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Alert, Button, Stack, Text } from "@mantine/core";
import {
  IconClock,
  IconCurrencyDollar,
  IconSpeakerphone,
  IconStar,
  IconStarFilled,
  IconThumbDown,
  IconTrash,
} from "@tabler/icons-react";
import { useStore, useTurkerView } from "../../hooks";
import { StyledModal, themedScrollbarStyles } from "../../styles";
import HitList from "../workspace/HitList";

interface RequesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  requesterId: string;
}

// Styled component for displaying the requester's name
const RequesterName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary[8]};
`;

// Styled component for displaying the requester ID
const RequesterId = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary[7]};
`;

// Styled component for displaying information text with optional color
const StyledInfoText = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.color || props.theme.colors.primary[8]};
`;

// Styled container for the scrollable content within the modal
const ScrollableContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.other.hitBorder};
  ${({ theme }) => themedScrollbarStyles(theme)};
`;

// Styled component for the bottom actions section of the modal
const BottomActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: ${(props) => props.theme.spacing.md} 0;
  background-color: ${(props) => props.theme.colors.primary[0]};
`;

// Styled container for TurkerView information
const StyledTurkerViewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

// Main container for the modal content
const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 80vh;
`;

/**
 * RequesterModal component for displaying detailed information about a requester,
 * including their HITs and TurkerView ratings.
 */
const RequesterModal: React.FC<RequesterModalProps> = ({
  isOpen,
  onClose,
  requesterId,
}) => {
  const theme = useTheme() as Theme;

  const blockRequester = useStore((state) => state.blockRequester);
  const toggleFavoriteRequester = useStore(
    (state) => state.toggleFavoriteRequester
  );
  const favoriteRequesters = useStore((state) => state.favoriteRequesters);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    setIsFavorite(favoriteRequesters.some((r) => r.id === requesterId));
  }, [favoriteRequesters, requesterId]);

  // Retrieve hits related to the requester and their loading/error states
  const {
    hits,
    loading: hitsLoading,
    error: hitsError,
  } = useStore((state) => ({
    hits:
      state.hits.data?.filter((hit) => hit.requester_id === requesterId) || [],
    loading: state.hits.loading,
    error: state.hits.error,
  }));

  // Retrieve the number of columns and the function to set the columns for the HitList in the modal
  const requesterModalColumns = useStore(
    (state) => state.config.requesterModalColumns
  );
  const setRequesterModalColumns = useStore(
    (state) => state.config.setRequesterModalColumns
  );

  // Retrieve TurkerView information for the requester
  const { requesters } = useTurkerView([requesterId]);
  const requester = requesters[requesterId];

  // Handle blocking the requester and closing the modal
  const handleBlockRequester = () => {
    blockRequester(requesterId);
    onClose();
  };

  const handleToggleFavorite = () => {
    toggleFavoriteRequester(requesterId, requester?.requester_name || "");
  };

  // Map of icons for different TurkerView ratings
  const iconMap = {
    faDollar: <IconCurrencyDollar size={16} />,
    faThumbsODown: <IconThumbDown size={16} />,
    faBullhorn: <IconSpeakerphone size={16} />,
    faClockO: <IconClock size={16} />,
  };

  // Render function for displaying information items with labels and values
  const renderInfoItem = (
    label: string,
    value: string | null,
    iconComponent: JSX.Element,
    colorClass: keyof Theme["other"]["turkerView"]
  ) => (
    <StyledInfoText color={theme.other.turkerView[colorClass]}>
      {iconComponent} <strong>{label}:</strong> {value || "N/A"}
    </StyledInfoText>
  );

  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      title="Requester Info"
      zIndex={9999}
      size="75%"
      closeOnClickOutside={false}
    >
      <ModalContentContainer>
        <ScrollableContent>
          <Stack gap={theme.spacing.md}>
            <Stack align="center" gap={theme.spacing.xs}>
              <RequesterName>{requester?.requester_name}</RequesterName>
              <RequesterId>ID: {requesterId}</RequesterId>
            </Stack>

            {requester && (
              <StyledTurkerViewContainer>
                {renderInfoItem(
                  "Hourly Rate",
                  `$${requester.wages.average.wage}/hr`,
                  iconMap.faDollar,
                  requester.wages.average
                    .class as keyof Theme["other"]["turkerView"]
                )}
                {renderInfoItem(
                  "Pay",
                  requester.ratings.pay.text,
                  iconMap.faThumbsODown,
                  requester.ratings.pay
                    .class as keyof Theme["other"]["turkerView"]
                )}
                {renderInfoItem(
                  "Communication",
                  requester.ratings.comm.text,
                  iconMap.faBullhorn,
                  requester.ratings.comm
                    .class as keyof Theme["other"]["turkerView"]
                )}
                {renderInfoItem(
                  "Speed",
                  requester.ratings.fast.text,
                  iconMap.faClockO,
                  requester.ratings.fast
                    .class as keyof Theme["other"]["turkerView"]
                )}
              </StyledTurkerViewContainer>
            )}

            {hitsError && <Alert color="red">{hitsError}</Alert>}
            {hits.length > 0 ? (
              <HitList
                hits={hits}
                title={`Hits from ${requester?.requester_name}`}
                hideRequester
                columns={requesterModalColumns}
                setColumns={setRequesterModalColumns}
              />
            ) : (
              !hitsLoading && <Text>No HITs found for this requester.</Text>
            )}
          </Stack>
        </ScrollableContent>

        <BottomActions>
          <Button
            onClick={handleToggleFavorite}
            leftSection={
              isFavorite ? <IconStarFilled size={16} /> : <IconStar size={16} />
            }
            styles={{
              root: {
                backgroundColor: isFavorite
                  ? theme.other.favoriteIcon
                  : theme.other.buttonColor,
                color: theme.white,
                "&:hover": {
                  backgroundColor: isFavorite
                    ? theme.other.favoriteIcon
                    : theme.other.buttonHoverColor,
                },
                "&:active": {
                  backgroundColor: isFavorite
                    ? theme.other.favoriteIcon
                    : theme.other.buttonActiveColor,
                },
              },
            }}
          >
            {isFavorite ? "Unfavorite Requester" : "Favorite Requester"}
          </Button>

          <Button
            onClick={handleBlockRequester}
            leftSection={<IconTrash />}
            styles={{
              root: {
                backgroundColor: theme.other.negativeButtonColor,
                color: theme.white,
                "&:hover": {
                  backgroundColor: theme.other.negativeButtonHoverColor,
                },
                "&:active": {
                  backgroundColor: theme.other.negativeButtonActiveColor,
                },
              },
            }}
          >
            Block Requester
          </Button>
        </BottomActions>
      </ModalContentContainer>
    </StyledModal>
  );
};

export default RequesterModal;
