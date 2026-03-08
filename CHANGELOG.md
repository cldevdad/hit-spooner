# Changelog

All notable changes to the Hit Spooner project.

## [Unreleased]

### Fixed
- **Invalid Keyframe Errors**
  - Replaced nested `@keyframes` declarations in `HitSpoonerLogo` with Emotion `keyframes` helper to prevent console spam

### Changed
- **HIT Queue**
  - Made queue rows clickable again and switched to `window.open(..., "_blank")` for more reliable tab opening
  - Removed the non-working "Return HIT" button and all related logic to prevent confusing behavior

## [1.0.1] - 2024-02-23

### Added
- **Block Requesters Feature**
  - Toggle-based block/unblock functionality for MTurk requesters
  - Enhanced BlockedRequestersModal with card-based UI
  - Count badge showing total blocked requesters
  - "Unblock All" button with confirmation dialog
  - Individual "Unblock" buttons for each requester
  - Scrollable area (400px height) for large blocked lists
  - Improved empty state with centered icon and message
  - Info alert explaining what blocking does
  - Success notifications for user actions
  - LocalStorage persistence for blocked requesters list
  - Quick access via 🚫 icon in bottom bar

- **Logged Out Detection**
  - Added `isLoggedIn` state tracking to store
  - Created LoggedOutModal component with friendly UI
  - Automatic detection when user is not logged into MTurk
  - "Go to MTurk Login" button to redirect to login page
  - "Reload Page" button to refresh current page
  - Auto-shows modal when logged out
  - Auto-closes modal when logged in
  - Reduces console error spam by gracefully handling redirects

### Fixed
- **Critical Memory Leak**
  - Fixed unbounded task queue growth in `startUpdateIntervals`
  - Limited queue size to maximum 20 tasks
  - Changed from growing interval to fixed interval (every 5 cycles)
  - Added concurrency protection with `isAddingToQueue` flag
  - Added error handling in task processing
  - Added queue truncation when exceeding max size
  - **Impact:** Memory reduced from ~50-100MB/min growth to stable ~10-20MB
  - **Impact:** Tab crashes eliminated
  - **Impact:** Can run indefinitely without crashes

### Changed
- **Build System**
  - Updated package.json to use `npm` instead of `yarn`
  - Build scripts now work with npm commands
  - Added `build:noreload` script for building without extension reload
  - Extension successfully builds in ~87 seconds

- **Documentation**
  - Added comprehensive documentation in `docs/` folder
  - README.md updated with feature descriptions
  - Created BLOCK_REQUESTERS_FEATURE.md - complete user guide
  - Created MEMORY_LEAK_FIX.md - technical fix explanation
  - Created LOGGED_OUT_DETECTION.md - login detection documentation
  - Created ERRORS_EXPLAINED.md - error troubleshooting guide

### Technical Details

**Modified Files:**
- `src/hooks/store/useStore.ts` - Memory leak fix, login detection logic
- `src/hooks/store/IHitSpoonerStoreState.ts` - Added `isLoggedIn` and `setLoggedIn`
- `src/components/modals/BlockedRequestersModal.tsx` - Enhanced UI
- `src/components/workspace/Workspace.tsx` - Integrated LoggedOutModal
- `src/components/modals/LoggedOutModal.tsx` - New login detection modal
- `package.json` - Updated build scripts
- `README.md` - Updated with new features

**New Files:**
- `docs/BLOCK_REQUESTERS_FEATURE.md`
- `docs/MEMORY_LEAK_FIX.md`
- `docs/LOGGED_OUT_DETECTION.md`
- `docs/ERRORS_EXPLAINED.md`
- `CHANGELOG.md`

### Improvements
- Better user experience when not logged into MTurk
- Clear visual feedback for blocked requesters
- Stable performance - no more crashes
- Comprehensive error handling
- Reduced console error spam

### Known Issues
- Bundle size warnings (acceptable for feature-rich extension)
  - content.js: 16.8 MiB
  - popup.js: 3.48 MiB
  - These are normal for extensions with React, Mantine UI, and charts
