import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { IDailyHitStatistic } from "@hit-spooner/api";
import { Accordion, Badge, Box, Group, Stack, Text } from "@mantine/core";
import { IconCalendarEvent, IconCoin } from "@tabler/icons-react";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { useStore } from "../../hooks";
import { StyledModal, StyledTitle, themedAccordinStyles } from "../../styles";
import { groupByWeek } from "../../utils/groupByWeek";
import { EarningsOverview } from "../widgets/EarningsOverview";
import { HitDetails } from "../widgets/HitDetails";
import { WeeklyStatsTable } from "../widgets/WeeklyStatsTable";

interface IDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StyledWidgetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
`;

const StyledGroup = styled(Group)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const BadgeGroup = styled(Group)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const StyledWeekTextWrapper = styled.div`
  color: ${({ theme }) => theme.colors.primary[9]};
  font-weight: 500;
`;

const DashboardModal: React.FC<IDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const theme = useTheme();
  const { data: dashboardData } = useStore((state) => ({
    data: state.dashboard,
    loading: state.dashboard.loading,
  }));

  const filteredDailyStats = useMemo(() => {
    if (dashboardData?.data?.daily_hit_statistics_overview) {
      const dailyStats = dashboardData?.data.daily_hit_statistics_overview
        .map((stat) => ({
          date: format(new Date(stat.date), "MM/dd"),
          submitted: stat.submitted,
          approved: stat.approved,
          rejected: stat.rejected,
          pending: stat.pending,
          hits_rewards: stat.hits_rewards,
          bonus_rewards: stat.bonus_rewards,
          earnings: stat.earnings,
        }))
        .reverse();

      return dailyStats.filter((stat, index, array) =>
        array.slice(0, index).some((s) => s.earnings > 0)
      );
    }
  }, [dashboardData]);

  const {
    available_earnings,
    hits_overview,
    daily_hit_statistics_overview,
    earnings_to_date,
  } = dashboardData?.data ?? {
    available_earnings: {
      amount_in_dollars: 0,
      currency_code: "USD",
    },
    hits_overview: {
      approved: 0,
      approval_rate: 0,
      pending: 0,
      rejected: 0,
      rejection_rate: 0,
    },
    daily_hit_statistics_overview: [
      {
        date: "0",
        submitted: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        hits_rewards: 0,
        bonus_rewards: 0,
        earnings: 0,
      },
    ],
    earnings_to_date: {
      approved: 0,
      bonuses: 0,
      total_earnings: 0,
    },
  };

  const weeklyStats = Object.entries(
    groupByWeek(daily_hit_statistics_overview)
  ).map(([week, stats]) => ({
    week,
    stats: stats as IDailyHitStatistic[],
  }));

  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      title="Dashboard Data"
      size="80%"
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "ease",
      }}
      closeOnClickOutside
    >
      <Stack gap={theme.spacing.lg}>
        <StyledWidgetsContainer>
          <EarningsOverview
            availableEarnings={available_earnings.amount_in_dollars ?? 0}
            stats={filteredDailyStats ?? []}
          />
          <HitDetails
            hitsOverview={hits_overview}
            stats={filteredDailyStats ?? []}
          />
        </StyledWidgetsContainer>

        <Box>
          <StyledTitle order={4} mb={theme.spacing.sm}>
            Daily HIT Statistics
          </StyledTitle>

          <Accordion
            styles={themedAccordinStyles(theme)}
            defaultValue={weeklyStats[0]?.week || ""}
          >
            {weeklyStats.map(({ week, stats }) => {
              const totalEarnings = stats
                .reduce(
                  (acc: number, stat: IDailyHitStatistic) =>
                    acc + stat.earnings,
                  0
                )
                .toFixed(2);

              const totalSubmitted = stats.reduce(
                (acc, stat) => acc + stat.submitted,
                0
              );
              const totalApproved = stats.reduce(
                (acc, stat) => acc + stat.approved,
                0
              );
              const totalRejected = stats.reduce(
                (acc, stat) => acc + stat.rejected,
                0
              );
              const totalPending = stats.reduce(
                (acc, stat) => acc + stat.pending,
                0
              );

              return (
                <Accordion.Item key={week} value={week}>
                  <Accordion.Control icon={<IconCalendarEvent />}>
                    <StyledGroup>
                      <BadgeGroup>
                        <StyledWeekTextWrapper>
                          <Text>{week}</Text>
                        </StyledWeekTextWrapper>
                        <Badge
                          style={{
                            backgroundColor: theme.other.hitStatus.submitted,
                            color: theme.colors.primary[0],
                          }}
                          variant="light"
                        >
                          Submitted: {totalSubmitted}
                        </Badge>
                        <Badge
                          style={{
                            backgroundColor: theme.other.hitStatus.approved,
                            color: theme.colors.primary[0],
                          }}
                          variant="light"
                        >
                          Approved: {totalApproved}
                        </Badge>
                        {totalPending > 0 && (
                          <Badge
                            style={{
                              backgroundColor: theme.other.hitStatus.pending,
                              color: theme.colors.primary[0],
                            }}
                            variant="light"
                          >
                            Pending: {totalPending}
                          </Badge>
                        )}
                        {totalRejected > 0 && (
                          <Badge
                            style={{
                              backgroundColor: theme.other.hitStatus.rejected,
                              color: theme.colors.primary[0],
                            }}
                            variant="light"
                          >
                            Rejected: {totalRejected}
                          </Badge>
                        )}
                      </BadgeGroup>
                      <Badge
                        style={{
                          backgroundColor: theme.other.hitRewardColor,
                          color: theme.colors.primary[0],
                        }}
                        variant="light"
                        leftSection={<IconCoin size={16} />}
                        size="lg"
                      >
                        ${totalEarnings}
                      </Badge>
                    </StyledGroup>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <WeeklyStatsTable stats={stats} />
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Box>
      </Stack>
    </StyledModal>
  );
};

export default DashboardModal;
