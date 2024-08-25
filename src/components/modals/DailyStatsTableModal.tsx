import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { IHitCompletion } from "@hit-spooner/api";
import {
  Badge,
  Box,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconCash, IconClock, IconMoneybag, IconX } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyledModal,
  StyledTable,
  StyledTableCell,
  StyledTableHeader,
  StyledTableHeaderRow,
  StyledTableRow,
} from "../../styles";

interface DailyStatsTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

const StickySummaryBox = styled.div`
  position: sticky;
  top: -20px;
  background-color: ${({ theme }) => theme.colors.primary[0]};
  z-index: 1;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  display: block;
  margin: 0;
`;

export const DailyStatsTableModal: React.FC<DailyStatsTableModalProps> = ({
  isOpen,
  onClose,
  date,
}) => {
  const theme = useTheme();
  const [hitCompletions, setHitCompletions] = useState<IHitCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHitCompletions = async () => {
      let page = 1;
      let allResults: IHitCompletion[] = [];
      let hasMoreResults = true;

      while (hasMoreResults) {
        const response = await fetch(
          `https://worker.mturk.com/status_details/${date}/?page_number=${page}&format=json`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          allResults = [...allResults, ...data.results];
          page++;
        } else {
          hasMoreResults = false;
        }
      }

      setHitCompletions(allResults);
      setLoading(false);
    };

    if (isOpen) {
      fetchHitCompletions();
    }
  }, [date, isOpen]);

  const summary = useMemo(() => {
    return hitCompletions.reduce(
      (acc, hit) => {
        if (hit.state !== "Rejected") {
          acc.totalEarnings += hit.reward.amount_in_dollars;
        } else {
          acc.totalEarnings -= hit.reward.amount_in_dollars;
        }

        acc.requesters[hit.requester_name] = acc.requesters[
          hit.requester_name
        ] || {
          count: 0,
          earnings: 0,
        };
        acc.requesters[hit.requester_name].count++;
        acc.requesters[hit.requester_name].earnings +=
          hit.reward.amount_in_dollars;

        if (hit.state === "Paid") acc.approved++;
        if (hit.state === "Approved") acc.approved++;
        if (hit.state === "Rejected") acc.rejected++;
        if (hit.state === "Pending") acc.pending++;
        if (hit.state === "Submitted") acc.submitted++;
        return acc;
      },
      {
        approved: 0,
        rejected: 0,
        pending: 0,
        submitted: 0,
        totalEarnings: 0,
        requesters: {} as Record<string, { count: number; earnings: number }>,
      }
    );
  }, [hitCompletions]);

  if (loading) {
    return (
      <Group align="center" justify="center" style={{ height: "100%" }}>
        <Loader size="xl" />
        <Text>Loading details for {new Date(date).toLocaleDateString()}</Text>
      </Group>
    );
  }

  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      title="Daily HIT Details"
      size="80%"
      zIndex={10001}
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "ease",
      }}
      closeOnClickOutside
    >
      <Stack gap="md">
        <StickySummaryBox>
          <Group align="apart" justify="space-between">
            <Title order={4}>
              Summary for {new Date(date).toLocaleDateString()}
            </Title>
            <Text size="xl" c={theme.other.hitRewardColor}>
              Total Earnings: ${summary.totalEarnings.toFixed(2)}
            </Text>
          </Group>
          <Divider my="sm" />
          <Group gap="xs">
            <Badge
              leftSection={<IconMoneybag size={16} />}
              style={{
                backgroundColor: theme.other.hitStatus.paid,
                color: theme.colors.primary[0],
              }}
              variant="light"
            >
              Paid: {summary.approved}
            </Badge>
            <Badge
              leftSection={<IconCash size={16} />}
              style={{
                backgroundColor: theme.other.hitStatus.approved,
                color: theme.colors.primary[0],
              }}
              variant="light"
            >
              Approved: {summary.approved}
            </Badge>
            <Badge
              leftSection={<IconClock size={16} />}
              style={{
                backgroundColor: theme.other.hitStatus.pending,
                color: theme.colors.primary[0],
              }}
              variant="light"
            >
              Pending: {summary.submitted}
            </Badge>
            <Badge
              leftSection={<IconX size={16} />}
              style={{
                backgroundColor: theme.other.hitStatus.rejected,
                color: theme.colors.primary[0],
              }}
              variant="light"
            >
              Rejected: {summary.rejected}
            </Badge>
          </Group>
        </StickySummaryBox>

        <Box mt="md">
          <Text size="md" w={600} mt="md">
            Requesters Breakdown
          </Text>
          <StyledTable highlightOnHover verticalSpacing="sm" striped>
            <thead>
              <StyledTableHeaderRow>
                <StyledTableHeader>Requester</StyledTableHeader>
                <StyledTableHeader>HITs Completed</StyledTableHeader>
                <StyledTableHeader>Total Earnings</StyledTableHeader>
              </StyledTableHeaderRow>
            </thead>
            <tbody>
              {Object.entries(summary.requesters).map(
                ([requesterName, { count, earnings }]) => (
                  <StyledTableRow key={requesterName}>
                    <StyledTableCell>{requesterName}</StyledTableCell>
                    <StyledTableCell>{count}</StyledTableCell>
                    <StyledTableCell>${earnings.toFixed(2)}</StyledTableCell>
                  </StyledTableRow>
                )
              )}
            </tbody>
          </StyledTable>
        </Box>

        <Box mt="md">
          <Text size="md" w={600} mt="md">
            All HIT Completions
          </Text>
          <StyledTable highlightOnHover verticalSpacing="sm" striped>
            <thead>
              <StyledTableHeaderRow>
                <StyledTableHeader>Status</StyledTableHeader>
                <StyledTableHeader>Title</StyledTableHeader>
                <StyledTableHeader>Requester</StyledTableHeader>
                <StyledTableHeader>Reward</StyledTableHeader>
              </StyledTableHeaderRow>
            </thead>
            <tbody>
              {hitCompletions.map((completion) => (
                <StyledTableRow key={completion.assignment_id}>
                  <StyledTableCell>
                    {completion.state === "Submitted" && (
                      <Badge
                        variant="light"
                        leftSection={<IconMoneybag size={14} />}
                        style={{
                          backgroundColor: theme.other.hitStatus.pending,
                          color: theme.colors.primary[0],
                        }}
                      >
                        Submitted
                      </Badge>
                    )}
                    {completion.state === "Paid" && (
                      <Badge
                        variant="light"
                        leftSection={<IconMoneybag size={14} />}
                        style={{
                          backgroundColor: theme.other.hitStatus.paid,
                          color: theme.colors.primary[0],
                        }}
                      >
                        Paid
                      </Badge>
                    )}
                    {completion.state === "Approved" && (
                      <Badge
                        variant="light"
                        leftSection={<IconCash size={14} />}
                        style={{
                          backgroundColor: theme.other.hitStatus.approved,
                          color: theme.colors.primary[0],
                        }}
                      >
                        Approved
                      </Badge>
                    )}
                    {completion.state === "Rejected" && (
                      <Badge
                        variant="light"
                        leftSection={<IconX size={14} />}
                        style={{
                          backgroundColor: theme.other.hitStatus.rejected,
                          color: theme.colors.primary[0],
                        }}
                      >
                        Rejected
                      </Badge>
                    )}
                    {completion.state === "Pending" && (
                      <Badge
                        variant="light"
                        leftSection={<IconClock size={14} />}
                        style={{
                          backgroundColor: theme.other.hitStatus.pending,
                          color: theme.colors.primary[0],
                        }}
                      >
                        Pending
                      </Badge>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{completion.title}</StyledTableCell>
                  <StyledTableCell>{completion.requester_name}</StyledTableCell>
                  <StyledTableCell>
                    <Tooltip
                      label={`${
                        completion.reward.amount_in_dollars > 1
                          ? completion.reward.amount_in_dollars.toFixed(2)
                          : completion.reward.amount_in_dollars.toFixed(3)
                      }`}
                      withArrow
                      position="bottom"
                    >
                      <Text
                        color={theme.other.chartPositiveColor}
                        style={{
                          textDecoration:
                            completion.state === "Rejected"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        ${completion.reward.amount_in_dollars.toFixed(2)}
                      </Text>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </tbody>
          </StyledTable>
        </Box>
      </Stack>
    </StyledModal>
  );
};
