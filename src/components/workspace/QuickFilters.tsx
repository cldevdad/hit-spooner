import React from "react";
import styled from "@emotion/styled";
import { Badge, Group } from "@mantine/core";
import { IHitProject } from "@hit-spooner/api";

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) => props.theme.colors.primary[0]};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[2]};
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary[7]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterBadge = styled.span<{ color: string; active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => props.active ? props.color : 'transparent'};
  color: ${(props) => props.active ? 'white' : props.theme.colors.primary[7]};
  border: 1px solid ${(props) => props.active ? props.color : props.theme.colors.primary[3]};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

interface QuickFiltersProps {
  onFilter: (filter: string) => void;
  activeFilter?: string;
}

// Define filters as a constant outside the component to avoid recreation on each render
const QUICK_FILTERS = [
  { id: "all", label: "All", color: "#6b7280" },
  { id: "high_pay", label: ">$0.50", color: "#22c55e" },
  { id: "very_high_pay", label: ">$1.00", color: "#14b8a6" },
  { id: "new_requester", label: "New", color: "#3b82f6" },
  { id: "short", label: "<1 min", color: "#f97316" },
  { id: "short_5m", label: "<5 min", color: "#f59e0b" },
  { id: "short_10m", label: "<10 min", color: "#eab308" },
  { id: "short_30m", label: "<30m dur", color: "#84cc16" },
  { id: "masters", label: "Masters", color: "#8b5cf6" },
  { id: "pending_qual", label: "Pend Qual", color: "#ec4899" },
  { id: "recent_30m", label: "Fresh", color: "#06b6d4" },
] as const;

export type QuickFilterId = typeof QUICK_FILTERS[number]["id"];

export const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilter, activeFilter }) => {
  return (
    <FilterContainer>
      <FilterLabel>Quick:</FilterLabel>
      <Group gap={6}>
        {QUICK_FILTERS.map((filter) => (
          <FilterBadge
            key={filter.id}
            color={filter.color}
            active={activeFilter === filter.id}
            onClick={() => onFilter(filter.id)}
          >
            {filter.label}
          </FilterBadge>
        ))}
      </Group>
    </FilterContainer>
  );
};

export const applyQuickFilter = (
  hits: IHitProject[],
  filterId: string,
  blockedRequesters: string[]
): IHitProject[] => {
  return hits.filter((hit) => {
    if (blockedRequesters.includes(hit.requester_id)) return false;

    switch (filterId) {
      case "all":
        return true;
      case "high_pay":
        return hit.monetary_reward?.amount_in_dollars > 0.5;
      case "very_high_pay":
        return hit.monetary_reward?.amount_in_dollars > 1.0;
      case "new_requester":
        return hit.requester_name && hit.requester_name.includes("NEW");
      case "short":
        return (hit.assignment_duration_in_seconds || 0) < 60;
      case "short_5m":
        return (hit.assignment_duration_in_seconds || 0) < 300;
      case "short_10m":
        return (hit.assignment_duration_in_seconds || 0) < 600;
      case "short_30m":
        return (hit.assignment_duration_in_seconds || 0) < 1800;
      case "masters":
        return hit.qualifications?.some(q => q.qualification_type?.name?.toLowerCase().includes("master")) === true;
      case "pending_qual":
        return !hit.caller_meets_requirements;
      case "recent_30m":
        const hitTime = new Date(hit.last_updated_time || hit.creation_time || 0).getTime();
        const thirtyMinAgo = Date.now() - (30 * 60 * 1000);
        return hitTime > thirtyMinAgo;
      default:
        return true;
    }
  });
};
