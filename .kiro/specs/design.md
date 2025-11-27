# Chrome Extension Design Document

**Feature**: Memory Layer Chrome Extension  
**Version**: 1.0.0  
**Status**: Implementation Complete  
**Created**: 2025-11-27

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │   Popup UI   │      │   Service    │                     │
│  │  (popup.js)  │◄────►│   Worker     │                     │
│  │              │      │(background.js)│                     │
│  └──────────────┘      └───────┬──────┘                     │
│                                 │                             │
│                                 │ Message Passing             │
│                                 │                             │
│  ┌──────────────────────────────▼──────────────────────────┐│
│  │           Content Scripts (Platform-Specific)            ││
│  ├──────────────┬──────────────┬──────────────┬────────────┤│
│  │  chatgpt.js  │  claude.js   │  gemini.js   │  grok.js   ││
│  └──────────────┴──────────────┴──────────────┴────────────┘│
│         │              │              │              │        │
└─────────┼──────────────┼──────────────┼──────────────┼───────┘
          │              │              │              │
          ▼              ▼              ▼              ▼
    ┌─────────────────────────────────────────────────────┐
    │           AI Chat Platforms (DOM)                    │
    │  ChatGPT    │    Claude    │   Gemini   │   Grok    │
    └─────────────────────────────────────────────────────┘
                          │
                          │ HTTPS API Calls
                          ▼
                ┌──────────────────────┐
                │   Backend API        │
                │  (FastAPI + FAISS)   │
                └──────────────────────┘
```

### Component Responsibilities

**Service Worker (background.js)**
- Central message hub
- Authentication state management
- API communication
- Token refresh logic
- Error handling and logging

**Content Scripts (platform-specific)**
- DOM manipulation
- Button injection
- User interaction handling
- Response observation
- Platform-specific logic

**Popup UI (popup.js/html)**
- User authentication interface
- Statistics display
- Platform status
- Sign-out functionality

**Auth Module (auth.js)**
- OAuth flow management
- Token storage and retrieval
- Token refresh
- Session management

## Detailed Component Design

### 1. Service Worker (background.js)

#### Purpose
Central coordinator for all extension operations.

#### Key Functions

```javascript
// Message handler - routes messages to appropriate handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep channel open for async
});

// API Functions
async function savePrompt(userId, prompt, platform)
async function saveResponse(userId, promptId, response, platform)
async function getContext(userId, query)

// Auth Functions
async function checkAuthStatus()
async function refreshTokenIfNeeded()
```

#### State Management
- Stores auth state in memory
- Syncs with chrome.storage.local
- Broadcasts auth changes to popup and content scripts

#### Error Handling
- Try-catch blocks around all async operations
- User-friendly error messages
- Automatic retry logic (3 attempts)
- Fallback to offline queue

#### Message Types Handled
- `SAVE_PROMPT`: Save user prompt to backend
- `GET_CONTEXT`: Retrieve relevant context
- `SAVE_RESPONSE`: Save AI response
- `CHECK_AUTH`: Verify authentication status
- `SIGN_OUT`: Clear auth and local data

### 2. Content Scripts

#### Architecture Pattern
Each platform has its own content script with shared utilities.

#### Common Structure

```javascript
// 1. Wait for page load
function waitForElement(selector, timeout)

// 2. Create and inject button
function createMemoryButton()
function injectButton()

// 3. Handle user interaction
async function handleButtonClick()

// 4. Enhance prompt flow
async function enhancePrompt(originalPrompt)

// 5. Observe and capture response
function observeResponse()
function captureResponse()

