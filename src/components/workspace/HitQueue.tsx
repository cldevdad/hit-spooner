import React from "react";
import styled from "@emotion/styled";
import { Table, Text, Progress } from "@mantine/core";
import { useStore } from "../../hooks";
import { IHitAssignment } from "@hit-spooner/api";
import PanelTitleBar from "../app/PanelTitleBar";
import { formatDistanceToNowStrict } from "date-fns";

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledTableHeaderRow = styled.tr`
  background-color: ${(props) => props.theme.colors.primary[2]};
`;

const StyledTableHeader = styled.th`
  color: ${(props) => props.theme.colors.primary[9]};
  padding: ${(props) => props.theme.spacing.xs};
  text-align: left;
`;

const StyledTableRow = styled.tr`
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary[0]};
  &:nth-of-type(even) {
    background-color: ${(props) => props.theme.colors.primary[1]};
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.primary[3]};
  }
`;

const StyledTableCell = styled.td`
  padding: ${(props) => props.theme.spacing.xs};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[3]};
`;

const CenteredText = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.primary[6]};
  font-size: ${(props) => props.theme.fontSizes.md};
  margin-top: 50px;
`;

/**
 * Component to display the user's HIT assignment queue with clickable rows that
 * open the HIT in a new window.
 */
const HitQueue: React.FC = () => {
  const { queue } = useStore((state) => ({
    queue: state.queue,
  }));

  const handleRowClick = (assignment: IHitAssignment) => {
    const url = `https://worker.mturk.com/projects/${assignment.project.hit_set_id}/tasks/${assignment.task_id}?assignment_id=${assignment.assignment_id}`;

    // Open a window/tab with full features and reuse it
    window.open(url, "mturkWindow");
  };

  const calculateTimeRemainingPercentage = (
    deadline: string,
    assignmentDurationInSeconds: number
  ) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const timeRemainingInSeconds = (deadlineTime - now) / 1000; // Convert to seconds

    if (assignmentDurationInSeconds <= 0) {
      return 0;
    }

    const percentageRemaining =
      (timeRemainingInSeconds / assignmentDurationInSeconds) * 100;
    return Math.max(0, Math.min(percentageRemaining, 100));
  };

  if (queue.length === 0) {
    return (
      <>
        <PanelTitleBar title="Your HITs Queue" />
        <CenteredText>You don't currently have any HITs accepted.</CenteredText>
      </>
    );
  }

  return (
    <>
      <PanelTitleBar title="Your HITs Queue" />

      <StyledTable highlightOnHover verticalSpacing="sm" striped>
        <thead>
          <StyledTableHeaderRow>
            <StyledTableHeader>Requester</StyledTableHeader>
            <StyledTableHeader>Title</StyledTableHeader>
            <StyledTableHeader>Reward</StyledTableHeader>
            <StyledTableHeader>Time to Deadline</StyledTableHeader>
          </StyledTableHeaderRow>
        </thead>
        <tbody>
          {queue.map((assignment: IHitAssignment) => {
            const assignmentDurationInSeconds =
              assignment.project.assignment_duration_in_seconds || 0;

            return (
              <StyledTableRow
                key={assignment.assignment_id}
                onClick={() => handleRowClick(assignment)}
              >
                <StyledTableCell>
                  {assignment.project.requester_name}
                </StyledTableCell>
                <StyledTableCell>{assignment.project.title}</StyledTableCell>
                <StyledTableCell>
                  $
                  {assignment.project.monetary_reward.amount_in_dollars.toFixed(
                    2
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ marginBottom: "4px" }}>
                    {formatDistanceToNowStrict(new Date(assignment.deadline), {
                      addSuffix: true,
                    })}
                  </div>
                  <Progress
                    value={calculateTimeRemainingPercentage(
                      assignment.deadline,
                      assignmentDurationInSeconds
                    )}
                    size="xs"
                    color="blue"
                  />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </tbody>
      </StyledTable>
    </>
  );
};

export default HitQueue;
