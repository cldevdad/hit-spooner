import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import HitItem from "./HitItem";
import { IHitProject } from "@hit-spooner/api";
import { useStore } from "../../hooks";
import { themedScrollbarStyles } from "../../styles";
import PanelTitleBar from "../app/PanelTitleBar";
import { filterHitProjects } from "../../utils";

// Styled container for the entire HitList component
const HitListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// Styled container for the grid layout of the HIT items
const GridContainer = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  width: 100%;
  ${({ theme }) => themedScrollbarStyles(theme)};
`;

interface IHitListProps {
  /**
   * Array of HIT projects to display in the list.
   */
  hits: IHitProject[];

  /**
   * Title of the HitList panel.
   */
  title: string;

  /**
   * Optional flag to hide the requester information in each HIT item.
   */
  hideRequester?: boolean;

  /**
   * Number of columns to display in the grid.
   */
  columns: number;

  /**
   * Function to update the number of columns in the grid.
   * @param columns - The new number of columns to set.
   */
  setColumns: (columns: number) => void;

  onRequesterClick?: (requesterId: string) => void;
}

/**
 * HitList component for displaying a list of HIT projects in a grid format.
 */
export const HitList: React.FC<IHitListProps> = ({
  hits,
  title,
  hideRequester,
  columns,
  setColumns,
  onRequesterClick,
}) => {
  const { blockedRequesters } = useStore();
  const [filterText, setFilterText] = useState("");

  // Memoize the filtered HITs to avoid unnecessary re-renders
  const filteredHits = useMemo(
    () => filterHitProjects(hits, filterText, blockedRequesters),
    [hits, filterText, blockedRequesters]
  );

  return (
    <HitListContainer>
      {/* Panel title bar with a filter and column adjustment options */}
      <PanelTitleBar
        title={title}
        columns={columns}
        setColumns={setColumns}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      {/* Grid container to display HIT items */}
      <GridContainer columns={columns}>
        {filteredHits.map((hit: IHitProject) => (
          <HitItem
            key={hit.hit_set_id}
            hit={hit}
            hideRequester={hideRequester}
            onRequesterClick={onRequesterClick}
          />
        ))}
      </GridContainer>
    </HitListContainer>
  );
};

export default React.memo(HitList);