// 6. Show notifications
function showNotification(message, type)
```

#### Platform-Specific Selectors

**ChatGPT (chatgpt.js)**
```javascript
const SELECTORS = {
  textarea: 'textarea[data-id="root"]',
  sendButton: 'button[data-testid="send-button"]',
  responseContainer: '.markdown',
  conversationContainer: 'main'
};
```

**Claude (claude.js)**
```javascript
const SELECTORS = {
  textarea: 'div[contenteditable="true"]',
  sendButton: 'button[aria-label="Send Message"]',
  responseContainer: '.font-claude-message',
  conversationContainer: 'main'
};
```

**Gemini (gemini.js)**
```javascript
const SELECTORS = {
  textarea: 'rich-textarea',
  sendButton: 'button.send-button',
  responseContainer: '.model-response',
  conversationContainer: '.conversation-container'
};
```

**Grok (grok.js)**
```javascript
const SELECTORS = {
  textarea: 'div[data-testid="grok-input"]',
  sendButton: 'button[data-testid="grok-send"]',
  responseContainer: '.grok-message',
  conversationContainer: '.grok-conversation'
};
```

#### 7-Step Enhancement Flow

```javascript
async function enhancePrompt(originalPrompt) {
  try {
    // Step 1: Show loading state
    showNotification('Enhancing prompt...', 'info');
    
    // Step 2: Save prompt to backend
    const promptId = await savePromptToBackend(originalPrompt);
    
    // Step 3: Get relevant context
    const context = await getRelevantContext(originalPrompt);
    
    // Step 4: Format enhanced prompt
    const enhancedPrompt = formatPromptWithContext(originalPrompt, context);
    
    // Step 5: Inject into textarea
    injectPromptIntoTextarea(enhancedPrompt);
    
    // Step 6: Trigger send
    clickSendButton();
    
    // Step 7: Observe and capture response
    observeResponse(promptId);
    
    showNotification('Prompt enhanced!', 'success');
  } catch (error) {
    showNotification('Enhancement failed', 'error');
    // Restore original prompt
    injectPromptIntoTextarea(originalPrompt);
  }
}
```

#### Response Observation

```javascript
function observeResponse(promptId) {
  const observer = new MutationObserver((mutations) => {
    // Check if response is complete
    if (isResponseComplete()) {
      const responseText = extractResponseText();
      saveResponseToBackend(promptId, responseText);
      observer.disconnect();
    }
  });
  
  observer.observe(responseContainer, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
```

### 3. Authentication Module (auth.js)

#### Class Structure

```javascript
class MemoryLayerAuth {
  constructor() {
    this.supabaseUrl = CONFIG.SUPABASE_URL;
    this.supabaseKey = CONFIG.SUPABASE_ANON_KEY;
    this.currentUser = null;
    this.accessToken = null;
  }
  
  // Initialize auth state
  async init()
  
  // Sign in methods
  async signInWithEmail(email, password)
  async signInWithProvider(provider)
  
  // Token management
  async getAccessToken()
  async refreshToken()
  async isTokenExpired()
  
  // Session management
  async getSession()
  async signOut()
  
  // Storage
  async saveAuthData(data)
  async loadAuthData()
  async clearAuthData()
}
```

#### OAuth Flow

```
1. User clicks "Sign in with Google" in popup
2. Popup opens auth-callback.html in new tab
3. Callback page redirects to Supabase OAuth
4. User authenticates with Google
5. Supabase redirects back to callback page with tokens
6. Callback extracts tokens from URL hash
7. Callback sends tokens to service worker
8. Service worker stores tokens
9. Callback closes, popup refreshes
```

#### Token Refresh Strategy

```javascript
async function refreshTokenIfNeeded() {
  const token = await auth.getAccessToken();
  if (!token) return false;
  
  // Check if token expires in next 5 minutes
  const expiresAt = parseJWT(token).exp * 1000;
  const fiveMinutes = 5 * 60 * 1000;
  
  if (Date.now() + fiveMinutes > expiresAt) {
    await auth.refreshToken();
    return true;
  }
  
  return false;
}
```

### 4. Popup Interface (popup.js/html)

#### UI States

**State 1: Signed Out**
```html
<div id="signedOut">
  <h2>Memory Layer</h2>
  <p>Sign in to enhance your AI conversations</p>
  <button id="signInButton">Sign in with Google</button>
</div>
```

**State 2: Signed In**
```html
<div id="signedIn">
  <div class="user-info">
    <img src="avatar" />
    <span>user@email.com</span>
  </div>
  
  <div class="stats">
    <div class="stat">
      <span class="label">Total Memories</span>
      <span class="value">1,234</span>
    </div>
    <div class="stat">
      <span class="label">This Week</span>
      <span class="value">56</span>
    </div>
  </div>
  
  <div class="platforms">
    <div class="platform">
      <span>ChatGPT</span>
      <span class="status active">●</span>
    </div>
    <!-- More platforms -->
  </div>
  
  <button id="signOutButton">Sign Out</button>
</div>
```

#### Event Handlers

```javascript
// Sign in
document.getElementById('signInButton').addEventListener('click', async () => {
  chrome.tabs.create({ url: 'auth-callback.html' });
});

// Sign out
document.getElementById('signOutButton').addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'SIGN_OUT' });
  updateUI();
});

