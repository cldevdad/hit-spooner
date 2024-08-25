import React from "react";
import styled from "@emotion/styled";
import { Slider, TextInput, Tooltip } from "@mantine/core";
import { useTheme } from "@emotion/react";
import { IconX, IconInfoCircle } from "@tabler/icons-react";
import { themedSliderStyles } from "../../styles";

const StyledPanelTitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  background-color: ${(props) => props.theme.colors.primary[6]};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[4]};
  z-index: 1;
  width: 100%;
  height: 34px;
`;

const StyledTitle = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  padding-left: 5px;
`;

const FilterInputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 5px;
`;

const StyledTextInput = styled(TextInput)`
  input {
    font-size: 0.75rem;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 6px;
    border-width: 0;
  }
`;

const IconWrapper = styled.div<{ position: "left" | "right" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-40%);
  ${({ position }) => (position === "left" ? "left: 8px;" : "right: 8px;")}
  cursor: pointer;
  z-index: 2;
`;

const TooltipContent = styled.div`
  padding: 8px;
  background-color: ${(props) => props.theme.colors.primary[1]};
  color: ${(props) => props.theme.colors.primary[9]};
  font-size: 0.75rem;
  border-radius: 4px;
  z-index: 9999;
`;

interface IPanelTitleBarProps {
  title: string;
  columns?: number;
  setColumns?: (value: number) => void;
  filterText?: string;
  setFilterText?: (value: string) => void;
}

const PanelTitleBar: React.FC<IPanelTitleBarProps> = ({
  title,
  columns,
  setColumns,
  filterText,
  setFilterText,
}) => {
  const theme = useTheme();

  const handleClearFilter = () => {
    if (setFilterText) {
      setFilterText("");
    }
  };

  return (
    <StyledPanelTitleBar>
      <StyledTitle>{title}</StyledTitle>
      {columns !== undefined && setColumns !== undefined && (
        <Slider
          min={1}
          max={5}
          step={1}
          value={columns}
          onChange={setColumns}
          styles={themedSliderStyles(theme)}
        />
      )}
      {setFilterText && (
        <FilterInputWrapper>
          <IconWrapper position="left">
            <Tooltip
              label={
                <TooltipContent>
                  <strong>Filter Tips:</strong>
                  <div style={{ marginTop: 8 }}>
                    Search by keywords in title, description, requester name, or
                    reward amount.
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <code>&lt;10</code> - HITs with rewards less than $10
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <code>=5</code> - HITs with exactly $5 rewards
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <code>Rank 7 options</code> - Search by title containing
                    "Rank 7 options"
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <code>pickfu</code> - Search by requester named "PickFu"
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <code>transcri</code> - Search for all "transcribe" or
                    "transcription" HITs.
                  </div>
                </TooltipContent>
              }
              withArrow
              position="bottom"
              color={theme.colors.primary[1]}
            >
              <IconInfoCircle size={16} />
            </Tooltip>
          </IconWrapper>
          <StyledTextInput
            size="xs"
            placeholder="Filter..."
            value={filterText}
            onChange={(event) => setFilterText(event.currentTarget.value)}
          />
          <IconWrapper position="right" onClick={handleClearFilter}>
            <IconX size={16} />
          </IconWrapper>
        </FilterInputWrapper>
      )}
    </StyledPanelTitleBar>
  );
};

export default React.memo(PanelTitleBar);
