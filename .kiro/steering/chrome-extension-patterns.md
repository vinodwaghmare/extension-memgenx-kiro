---
inclusion: fileMatch
fileMatchPattern: "**/{manifest.json,background.js,content.js,popup.*}"
---

# Chrome Extension Development Patterns

## Manifest V3 Requirements
Always use Manifest V3 (not V2) for new Chrome extensions.

### Service Workers (Background Scripts)
```javascript
// background.js - Use service worker, not persistent background page
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Service workers can be terminated, so use chrome.storage for persistence
chrome.storage.local.set({ key: 'value' });
```

### Message Passing
```javascript
// From content script to background
chrome.runtime.sendMessage({ type: 'CAPTURE_PAGE' }, (response) => {
  console.log('Response:', response);
});

// In background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_PAGE') {
    // Handle message
    sendResponse({ success: true });
  }
  return true; // Keep channel open for async response
});
```

### Storage Best Practices
```javascript
// Use chrome.storage.local for extension data
await chrome.storage.local.set({ memories: [] });
const { memories } = await chrome.storage.local.get('memories');

// Use chrome.storage.sync for user preferences (limited to 100KB)
await chrome.storage.sync.set({ theme: 'dark' });
```

### Permissions
Only request permissions you actually need:
```json
{
  "permissions": [
    "storage",      // For chrome.storage API
    "tabs",         // For chrome.tabs API
    "activeTab"     // For accessing current tab
  ],
  "host_permissions": [
    "https://*/*"   // Be specific when possible
  ]
}
```

### Content Scripts
```javascript
// Inject content script to access page DOM
// manifest.json
{
  "content_scripts": [{
    "matches": ["https://*/*"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }]
}

// content.js - Has access to page DOM but not page JavaScript
const pageTitle = document.title;
const pageUrl = window.location.href;
```

### OAuth in Extensions
```javascript
// Use chrome.identity for OAuth
chrome.identity.getAuthToken({ interactive: true }, (token) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }
  // Use token for API requests
});
```

## Common Patterns

### Debouncing Tab Updates
```javascript
let debounceTimer;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      capturePageContext(tab);
    }, 2000); // Wait 2s after page load
  }
});
```

### Error Handling
```javascript
async function captureMemory(data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to capture memory:', error);
    // Queue for retry
    await queueFailedRequest(data);
  }
}
```

### Offline Queue
```javascript
async function queueFailedRequest(data) {
  const { queue = [] } = await chrome.storage.local.get('queue');
  queue.push({ data, timestamp: Date.now() });
  await chrome.storage.local.set({ queue });
}

// Retry queue when online
chrome.runtime.onStartup.addListener(async () => {
  const { queue = [] } = await chrome.storage.local.get('queue');
  for (const item of queue) {
    await captureMemory(item.data);
  }
  await chrome.storage.local.set({ queue: [] });
});
```

## Security Considerations
- Never inject untrusted code into pages
- Validate all messages from content scripts
- Use Content Security Policy in manifest
- Store sensitive data encrypted
- Implement rate limiting for API calls

## Testing Extensions
```javascript
// Use chrome.test API for automated tests
chrome.test.runTests([
  async function testCaptureMemory() {
    const result = await captureMemory({ url: 'https://example.com' });
    chrome.test.assertTrue(result.success);
  }
]);
```

---

*Follow these patterns for robust Chrome extension development.*
