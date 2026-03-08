import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useTheme, Theme } from "@emotion/react";
import { Table, Progress, Tooltip, Badge } from "@mantine/core";
import { useStore } from "../../hooks";
import {
  useTotalEarnings,
  useTotalEarningsPerHour,
  useAverageRewardPerHit,
  useTotalDuration
} from "../../hooks/store/useStore";
import { IHitAssignment } from "@hit-spooner/api";
import PanelTitleBar from "../app/PanelTitleBar";
import { formatDistanceToNowStrict, format } from "date-fns";
import { themedScrollbarStyles } from "../../styles";

const StyledTable = styled(Table)`
  width: 100%;
  min-width: 800px;
`;

const TableContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  ${({ theme }) => `
    background-color: ${theme.colors.primary[0]};
  `}
  ${({ theme }) => themedScrollbarStyles(theme)};
`;

const HitQueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledTableHeaderRow = styled.tr`
  background-color: ${(props) => props.theme.colors.primary[2]};
`;

const StyledTableHeader = styled.th`
  color: ${(props) => props.theme.colors.primary[9]};
  padding: ${(props) => props.theme.spacing.xs};
  text-align: left;
  vertical-align: middle;
`;

const StatusHeader = styled(StyledTableHeader)`
  width: 80px;
  padding-left: ${(props) => props.theme.spacing.sm};
  text-align: center;
  vertical-align: middle;
`;

const RewardHeader = styled(StyledTableHeader)`
  text-align: right;
  width: 80px;
  vertical-align: middle;
`;

const StyledTableRow = styled.tr<{ isNext?: boolean }>`
  background-color: ${(props) => props.theme.colors.primary[0]};
  border-left: ${(props) => props.isNext ? `3px solid #16a34a` : 'none'};
  cursor: pointer;
  &:nth-of-type(even) {
    background-color: ${(props) => props.theme.colors.primary[1]};
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.primary[3]};
  }
`;

const StyledTableCell = styled.td`
  padding: ${(props) => props.theme.spacing.sm};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[3]};
  vertical-align: middle;
`;

const StatusCell = styled(StyledTableCell)`
  padding-left: ${(props) => props.theme.spacing.sm};
  width: 80px;
  text-align: center;
  vertical-align: middle;
`;

const TitleCell = styled(StyledTableCell)`
  cursor: pointer;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
`;

const RewardCell = styled(StyledTableCell)`
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  width: 80px;
  vertical-align: middle;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl};
  min-height: 300px;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: ${(props) => props.theme.colors.primary[5]};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const EmptyStateTitle = styled.div`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary[8]};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const EmptyStateDescription = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.primary[6]};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-width: 400px;
  text-align: center;
`;

const tooltipStyles = (theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.colors.primary[1],
    color: theme.colors.primary[8],
    border: `1px solid ${theme.colors.primary[3]}`,
  },
});

interface QueueRowProps {
  assignment: IHitAssignment;
  index: number;
  theme: Theme;
  currentTime: number;
  getRemainingTimeColor: (deadline: string) => string;
  calculateTimeRemainingPercentage: (deadline: string, duration: number) => number;
  tooltipStyles: (theme: Theme) => object;
}

