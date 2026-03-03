import React, { useState } from "react";
import styled from "@emotion/styled";
import { Slider, TextInput, Tooltip } from "@mantine/core";
import { useTheme } from "@emotion/react";
import { IconX, IconInfoCircle } from "@tabler/icons-react";
import { themedSliderStyles } from "../../styles";

const StyledPanelTitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(180deg, ${(props) => props.theme.colors.primary[6]} 0%, ${(props) => props.theme.colors.primary[5]} 100%);
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[4]};
  z-index: 1;
  width: 100%;
  min-height: 52px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: visible;
`;

const SliderWrapper = styled.div`
  overflow: visible;
  min-width: 140px;
`;

const StyledTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
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
  totalEarnings?: number;
  totalEarningsPerHour?: number;
  averageRewardPerHit?: number;
  totalDuration?: number;
}

const PanelTitleBar: React.FC<IPanelTitleBarProps> = ({
  title,
  columns,
  setColumns,
  filterText,
  setFilterText,
  totalEarnings,
  totalEarningsPerHour,
  averageRewardPerHit,
  totalDuration,
}) => {
  const theme = useTheme();
  const [statsExpanded, setStatsExpanded] = useState(false);

  const handleClearFilter = () => {
    if (setFilterText) {
      setFilterText("");
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <StyledPanelTitleBar>
      <StyledTitle>
        {title}
        {typeof totalEarnings !== "undefined" && (
          <span
            style={{ 
              fontSize: "0.8rem", 
              marginLeft: "12px", 
              fontWeight: "normal",
              padding: "3px 10px",
              backgroundColor: theme.colors.primary[1],
              borderRadius: "6px",
              border: `1px solid ${theme.colors.primary[3]}`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              cursor: "pointer",
            }}
            onMouseEnter={() => setStatsExpanded(true)}
            onMouseLeave={() => setStatsExpanded(false)}
          >
            <span>Total: ${totalEarnings.toFixed(2)}</span>
            {statsExpanded && (
              <>
                {typeof totalEarningsPerHour !== "undefined" && (
                  <span style={{ 
                    paddingLeft: "8px",
                    borderLeft: `1px solid ${theme.colors.primary[3]}`
                  }}>
                    ${totalEarningsPerHour.toFixed(2)}/hr
                  </span>
                )}
                {typeof averageRewardPerHit !== "undefined" && (
                  <span style={{ 
                    paddingLeft: "8px",
                    borderLeft: `1px solid ${theme.colors.primary[3]}`
                  }}>
                    Avg: ${averageRewardPerHit.toFixed(2)}
                  </span>
                )}
                {typeof totalDuration !== "undefined" && (
                  <span style={{ 
                    paddingLeft: "8px",
                    borderLeft: `1px solid ${theme.colors.primary[3]}`
                  }}>
                    Time: {formatDuration(totalDuration)}
                  </span>
                )}
              </>
            )}
          </span>
        )}
      </StyledTitle>
      {columns !== undefined && setColumns !== undefined && (
        <SliderWrapper>
          <Slider
            min={1}
            max={5}
            step={1}
            value={columns}
            onChange={setColumns}
            styles={themedSliderStyles(theme)}
          />
        </SliderWrapper>
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
