# Fix HIT Return Functionality Issues

## Problem Summary
The HIT return functionality is still broken with two main issues:
1. Error codes don't display properly in the UI
2. Return fails with "HTTP undefined" error

## Root Causes Identified

1. **HTTP undefined error**: Occurs when `parsedResult.status` is undefined due to:
   - Script returning `undefined` or invalid JSON
   - Script failing to execute entirely  
   - Response parsing failures
   - Network errors that don't set status

2. **Error code not displaying**: Happens when the script returns a status code but no error message, or when the error message is not properly propagated.

## Fix Strategy

**Phase 1: Fix Script Execution and Response Handling**
1. Improve script injection and execution reliability
2. Add comprehensive error handling for script execution
3. Validate all responses from MTurk
4. Fix status code and error message parsing

**Phase 2: Enhance Error Display in UI**
1. Improve error message formatting in background.ts
2. Ensure consistent error propagation through useStore
3. Optimize notification display for different error scenarios

## Detailed Implementation Plan

### File: src/background.ts
```typescript
const executeReturnHit = async (
  tabId: number,
  hitSetId: string,
  taskId: string,
  assignmentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Executing return hit script on tab:", tabId);
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (hitSetId: string, taskId: string, assignmentId: string) => {
        try {
          console.log("Script: Getting CSRF token");
          const getCsrfToken = (): string | null => {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            return metaTag?.getAttribute('content') || null;
          };

          const csrfToken = getCsrfToken();
          if (!csrfToken) {
            return JSON.stringify({
              success: false,
              status: 403,
              error: 'CSRF token not found',
              url: 'N/A'
            });
          }

          const returnUrl = `https://worker.mturk.com/projects/${hitSetId}/tasks/${taskId}?assignment_id=${assignmentId}&ref=w_wp_rtrn_top`;
          console.log("Script: Making request to:", returnUrl);

          const response = await fetch(returnUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `_method=delete&authenticity_token=${encodeURIComponent(csrfToken || '')}`,
          });

          console.log("Script: Response received:", response.status, response.statusText);

          if (response.ok) {
            return JSON.stringify({
              success: true,
              status: response.status,
              url: returnUrl
            });
          } else {
            return JSON.stringify({
              success: false,
              status: response.status,
              error: `HTTP ${response.status} ${response.statusText}`,
              url: returnUrl
            });
          }
        } catch (error) {
          console.error("Script error:", error);
          return JSON.stringify({
            success: false,
            status: 500,
            error: `Network error: ${String(error)}`,
            url: 'N/A'
          });
        }
      },
      args: [hitSetId, taskId, assignmentId],
    });

    if (!result || !Array.isArray(result) || result.length === 0) {
      return { success: false, error: 'No result from script - empty result array' };
    }

    console.log("Script result:", result[0]);

    if (!result[0].result) {
      return { success: false, error: 'Script returned no data' };
    }

    const parsedResult = JSON.parse(result[0].result || '{}');
    console.log("Parsed script result:", parsedResult);

    if (parsedResult.success) {
      return { success: true };
    } else {
      const errorMessage = parsedResult.error || (parsedResult.status ? `HTTP ${parsedResult.status}` : 'Unknown error');
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error("Error executing return hit script:", error);
    return { success: false, error: `Script execution failed: ${String(error)}` };
  }
};
```

### File: src/hooks/store/useStore.ts  
```typescript
// Update returnHit function to handle undefined errors better
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
      const errorMessage = response?.error || "Failed to return HIT - unknown error";
      console.error("Failed to return HIT:", errorMessage);
      notifications.show({
        title: "Failed to Return HIT",
        message: errorMessage,
        color: "red",
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to return HIT - unexpected error";
    console.error("Error returning HIT:", errorMessage);
    notifications.show({
      title: "Failed to Return HIT",
      message: errorMessage,
      color: "red",
    });
  }
},
```

## Key Improvements

1. **Enhanced Script Error Handling**: Added comprehensive try-catch around entire script logic with detailed logging
2. **Improved Response Validation**: Checked for valid response structure and required fields
3. **Fixed Error Message Parsing**: Ensured status code and error messages are always defined
4. **Better Debugging**: Added detailed logging for every step of the process
5. **CSRF Token Validation**: Added check for valid CSRF token before making request
6. **Error Propagation**: Improved error handling in useStore to display meaningful messages

## Verification Steps
1. Build extension and reload in Chrome
2. Test return functionality with various scenarios
3. Check console logs for debugging information
4. Verify notifications display correctly
5. Ensure error codes are properly formatted

This plan will systematically address both issues by improving script execution reliability, error handling, and response validation.