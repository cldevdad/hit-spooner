import React from "react";
import styled from "@emotion/styled";
import { useStore } from "../../hooks";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => props.theme.colors.primary[0]};
  border-top: 1px solid ${(props) => props.theme.colors.primary[2]};
  position: sticky;
  bottom: 0;
  z-index: 10;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background-color: ${(props) => props.theme.colors.primary[1]};
  color: ${(props) => props.theme.colors.primary[9]};
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.primary[1]
        : props.theme.colors.primary[2]};
  }
`;

const Pagination: React.FC = () => {
  const { currentPage, pageSize, total, setHitsPage } = useStore((state) => ({
    currentPage: state.hits.currentPage ?? 1,
    pageSize: state.hits.pageSize ?? 50,
    total: state.hits.total ?? 0,
    setHitsPage: state.setHitsPage,
  }));

  const totalPages = Math.ceil(total / pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) setHitsPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setHitsPage(currentPage + 1);
  };

  return totalPages > 1 ? (
    <PaginationContainer>
      <PaginationButton disabled={currentPage === 1} onClick={handlePrevious}>
        Previous
      </PaginationButton>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Next
      </PaginationButton>
    </PaginationContainer>
  ) : null;
};

export default Pagination;
