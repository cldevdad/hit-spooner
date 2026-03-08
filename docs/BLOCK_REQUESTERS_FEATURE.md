# Block Requesters Feature Documentation

## Overview

The Block Requesters feature allows you to block specific MTurk requesters, automatically filtering out all HITs from those requesters in your search results. This helps you avoid working with requesters you've had bad experiences with or simply don't want to see HITs from.

**Version:** 1.0.0  
**Status:** ✅ Fully Implemented

## How It Works

When you block a requester, their requester ID is added to your blocked list. This list is persisted in your browser's local storage, so it will persist across browser sessions.

Key behaviors:
- **Automatic Filtering:** All HITs from blocked requesters are filtered out during HIT fetching
- **Instant Effect:** Blocking takes effect immediately on the next HIT refresh
- **Persistence:** Blocked requesters are saved in localStorage
- **Toggle Functionality:** The `blockRequester` function toggles between block/unblock

## How to Use

### Blocking a Requester

1. **Navigate to HITs:** Find a HIT from the requester you want to block in the Available HITs list
2. **Click Requester Name:** Click on the requester's name or ID in any HIT item to open the Requester Info modal
3. **Block Requester:** Click the **"Block Requester"** button (red button with trash icon 🗑️) at the bottom of the modal
4. **Confirmation:** The requester is immediately blocked and the modal closes
5. **Verification:** Blocked requester's HITs will no longer appear in your search results

### Viewing/Managing Blocked Requesters

1. **Open Blocked Requesters Modal:** Click the **🚫 Blocked Requesters** icon (ban symbol) in the bottom bar
2. **View Blocked List:** See all currently blocked requesters with their IDs
3. **Count Badge:** Total number of blocked requesters is displayed in the top-right corner

### Unblocking a Requester

#### Single Requester Unblock
1. Open the Blocked Requesters modal from the bottom bar
2. Locate the requester you want to unblock
3. Click the **"Unblock"** button (green button)
4. **Confirm:** A confirmation dialog will appear - click "Yes, Unblock"
5. **Notification:** Success notification confirms the requester has been unblocked

#### Unblock All Requesters
1. Open the Blocked Requesters modal
2. Click the **"Unblock All"** button (red button with trash icon) at the top
3. **Confirm:** Dialog shows total count - click "Yes, Unblock All"
4. **Page Reload:** Page automatically reloads to refresh the state
5. **Notification:** Success message confirms all requesters have been unblocked

## UI Components

### Requester Info Modal
- **Location:** Opens when clicking on any requester name/ID in HIT items
- **Block Button:** Red button with trash icon at bottom of modal
- **Button Text:** "Block Requester"
- **Behavior:** Clicking adds/retains the requester in blocked list

### Blocked Requesters Modal
- **Access:** Bottom bar 🚫 icon
- **Features:**
  - Card-based list of all blocked requesters
  - Count badge showing total blocked
  - "Unblock All" button for bulk operations
  - Individual "Unblock" buttons per requester
  - Scrollable area for large lists
- **Empty State:** Friendly message with icon when no requesters are blocked
- **Info Alert:** Explains that blocked requesters are filtered from HIT results

### Bottom Bar
- **Icon:** 🚫 (Ban symbol) - third button from left
- **Tooltip:** "Blocked Requesters"
- **Click Behavior:** Opens BlockedRequestersModal

## Technical Implementation

### Data Storage
- **Storage Key:** `"blockedRequesters"`
- **Format:** JSON array of strings (requester IDs)
- **Example:** `["A12345678", "B98765432"]`

### Key Functions

#### `blockRequester(requesterId: string)`
- **Location:** `src/hooks/store/useStore.ts`
- **Behavior:** Toggles the requester's blocked status
- **Logic:**
  ```typescript
  const isAlreadyBlocked = state.blockedRequesters.includes(requesterId);
  if (isAlreadyBlocked) {
    // Remove from blocked list (unblock)
  } else {
    // Add to blocked list (block)
  }
  ```

