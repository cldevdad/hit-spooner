# Fix HIT Return Functionality

## Summary
Fix the HIT return functionality where clicking the return button shows no feedback to users. The issue is caused by silent error handling.

## Changes Made

### 1. Install Notification Library
Added `@mantine/notifications@7.17.8` dependency to package.json using `--legacy-peer-deps` flag to bypass peer dependency conflicts.

### 2. Configure Notifications in App.tsx
- Import `Notifications` component and its styles
- Add `<Notifications />` component to the app root

```tsx
// src/components/app/App.tsx
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

// ...

return (
  <EmotionThemeProvider theme={theme}>
    <MantineProvider theme={theme}>
      <GlobalStyles />
      <Notifications />
      <MainContainer>
        {/* ... existing content ... */}
      </MainContainer>
    </MantineProvider>
  </EmotionThemeProvider>
);
```

### 3. Enhance useStore.ts
Add error logging and user feedback to the `returnHit` function:

```typescript
// src/hooks/store/useStore.ts
returnHit: async (assignment: IHitAssignment) => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "RETURN_HIT",
      payload: {
        hitSetId: assignment.project.hit_set_id,
        taskId: assignment.task_id,
        assignmentId: assignment.assignment_id,
      },
    });

    if (response?.success) {
      set((state) => ({
        queue: state.queue.filter((a) => a.assignment_id !== assignment.assignment_id),
      }));
      notifications.show({
        title: "HIT Returned",
        message: "The HIT has been successfully returned",
        color: "green",
      });
    } else {
      console.error("Failed to return HIT:", response?.error);
      notifications.show({
        title: "Failed to Return HIT",
        message: response?.error || "Unknown error occurred",
        color: "red",
      });
    }
  } catch (error) {
    console.error("Error returning HIT:", error);
    notifications.show({
      title: "Failed to Return HIT",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      color: "red",
    });
  }
},
```

### 4. Improve Background.ts
Add error logging to the RETURN_HIT message handler:

```typescript
// src/background.ts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "RETURN_HIT") {
    (async () => {
      let createdTabId: number | null = null;

      try {
        console.log("Processing RETURN_HIT request:", message.payload);
        let tab = await getMturkTab();
        if (!tab?.id) {
          console.log("Creating new MTurk tab");
          tab = await createMturkTab();
          createdTabId = tab.id!;
        }

        const { hitSetId, taskId, assignmentId } = message.payload;
        const response = await executeReturnHit(tab.id!, hitSetId, taskId, assignmentId);
        console.log("Return HIT response:", response);

        if (createdTabId) {
          try {
            await chrome.tabs.remove(createdTabId);
          } catch {
            // Tab already closed
          }
        }

        sendResponse(response);
      } catch (error) {
        console.error("Error processing RETURN_HIT message:", error);
        if (createdTabId) {
          try {
            await chrome.tabs.remove(createdTabId);
          } catch {
            // Tab already closed
          }
        }

        sendResponse({ success: false, error: String(error) });
      }
    })();
    return true;
  }
});

// Also add logging to executeReturnHit function
const executeReturnHit = async (
  tabId: number,
  hitSetId: string,
  taskId: string,
  assignmentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Executing return hit script on tab:", tabId);
    const result = await chrome.scripting.executeScript({
      // ... existing code ...
    });
    // ... existing code ...
  } catch (error) {
    console.error("Error executing return hit script:", error);
    return { success: false, error: `Script execution failed: ${String(error)}` };
  }
};
```

### 5. Modernize API Call in executeReturnHit
Replace synchronous XMLHttpRequest with async fetch API:

```typescript
// src/background.ts
const executeReturnHit = async (
  tabId: number,
  hitSetId: string,
  taskId: string,
  assignmentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (hitSetId: string, taskId: string, assignmentId: string) => {
        const getCsrfToken = (): string | null => {
          const metaTag = document.querySelector('meta[name="csrf-token"]');
          return metaTag?.getAttribute('content') || null;
        };

        const csrfToken = getCsrfToken();
        const returnUrl = `https://worker.mturk.com/projects/${hitSetId}/tasks/${taskId}?assignment_id=${assignmentId}&ref=w_wp_rtrn_top`;

        try {
          const response = await fetch(returnUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `_method=delete&authenticity_token=${encodeURIComponent(csrfToken || '')}`,
          });

          return JSON.stringify({
            success: response.ok,
            status: response.status,
            url: returnUrl
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            status: 500,
            error: String(error),
            url: returnUrl
          });
        }
      },
      args: [hitSetId, taskId, assignmentId],
    });

    if (!result || !Array.isArray(result) || result.length === 0) {
      return { success: false, error: 'No result from script - empty result array' };
    }

    const parsedResult = JSON.parse(result[0].result || '{}');
    return parsedResult.success
      ? { success: true }
      : { success: false, error: parsedResult.error || `HTTP ${parsedResult.status}` };
  } catch (error) {
    console.error("Error executing return hit script:", error);
    return { success: false, error: `Script execution failed: ${String(error)}` };
  }
};
```

## Verification Steps
1. Build the extension: `npm run build`
2. Reload the extension in Chrome
3. Test the return functionality
4. Verify that:
   - Success notification is shown when HIT is returned
   - Error notification is shown if return fails
   - Console logs are available for debugging

## Files Modified
- package.json - Added @mantine/notifications dependency
- yarn.lock - Updated with new dependency
- src/components/app/App.tsx - Added Notifications component
- src/hooks/store/useStore.ts - Enhanced error handling and notifications
- src/background.ts - Added logging and modernized API call