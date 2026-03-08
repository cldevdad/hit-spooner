import React from "react";
import { Alert, Stack, Text, Button, Group, Card } from "@mantine/core";
import { StyledModal } from "../../styles";
import { IconAlertTriangle, IconLogin, IconRefresh } from "@tabler/icons-react";

interface LoggedOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoggedOutModal: React.FC<LoggedOutModalProps> = ({ isOpen, onClose }) => {
  const handleLoginClick = () => {
    window.location.href = "https://worker.mturk.com";
  };

  const handleReloadClick = () => {
    window.location.reload();
  };

  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      title="Not Logged Into MTurk"
      size="md"
      transitionProps={{ transition: "fade", duration: 300, timingFunction: "ease" }}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <Stack gap="md">
        <Alert color="yellow" icon={<IconAlertTriangle size={24} />} title="Session Required">
          <Stack gap="sm">
            <Text size="sm">
              Hit Spooner requires you to be logged into Amazon Mechanical Turk to fetch HITs.
            </Text>
            <Text size="sm" c="dimmed">
              Your MTurk session may have expired or you may not be logged in.
            </Text>
          </Stack>
        </Alert>

        <Card withBorder padding="md" shadow="sm">
          <Stack gap="sm">
            <Text size="sm" fw={500}>What's happening:</Text>
            <Text size="sm" c="dimmed" pl="xs">• Extension trying to fetch from worker.mturk.com</Text>
            <Text size="sm" c="dimmed" pl="xs">• MTurk redirecting to login page</Text>
            <Text size="sm" c="dimmed" pl="xs">• HIT fetching has been paused</Text>
          </Stack>
        </Card>

        <Group justify="center" mt="md">
          <Button leftSection={<IconLogin size={18} />} onClick={handleLoginClick} size="md" style={{ flex: 1 }}>
            Go to MTurk Login
          </Button>
          <Button leftSection={<IconRefresh size={18} />} onClick={handleReloadClick} variant="light" size="md" style={{ flex: 1 }}>
            Reload Page
          </Button>
        </Group>

        <Text size="xs" c="dimmed" ta="center" mt="sm">
          After logging in, this modal will close automatically.
        </Text>
      </Stack>
    </StyledModal>
  );
};

export default LoggedOutModal;
