# Contributing to Memory Layer Chrome Extension

Thank you for your interest in contributing! This project was built with Kiro AI IDE and demonstrates comprehensive usage of Kiro's features.

## 🎯 How to Contribute

### Using Kiro (Recommended)

This project was built with Kiro, and we encourage contributors to use Kiro for consistency:

1. **Install Kiro AI IDE** from [kiro.ai](https://kiro.ai)

2. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd extension-kiro1
   ```

3. **Read the Kiro development docs**
   - [KIRO_DEVELOPMENT.md](.kiro/KIRO_DEVELOPMENT.md) - Development guide
   - [.kiro/steering/](.kiro/steering/) - Steering documents (always active)
   - [.kiro/specs/extension-spec.md](.kiro/specs/extension-spec.md) - Project specification

4. **Follow the steering docs**
   - All code should follow patterns in `.kiro/steering/chrome-extension-patterns.md`
   - Use code style from `.kiro/steering/code-style.md`

5. **Use Kiro for development**
   ```
   Example prompt:
   "Add [feature] to [file]:
   1. [Requirement 1]
   2. [Requirement 2]
   Follow chrome-extension-patterns and code-style steering docs"
   ```

6. **Run agent hooks**
   - Run `validate-manifest` hook after manifest changes
   - Run `security-check` hook before committing
   - Run `test-extension` hook to verify functionality

7. **Update documentation**
   - Add your changes to `.kiro/dev-log.md`
   - Update `.kiro/conversation-history.md` if you had interesting Kiro interactions

### Without Kiro

If you're not using Kiro, please:

1. **Follow the existing code style**
   - Read `.kiro/steering/code-style.md` for conventions
   - Match the existing patterns

2. **Ensure Manifest V3 compliance**
   - Read `.kiro/steering/chrome-extension-patterns.md`
   - Follow service worker patterns

3. **Add comprehensive error handling**
   - Use try-catch blocks
   - Return consistent error formats

4. **Test thoroughly**
   - Test on all supported platforms
   - Check console for errors
   - Verify no regressions

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues
2. Test on latest Chrome version
3. Verify it's not a configuration issue

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Chrome Version: [e.g. 120.0]
- Extension Version: [e.g. 1.0.0]
- Platform: [e.g. ChatGPT, Claude]

**Screenshots**
If applicable

**Console Errors**
Any errors from console
```

## ✨ Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Implementation**
How could this be implemented?

**Kiro Prompt (Optional)**
If using Kiro, what prompt would you use?

**Alternatives Considered**
Other approaches you've thought about
```

## 🔧 Development Setup

### Prerequisites

- Chrome 88+
- Node.js (for any build tools)
- Kiro AI IDE (recommended)
- Supabase account (for testing auth)

### Setup Steps

1. **Clone and configure**
   ```bash
   git clone <repo-url>
   cd extension-kiro1
   cp config.js config.local.js
   # Edit config.local.js with your credentials
   ```

2. **Load extension**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension-kiro1` folder

3. **Test authentication**
   - Click extension icon
   - Sign in with Google
   - Verify token storage

4. **Test on platforms**
   - Go to chat.openai.com
   - Verify button appears
   - Test 7-step flow

## 📝 Pull Request Process

### Before Submitting

1. **Test your changes**
   - [ ] Extension loads without errors
   - [ ] All features work as expected
   - [ ] No console errors
   - [ ] Tested on relevant platforms

2. **Code quality**
   - [ ] Follows steering doc patterns
   - [ ] Has error handling
   - [ ] Has comments for complex logic
   - [ ] No hardcoded secrets

3. **Documentation**
   - [ ] Updated README if needed
   - [ ] Updated dev-log.md with changes
   - [ ] Added comments to code

4. **Kiro usage (if applicable)**
   - [ ] Used Kiro for development
   - [ ] Followed steering docs
   - [ ] Ran agent hooks
   - [ ] Documented prompts used

### PR Template

```markdown
**Description**
What does this PR do?

**Related Issue**
Fixes #(issue number)

**Changes Made**
- Change 1
- Change 2
- Change 3

**Kiro Usage**
- [ ] Used Kiro for development
- [ ] Followed steering docs
- [ ] Ran agent hooks

**Testing**
- [ ] Tested on ChatGPT
- [ ] Tested on Claude
- [ ] Tested on Gemini
- [ ] Tested on Grok
- [ ] No console errors
- [ ] Authentication works

**Screenshots**
If applicable

**Kiro Prompts Used**
If you used Kiro, what prompts did you use?
```

### Review Process

1. Maintainer reviews code
2. Automated checks run (if configured)
3. Feedback provided
4. Changes requested or approved
5. Merged to main

## 🎨 Code Style

### JavaScript

Follow `.kiro/steering/code-style.md`:

```javascript
// Good: Descriptive names, async/await, error handling
async function savePromptToBackend(prompt, userId) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ prompt, userId })
    });
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Save failed:', error);
    return { success: false, error: error.message };
  }
}

// Bad: Generic names, no error handling
function save(p, u) {
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ p, u })
  });
}
```

### Chrome Extension Patterns

Follow `.kiro/steering/chrome-extension-patterns.md`:

```javascript
// Good: Proper message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep channel open for async
});

// Bad: Missing return true
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  // Missing return true!
});
```

## 🧪 Testing Guidelines

### Manual Testing

1. **Load extension**
   - No console errors
   - Icon appears in toolbar

2. **Authentication**
   - Sign in works
   - Token stored correctly
   - Sign out clears data

3. **Platform integration**
   - Button appears on each platform
   - Button triggers 7-step flow
   - Prompt is enhanced
   - Response is saved

4. **Error handling**
   - Network errors handled
   - Auth errors handled
   - Invalid input handled

### Using Agent Hooks

```bash
# Validate manifest
# Run validate-manifest hook in Kiro

# Security check
# Run security-check hook in Kiro

# Comprehensive test
# Run test-extension hook in Kiro
```

## 📚 Resources

### Project Documentation
- [README.md](README.md) - Project overview
- [BUILT_WITH_KIRO.md](BUILT_WITH_KIRO.md) - Development journey
- [.kiro/KIRO_DEVELOPMENT.md](.kiro/KIRO_DEVELOPMENT.md) - Development guide

### Kiro Resources
- [Kiro Documentation](https://kiro.ai/docs)
- [Steering Documents](.kiro/steering/)
- [Project Specification](.kiro/specs/extension-spec.md)

### Chrome Extension Resources
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Service Worker Guide](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

## 🤝 Community

### Getting Help

1. Check [README.md](README.md) for common issues
2. Read [.kiro/KIRO_DEVELOPMENT.md](.kiro/KIRO_DEVELOPMENT.md)
3. Search existing issues
4. Create a new issue with details

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Share knowledge about Kiro usage

## 🎃 Kiroween 2025

This project is part of Kiroween 2025 and demonstrates comprehensive Kiro usage. When contributing:

- Consider using Kiro for development
- Document your Kiro prompts
- Share interesting Kiro interactions
- Help improve the Kiro development process

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🌟 Thank You!

Thank you for contributing to Memory Layer! Your contributions help:

- Improve the extension
- Demonstrate Kiro capabilities
- Help others learn Chrome extension development
- Build a better developer community

**Happy coding with Kiro! 🎃**
