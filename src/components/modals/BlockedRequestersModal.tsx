import React, { useMemo } from "react";
import { Button, Stack, Text, Alert, ScrollArea, Group, Modal, Center, Card, Badge } from "@mantine/core";
import { useStore } from "../../hooks";
import { StyledModal } from "../../styles";
import { notifications } from "@mantine/notifications";
import { IconBan, IconX, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import { LocalStorageKeys } from "../../hooks/store/LocalStorageKeys";

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
  const [requesterToUnblock, setRequesterToUnblock] = React.useState<string | null>(null);
  const [unblockAllConfirm, setUnblockAllConfirm] = React.useState(false);

  const blockedCount = useMemo(() => blockedRequesters.length, [blockedRequesters.length]);

  const handleUnblock = (requesterId: string) => {
    setRequesterToUnblock(requesterId);
  };

  const confirmUnblock = () => {
    if (requesterToUnblock) {
      blockRequester(requesterToUnblock);
      setRequesterToUnblock(null);
      notifications.show({
        title: "Requester Unblocked",
        message: `Requester ${requesterToUnblock} has been unblocked`,
        color: "teal",
      });
    }
  };

  const handleUnblockAll = () => {
    setUnblockAllConfirm(true);
  };

  const confirmUnblockAll = () => {
    localStorage.setItem(LocalStorageKeys.BlockedRequesters, "[]");
    window.location.reload();
  };

  const cancelUnblock = () => {
    setRequesterToUnblock(null);
  };

  const cancelUnblockAll = () => {
    setUnblockAllConfirm(false);
  };

  return (
    <>
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
        <Stack gap="md">
          {blockedCount === 0 ? (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Center>
                <Stack align="center" gap="sm">
                  <IconBan size={48} color="gray" />
                  <Text size="lg" fw={500} c="dimmed">
                    No requesters are currently blocked
                  </Text>
                  <Text size="sm" c="dimmed">
                    Blocked requesters will appear here when you block them from the Requester Info modal
                  </Text>
                </Stack>
              </Center>
            </Card>
          ) : (
            <>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Total blocked: <Badge color="red">{blockedCount}</Badge>
                </Text>
                <Button 
                  size="xs" 
                  variant="light" 
                  color="red"
                  onClick={handleUnblockAll}
                  leftSection={<IconTrash size={16} />}
                >
                  Unblock All
                </Button>
              </Group>

              <ScrollArea h={400} offsetScrollbars>
                <Stack gap="xs">
                  {blockedRequesters.map((requesterId: string) => (
                    <Card 
                      key={requesterId} 
                      shadow="sm" 
                      padding="sm" 
                      radius="md" 
                      withBorder
                    >
                      <Group justify="space-between" align="center">
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {requesterId}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Blocked requester
                          </Text>
                        </Stack>
                        
                        <Button
                          size="xs"
                          variant="filled"
                          color="green"
                          onClick={() => handleUnblock(requesterId)}
                          leftSection={<IconX size={14} />}
                        >
                          Unblock
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>

              <Alert color="yellow" icon={<IconAlertTriangle size={16} />}>
                <Text size="sm">
                  Blocked requesters will be automatically filtered from your HIT search results.
                </Text>
              </Alert>
            </>
          )}
        </Stack>
      </StyledModal>

      <Modal
        opened={requesterToUnblock !== null}
        onClose={cancelUnblock}
        title="Confirm Unblock"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to unblock requester <Text fw="bold" span>{requesterToUnblock}</Text>?
          </Text>
          <Group justify="center" mt="md">
            <Button variant="default" onClick={cancelUnblock}>
              Cancel
            </Button>
            <Button color="teal" onClick={confirmUnblock}>
              Yes, Unblock
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={unblockAllConfirm}
        onClose={cancelUnblockAll}
        title="Confirm Unblock All"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to unblock all <Text fw="bold" span>{blockedCount}</Text> requesters?
          </Text>
          <Text size="sm" c="dimmed">
            This action cannot be undone.
          </Text>
          <Group justify="center" mt="md">
            <Button variant="default" onClick={cancelUnblockAll}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmUnblockAll}>
              Yes, Unblock All
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default BlockedRequestersModal;