// Load stats
async function loadStats() {
  const response = await chrome.runtime.sendMessage({ 
    type: 'GET_STATS' 
  });
  displayStats(response.stats);
}
```

### 5. Configuration (config.js)

#### Structure

```javascript
const CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  
  // Backend API
  API_BASE_URL: 'https://your-backend.onrender.com',
  API_ENDPOINTS: {
    savePrompt: '/save-prompt',
    saveResponse: '/save-response',
    getContext: '/context',
    getStats: '/stats'
  },
  
  // Extension Settings
  CONTEXT_LIMIT: 5,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TOKEN_REFRESH_BUFFER: 300000, // 5 minutes
  
  // Logging
  DEBUG: false
};

// Make available in both contexts
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
if (typeof self !== 'undefined') {
  self.CONFIG = CONFIG;
}
```

## Data Flow Diagrams

### Prompt Enhancement Flow

```
User Types Prompt
       │
       ▼
Clicks Memory Button
       │
       ▼
Content Script Captures Prompt
       │
       ▼
Message to Service Worker
       │
       ▼
Service Worker → Backend API (Save Prompt)
       │
       ▼
Backend Returns Prompt ID
       │
       ▼
Service Worker → Backend API (Get Context)
       │
       ▼
Backend Returns Relevant Memories
       │
       ▼
Service Worker → Content Script (Context Data)
       │
       ▼
Content Script Formats Enhanced Prompt
       │
       ▼
Content Script Injects into Textarea
       │
       ▼
Content Script Clicks Send Button
       │
       ▼
AI Platform Generates Response
       │
       ▼
Content Script Observes Response
       │
       ▼
Content Script Captures Complete Response
       │
       ▼
Message to Service Worker
       │
       ▼
Service Worker → Backend API (Save Response)
       │
       ▼
Complete ✓
```

### Authentication Flow

```
User Opens Popup
       │
       ▼
Clicks "Sign in with Google"
       │
       ▼
Opens auth-callback.html
       │
       ▼
Redirects to Supabase OAuth
       │
       ▼
User Authenticates with Google
       │
       ▼
Supabase Redirects Back with Tokens
       │
       ▼
Callback Extracts Tokens from URL
       │
       ▼
Callback → Service Worker (Tokens)
       │
       ▼
Service Worker Stores in chrome.storage
       │
       ▼
Service Worker Updates Auth State
       │
       ▼
Callback Tab Closes
       │
       ▼
Popup Refreshes UI
       │
       ▼
Shows Dashboard ✓
```

## API Integration

### Request Format

```javascript
// Save Prompt
POST /save-prompt
Headers: {
  'Authorization': 'Bearer <jwt-token>',
  'Content-Type': 'application/json'
}
Body: {
  user_id: 'uuid',
  prompt: 'string',
  platform: 'chatgpt|claude|gemini|grok',
  timestamp: 'ISO-8601'
}

// Get Context
GET /context/{user_id}?query=<prompt>&top_k=5
Headers: {
  'Authorization': 'Bearer <jwt-token>'
}

