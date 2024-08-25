import React, { useMemo, useState } from "react";
import { Allotment } from "allotment";
import styled from "@emotion/styled";
import "allotment/dist/style.css";
import HitList from "./HitList";
import RequesterModal from "../modals/RequesterModal";
import { useStore } from "../../hooks";
import { themedScrollbarStyles } from "../../styles";
import useRequesterHourlyRates from "../../hooks/useRequesterHourlyRates";
import HitQueue from "./HitQueue";

const WorkspaceContainer = styled.div`
  background-color: ${(props) => props.theme.colors.primary[0]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

const HitListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  ${({ theme }) => themedScrollbarStyles(theme)};
`;

const Workspace: React.FC = () => {
  const hits = useStore((state) => state.hits.data);

  const workspaceSizes = useStore((state) => state.config.workspacePanelSizes);
  const setWorkspaceSizes = useStore(
    (state) => state.config.setWorkspacePanelSizes
  );

  const workspaceListSizes = useStore(
    (state) => state.config.workspaceListSizes
  );
  const setWorkspaceListSizes = useStore(
    (state) => state.config.setWorkspaceListSizes
  );

  const availableHitColumns = useStore(
    (state) => state.config.workspaceAvailableColumns
  );
  const setAvailableHitColumns = useStore(
    (state) => state.config.setWorkspaceAvailableColumns
  );

  const unavailableHitColumns = useStore(
    (state) => state.config.workspaceUnavailableColumns
  );
  const setUnavailableHitColumns = useStore(
    (state) => state.config.setWorkspaceUnavailableColumns
  );

  const [selectedRequesterId, setSelectedRequesterId] = useState<string | null>(
    null
  );

  const requesterIds = useMemo(() => {
    return Array.from(new Set(hits?.map((hit) => hit.requester_id)));
  }, [hits]);

  const requesterHourlyRates = useRequesterHourlyRates(requesterIds);

  const hitsWithRates = useMemo(() => {
    return hits?.map((hit) => ({
      ...hit,
      hourlyRate: requesterHourlyRates[hit.requester_id] || "-",
    }));
  }, [hits, requesterHourlyRates]);

  const availableHits = useMemo(() => {
    return hitsWithRates?.filter((hit) => !hit.unavailable) || [];
  }, [hitsWithRates]);

  const unavailableHits = useMemo(() => {
    return hitsWithRates?.filter((hit) => hit.unavailable) || [];
  }, [hitsWithRates]);

  const handleRequesterClick = (requesterId: string) => {
    setSelectedRequesterId(requesterId);
  };

  const handleCloseRequesterModal = () => {
    setSelectedRequesterId(null);
  };

  return (
    <WorkspaceContainer>
      <Allotment defaultSizes={workspaceSizes} onChange={setWorkspaceSizes}>
        <Allotment
          vertical
          defaultSizes={workspaceListSizes}
          onChange={setWorkspaceListSizes}
        >
          <HitListContainer>
            <HitList
              hits={availableHits}
              title="Available HITs"
              columns={availableHitColumns}
              setColumns={setAvailableHitColumns}
              onRequesterClick={handleRequesterClick}
            />
          </HitListContainer>
          <HitListContainer>
            <HitList
              hits={unavailableHits}
              title="Unavailable HITs"
              columns={unavailableHitColumns}
              setColumns={setUnavailableHitColumns}
              onRequesterClick={handleRequesterClick}
            />
          </HitListContainer>
        </Allotment>
        <HitQueue />
      </Allotment>

      {selectedRequesterId && (
        <RequesterModal
          isOpen={Boolean(selectedRequesterId)}
          onClose={handleCloseRequesterModal}
          requesterId={selectedRequesterId}
        />
      )}
    </WorkspaceContainer>
  );
};

export default Workspace;
