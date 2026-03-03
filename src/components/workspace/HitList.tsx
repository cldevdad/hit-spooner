import React, { useMemo, useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { Modal, Table, Text, Badge, Group } from "@mantine/core";
import HitItem from "./HitItem";
import { IHitProject } from "@hit-spooner/api";
import { useStore } from "../../hooks";
import { themedScrollbarStyles } from "../../styles";
import PanelTitleBar from "../app/PanelTitleBar";
import { filterHitProjects } from "../../utils";
import { QuickFilters, applyQuickFilter } from "./QuickFilters";
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
      return applyQuickFilter(textFiltered, quickFilter, blockedRequesters);
    },
    [hits, filterText, quickFilter, blockedRequesters]
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
      <QuickFilters onFilter={setQuickFilter} activeFilter={quickFilter} />
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
