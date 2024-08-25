import React from "react";
import { Paper, Text, Group, Tooltip, ActionIcon } from "@mantine/core";
import ReactApexChart from "react-apexcharts";
import { StyledTitle } from "../../styles";
import { ApexOptions } from "apexcharts";
import { Theme, useTheme } from "@emotion/react";
import { IDailyHitStatistic } from "@hit-spooner/api";
import { useNextTransferDate } from "../../hooks";
import { IconInfoCircle } from "@tabler/icons-react";

interface EarningsOverviewProps {
  availableEarnings: number;
  stats: IDailyHitStatistic[];
}

export const EarningsOverview: React.FC<EarningsOverviewProps> = ({
  availableEarnings,
  stats,
}) => {
  const theme = useTheme() as Theme;

  const nextTransferDate = useNextTransferDate();

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 200,
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (value: number) {
        if (value > 0) {
          return `$${value.toFixed(2)}`;
        }
        return "";
      },
      style: {
        fontSize: "10px",
        colors: [theme.colors.primary[8]],
      },
      offsetY: 15,
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
          orientation: "vertical",
        },
      },
    },
    xaxis: {
      categories: stats?.map((s) => s.date),
      labels: {
        show: true,
        style: {
          colors: Array(stats?.length ?? 0).fill(theme.colors.primary[8]),
        },
        formatter: (value: string) => {
          return value;
        },
      },
      tickAmount: Math.min(10, Math.floor((stats?.length ?? 0) / 5)),
    },
    yaxis: {
      labels: {
        style: {
          colors: [theme.colors.primary[8]],
        },
        formatter: function (value: number) {
          return `$${value.toFixed(2)}`;
        },
      },
    },
    colors: [theme.other.chartPositiveColor],
  };

  const chartData = [
    {
      name: "Earnings",
      data: stats?.map((s) => s.earnings) || [],
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
      <Group align="apart">
        <StyledTitle order={4}>Available Earnings</StyledTitle>
        {nextTransferDate && (
          <Tooltip
            label={nextTransferDate}
            withArrow
            position="right"
            style={{
              color: theme.colors.primary[8],
              backgroundColor: theme.other.hitBackground,
            }}
          >
            <ActionIcon>
              <IconInfoCircle size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      <Text size="2em" w={700} c={theme.other.hitRewardColor} mb="md">
        ${availableEarnings.toFixed(2)}
      </Text>

      <StyledTitle order={4} mt="lg">
        Earnings History
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