#### HIT Filtering
- **Location:** `src/hooks/store/useStore.ts` in `fetchAndUpdateHits`
- **Implementation:**
  ```typescript
  const blockedRequestersSet = new Set(get().blockedRequesters);
  filteredHits = fetchedHits.filter(
    (hit: IHitProject) => !blockedRequestersSet.has(hit.requester_id)
  );
  ```

### Component Files
- **Modal:** `src/components/modals/BlockedRequestersModal.tsx`
- **Trigger:** `src/components/app/BottomBar.tsx`
- **Store:** `src/hooks/store/useStore.ts`

## Edge Cases & Limitations

### Current Limitations
1. **Requester Names Not Stored:** Only requester IDs are stored in the blocked list
2. **No Bulk Block Feature:** Must block requesters one at a time through Requester Info modal
3. **Page Reload Required for "Unblock All":** The `handleUnblockAll` function calls `window.location.reload()` to refresh the store state

### Expected Behaviors
- **Duplicate Blocks:** The `blockRequester` function checks if already blocked before adding, preventing duplicates
- **Unblock Confirmation:** Both single and bulk unblock require user confirmation
- **Automatic Persistence:** All changes automatically saved to localStorage
- **Empty List Handling:** UI gracefully handles empty blocked list

## Future Enhancements (Potential)

### Suggested Improvements
1. **Store Requester Names:** Save both ID and name when blocking for better identification
2. **Bulk Block from Queue:** Add option to block all requesters in the current queue
3. **Block Reason Notes:** Allow users to add notes explaining why they blocked a requester
4. **Export/Import:** Feature to export blocked list and import to another browser/device
5. **Time-based Blocking:** Option to auto-unblock after a specified time period
6. **Smart Blocking:** Suggest blocking based on low ratings or rejection rates

## Troubleshooting

### Requester Not Being Blocked
- **Check localStorage:** Verify requester ID exists in `blockedRequesters` array
- **Refresh Page:** Force page reload to ensure store updates
- **Check Filter Logic:** Verify HITs are actually being from that requester (debug with Developer Tools)

### Blocked Requesters Still Appearing
- **Wait for Next Refresh:** HIT filtering only applies on new fetches
- **Check Queue:** If requester is already in queue, they'll remain until removed
- **Verify ID Match:** Ensure you're blocking the correct requester ID

### UI Issues
- **Modal Not Opening:** Check browser console for errors
- **Buttons Not Responding:** Verify `useStore` hook is properly connected
- **Styles Misaligned:** Mantine theme may need adjustment

## API Reference

### BlockedRequester Type
```typescript
type BlockedRequester = string; // Requester ID
```

### BlockedRequesters Array
```typescript
type BlockedRequesters = Array<BlockedRequester>;
```

### Store State
```typescript
interface IHitSpoonerStoreState {
  blockedRequesters: BlockedRequesters;
  blockRequester: (requesterId: string) => void;
}
```

## Testing Checklist

- [ ] Block a single requester
- [ ] Verify blocked requester's HITs don't appear in search
- [ ] Unblock a single requester
- [ ] Verify unblocked requester's HITs appear in search
- [ ] Block multiple requesters
- [ ] Verify all blocked HITs filtered out
- [ ] Unblock all requesters
- [ ] Verify empty state displays correctly
- [ ] Test persistence across page reloads
- [ ] Test count badge accuracy
- [ ] Verify confirmation dialogs work
- [ ] Check notification success messages

## Changelog

### v1.0.0 (Current)
- ✅ Initial implementation of block requester functionality
- ✅ Toggle-based block/unblock system
- ✅ BlockedRequestersModal with improved UI
- ✅ "Unblock All" feature with confirmation
- ✅ LocalStorage persistence
- ✅ Automatic HIT filtering
- ✅ Bottom bar integration
- ✅ Success notifications
- ✅ Empty state handling

## Support

For issues or questions regarding the Block Requesters feature:
1. Check browser console for errors
2. Verify localStorage contains valid `blockedRequesters` array
3. Report bugs via GitHub issues
4. Check implementation in:
   - `src/components/modals/BlockedRequestersModal.tsx`
   - `src/hooks/store/useStore.ts`
   - `src/components/app/BottomBar.tsx`

---

**Last Updated:** 2024  
**Maintained By:** Hit Spooner Development Team