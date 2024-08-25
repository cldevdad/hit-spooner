import React from "react";
import { Button, Stack, Text, Alert, ScrollArea, Group } from "@mantine/core";
import { useStore } from "../../hooks";
import { StyledModal } from "../../styles";

interface BlockedRequestersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * BlockedRequestersModal component for managing blocked requesters.
 */
const BlockedRequestersModal: React.FC<BlockedRequestersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { blockedRequesters, blockRequester } = useStore();

  const handleUnblock = (requesterId: string) => {
    blockRequester(requesterId);
  };

  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      title="Manage Blocked Requesters"
      size="lg"
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "ease",
      }}
      closeOnClickOutside
    >
      <Stack>
        {blockedRequesters.length === 0 ? (
          <Alert color="blue">No requesters are currently blocked.</Alert>
        ) : (
          <ScrollArea style={{ height: "90%" }}>
            {blockedRequesters.map((requesterId: string) => (
              <div
                key={requesterId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                }}
              >
                <Text>{requesterId}</Text>
                <Button color="red" onClick={() => handleUnblock(requesterId)}>
                  Unblock
                </Button>
              </div>
            ))}
          </ScrollArea>
        )}
      </Stack>
    </StyledModal>
  );
};

export default BlockedRequestersModal;
