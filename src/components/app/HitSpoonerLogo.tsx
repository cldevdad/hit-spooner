import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import "@fontsource/poppins";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pop = keyframes`
  0% {
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  animation: ${fadeIn} 1s ease-in-out, ${pop} 1s ease-in-out;
  animation-fill-mode: both;
`;

const Text = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.other.logoTextColor};
  margin-left: 10px;
`;

const HitSpoonerLogo: React.FC = () => {
  return (
    <LogoContainer>
      <Text>HitSpooner</Text>
    </LogoContainer>
  );
};

export default HitSpoonerLogo;
