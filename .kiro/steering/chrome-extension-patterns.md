---
inclusion: always
---

# Chrome Extension Development Patterns

This steering document ensures all Chrome extensions follow Manifest V3 best practices and modern patterns.

## Manifest V3 Requirements

### Service Worker (Not Background Page)
```json
{
  "background": {
    "service_worker": "background.js"
  }
}
```

Never use:
```json
{
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  }
}
```

### Permissions
- Use `host_permissions` for URL patterns (not `permissions`)
- Request minimal permissions
- Use `activeTab` when possible instead of broad host permissions

### Content Scripts
- Specify `matches` patterns carefully
- Use `run_at: "document_idle"` for most cases
- Consider `world: "ISOLATED"` for security

## Service Worker Patterns

### Module Imports
```javascript
// Use importScripts for dependencies
importScripts('config.js');
importScripts('auth.js');
```

### Message Handling
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle async operations
  handleMessage(message, sender, sendResponse);
  return true; // CRITICAL: Keep channel open for async
});
```

### Async Operations
```javascript
async function handleMessage(message, sender, sendResponse) {
  try {
    const result = await someAsyncOperation();
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
```

## Content Script Patterns

### Wait for DOM
```javascript
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Element not found'));
    }, timeout);
  });
}
```

### Button Injection
```javascript
// Create button
const button = document.createElement('button');
button.id = 'my-extension-btn';
button.textContent = 'My Button';

// Find insertion point
const sendButton = await waitForElement('[data-testid="send-button"]');
sendButton.parentElement.insertBefore(button, sendButton);
```

### Event Listeners
```javascript
// Use event delegation for dynamic content
document.addEventListener('click', (e) => {
  if (e.target.id === 'my-extension-btn') {
    handleButtonClick();
  }
});
```

## OAuth Integration

### Supabase OAuth Flow
```javascript
// 1. Open OAuth URL in new tab
const redirectUrl = chrome.runtime.getURL('auth-callback.html');
const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
await chrome.tabs.create({ url: authUrl });

// 2. In callback page, extract tokens
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get('access_token');
const refreshToken = hashParams.get('refresh_token');

// 3. Store in chrome.storage
await chrome.storage.local.set({
  accessToken,
  refreshToken,
  expiresAt: Date.now() + 3600000
});

// 4. Send message to background
chrome.runtime.sendMessage({ type: 'AUTH_SUCCESS' });
```

### Token Refresh
```javascript
async function refreshToken() {
  const { refreshToken } = await chrome.storage.local.get('refreshToken');
  
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  const data = await response.json();
  
  await chrome.storage.local.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000
  });
}
```

## Storage Patterns

### Chrome Storage
```javascript
// Save
await chrome.storage.local.set({ key: value });

// Get
const { key } = await chrome.storage.local.get('key');

// Remove
await chrome.storage.local.remove('key');

// Clear all
await chrome.storage.local.clear();
```

### Storage Limits
- `chrome.storage.local`: 10MB (unlimited with `unlimitedStorage` permission)
- `chrome.storage.sync`: 100KB total, 8KB per item

## Error Handling

### Try-Catch Everywhere
```javascript
async function someFunction() {
  try {
    const result = await riskyOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { success: false, error: error.message };
  }
}
```

### User Feedback
```javascript
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `extension-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}
```

## Security Best Practices

### Content Security Policy
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### No Inline Scripts
- Never use `eval()` or `new Function()`
- No inline event handlers in HTML
- All scripts in separate files

### Secrets Management
```javascript
// ❌ NEVER hardcode secrets
const API_KEY = 'sk-1234567890abcdef';

// ✅ Use config file (not committed)
// config.js
const CONFIG = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY'
};
```

### Validate All Inputs
```javascript
function validateMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new Error('Invalid message format');
  }
  
  if (!message.type || typeof message.type !== 'string') {
    throw new Error('Message type required');
  }
  
  return true;
}
```

## Testing

### Manual Testing Checklist
- [ ] Load extension in Chrome
- [ ] Check console for errors
- [ ] Test all user flows
- [ ] Test error cases
- [ ] Test on different websites
- [ ] Test after browser restart
- [ ] Test with network offline

### Debug Tools
```javascript
// Enable logging in development
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log('[Extension]', ...args);
  }
}
```

## Common Pitfalls

### ❌ Don't: Use background page
```json
"background": {
  "page": "background.html"
}
```

### ✅ Do: Use service worker
```json
"background": {
  "service_worker": "background.js"
}
```

### ❌ Don't: Forget return true
```javascript
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  someAsyncFunction().then(sendResponse);
  // Missing return true!
});
```

### ✅ Do: Return true for async
```javascript
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  someAsyncFunction().then(sendResponse);
  return true; // Keeps channel open
});
```

### ❌ Don't: Use document.write
```javascript
document.write('<div>Hello</div>');
```

### ✅ Do: Use DOM manipulation
```javascript
const div = document.createElement('div');
div.textContent = 'Hello';
document.body.appendChild(div);
```

## Performance

### Lazy Loading
```javascript
// Don't load everything at startup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'NEED_HEAVY_MODULE') {
    import('./heavy-module.js').then(module => {
      module.doSomething();
    });
  }
});
```

### Debouncing
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Usage
const debouncedSave = debounce(saveToBackend, 1000);
```

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Service Worker Guide](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
