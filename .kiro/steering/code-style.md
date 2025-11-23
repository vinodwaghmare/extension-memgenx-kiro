---
inclusion: always
---

# JavaScript Code Style Guidelines

This steering document ensures consistent code style across the Memory Layer Chrome Extension.

## General Principles

- Write clear, readable code
- Prefer async/await over promises
- Use descriptive variable names
- Add comments for complex logic
- Handle all errors gracefully

## Naming Conventions

### Variables and Functions
```javascript
// camelCase for variables and functions
const userName = 'John';
const userEmail = 'john@example.com';

function getUserData() { }
function savePromptToBackend() { }
```

### Constants
```javascript
// UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;
```

### Classes
```javascript
// PascalCase for classes
class MemoryLayerAuth { }
class MessageHandler { }
class ContextEnhancer { }
```

### Private Methods
```javascript
// Prefix with underscore
class MyClass {
  _privateMethod() { }
  publicMethod() { }
}
```

## Function Structure

### Async Functions
```javascript
// Always use async/await
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Fetch user data failed:', error);
    return { success: false, error: error.message };
  }
}
```

### Return Early
```javascript
// Good: Early returns
function processUser(user) {
  if (!user) return null;
  if (!user.id) return null;
  
  return {
    id: user.id,
    name: user.name
  };
}

// Avoid: Nested conditions
function processUser(user) {
  if (user) {
    if (user.id) {
      return {
        id: user.id,
        name: user.name
      };
    }
  }
  return null;
}
```

## Error Handling

### Try-Catch Pattern
```javascript
async function saveData(data) {
  try {
    const result = await api.save(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Save failed:', error);
    return { success: false, error: error.message };
  }
}
```

### Validation
```javascript
function validatePrompt(prompt) {
  if (!prompt) {
    throw new Error('Prompt is required');
  }
  
  if (typeof prompt !== 'string') {
    throw new Error('Prompt must be a string');
  }
  
  if (prompt.length > 10000) {
    throw new Error('Prompt too long');
  }
  
  return true;
}
```

## Comments

### Function Comments
```javascript
/**
 * Enhances a user prompt with relevant context from past conversations
 * @param {string} prompt - The original user prompt
 * @param {string} userId - The user's ID
 * @returns {Promise<string>} The enhanced prompt with context
 */
async function enhancePrompt(prompt, userId) {
  // Implementation
}
```

### Inline Comments
```javascript
// Good: Explain WHY, not WHAT
// Wait for response to complete before saving (streaming can take 10-30s)
await waitForResponseComplete();

// Avoid: Obvious comments
// Set the user name
const userName = 'John';
```

### TODO Comments
```javascript
// TODO: Add retry logic for failed API calls
// FIXME: Handle edge case when user is not authenticated
// NOTE: This is a temporary workaround for Chrome bug #12345
```

## Code Organization

### File Structure
```javascript
// 1. Imports/Dependencies
importScripts('config.js');
importScripts('auth.js');

// 2. Constants
const MAX_RETRIES = 3;
const TIMEOUT = 5000;

// 3. Global Variables
let authInstance = null;

// 4. Main Functions
async function init() { }

// 5. Helper Functions
function formatDate(date) { }

// 6. Event Listeners
chrome.runtime.onMessage.addListener(handleMessage);
```

### Function Order
```javascript
// Public functions first
async function savePrompt(prompt) {
  const validated = _validatePrompt(prompt);
  return _sendToBackend(validated);
}

// Private/helper functions after
function _validatePrompt(prompt) { }
function _sendToBackend(data) { }
```

## Async/Await Best Practices

### Parallel Operations
```javascript
// Good: Run in parallel
const [user, settings, history] = await Promise.all([
  fetchUser(),
  fetchSettings(),
  fetchHistory()
]);

// Avoid: Sequential when not needed
const user = await fetchUser();
const settings = await fetchSettings();
const history = await fetchHistory();
```

### Error Handling
```javascript
// Good: Handle each operation
try {
  const user = await fetchUser();
  const settings = await fetchSettings();
  return { user, settings };
} catch (error) {
  console.error('Fetch failed:', error);
  return null;
}
```

## Object and Array Handling

### Destructuring
```javascript
// Good: Use destructuring
const { userId, userName, userEmail } = user;
const [first, second, ...rest] = items;

// Avoid: Multiple assignments
const userId = user.userId;
const userName = user.userName;
const userEmail = user.userEmail;
```

### Spread Operator
```javascript
// Good: Use spread
const newUser = { ...user, name: 'New Name' };
const newArray = [...oldArray, newItem];

// Avoid: Manual copying
const newUser = Object.assign({}, user, { name: 'New Name' });
```

### Optional Chaining
```javascript
// Good: Use optional chaining
const email = user?.profile?.email;
const firstItem = items?.[0];

// Avoid: Manual checks
const email = user && user.profile && user.profile.email;
```

## Chrome Extension Specific

### Message Handling
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Always validate message
  if (!message || !message.type) {
    sendResponse({ success: false, error: 'Invalid message' });
    return;
  }
  
  // Handle async
  handleMessageAsync(message, sender)
    .then(result => sendResponse(result))
    .catch(error => sendResponse({ success: false, error: error.message }));
  
  return true; // Keep channel open
});
```

### Storage Operations
```javascript
// Good: Use async/await
async function saveToStorage(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Good: Get with default
async function getFromStorage(key, defaultValue = null) {
  const result = await chrome.storage.local.get(key);
  return result[key] ?? defaultValue;
}
```

## DOM Manipulation

### Element Creation
```javascript
// Good: Create and configure
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.id = 'memgenx-btn';
  button.className = 'memgenx-button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}
```

### Query Selectors
```javascript
// Good: Specific selectors
const sendButton = document.querySelector('[data-testid="send-button"]');
const textarea = document.querySelector('textarea[placeholder*="Message"]');

// Avoid: Generic selectors
const button = document.querySelector('button');
const input = document.querySelector('input');
```

## Performance

### Debouncing
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### Memoization
```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

## Security

### Input Sanitization
```javascript
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

### URL Validation
```javascript
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

## Testing Helpers

### Mock Functions
```javascript
function createMockAuth() {
  return {
    init: async () => ({ success: true }),
    signIn: async () => ({ success: true, user: { id: '123' } }),
    signOut: async () => ({ success: true })
  };
}
```

### Debug Logging
```javascript
const DEBUG = true;

function log(category, ...args) {
  if (DEBUG) {
    console.log(`[${category}]`, ...args);
  }
}

// Usage
log('AUTH', 'User signed in:', userId);
log('API', 'Saving prompt:', prompt);
```

## Code Review Checklist

Before committing code, ensure:
- [ ] All functions have error handling
- [ ] Async operations use async/await
- [ ] Variables have descriptive names
- [ ] Complex logic has comments
- [ ] No hardcoded secrets or credentials
- [ ] Chrome API calls follow Manifest V3 patterns
- [ ] All promises are awaited or handled
- [ ] Return values are consistent
- [ ] Edge cases are handled
- [ ] Code is formatted consistently
