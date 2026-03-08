# MTurk Tool Project - Memory Leak and Optimization Plan

## Summary
This plan addresses all memory leaks and optimization opportunities identified in the audit report. The issues are prioritized based on their potential impact on performance and stability.

## Prioritization
1. **Critical (Must Fix)**: Issues that could cause immediate crashes or severe memory leaks
2. **High (Should Fix)**: Issues that could degrade performance over time
3. **Medium (Consider Fixing)**: Optimization opportunities that improve performance
4. **Low (Optional)**: Minor optimizations that have limited impact

## Implementation Phases

### Phase 1: Critical Fixes - Memory Leak Prevention

#### 1.1 Audio Unlocking Event Listeners (src/utils/playSound.ts:238-244)
- **Issue**: Event listeners added to `document` (click, keydown, touchstart, mousedown) for audio unlocking purposes are never removed.
- **Impact**: Persistent listeners cause memory leaks over extended use.
- **Solution**: Add a cleanup function to remove these event listeners when they are no longer needed.

#### 1.2 MutationObserver Cleanup (src/components/app/App.tsx:53-90)
- **Issue**: MutationObserver is only disconnected if the component unmounts while `!isHitSpoonerUrl`.
- **Impact**: Observer remains active when component unmounts, causing memory leaks.
- **Solution**: Always disconnect the observer in the cleanup function regardless of state.

#### 1.3 Timer Cleanup (src/components/app/App.tsx:92-97)
- **Issue**: setTimeout timer is not cleared if the component unmounts.
- **Impact**: Timer continues to run after unmount, causing memory leaks.
- **Solution**: Clear the timeout in the useEffect cleanup function.

#### 1.4 Fetch Request Cleanup (src/hooks/useTurkerView.ts:72)
- **Issue**: Fetch requests are not aborted when the component unmounts or when `requesterIds` change.
- **Impact**: Uncompleted fetch requests cause memory leaks and inconsistent data.
- **Solution**: Add an AbortController to abort ongoing requests when dependencies change.

### Phase 2: High Priority Fixes - Performance Optimization

#### 2.1 HitItem Title Processing (src/components/workspace/HitItem.tsx:234-421)
- **Issue**: useMemo hooks that depend on `hit.title` cause unnecessary re-computations.
- **Impact**: Reduced performance when rendering large lists of HitItems.
- **Solution**: Memoize processed title and bullet points at a higher level.

#### 2.2 HitList Prop Memoization (src/components/workspace/HitList.tsx:61-104)
- **Issue**: HitList component wrapped in React.memo but props are not properly memoized.
- **Impact**: Unnecessary re-renders even when props haven't changed.
- **Solution**: Memoize all props passed to HitList components.

#### 2.3 Fetch Timeout Handling (src/utils/fetchWithTimeout.ts:8-27)
- **Issue**: FetchWithTimeout function correctly uses AbortController but doesn't expose abort functionality.
- **Impact**: Requests continue to run after component unmount.
- **Solution**: Modify the function to return both response and an abort function.

### Phase 3: Medium Priority Optimizations

#### 3.1 Store Size Optimization (src/hooks/store/useStore.ts:21-766)
- **Issue**: Large Zustand store with many debounced functions and intervals.
- **Impact**: Memory bloat over time.
- **Solution**: Move some state logic to components or custom hooks, and ensure all intervals/timeout are cleared.

#### 3.2 Sound Generation Optimization (src/utils/playSound.ts:12-139)
- **Issue**: Generating WAV sounds on the fly using base64 encoding is computationally expensive.
- **Impact**: UI lag when sounds are played frequently.
- **Solution**: Pre-generate and cache sound files.

#### 3.3 API Error Handling (src/hooks/useActivityData.ts:10-64, src/hooks/useHitsQueue.ts:10-28)
- **Issue**: API calls without timeouts or proper error handling.
- **Impact**: Failed requests leave components in loading state indefinitely.
- **Solution**: Add timeouts and error handling to all API calls.

### Phase 4: Low Priority Optimizations

#### 4.1 Workspace Callback Memoization (src/components/workspace/Workspace.tsx:1-126)
- **Issue**: Callback functions passed to HitList components are not memoized.
- **Impact**: Unnecessary re-renders when workspace resizes.
- **Solution**: Memoize callback functions using useCallback.

#### 4.2 Background Script Error Handling (src/background.ts:1-185)
- **Issue**: Background script doesn't handle all error scenarios when creating/removing tabs.
- **Impact**: Orphaned tabs if script fails.
- **Solution**: Improve error handling and ensure tabs are always cleaned up.

## Testing Strategy

1. **Memory Leak Detection**: 
   - Use Chrome DevTools Memory panel to profile the extension
   - Test with large numbers of HITs
   - Monitor memory usage over extended periods

2. **Performance Testing**:
   - Measure time to render large HIT lists
   - Test audio playback performance
   - Monitor API request times

3. **Regression Testing**:
   - Ensure all existing functionality still works
   - Test with different queue sizes
   - Verify all interactive elements function correctly

## Implementation Timeline

- **Phase 1 (Critical Fixes)**: 2-3 days
- **Phase 2 (High Priority)**: 3-4 days
- **Phase 3 (Medium Priority)**: 4-5 days
- **Phase 4 (Low Priority)**: 2-3 days
- **Testing and Verification**: 2-3 days

## Risk Mitigation

1. **Incremental Changes**: Implement each fix in isolation and test thoroughly before moving to the next
2. **Version Control**: Use Git branches to manage changes and revert if necessary
3. **Backup Strategy**: Keep copies of all modified files before implementing changes

## Success Metrics

1. **Memory Usage**: Reduced by 30-50% when handling large queues
2. **Rendering Performance**: Improved by 20-30% for large HIT lists
3. **API Response Times**: Consistent handling of timeouts and errors
4. **Stability**: No memory leaks detected after 24 hours of continuous use