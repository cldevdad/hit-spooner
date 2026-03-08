import React, { useMemo, useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { Modal, Table, Text, Badge, Group, Select } from "@mantine/core";
import HitItem from "./HitItem";
import { IHitProject } from "@hit-spooner/api";
import { useStore } from "../../hooks";
import { themedScrollbarStyles } from "../../styles";
import PanelTitleBar from "../app/PanelTitleBar";
import { filterHitProjects } from "../../utils";
import { QuickFilters, applyQuickFilter, QUICK_FILTERS, FilterLabel, FilterBadge } from "./QuickFilters";
import { HitPreviewModal } from "./HitPreviewModal";

const HitListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: visible;
`;

const GridContainer = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  width: 100%;
  ${({ theme }) => themedScrollbarStyles(theme)};
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${(props) => props.theme.colors.primary[0]};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[2]};
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary[7]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const KeyboardHintText = styled.div`
  position: fixed;
  bottom: 80px;
  left: 20px;
  font-size: 11px;
  color: #666;
  background: rgba(255,255,255,0.9);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

export type SortOption = "default" | "reward_high" | "reward_low" | "duration_short" | "duration_long" | "requester_az" | "requester_za" | "newest";

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "reward_high", label: "Reward: High to Low" },
  { value: "reward_low", label: "Reward: Low to High" },
  { value: "duration_short", label: "Duration: Shortest" },
  { value: "duration_long", label: "Duration: Longest" },
  { value: "requester_az", label: "Requester: A-Z" },
  { value: "requester_za", label: "Requester: Z-A" },
  { value: "newest", label: "Newest First" },
];

const applySorting = (hits: IHitProject[], sortBy: SortOption): IHitProject[] => {
  const sorted = [...hits];
  
  switch (sortBy) {
    case "reward_high":
      return sorted.sort((a, b) => 
        (b.monetary_reward?.amount_in_dollars || 0) - (a.monetary_reward?.amount_in_dollars || 0)
      );
    case "reward_low":
      return sorted.sort((a, b) => 
        (a.monetary_reward?.amount_in_dollars || 0) - (b.monetary_reward?.amount_in_dollars || 0)
      );
    case "duration_short":
      return sorted.sort((a, b) => 
        (a.assignment_duration_in_seconds || 0) - (b.assignment_duration_in_seconds || 0)
      );
    case "duration_long":
      return sorted.sort((a, b) => 
        (b.assignment_duration_in_seconds || 0) - (a.assignment_duration_in_seconds || 0)
      );
    case "requester_az":
      return sorted.sort((a, b) => 
        (a.requester_name || "").localeCompare(b.requester_name || "")
      );
    case "requester_za":
      return sorted.sort((a, b) => 
        (b.requester_name || "").localeCompare(a.requester_name || "")
      );
    case "newest":
      return sorted.sort((a, b) => 
        new Date(b.last_updated_time || 0).getTime() - new Date(a.last_updated_time || 0).getTime()
      );
    default:
      return sorted;
  }
};

interface IHitListProps {
  hits: IHitProject[];
  title: string;
  hideRequester?: boolean;
  columns: number;
  setColumns: (columns: number) => void;
  onRequesterClick?: (requesterId: string) => void;
}

