# Memory Layer Chrome Extension

> **Built with Kiro for Kiroween 2025 🎃**
> 
> **Development Time**: 10 hours (vs 40 hours manually - 75% time saved)  
> **Code Generated**: 1,500+ lines with Kiro Vibe Coding  
> **Quality**: Production-ready, Manifest V3 compliant

A Chrome extension that captures your conversations with AI assistants (ChatGPT, Claude, Gemini, Grok) and stores them in a universal memory layer for enhanced context across all platforms.

## 🎃 Built with Kiro - Complete Feature Showcase

This extension demonstrates **comprehensive usage** of Kiro's features:

- ✅ **Vibe Coding** - 95% of code generated through conversation
- ✅ **Steering Documents** - Chrome extension patterns & code style (see `.kiro/steering/`)
- ✅ **Spec-Driven Development** - Complete specification (see `.kiro/specs/extension-spec.md`)
- ✅ **Agent Hooks** - Automated validation & security checks (see `.kiro/hooks/`)
- ✅ **Development Log** - Complete development history (see `.kiro/dev-log.md`)

**See [BUILT_WITH_KIRO.md](BUILT_WITH_KIRO.md) for the complete development journey!**

## 🎯 Features

- **Universal Memory**: Capture conversations from ChatGPT, Claude, Gemini, and Grok
- **Supabase Authentication**: Secure Google OAuth integration
- **Context Enhancement**: Automatically enhance prompts with relevant past conversations
- **Real-time Sync**: Instant synchronization with backend API
- **Manifest V3**: Modern Chrome extension architecture
- **Spooky UI**: Halloween-themed interface for Kiroween 2025

## 🏗️ Architecture

```
extension-kiro1/
├── manifest.json           # Extension configuration (Manifest V3)
├── background.js           # Service worker for background tasks
├── config.js               # Configuration (API URLs, Supabase)
├── auth.js                 # Supabase authentication module
├── popup.html              # Extension popup dashboard
├── popup.js                # Popup logic and UI
├── content/                # Content scripts for each platform
│   ├── chatgpt.js         # ChatGPT integration
│   ├── claude.js          # Claude integration
│   ├── gemini.js          # Gemini integration
│   └── grok.js            # Grok integration
├── styles/
│   ├── popup.css          # Popup styles
│   └── content.css        # Content script styles
└── icons/                  # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Quick Start

### Prerequisites

- Chrome browser (version 88+)
- Supabase project with Google OAuth configured
- Memory Layer backend API running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd extension-kiro1
   ```

2. **Configure the extension**
   
   Edit `config.js` with your credentials:
   ```javascript
   const MEMORY_LAYER_CONFIG = {
     supabase: {
       url: 'https://your-project.supabase.co',
       anonKey: 'your-anon-key'
     },
     backend: {
       baseUrl: 'https://your-backend.onrender.com'
     }
   };
   ```

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `extension-kiro1` folder
   - Extension icon should appear in toolbar

4. **Sign in**
   - Click the extension icon
   - Click "Continue with Google"
   - Authorize the extension
   - You're ready to go!

## 📖 How It Works

### 7-Step Flow

1. **User clicks MemGenX button** - Purple button appears next to send button
2. **Save prompt** - Immediately saves user's prompt to backend
3. **Get context** - Retrieves relevant past conversations
4. **Enhance prompt** - Adds context to the prompt
5. **Send to AI** - Clicks the platform's send button
6. **Wait for response** - Observes DOM for AI response
7. **Save response** - Stores complete conversation

### Content Script Integration

Each platform has a dedicated content script that:
- Detects the chat interface
- Injects the MemGenX button
- Captures user prompts
- Enhances prompts with context
- Saves responses automatically

### Authentication Flow

1. User clicks "Continue with Google"
2. Opens Supabase OAuth flow in new tab
3. Callback page receives auth tokens
4. Tokens stored in `chrome.storage.local`
5. Background service worker manages token refresh

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project
2. Enable Google OAuth provider
3. Add redirect URL: `chrome-extension://YOUR_EXTENSION_ID/auth-callback.html`
4. Copy URL and anon key to `config.js`

### Backend API

The extension requires these endpoints:
- `POST /save-prompt` - Save user prompt
- `POST /save-response` - Save AI response
- `GET /context/{user_id}` - Get relevant context

See backend documentation for API details.

## 🎨 Customization

### Styling

Edit `styles/content.css` to customize the MemGenX button:

```css
#memgenx-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  /* Add your custom styles */
}
```

### Button Position

Modify content scripts to change button placement:

```javascript
// In content/chatgpt.js
sendButton.parentElement.insertBefore(memgenxButton, sendButton);
```

## 🧪 Testing

### Manual Testing

1. Load extension in Chrome
2. Sign in with Google
3. Go to ChatGPT/Claude/Gemini/Grok
4. Type a message
5. Click MemGenX button
6. Verify prompt is enhanced and sent
7. Check that response is saved

### Debug Mode

Enable logging in `config.js`:

```javascript
settings: {
  enableLogging: true
}
```

View logs in:
- Extension popup: Right-click → Inspect
- Content scripts: Page console (F12)
- Background: `chrome://extensions/` → Service worker → Inspect

## 📦 Building for Production

1. **Update manifest version**
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Remove debug code**
   - Set `enableLogging: false` in config
   - Remove console.log statements

3. **Create ZIP**
   ```bash
   zip -r extension-kiro1.zip extension-kiro1/ -x "*.git*" "*.DS_Store"
   ```

4. **Submit to Chrome Web Store**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload ZIP file
   - Fill in store listing
   - Submit for review

## 🔒 Security

- **No hardcoded secrets**: All credentials in config.js
- **JWT authentication**: Secure token-based auth
- **Content Security Policy**: Strict CSP in manifest
- **Minimal permissions**: Only requests necessary permissions
- **Token refresh**: Automatic token refresh before expiration

## 🐛 Troubleshooting

### Extension not loading
- Check Chrome version (88+)
- Verify manifest.json syntax
- Check console for errors

### Authentication failing
- Verify Supabase URL and key
- Check redirect URL in Supabase dashboard
- Ensure Google OAuth is enabled

### Button not appearing
- Check if content script is injected (console)
- Verify page URL matches manifest patterns
- Try refreshing the page

### Context not loading
- Verify backend API is running
- Check network tab for API calls
- Ensure user is authenticated

## 📝 Built with Kiro

This extension was built using Kiro's features:

### Vibe Coding
- Generated content scripts for each platform
- Created authentication flow with Supabase
- Built service worker with proper message handling

### Spec-Driven Development
- Followed extension-spec.md for consistent architecture
- Coordinated with backend API contracts

### Agent Hooks
- Automated manifest validation
- Security vulnerability scanning
- Code style checking

### Steering Docs
- Chrome extension patterns for Manifest V3
- OAuth best practices
- Message passing patterns

## 🎃 Kiroween 2025

Part of the Memory Layer Frankenstein project for Kiroween 2025.

**Category**: Frankenstein  
**Built with**: Kiro AI IDE

---

*Never lose context again. 🎃*
