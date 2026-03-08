# Logged Out Detection Feature

## Overview

The Logged Out Detection feature provides a user-friendly experience when you're not logged into Amazon Mechanical Turk. Instead of flooding the console with errors, the extension now shows a helpful modal explaining what's happening and how to fix it.

## What's New

### 1. Login State Tracking

**Added to Store (`IHitSpoonerStoreState`):**
```typescript
isLoggedIn: boolean;
setLoggedIn: (loggedIn: boolean) => void;
```

**How it works:**
- Extension starts with `isLoggedIn: false`
- On successful HIT fetch → sets `isLoggedIn: true`
- On failed fetch (redirect to login) → sets `isLoggedIn: false`
- Modal automatically shows/hides based on this state

### 2. LoggedOutModal Component

**New Component:** `src/components/modals/LoggedOutModal.tsx`

**Features:**
- ✅ Friendly alert explaining the issue
- ✅ Clear explanation of what's happening
- ✅ Two action buttons:
  - "Go to MTurk Login" - redirects to worker.mturk.com
  - "Reload Page" - reloads current page
- ✅ Cannot be closed by clicking outside (forces action)
- ✅ Auto-closes when logged in

**UI Elements:**
- Yellow alert with warning icon
- Card with bullet points explaining the situation
- Centered buttons for easy access
- Helpful text explaining auto-close behavior

### 3. Integration with Workspace

**Modified:** `src/components/workspace/Workspace.tsx`

**Changes:**
- Import LoggedOutModal component
- Track `isLoggedIn` state from store
- Show modal when `!isLoggedIn`
- Auto-show/hide based on login state

## How It Works

### Initial State (Not Logged In)
```
1. Extension loads
2. isLoggedIn = false
3. LoggedOutModal shows
4. Extension attempts to fetch HITs
5. Fails (redirect to login)
6. setLoggedIn(false) - stays false
7. Modal remains visible
```

### After Logging In
```
1. User logs into MTurk
2. Extension fetches HITs successfully
3. setLoggedIn(true) called
4. LoggedOutModal closes automatically
5. HITs start populating
6. Extension works normally
```

### Session Expiry
```
1. User's MTurk session expires
2. Fetch fails with redirect
3. setLoggedIn(false) called
4. LoggedOutModal shows
5. User can click to log in again
```

## Files Modified

| File | Changes |
|------|---------|
| `src/hooks/store/IHitSpoonerStoreState.ts` | Added `isLoggedIn` and `setLoggedIn` to interface |
| `src/hooks/store/useStore.ts` | Implemented login state tracking in store |
| `src/components/workspace/Workspace.tsx` | Integrated LoggedOutModal |
| `src/components/modals/LoggedOutModal.tsx` | Created new modal component |

## Technical Details

### Login Detection Logic

**On Successful Fetch:**
```typescript
const fetchedHits = await fetchHITProjects(get().filters);
// Successfully fetched HITs - user is logged in
get().setLoggedIn(true);
```

**On Failed Fetch (Session Expired):**
```typescript
catch (error: any) {
  // Detect if we're being redirected to login (session expired)
  if (error?.message === "Redirected" || error?.name === "TypeError") {
    get().setLoggedIn(false);
    fetchError = "Session expired? Please log in to MTurk.";
  }
}
```

**On Queue Fetch Success:**
```typescript
const data = await response.json();
// Successfully fetched queue - user is logged in
get().setLoggedIn(true);
```

### Modal State Management

```typescript
const [isLoggedOutModalOpen, setIsLoggedOutModalOpen] = useState(false);
const { isLoggedIn } = useStore((state) => ({
  isLoggedIn: state.isLoggedIn,
}));

// Effect to show logged out modal when not logged in
useEffect(() => {
  setIsLoggedOutModalOpen(!isLoggedIn);
}, [isLoggedIn]);
```

## Benefits

### Before (Without Login Detection):
- ❌ Console flooded with CORS errors
- ❌ "Failed to fetch" errors everywhere
- ❌ Extension trying to fetch endlessly
- ❌ No clear indication of the problem
- ❌ User confused why nothing works

### After (With Login Detection):
- ✅ Friendly modal explains the issue
- ✅ Clear instructions on how to fix
- ✅ Console errors reduced (handled gracefully)
- ✅ Extension stops unnecessary fetch attempts
- ✅ Better user experience

## User Experience

### First Time Loading Extension:
1. User loads extension on MTurk
2. If logged in → Works normally
3. If not logged in → Shows modal with options
4. User clicks "Go to MTurk Login"
5. Logs in and returns
6. Modal closes, HITs appear

### Session Expiry:
1. User's session expires while using extension
2. Next fetch fails
3. LoggedOutModal appears
4. User clicks "Reload Page"
5. MTurk redirects to login
6. User logs in
7. Extension resumes normally

## Testing

### Test Scenarios:

**1. Test Logged Out State:**
- Log out of MTurk
- Reload extension
- ✅ Should see LoggedOutModal
- ✅ No endless console errors

**2. Test Logged In State:**
- Log into MTurk
- Reload extension
- ✅ Should NOT see LoggedOutModal
- ✅ HITs should populate normally

**3. Test Session Expiry:**
- Stay logged in
- Let session expire
- Wait for next fetch attempt
- ✅ LoggedOutModal should appear

**4. Test Buttons:**
- Click "Go to MTurk Login"
  - ✅ Should redirect to worker.mturk.com
- Click "Reload Page"
  - ✅ Should reload current page

## Troubleshooting

### Modal Not Showing When Logged Out:
- Check if `isLoggedIn` state is being set correctly
- Verify fetch functions are calling `setLoggedIn(false)` on error
- Check browser console for errors

### Modal Not Closing When Logged In:
- Verify fetch functions are calling `setLoggedIn(true)` on success
- Check useEffect dependency on `isLoggedIn`
- Verify modal `isOpen` prop is connected to state

### HITs Still Not Appearing After Logging In:
- Make sure you're on `worker.mturk.com`
- Check browser console for actual errors
- Verify extension permissions
- Try reloading the page after logging in

## Future Enhancements

### Potential Improvements:

1. **Auto-Detect Login Status:**
   ```typescript
   // Check if we're on mturk.com
   const isOnMturkPage = window.location.href.includes('worker.mturk.com');
   ```

2. **Session Timeout Warning:**
   ```typescript
   // Warn user before session expires
   useEffect(() => {
     const timer = setInterval(() => {
       checkSessionExpiry();
     }, 60000); // Check every minute
     return () => clearInterval(timer);
   }, []);
   ```

3. **Auto-Redirect Option:**
   ```typescript
   // Option to automatically redirect to login
   const autoRedirect = localStorage.getItem('autoRedirectToLogin') === 'true';
   if (!isLoggedIn && autoRedirect) {
     window.location.href = 'https://worker.mturk.com';
   }
   ```

## Summary

**What This Feature Solves:**
- ✅ Eliminates confusing console errors
- ✅ Provides clear user feedback
- ✅ Reduces unnecessary network requests
- ✅ Improves overall user experience

**How It Works:**
- Tracks login state via `isLoggedIn` boolean
- Sets state to `true` on successful fetches
- Sets state to `false` on failed fetches (redirects)
- Shows/hides modal based on state
- Provides clear actions to resolve the issue

**User Flow:**
1. Extension detects you're not logged in
2. Shows friendly modal
3. You click to log in
4. Extension detects successful login
5. Modal closes automatically
6. Extension works normally

---

**Implementation Date:** February 2024  
**Status:** ✅ Complete and Working  
**User Impact:** ✅ Significantly Improved
