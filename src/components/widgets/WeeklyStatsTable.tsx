import { IDailyHitStatistic } from "@hit-spooner/api";
import React, { useState } from "react";
import {
  StyledTable,
  StyledTableCell,
  StyledTableHeader,
  StyledTableHeaderRow,
  StyledTableRow,
} from "../../styles";
import { DailyStatsTableModal } from "../modals/DailyStatsTableModal";
import { Loader, Center, Text } from "@mantine/core";

interface IWeeklyStatsTableProps {
  stats: IDailyHitStatistic[];
}

export const WeeklyStatsTable: React.FC<IWeeklyStatsTableProps> = ({
  stats,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRowClick = (date: string) => {
    const formattedDate = date.split("T")[0];
    setSelectedDate(formattedDate);
    setLoading(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLoading(false);
  };

  const weeklyTotals = stats.reduce(
    (acc, stat) => {
      acc.submitted += stat.submitted;
      acc.approved += stat.approved;
      acc.rejected += stat.rejected;
      acc.pending += stat.pending;
      acc.hits_rewards += stat.hits_rewards;
      acc.bonus_rewards += stat.bonus_rewards;
      acc.earnings += stat.earnings;
      return acc;
    },
    {
      submitted: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
      hits_rewards: 0,
      bonus_rewards: 0,
      earnings: 0,
    }
  );

  return (
    <>
      <StyledTable highlightOnHover verticalSpacing="sm" striped>
        <thead>
          <StyledTableHeaderRow>
            <StyledTableHeader>Date</StyledTableHeader>
            <StyledTableHeader>Submitted</StyledTableHeader>
            <StyledTableHeader>Approved</StyledTableHeader>
            <StyledTableHeader>Rejected</StyledTableHeader>
            <StyledTableHeader>Pending</StyledTableHeader>
            <StyledTableHeader>HITs rewards</StyledTableHeader>
            <StyledTableHeader>Bonus rewards</StyledTableHeader>
            <StyledTableHeader>Total rewards</StyledTableHeader>
          </StyledTableHeaderRow>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <StyledTableRow
              key={stat.date}
              onClick={() => handleRowClick(stat.date)}
            >
              <StyledTableCell>
                {new Date(stat.date).toLocaleDateString()}
              </StyledTableCell>
              <StyledTableCell>{stat.submitted}</StyledTableCell>
              <StyledTableCell>{stat.approved}</StyledTableCell>
              <StyledTableCell>{stat.rejected}</StyledTableCell>
              <StyledTableCell>{stat.pending}</StyledTableCell>
              <StyledTableCell>${stat.hits_rewards.toFixed(2)}</StyledTableCell>
              <StyledTableCell>
                ${stat.bonus_rewards.toFixed(2)}
              </StyledTableCell>
              <StyledTableCell>${stat.earnings.toFixed(2)}</StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableRow style={{ fontWeight: "bold" }}>
            <StyledTableCell>Weekly Total</StyledTableCell>
            <StyledTableCell>{weeklyTotals.submitted}</StyledTableCell>
            <StyledTableCell>{weeklyTotals.approved}</StyledTableCell>
            <StyledTableCell>{weeklyTotals.rejected}</StyledTableCell>
            <StyledTableCell>{weeklyTotals.pending}</StyledTableCell>
            <StyledTableCell>
              ${weeklyTotals.hits_rewards.toFixed(2)}
            </StyledTableCell>
            <StyledTableCell>
              ${weeklyTotals.bonus_rewards.toFixed(2)}
            </StyledTableCell>
            <StyledTableCell>
              ${weeklyTotals.earnings.toFixed(2)}
            </StyledTableCell>
          </StyledTableRow>
        </tbody>
      </StyledTable>

      {loading && (
        <Center style={{ position: "fixed", top: "50%", left: "50%" }}>
          <Loader size="xl" />
          <Text>Loading details for {selectedDate}</Text>
        </Center>
      )}

      {selectedDate && (
        <DailyStatsTableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          date={selectedDate}
        />
      )}
    </>
  );
};
