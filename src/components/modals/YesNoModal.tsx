import { useTheme } from "@emotion/react";
import { Button, Group, Text } from "@mantine/core";
import React from "react";
import { StyledAlert, StyledModal } from "../../styles";

/**
 * Props for the YesNoModal component.
 */
interface IYesNoModalProps {
  /**
   * Indicates whether the modal is open or closed.
   * @type {boolean}
   */
  isOpen: boolean;

  /**
   * Callback function to close the modal.
   * @type {() => void}
   */
  onClose: () => void;

  /**
   * Callback function to confirm the action.
   * This function is triggered when the user clicks the "Yes" button.
   * @type {() => void}
   */
  onConfirm: () => void;

  /**
   * The confirmation message to display in the modal.
   * This can be either a string or a custom JSX element.
   * @type {string | React.ReactNode}
   */
  message: string | React.ReactNode;
}

/**
 * YesNoModal component for displaying a confirmation dialog.
 * @param {boolean} isOpen - Determines if the modal is open.
 * @param {() => void} onClose - Callback function to close the modal.
 * @param {() => void} onConfirm - Callback function to confirm the action.
 * @param {string | React.ReactNode} message - The confirmation message to display, can be a string or custom JSX.
 */
export const YesNoModal: React.FC<IYesNoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
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
          color="red"
          onClick={onConfirm}
          style={{
            backgroundColor: theme.other.negativeButtonColor,
          }}
        >
          Yes
        </Button>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: theme.other.okButtonColor,
          }}
        >
          No
        </Button>
      </Group>
    </StyledAlert>
  );
};

export default YesNoModal;