export const HitList: React.FC<IHitListProps> = ({
  hits,
  title,
  hideRequester,
  columns,
  setColumns,
  onRequesterClick,
}) => {
  const { blockedRequesters, acceptHit, paused } = useStore();
  const [filterText, setFilterText] = useState("");
  const [quickFilter, setQuickFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [previewHit, setPreviewHit] = useState<IHitProject | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts = [
    { key: "j / ↓", desc: "Next HIT" },
    { key: "k / ↑", desc: "Previous HIT" },
    { key: "g", desc: "First HIT" },
    { key: "G", desc: "Last HIT" },
    { key: "Enter", desc: "Accept HIT" },
    { key: "Space", desc: "Preview HIT" },
    { key: "?", desc: "Show shortcuts" },
  ];

  const filteredHits = useMemo(
    () => {
      const textFiltered = filterHitProjects(hits, filterText, blockedRequesters);
      const quickFiltered = applyQuickFilter(textFiltered, quickFilter, blockedRequesters);
      return applySorting(quickFiltered, sortBy);
    },
    [hits, filterText, quickFilter, sortBy, blockedRequesters]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (paused) return;
      const totalHits = filteredHits.length;
      if (totalHits === 0) return;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, totalHits - 1));
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "g":
          if (!e.shiftKey) {
            e.preventDefault();
            setSelectedIndex(0);
          }
          break;
        case "G":
          e.preventDefault();
          setSelectedIndex(totalHits - 1);
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && filteredHits[selectedIndex]) {
            acceptHit(filteredHits[selectedIndex]);
          }
          break;
        case " ":
          e.preventDefault();
          if (selectedIndex >= 0 && filteredHits[selectedIndex]) {
            setPreviewHit(filteredHits[selectedIndex]);
            setPreviewOpen(true);
          }
          break;
        case "?":
          e.preventDefault();
          setShowHelp(true);
          break;
      }
    },
    [filteredHits, selectedIndex, acceptHit, paused]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleAccept = (hit: IHitProject) => {
    acceptHit(hit);
  };

  const handlePreview = (hit: IHitProject) => {
    setPreviewHit(hit);
    setPreviewOpen(true);
  };

  return (
    <HitListContainer>
      <PanelTitleBar
        title={title}
        columns={columns}
        setColumns={setColumns}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <ToolbarContainer>
        <ToolbarSection>
          <FilterLabel>Quick:</FilterLabel>
          <Group gap={6}>
            {QUICK_FILTERS.map((filter: typeof QUICK_FILTERS[number]) => (
              <FilterBadge
                key={filter.id}
                color={filter.color}
                active={quickFilter === filter.id}
                onClick={() => setQuickFilter(filter.id)}
              >
                {filter.label}
              </FilterBadge>
            ))}
          </Group>
        </ToolbarSection>
        <ToolbarSection>
          <ToolbarLabel>Sort:</ToolbarLabel>
          <Select
            size="xs"
            value={sortBy}
            onChange={(v) => setSortBy((v as SortOption) || "default")}
            data={sortOptions}
            styles={{ input: { minWidth: 140, height: 28, fontSize: 12 } }}
          />
        </ToolbarSection>
        <ToolbarSection>
          <Text size="xs" c="dimmed">
            {filteredHits.length} HITs
          </Text>
        </ToolbarSection>
      </ToolbarContainer>
      <GridContainer columns={columns}>
        {filteredHits.map((hit: IHitProject, index: number) => (
          <HitItem
            key={hit.hit_set_id}
            hit={hit}
            hideRequester={hideRequester}
            onRequesterClick={onRequesterClick}
            isSelected={index === selectedIndex}
            onSelect={() => setSelectedIndex(index)}
            onAccept={() => handleAccept(hit)}
            onPreview={() => handlePreview(hit)}
          />
        ))}
      </GridContainer>

      <HitPreviewModal
        hit={previewHit}
        opened={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onAccept={() => {
          if (previewHit) handleAccept(previewHit);
          setPreviewOpen(false);
        }}
      />

      <KeyboardHintText onClick={() => setShowHelp(true)}>
        Press ? for shortcuts
      </KeyboardHintText>

      <Modal
        opened={showHelp}
        onClose={() => setShowHelp(false)}
        title="Keyboard Shortcuts"
        centered
      >
        <Table>
          <Table.Tbody>
            {shortcuts.map((s) => (
              <Table.Tr key={s.key}>
                <Table.Td><Badge variant="outline">{s.key}</Badge></Table.Td>
                <Table.Td>{s.desc}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Modal>
    </HitListContainer>
  );
};

export default React.memo(HitList);
