# Chrome Extension Enhancement Tasks

This file contains actionable tasks for enhancing the Memory Layer Chrome extension.

## Task List

### TASK-1: Add Offline Queue Persistence
**Status**: TODO
**Priority**: High
**Estimated Time**: 1 hour

**Description**: Persist offline queue to chrome.storage so queued requests survive browser restarts.

**Acceptance Criteria**:
- Queue saved to chrome.storage.local
- Queue restored on service worker startup
- Failed requests remain in queue
- Queue processed when connection restored
- Maximum queue size enforced (100 items)

**Implementation Steps**:
1. Create queue management module in background.js
2. Save queue to chrome.storage on every change
3. Load queue on service worker initialization
4. Add queue size limit with FIFO eviction
5. Process queue when online event detected
6. Add queue status to popup UI

**Files to Create/Modify**:
- background.js (modify)
- popup.js (modify)
- popup.html (modify)

---

### TASK-2: Add Keyboard Shortcuts
**Status**: TODO
**Priority**: Medium
**Estimated Time**: 45 minutes

**Description**: Implement keyboard shortcuts for quick memory enhancement.

**Acceptance Criteria**:
- Ctrl+Shift+M (Cmd+Shift+M on Mac) triggers enhancement
- Works on all supported platforms
- Shows visual feedback when triggered
- Configurable in extension settings
- Documented in README

**Implementation Steps**:
1. Add commands to manifest.json
2. Add command listener in background.js
3. Send message to active content script
4. Trigger enhancement flow
5. Show notification on success
6. Add settings UI for customization

**Files to Create/Modify**:
- manifest.json (modify)
- background.js (modify)
- content/chatgpt.js (modify)
- content/claude.js (modify)
- content/gemini.js (modify)
- content/grok.js (modify)

---

### TASK-3: Implement Memory Preview
**Status**: TODO
**Priority**: Medium
**Estimated Time**: 1.5 hours

**Description**: Show preview of context that will be injected before sending prompt.

**Acceptance Criteria**:
- Modal shows retrieved context
- User can approve or cancel
- Context displayed in readable format
- Shows relevance scores
- Option to edit context before sending

**Implementation Steps**:
1. Create preview modal HTML/CSS
2. Inject modal into page DOM
3. Fetch context and display in modal
4. Add approve/cancel buttons
5. Handle user decision
6. Proceed with enhancement or cancel

**Files to Create/Modify**:
- content/preview-modal.js (new)
- content/preview-modal.css (new)
- content/chatgpt.js (modify)
- content/claude.js (modify)
- content/gemini.js (modify)
- content/grok.js (modify)

---

### TASK-4: Add Usage Statistics Dashboard
**Status**: TODO
**Priority**: Low
**Estimated Time**: 2 hours

**Description**: Create detailed statistics page showing memory usage analytics.

**Acceptance Criteria**:
- New stats page accessible from popup
- Shows memories by platform (chart)
- Shows memories over time (timeline)
- Shows most used platforms
- Export stats as CSV

**Implementation Steps**:
1. Create stats.html page
2. Create stats.js with chart rendering
3. Fetch data from backend API
4. Render charts using Chart.js or similar
5. Add export functionality
6. Link from popup

**Files to Create/Modify**:
- stats.html (new)
- stats.js (new)
- stats.css (new)
- popup.html (modify - add link)
- manifest.json (modify - add stats page)

---

### TASK-5: Implement Context Highlighting
**Status**: TODO
**Priority**: Low
**Estimated Time**: 1 hour

**Description**: Highlight the injected context in the prompt textarea so users can see what was added.

**Acceptance Criteria**:
- Injected context visually distinct
- Uses different color or style
- Doesn't break prompt functionality
- Works on all platforms
- Can be toggled on/off

**Implementation Steps**:
1. Wrap context in special markers
2. Apply CSS styling to markers
3. Ensure platform compatibility
4. Add toggle in popup settings
5. Test on all platforms

**Files to Create/Modify**:
- content/chatgpt.js (modify)
- content/claude.js (modify)
- content/gemini.js (modify)
- content/grok.js (modify)
- content/styles.css (modify)

