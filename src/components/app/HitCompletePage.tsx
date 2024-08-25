import styled from "@emotion/styled";
import { IconCircleCheck } from "@tabler/icons-react";
import confetti from "canvas-confetti";
import React, { useEffect } from "react";

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

// Styled container for the success message and icon
const SuccessMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  position: relative; /* Needed for absolute positioning of the coins */
`;

// Styled icon for success
const SuccessIcon = styled(IconCircleCheck)`
  color: ${({ theme }) => theme.other.chartPositiveColor};
  width: 4rem;
  height: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// Styled text components for the message
const SuccessTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary[8]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.primary[7]};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary[6]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const HitCompletePage: React.FC = () => {
  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 200 - 100;
      const y = Math.random() * 100 - 50;
      const delay = i * 0.1;

      setTimeout(() => {
        const coin = document.createElement("div");
        coin.textContent = "💰";
        coin.style.position = "absolute";
        coin.style.fontSize = "20px";
        coin.style.left = "50%";
        coin.style.transform = "translateX(-50%)";
        document.body.appendChild(coin);

        coin.animate(
          [
            { transform: `translate(0, 0) scale(1)`, opacity: 1 },
            { transform: `translate(${x}px, -${y}px) scale(0)`, opacity: 0 },
          ],
          {
            duration: 1000,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        setTimeout(() => {
          document.body.removeChild(coin);
        }, 1000);
      }, delay * 1000);
    }

    // Confetti effect
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <MainContainer>
      <SuccessMessageContainer>
        <SuccessIcon />
        <SuccessTitle>HIT Submitted Successfully!</SuccessTitle>
        <SuccessText>
          Thank you for your submission. Your HIT has been recorded.
        </SuccessText>
        <InfoText>
          Keep this tab open if you want further HIT assignments to open here
          automatically.
        </InfoText>
      </SuccessMessageContainer>
    </MainContainer>
  );
};

export default HitCompletePage;