// Save Response
POST /save-response
Headers: {
  'Authorization': 'Bearer <jwt-token>',
  'Content-Type': 'application/json'
}
Body: {
  user_id: 'uuid',
  prompt_id: 'uuid',
  response: 'string',
  platform: 'chatgpt|claude|gemini|grok',
  timestamp: 'ISO-8601'
}
```

### Error Handling

```javascript
async function apiCall(endpoint, options) {
  let attempts = 0;
  
  while (attempts < CONFIG.RETRY_ATTEMPTS) {
    try {
      const response = await fetch(endpoint, options);
      
      if (response.status === 401) {
        // Token expired, refresh and retry
        await auth.refreshToken();
        options.headers['Authorization'] = `Bearer ${await auth.getAccessToken()}`;
        attempts++;
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      attempts++;
      if (attempts >= CONFIG.RETRY_ATTEMPTS) {
        throw error;
      }
      await sleep(CONFIG.RETRY_DELAY * attempts);
    }
  }
}
```

## Storage Schema

### chrome.storage.local

```javascript
{
  // Authentication
  'auth_user': {
    id: 'uuid',
    email: 'user@example.com',
    name: 'User Name',
    avatar_url: 'https://...'
  },
  'auth_session': {
    access_token: 'jwt-token',
    refresh_token: 'refresh-token',
    expires_at: 1234567890,
    token_type: 'bearer'
  },
  
  // Statistics (cached)
  'stats': {
    total_memories: 1234,
    this_week: 56,
    by_platform: {
      chatgpt: 520,
      claude: 380,
      gemini: 240,
      grok: 94
    },
    last_updated: 1234567890
  },
  
  // Offline queue
  'offline_queue': [
    {
      type: 'save_prompt',
      data: {...},
      timestamp: 1234567890
    }
  ]
}
```

## Security Considerations

### Content Security Policy

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Token Storage
- JWT tokens stored in chrome.storage.local (encrypted by Chrome)
- Never logged to console in production
- Cleared on sign-out
- Automatic expiry handling

### API Communication
- HTTPS only
- Bearer token authentication
- CORS properly configured
- Rate limiting on backend

### Permissions
- Minimal permissions requested
- `storage`: For auth and cache
- `tabs`: For OAuth callback
- `activeTab`: For content script injection
- Host permissions: Only for supported platforms

## Performance Optimization

### Content Script Loading
- Inject only on supported platforms
- Lazy load heavy operations
- Debounce DOM observations
- Clean up observers when done

### API Calls
- Cache statistics (5-minute TTL)
- Batch requests where possible
- Use AbortController for cancellation
- Implement request deduplication

### Memory Management
- Disconnect observers after use
- Clear large objects from memory
- Limit offline queue size (100 items)
- Periodic cleanup of old data

## Error Recovery

### Network Errors
```javascript
try {
  await apiCall();
} catch (error) {
  if (error.message.includes('network')) {
    // Queue for later
    await queueOfflineRequest(request);
    showNotification('Saved offline, will sync later', 'info');
  }
}
```

### DOM Errors
```javascript
try {
  const element = await waitForElement(selector, 5000);
} catch (error) {
  console.error('Element not found:', selector);
  showNotification('Platform UI changed, please refresh', 'warning');
}
```

### Auth Errors
```javascript
if (response.status === 401) {
  await auth.refreshToken();
  // Retry request
} else if (response.status === 403) {
  // Sign out and redirect
  await auth.signOut();
  showNotification('Please sign in again', 'error');
}
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Button appears on all platforms
- [ ] Enhancement flow works end-to-end
- [ ] Response capture works for streaming
- [ ] Auth flow completes successfully
- [ ] Token refresh works automatically
- [ ] Offline queue syncs when online
- [ ] Error messages are user-friendly
- [ ] Popup UI updates correctly

### Platform-Specific Testing
- [ ] ChatGPT: Regular and streaming responses
- [ ] Claude: Long conversations
- [ ] Gemini: Code blocks in responses
- [ ] Grok: Real-time updates

### Edge Cases
- [ ] Network disconnection during enhancement
- [ ] Token expiry during operation
- [ ] Platform UI changes
- [ ] Multiple tabs open
- [ ] Extension update during use

## Deployment Checklist

### Pre-Submission
- [ ] Update manifest version
- [ ] Remove debug logging
- [ ] Update API URLs to production
- [ ] Test on fresh Chrome profile
- [ ] Verify all permissions necessary
- [ ] Check CSP compliance
- [ ] Test OAuth flow
- [ ] Verify icons and screenshots

### Chrome Web Store
- [ ] Prepare store listing
- [ ] Create promotional images
- [ ] Write clear description
- [ ] Add privacy policy
- [ ] Submit for review

## Maintenance Plan

### Monitoring
- Track error rates via backend logs
- Monitor API response times
- Check user feedback regularly
- Watch for platform UI changes

### Updates
- Monthly dependency updates
- Quarterly feature releases
- Immediate fixes for breaking changes
- Regular security audits

---

**Design Status**: Implementation Complete  
**Last Updated**: 2025-11-27  
**Next Review**: When adding new platforms