const QueueRow: React.FC<QueueRowProps> = React.memo(({
  assignment,
  index,
  theme,
  currentTime,
  getRemainingTimeColor,
  calculateTimeRemainingPercentage,
  tooltipStyles,
}) => {
  const duration = assignment.project.assignment_duration_in_seconds || 0;
  const timePct = calculateTimeRemainingPercentage(assignment.deadline, duration);
  const timeColor = getRemainingTimeColor(assignment.deadline);
  const isNext = index === 0;

  // Memoize URL construction
  const hitUrl = React.useMemo(() =>
    `https://worker.mturk.com/projects/${assignment.project.hit_set_id}/tasks/${assignment.task_id}?assignment_id=${assignment.assignment_id}`,
    [assignment.project.hit_set_id, assignment.task_id, assignment.assignment_id]
  );

  const handleClick = React.useCallback(() => {
    window.open(hitUrl, "_blank", "noopener,noreferrer");
  }, [hitUrl]);

  return (
    <StyledTableRow
      key={assignment.assignment_id}
      isNext={isNext}
      onClick={handleClick}
    >
      <StatusCell>
        {isNext && (
          <Badge color="green" size="xs" variant="filled">
            NEXT
          </Badge>
        )}
      </StatusCell>
      <StyledTableCell>{assignment.project.requester_name}</StyledTableCell>
      <TitleCell title={assignment.project.title}>
        {assignment.project.title}
      </TitleCell>
      <RewardCell>
        ${assignment.project.monetary_reward?.amount_in_dollars?.toFixed(2) ?? "0.00"}
      </RewardCell>
      <StyledTableCell>
        <Tooltip
          label={format(new Date(assignment.deadline), "PPPpp")}
          position="top"
          styles={tooltipStyles(theme)}
        >
          <span style={{
            color: timeColor,
            fontWeight: "600",
            display: "inline-block"
          }}>
            {formatDistanceToNowStrict(new Date(assignment.deadline), {
              addSuffix: true,
              roundingMethod: 'floor'
            })}
          </span>
        </Tooltip>
        {duration > 0 && (
          <div style={{ marginTop: 6, maxWidth: 180 }}>
            <Progress
              value={Math.max(0, Math.min(100, timePct))}
              size="xs"
              radius="xl"
              styles={{ section: { backgroundColor: timeColor } }}
            />
          </div>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
});

const HitQueue: React.FC = () => {
  const queue = useStore((state) => state.queue);

  const totalEarnings = useStore(useTotalEarnings);
  const totalEarningsPerHour = useStore(useTotalEarningsPerHour);
  const averageRewardPerHit = useStore(useAverageRewardPerHit);
  const totalDuration = useStore(useTotalDuration);

  const theme = useTheme();

  const timeRef = useRef(Date.now());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current = Date.now();
      forceUpdate(n => n + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ["Requester", "Title", "Reward", "Deadline", "Time Remaining"].join(","),
      ...queue.map((a) => [
        `"${(a.project?.requester_name || "").replace(/"/g, '""')}"`,
        `"${(a.project?.title || "").replace(/"/g, '""')}"`,
        `${(a.project?.monetary_reward?.amount_in_dollars ?? 0).toFixed(2)}`,
        new Date(a.deadline).toISOString(),
        formatDistanceToNowStrict(new Date(a.deadline), { addSuffix: true }),
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = `mturk_queue_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [queue]);

  const calculateTimeRemainingPercentage = useCallback((deadline: string, duration: number) => {
    if (duration <= 0) return 0;
    const now = Date.now();
    const deadlineTime = new Date(deadline).getTime();
    const remaining = ((deadlineTime - now) / 1000 / duration) * 100;
    return Math.max(0, Math.min(remaining, 100));
  }, []);

  const getRemainingTimeColor = useCallback((deadline: string) => {
    const deadlineTime = new Date(deadline).getTime();
    const remainingSeconds = Math.floor((deadlineTime - timeRef.current) / 1000);
    
    if (remainingSeconds < 0) return theme.colors.primary[9];
    if (remainingSeconds < 600) return "#dc2626";
    if (remainingSeconds < 1800) return "#f59e0b";
    return "#16a34a";
  }, [theme.colors.primary[9], timeRef]); // Added timeRef as dependency

  if (queue.length === 0) {
    return (
      <HitQueueContainer>
        <PanelTitleBar
          title={`Your HITs Queue (${queue.length})`}
          totalEarnings={totalEarnings}
          totalEarningsPerHour={totalEarningsPerHour}
          averageRewardPerHit={averageRewardPerHit}
          totalDuration={totalDuration}
          onExport={handleExport}
        />
        <EmptyStateContainer>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateTitle>Your queue is empty</EmptyStateTitle>
          <EmptyStateDescription>
            You don't have any HITs accepted. Browse available HITs to build your queue and start earning!
          </EmptyStateDescription>
        </EmptyStateContainer>
      </HitQueueContainer>
    );
  }

  return (
    <HitQueueContainer>
      <PanelTitleBar
        title={`Your HITs Queue (${queue.length})`}
        totalEarnings={totalEarnings}
        totalEarningsPerHour={totalEarningsPerHour}
        averageRewardPerHit={averageRewardPerHit}
        totalDuration={totalDuration}
        onExport={handleExport}
      />
      <TableContainer>
        <StyledTable highlightOnHover verticalSpacing="sm" striped>
          <thead>
            <StyledTableHeaderRow>
              <StatusHeader>Status</StatusHeader>
              <StyledTableHeader>Requester</StyledTableHeader>
              <StyledTableHeader>Title</StyledTableHeader>
              <RewardHeader>Reward</RewardHeader>
              <StyledTableHeader>Time to Deadline</StyledTableHeader>
            </StyledTableHeaderRow>
          </thead>
          <tbody>
            {queue.map((assignment: IHitAssignment, index: number) => (
              <QueueRow
                key={assignment.assignment_id}
                assignment={assignment}
                index={index}
                theme={theme}
                currentTime={timeRef.current}
                getRemainingTimeColor={getRemainingTimeColor}
                calculateTimeRemainingPercentage={calculateTimeRemainingPercentage}
                tooltipStyles={tooltipStyles}
              />
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </HitQueueContainer>
  );
};

export default HitQueue;
