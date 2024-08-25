import styled from "@emotion/styled";
import { IconAlertCircle } from "@tabler/icons-react";
import React from "react";

// Styled container for the main layout
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary[0]};
  overflow: hidden;
`;

// Styled container for the warning message and icon
const WarningMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

// Styled icon for warning
const WarningIcon = styled(IconAlertCircle)`
  color: ${({ theme }) => theme.other.negativeButtonColor};
  width: 4rem;
  height: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// Styled text components for the message
const WarningTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary[8]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WarningText = styled.p`
  color: ${({ theme }) => theme.colors.primary[7]};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary[6]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const NoMoreHitsPage: React.FC = () => {
  return (
    <MainContainer>
      <WarningMessageContainer>
        <WarningIcon />
        <WarningTitle>No More HITs Available</WarningTitle>
        <WarningText>There are no more of these HITs available.</WarningText>
        <InfoText>
          Keep this tab open if you want further HIT assignments to open here
          automatically.
        </InfoText>
      </WarningMessageContainer>
    </MainContainer>
  );
};

export default NoMoreHitsPage;
