import { useTheme } from "@emotion/react";
import { Button, Group, Text } from "@mantine/core";
import React from "react";
import { StyledAlert, StyledModal } from "../../styles";

interface IYesNoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const YesNoModal: React.FC<IYesNoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Yes",
  cancelLabel = "No",
}) => {
  const theme = useTheme();

  return (
    <StyledAlert
      opened={isOpen}
      onClose={onClose}
      title="Are you sure?"
      size="sm"
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "ease",
      }}
      closeOnClickOutside
    >
      <Text
        style={{
          marginBottom: theme.spacing.md,
          color: theme.colors.primary[8],
        }}
      >
        {message}
      </Text>
      <Group align="right">
        <Button
          onClick={onConfirm}
          style={{
            backgroundColor: theme.other.okButtonColor,
          }}
        >
          {confirmLabel}
        </Button>
        <Button
          color="red"
          onClick={onClose}
          style={{
            backgroundColor: theme.other.negativeButtonColor,
          }}
        >
          {cancelLabel}
        </Button>
      </Group>
    </StyledAlert>
  );
};

export default YesNoModal;
