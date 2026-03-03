/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import HitSpoonerLogo from "./HitSpoonerLogo";

/**
 * Styled container for the top bar.
 */
const TopBarContainer = styled.div`
  width: 100%;
  top: 0;
  background: linear-gradient(90deg, ${(props) => props.theme.other.topBarBackground} 0%, ${(props) => props.theme.colors.primary[5]} 100%);
  color: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1000;
  padding: 8px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
`;

/**
 * TopBar component displaying the logo, theme selector, and dashboard access.
 */
const TopBar: React.FC = () => {
  return (
    <TopBarContainer>
      <HitSpoonerLogo />
    </TopBarContainer>
  );
};

export default TopBar;
