import React from "react";
import { Modal, ScrollArea, Text, Badge, Group, Stack, Divider, Button } from "@mantine/core";
import { IHitProject } from "@hit-spooner/api";

interface HitPreviewModalProps {
  hit: IHitProject | null;
  opened: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const HitPreviewModal: React.FC<HitPreviewModalProps> = ({
  hit,
  opened,
  onClose,
  onAccept,
}) => {
  if (!hit) return null;

  const reward = hit.monetary_reward?.amount_in_dollars || 0;
  const duration = hit.assignment_duration_in_seconds || 0;
  const durationMin = Math.ceil(duration / 60);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          HIT Preview
        </Text>
      }
      size="lg"
      centered
    >
      <ScrollArea h={400}>
        <Stack gap="md">
          <div>
            <Text fw={700} size="xl">
              {hit.title}
            </Text>
            <Text size="sm" c="dimmed">
              by {hit.requester_name}
            </Text>
          </div>

          <Group gap="md">
            <Badge size="xl" color="green" variant="filled">
              ${reward.toFixed(2)}
            </Badge>
            <Badge size="lg" color="blue" variant="light">
              {durationMin} min{durationMin !== 1 ? "s" : ""}
            </Badge>
            {hit.qualifications?.some((q) => q.name?.toLowerCase().includes("master")) && (
              <Badge size="lg" color="violet" variant="filled">
                Masters Only
              </Badge>
            )}
          </Group>

          <Divider />

          <div>
            <Text fw={600} mb="xs">
              Description
            </Text>
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {hit.description}
            </Text>
          </div>

          {hit.qualifications && hit.qualifications.length > 0 && (
            <>
              <Divider />
              <div>
                <Text fw={600} mb="xs">
                  Qualifications
                </Text>
                <Group gap="xs">
                  {hit.qualifications.map((qual: any, idx: number) => (
                    <Badge key={idx} color="gray" variant="outline">
                      {qual.name}
                    </Badge>
                  ))}
                </Group>
              </div>
            </>
          )}

          <Divider />

          <div>
            <Text fw={600} mb="xs">
              Instructions
            </Text>
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {(hit as any).hit_instructions || "No special instructions."}
            </Text>
          </div>
        </Stack>
      </ScrollArea>

      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
        <Button color="green" onClick={onAccept}>
          Accept HIT
        </Button>
      </Group>
    </Modal>
  );
};
