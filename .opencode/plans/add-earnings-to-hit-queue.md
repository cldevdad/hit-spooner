# Plan: Add Earnings Information to HIT Queue Title Bar

## Summary
Add total earnings and total earnings per hour information to the HIT queue title bar, next to the existing title.

## Current Structure
- HIT queue uses `HitQueue.tsx` component
- Queue data is managed in `useStore.ts` Zustand store
- Title is currently displayed using `PanelTitleBar` component

## Requirements
1. Display total earnings from all HITs in the queue
2. Display total earnings per hour from all HITs in the queue
3. Show as currency ($X.XX) format
4. Display next to existing title in PanelTitleBar

## Implementation Steps

### 1. Create Calculation Functions in useStore.ts
- Add a selector to calculate total earnings from all HITs in the queue
- Add a selector to calculate total earnings per hour from all HITs in the queue
- Include error handling for invalid data

### 2. Update PanelTitleBar.tsx
- Add new props to accept earnings information:
  - `totalEarnings: number` - total earnings in dollars
  - `totalEarningsPerHour: number` - total earnings per hour in dollars
- Update the StyledTitle component to display the additional information
- Style the earnings information appropriately

### 3. Update HitQueue.tsx
- Calculate total earnings and total earnings per hour using store selectors
- Pass these values as props to PanelTitleBar
- Ensure the calculations update whenever the queue changes

### 4. Testing
- Test with an empty queue
- Test with single HIT in queue
- Test with multiple HITs in queue
- Verify currency formatting is correct
- Verify earnings per hour calculation is accurate

## Files to Modify
1. `src/hooks/store/useStore.ts` - Add calculation selectors
2. `src/components/app/PanelTitleBar.tsx` - Update to display earnings information
3. `src/components/workspace/HitQueue.tsx` - Pass earnings props to PanelTitleBar

## Detailed Implementation

### useStore.ts Changes
```typescript
// Add selectors to useStore.ts
export const useTotalEarnings = () =>
  useStore((state) =>
    state.queue.reduce((total, assignment) => {
      return total + assignment.project.monetary_reward.amount_in_dollars;
    }, 0)
  );

export const useTotalEarningsPerHour = () =>
  useStore((state) => {
    const totalReward = state.queue.reduce((total, assignment) => {
      return total + assignment.project.monetary_reward.amount_in_dollars;
    }, 0);

    const totalDurationHours = state.queue.reduce((total, assignment) => {
      const durationSeconds = assignment.project.assignment_duration_in_seconds || 0;
      return total + (durationSeconds / 3600); // Convert to hours
    }, 0);

    return totalDurationHours > 0 ? totalReward / totalDurationHours : 0;
  });
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
}

const PanelTitleBar: React.FC<IPanelTitleBarProps> = ({
  title,
  columns,
  setColumns,
  filterText,
  setFilterText,
  totalEarnings,
  totalEarningsPerHour,
}) => {
  // ... existing code ...

  return (
    <StyledPanelTitleBar>
      <StyledTitle>
        {title}
        {typeof totalEarnings !== "undefined" && (
          <span style={{ fontSize: "0.8rem", marginLeft: "10px", fontWeight: "normal" }}>
            | Total: ${totalEarnings.toFixed(2)}
            {typeof totalEarningsPerHour !== "undefined" && (
              <span style={{ marginLeft: "8px" }}>
                | ${totalEarningsPerHour.toFixed(2)}/hr
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
import { useStore } from "../../hooks";
import { useTotalEarnings, useTotalEarningsPerHour } from "../../hooks/store/useStore";

const HitQueue: React.FC = () => {
  // ... existing code ...
  
  const totalEarnings = useTotalEarnings();
  const totalEarningsPerHour = useTotalEarningsPerHour();

  return (
    <>
      <PanelTitleBar 
        title={`Your HITs Queue (${queue.length})`}
        totalEarnings={totalEarnings}
        totalEarningsPerHour={totalEarningsPerHour}
      />
      {/* ... existing code ... */}
    </>
  );
};
```

## Verification
- ✅ Total earnings calculation should correctly sum all HIT rewards
- ✅ Total earnings per hour should be calculated based on all HIT durations
- ✅ Earnings should display in $X.XX currency format
- ✅ Changes should be reactive to queue updates
- ✅ Empty queue should display no earnings information

This implementation will provide a clear and useful summary of the user's potential earnings from the HIT queue.