---

### TASK-6: Add Error Retry UI
**Status**: TODO
**Priority**: Medium
**Estimated Time**: 45 minutes

**Description**: Show retry button when enhancement fails instead of just error message.

**Acceptance Criteria**:
- Error notification shows retry button
- Clicking retry attempts enhancement again
- Shows attempt count (1/3, 2/3, 3/3)
- Gives up after 3 attempts
- Clear error message on final failure

**Implementation Steps**:
1. Modify notification system to support buttons
2. Add retry logic to enhancement flow
3. Track attempt count
4. Update UI with attempt status
5. Handle final failure gracefully

**Files to Create/Modify**:
- content/chatgpt.js (modify)
- content/claude.js (modify)
- content/gemini.js (modify)
- content/grok.js (modify)

---

### TASK-7: Implement Settings Page
**Status**: TODO
**Priority**: Medium
**Estimated Time**: 2 hours

**Description**: Create settings page for user preferences and configuration.

**Acceptance Criteria**:
- Settings page accessible from popup
- Configure context limit (3-10 memories)
- Toggle auto-capture on/off
- Configure keyboard shortcuts
- Clear all local data option
- Settings persist in chrome.storage

**Implementation Steps**:
1. Create settings.html page
2. Create settings.js with form handling
3. Load current settings from storage
4. Save settings on change
5. Apply settings across extension
6. Add reset to defaults button

**Files to Create/Modify**:
- settings.html (new)
- settings.js (new)
- settings.css (new)
- popup.html (modify - add link)
- background.js (modify - read settings)
- manifest.json (modify - add settings page)

---

### TASK-8: Add Platform Status Indicators
**Status**: TODO
**Priority**: Low
**Estimated Time**: 30 minutes

**Description**: Show real-time status of each platform in popup (active, inactive, error).

**Acceptance Criteria**:
- Green dot for active platforms
- Gray dot for inactive platforms
- Red dot for platforms with errors
- Updates in real-time
- Shows last activity timestamp

**Implementation Steps**:
1. Track platform status in background.js
2. Send status updates to popup
3. Update popup UI with status indicators
4. Add CSS for status dots
5. Show tooltip with details on hover

**Files to Create/Modify**:
- background.js (modify)
- popup.js (modify)
- popup.html (modify)
- styles/popup.css (modify)

---

### TASK-9: Implement Memory Search
**Status**: TODO
**Priority**: Low
**Estimated Time**: 1.5 hours

**Description**: Add search functionality to find specific memories from popup.

**Acceptance Criteria**:
- Search input in popup
- Searches through user's memories
- Shows results in list
- Click result to view details
- Debounced search (300ms)

**Implementation Steps**:
1. Add search input to popup.html
2. Implement search API call
3. Debounce search input
4. Render search results
5. Add result click handler
6. Style results list

**Files to Create/Modify**:
- popup.html (modify)
- popup.js (modify)
- styles/popup.css (modify)

---

### TASK-10: Add Context Source Attribution
**Status**: TODO
**Priority**: Low
**Estimated Time**: 1 hour

**Description**: Show which past conversations the context came from.

**Acceptance Criteria**:
- Context includes source attribution
- Shows date and platform of source
- Formatted clearly in injected context
- Doesn't clutter the prompt
- Can be toggled in settings

**Implementation Steps**:
1. Modify context formatting in background.js
2. Include metadata in context string
3. Format attribution clearly
4. Add toggle in settings
5. Test on all platforms

**Files to Create/Modify**:
- background.js (modify)
- settings.html (modify)
- settings.js (modify)

---

## Task Summary

**Total Tasks**: 10
**TODO**: 10
**In Progress**: 0
**Completed**: 0

**Estimated Total Time**: 12 hours 15 minutes

**Priority Breakdown**:
- High: 2 tasks
- Medium: 4 tasks
- Low: 4 tasks

---

**Note**: Click on any task above in Kiro IDE to start implementation. Kiro will read the task details and begin coding based on the acceptance criteria and implementation steps.
 