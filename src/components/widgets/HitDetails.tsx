import React, { useEffect } from "react";
import { Paper, ThemeIcon } from "@mantine/core";
import ReactApexChart from "react-apexcharts";
import { StyledTitle } from "../../styles";
import { ApexOptions } from "apexcharts";
import { Theme, useTheme } from "@emotion/react";
import { IDailyHitStatistic, IHitsOverview } from "@hit-spooner/api";
import {
  IconCheck,
  IconX,
  IconClock,
  IconPercentage,
} from "@tabler/icons-react";
import styled from "@emotion/styled";

interface HitDetailsProps {
  hitsOverview: IHitsOverview;
  stats: IDailyHitStatistic[];
}

const StatCardWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  justify-content: center;
`;

const StatTextWrapper = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: 0.8rem;
`;

const StatValueWrapper = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 700;
  font-size: 1.25rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const HitDetails: React.FC<HitDetailsProps> = ({
  hitsOverview,
  stats,
}) => {
  const theme = useTheme() as Theme;

  useEffect(() => {
    // Apply CSS variables for the custom tooltip
    const root = document.documentElement;
    root.style.setProperty(
      "--tooltip-background-color",
      theme.colors.primary[1]
    );
    root.style.setProperty("--tooltip-text-color", theme.colors.primary[9]);
  }, [theme]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 200,
      stacked: true,
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      categories: stats?.map((data) => data.date) || [],
      labels: {
        show: true,
        style: {
          colors: theme.colors.primary[8],
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return Math.round(value).toString();
        },
        style: {
          colors: theme.colors.primary[8],
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    colors: [
      theme.other.hitStatus.approved,
      theme.other.hitStatus.rejected,
      theme.other.hitStatus.pending,
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      labels: {
        colors: theme.colors.primary[8],
      },
    },
    tooltip: {
      cssClass: "apex-chart-tooltip",
    },
  };

  const chartData = [
    {
      name: "Approved",
      data: stats?.map((data) => data.approved) || [],
    },
    {
      name: "Rejected",
      data: stats?.map((data) => data.rejected) || [],
    },
    {
      name: "Pending",
      data: stats?.map((data) => data.pending) || [],
    },
  ];

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{
        backgroundColor: theme.colors.primary[1],
        width: "100%",
        border: "none",
        outline: "none",
      }}
    >
      <StyledTitle order={4} style={{ marginBottom: theme.spacing.md }}>
        HIT Details
      </StyledTitle>

      <StatsContainer>
        <StatCardWrapper>
          <ThemeIcon
            color={theme.other.hitStatus.approved}
            variant="light"
            radius="xl"
            size="sm"
          >
            <IconCheck size={16} />
          </ThemeIcon>
          <div>
            <StatTextWrapper color={theme.other.hitStatus.approved}>
              Approved
            </StatTextWrapper>
            <StatValueWrapper color={theme.other.hitStatus.approved}>
              {hitsOverview.approved.toLocaleString()}
            </StatValueWrapper>
          </div>
        </StatCardWrapper>

        <StatCardWrapper>
          <ThemeIcon
            color={theme.other.hitStatus.approved}
            variant="light"
            radius="xl"
            size="sm"
          >
            <IconPercentage size={16} />
          </ThemeIcon>
          <div>
            <StatTextWrapper color={theme.other.hitStatus.approved}>
              Approval Rate
            </StatTextWrapper>
            <StatValueWrapper color={theme.other.hitStatus.approved}>
              {`${hitsOverview.approval_rate.toFixed(2)}%`}
            </StatValueWrapper>
          </div>
        </StatCardWrapper>

        <StatCardWrapper>
          <ThemeIcon
            color={theme.other.hitStatus.pending}
            variant="light"
            radius="xl"
            size="sm"
          >
            <IconClock size={16} />
          </ThemeIcon>
          <div>
            <StatTextWrapper color={theme.other.hitStatus.pending}>
              Pending
            </StatTextWrapper>
            <StatValueWrapper color={theme.other.hitStatus.pending}>
              {hitsOverview.pending.toLocaleString()}
            </StatValueWrapper>
          </div>
        </StatCardWrapper>

        <StatCardWrapper>
          <ThemeIcon
            color={theme.other.hitStatus.rejected}
            variant="light"
            radius="xl"
            size="sm"
          >
            <IconX size={16} />
          </ThemeIcon>
          <div>
            <StatTextWrapper color={theme.other.hitStatus.rejected}>
              Rejected
            </StatTextWrapper>
            <StatValueWrapper color={theme.other.hitStatus.rejected}>
              {hitsOverview.rejected.toLocaleString()}
            </StatValueWrapper>
          </div>
        </StatCardWrapper>

        <StatCardWrapper>
          <ThemeIcon
            color={theme.other.hitStatus.rejected}
            variant="light"
            radius="xl"
            size="sm"
          >
            <IconPercentage size={16} />
          </ThemeIcon>
          <div>
            <StatTextWrapper color={theme.other.hitStatus.rejected}>
              Rejection Rate
            </StatTextWrapper>
            <StatValueWrapper color={theme.other.hitStatus.rejected}>
              {`${hitsOverview.rejection_rate.toFixed(2)}%`}
            </StatValueWrapper>
          </div>
        </StatCardWrapper>
      </StatsContainer>

      <StyledTitle order={4} mt="lg">
        HITs History
      </StyledTitle>
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="bar"
        width="100%"
        height="200"
      />
    </Paper>
  );
};

export default HitDetails;
