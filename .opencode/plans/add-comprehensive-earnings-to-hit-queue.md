# Plan: Add Comprehensive Earnings Information to HIT Queue Title Bar

## Summary
Add comprehensive earnings information to the HIT queue title bar, including total earnings, earnings per hour, average reward per HIT, and total duration, with responsive styling for all screen sizes.

## Current Structure
- HIT queue uses `HitQueue.tsx` component
- Queue data is managed in `useStore.ts` Zustand store
- Title is currently displayed using `PanelTitleBar` component

## Requirements
1. Display total earnings from all HITs in the queue
2. Display total earnings per hour from all HITs in the queue
3. Display average reward per HIT
4. Display total duration of all HITs in the queue
5. Show as currency ($X.XX) format for earnings
6. Show duration in readable format (HH:MM:SS)
7. Display next to existing title in PanelTitleBar
8. Add visual separation for better readability
9. Responsive styling for different screen sizes

## Implementation Steps

### 1. Create Calculation Functions in useStore.ts
- Add selectors to calculate all earnings metrics
- Include error handling for invalid data
- Add duration formatting helper

### 2. Update PanelTitleBar.tsx
- Add new props to accept all earnings and duration information
- Update the StyledTitle component to display all additional information
- Style with proper visual separation and responsive design
- Format duration in readable HH:MM:SS format

### 3. Update HitQueue.tsx
- Calculate all metrics using store selectors
- Pass these values as props to PanelTitleBar
- Ensure the calculations update whenever the queue changes

### 4. Testing
- Test with an empty queue
- Test with single HIT in queue
- Test with multiple HITs in queue
- Verify all metrics are calculated correctly
- Test responsive styling on different screen sizes

## Files to Modify
1. `src/hooks/store/useStore.ts` - Add calculation selectors
2. `src/components/app/PanelTitleBar.tsx` - Update to display all earnings information
3. `src/components/workspace/HitQueue.tsx` - Pass earnings props to PanelTitleBar

## Detailed Implementation

### useStore.ts Changes
```typescript
// Add selectors after imports
import { IHitProject, IHitSearchFilter, IHitAssignment } from "@hit-spooner/api";
import { debounce } from "lodash";
import { create } from "zustand";
import { notifications } from "@mantine/notifications";
import {
  darkTheme,
  lightTheme,
  pinkTheme,
  greenTheme,
  purpleTheme,
  steelTheme,
  newsTheme,
  blueTheme,
} from "../../styles/themes";
import { fetchDashboardData, fetchHITProjects, announceHitCaught, SoundType, playSound, safeParseInt } from "../../utils";
import { useIndexedDb, loadHits as loadHitsFromDb } from "../useIndexedDb";
import { IHitSpoonerStoreState } from "./IHitSpoonerStoreState";
import { LocalStorageKeys } from "./LocalStorageKeys";

// Helper selectors for queue earnings calculations
export const useTotalEarnings = (state: any) =>
  state.queue.reduce((total: number, assignment: any) => {
    return total + assignment.project.monetary_reward.amount_in_dollars;
  }, 0);

export const useTotalEarningsPerHour = (state: any) => {
  const totalReward = state.queue.reduce((total: number, assignment: any) => {
    return total + assignment.project.monetary_reward.amount_in_dollars;
  }, 0);

  const totalDurationHours = state.queue.reduce((total: number, assignment: any) => {
    const durationSeconds = assignment.project.assignment_duration_in_seconds || 0;
    return total + (durationSeconds / 3600); // Convert to hours
  }, 0);

  return totalDurationHours > 0 ? totalReward / totalDurationHours : 0;
};

export const useAverageRewardPerHit = (state: any) => {
  const totalReward = state.queue.reduce((total: number, assignment: any) => {
    return total + assignment.project.monetary_reward.amount_in_dollars;
  }, 0);

  return state.queue.length > 0 ? totalReward / state.queue.length : 0;
};

export const useTotalDuration = (state: any) => {
  return state.queue.reduce((total: number, assignment: any) => {
    const durationSeconds = assignment.project.assignment_duration_in_seconds || 0;
    return total + durationSeconds;
  }, 0);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
```

### PanelTitleBar.tsx Changes
```typescript
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

  // ... existing code ...

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
          <span style={{ 
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
            flexWrap: "wrap"
          }}>
            <span>Total: ${totalEarnings.toFixed(2)}</span>
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
          </span>
        )}
      </StyledTitle>
      {/* ... existing code ... */}
    </StyledPanelTitleBar>
  );
};
```

### HitQueue.tsx Changes
```typescript
import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Table, Progress, ActionIcon, Tooltip } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { useStore } from "../../hooks";
import { 
  useTotalEarnings, 
  useTotalEarningsPerHour, 
  useAverageRewardPerHit, 
  useTotalDuration 
} from "../../hooks/store/useStore";
import { IHitAssignment } from "@hit-spooner/api";
import PanelTitleBar from "../app/PanelTitleBar";
import { formatDistanceToNowStrict } from "date-fns";
import YesNoModal from "../modals/YesNoModal";

// ... existing component code ...

const HitQueue: React.FC = () => {
  const { queue, returnHit } = useStore((state) => ({
    queue: state.queue,
    returnHit: state.returnHit,
  }));

  const totalEarnings = useStore(useTotalEarnings);
  const totalEarningsPerHour = useStore(useTotalEarningsPerHour);
  const averageRewardPerHit = useStore(useAverageRewardPerHit);
  const totalDuration = useStore(useTotalDuration);

  const theme = useTheme();

  // ... existing state and handlers ...

  return (
    <>
      <PanelTitleBar 
        title={`Your HITs Queue (${queue.length})`}
        totalEarnings={totalEarnings}
        totalEarningsPerHour={totalEarningsPerHour}
        averageRewardPerHit={averageRewardPerHit}
        totalDuration={totalDuration}
      />
      {/* ... existing table rendering ... */}
    </>
  );
};

export default HitQueue;
```

## Visual Styling
- **Background Color**: Uses theme's light primary color for earnings container
- **Border**: Light border with rounded corners
- **Padding**: 3px horizontal, 10px vertical padding
- **Spacing**: 12px left margin from main title
- **Gap Between Metrics**: 8px gap for better separation
- **Flexible Layout**: Uses flexbox with wrap for responsive design
- **Border Separation**: Light borders between metrics for visual separation
- **Font Size**: 0.8rem (smaller than main title)
- **Font Weight**: Normal (not bold)
- **Responsive**: Wraps to new lines on smaller screens

## Responsive Design
- Uses flexbox with `flexWrap: "wrap"` for responsive behavior
- On very small screens, metrics will wrap vertically
- Maintains proper spacing and borders when wrapping
- Font size remains consistent for readability

## Verification
- ✅ All earnings metrics should be calculated correctly
- ✅ Duration should be formatted in HH:MM:SS format
- ✅ Earnings should display in $X.XX currency format
- ✅ Changes should be reactive to queue updates
- ✅ Empty queue should display no earnings information
- ✅ Visual separation should enhance readability
- ✅ Responsive styling should work on all screen sizes

This implementation will provide a comprehensive, visually appealing summary of the user's potential earnings from the HIT queue with proper separation from the main title and responsive design for all screen sizes.