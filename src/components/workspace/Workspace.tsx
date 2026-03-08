import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Allotment } from "allotment";
import styled from "@emotion/styled";
import "allotment/dist/style.css";
import HitList from "./HitList";
import RequesterModal from "../modals/RequesterModal";
import LoggedOutModal from "../modals/LoggedOutModal";
import { useStore } from "../../hooks";
import { themedScrollbarStyles } from "../../styles";
import useRequesterHourlyRates from "../../hooks/useRequesterHourlyRates";
import { useTurkerView } from "../../hooks/useTurkerView";
import HitQueue from "./HitQueue";

const WorkspaceContainer = styled.div`
  background-color: ${(props) => props.theme.colors.primary[0]};
  display: flex;
  flex-direction: column;
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
  const { hits, workspacePanelSizes, setWorkspacePanelSizes, workspaceListSizes, setWorkspaceListSizes,
    workspaceAvailableColumns, setWorkspaceAvailableColumns, workspaceUnavailableColumns,
    setWorkspaceUnavailableColumns } = useStore(useCallback((state) => ({
      hits: state.hits.data,
      workspacePanelSizes: state.config.workspacePanelSizes,
      setWorkspacePanelSizes: state.config.setWorkspacePanelSizes,
      workspaceListSizes: state.config.workspaceListSizes,
      setWorkspaceListSizes: state.config.setWorkspaceListSizes,
      workspaceAvailableColumns: state.config.workspaceAvailableColumns,
      setWorkspaceAvailableColumns: state.config.setWorkspaceAvailableColumns,
      workspaceUnavailableColumns: state.config.workspaceUnavailableColumns,
      setWorkspaceUnavailableColumns: state.config.setWorkspaceUnavailableColumns,
    }), []));

  const [selectedRequesterId, setSelectedRequesterId] = useState<string | null>(null);
  const [isLoggedOutModalOpen, setIsLoggedOutModalOpen] = useState(false);
  const { isLoggedIn } = useStore((state) => ({
    isLoggedIn: state.isLoggedIn,
  }));

  const requesterIds = useMemo(
    () => hits ? [...new Set(hits.map((hit) => hit.requester_id))] : [],
    [hits]
  );

  const requesterHourlyRates = useRequesterHourlyRates(requesterIds);
  const { requesters } = useTurkerView(requesterIds);

  const hitsWithRates = useMemo(
    () => hits?.map((hit) => ({
      ...hit,
      hourlyRate: requesterHourlyRates[hit.requester_id] || "-",
      requesterRatings: requesters[hit.requester_id]?.ratings,
    })) || [],
    [hits, requesterHourlyRates, requesters]
  );

  const availableHits = useMemo(
    () => hitsWithRates.filter((hit) => !hit.unavailable),
    [hitsWithRates]
  );

  const unavailableHits = useMemo(
    () => hitsWithRates
      .filter((hit) => hit.unavailable)
      .sort((a, b) => {
        const timeA = new Date(a.last_updated_time || 0).getTime();
        const timeB = new Date(b.last_updated_time || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, 100),
    [hitsWithRates]
  );

  const handleRequesterClick = useCallback((requesterId: string) => {
    setSelectedRequesterId(requesterId);
  }, []);

  const handleCloseRequesterModal = useCallback(() => {
    setSelectedRequesterId(null);
  }, []);

  // Effect to show logged out modal when not logged in
  useEffect(() => {
    setIsLoggedOutModalOpen(!isLoggedIn);
  }, [isLoggedIn]);

  return (
    <WorkspaceContainer>
      <Allotment defaultSizes={workspacePanelSizes} onChange={setWorkspacePanelSizes}>
        <Allotment vertical defaultSizes={workspaceListSizes} onChange={setWorkspaceListSizes}>
          <HitListContainer>
            <HitList
              hits={availableHits}
              title="Available HITs"
              columns={workspaceAvailableColumns}
              setColumns={setWorkspaceAvailableColumns}
              onRequesterClick={handleRequesterClick}
            />
          </HitListContainer>
          <HitListContainer>
            <HitList
              hits={unavailableHits}
              title="Unavailable HITs"
              columns={workspaceUnavailableColumns}
              setColumns={setWorkspaceUnavailableColumns}
              onRequesterClick={handleRequesterClick}
            />
          </HitListContainer>
        </Allotment>
        <HitQueue />
      </Allotment>

      {selectedRequesterId && (
        <RequesterModal
          isOpen={true}
          onClose={handleCloseRequesterModal}
          requesterId={selectedRequesterId}
        />
      )}

      <LoggedOutModal
        isOpen={isLoggedOutModalOpen}
        onClose={() => setIsLoggedOutModalOpen(false)}
      />
    </WorkspaceContainer>
  );
};

export default Workspace;
