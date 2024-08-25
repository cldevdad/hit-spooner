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
  background-color: ${(props) => props.theme.other.topBarBackground};
  color: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1000;
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
