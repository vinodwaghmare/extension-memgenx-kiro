# Kiro Development Guide

This document explains how this Chrome extension was built using Kiro and how to continue development with Kiro.

## Kiro Features Used

### 1. Steering Documents

Located in `.kiro/steering/`, these documents guide all code generation:

- **chrome-extension-patterns.md** - Manifest V3 best practices, service worker patterns, OAuth integration
- **code-style.md** - JavaScript conventions, naming, error handling, Chrome extension specific patterns

These are automatically included in every Kiro interaction to ensure consistent, high-quality code.

### 2. Specification

Located in `.kiro/specs/extension-spec.md`, this comprehensive spec defines:

- Requirements (functional and non-functional)
- Architecture and data flow
- Implementation tasks with Kiro prompts
- API contracts
- Platform-specific selectors
- Testing strategy

Use this spec to understand the project structure and guide future development.

### 3. Agent Hooks

Located in `.kiro/hooks/`, these automate quality checks:

- **validate-manifest.json** - Auto-runs on manifest.json save to check Manifest V3 compliance
- **security-check.json** - Manual hook to scan for security vulnerabilities
- **test-extension.json** - Manual hook to run comprehensive tests

To use hooks:
1. Open Kiro Hook UI from command palette
2. Enable/disable hooks
3. Run manual hooks when needed

### 4. Development Log

Located in `.kiro/dev-log.md`, this tracks:

- Day-by-day development progress
- Prompts used for each component
- Time saved vs manual development
- Challenges overcome
- Lessons learned

## How to Continue Development with Kiro

### Adding New Features

1. **Update the Spec**
   - Add new requirements to `.kiro/specs/extension-spec.md`
   - Define implementation tasks
   - Write Kiro prompts

2. **Use Vibe Coding**
   ```
   Example prompt:
   "Add conversation search feature to popup:
   1. Add search input in popup.html
   2. Implement search function in popup.js
   3. Call backend API GET /search endpoint
   4. Display results in a list
   5. Handle empty results
   Follow chrome-extension-patterns and code-style steering docs"
   ```

3. **Test with Hooks**
   - Run security-check hook after adding code
   - Run test-extension hook before committing

### Adding New Platform Support

1. **Create Content Script**
   ```
   Prompt to Kiro:
   "Create content/perplexity.js for Perplexity AI integration:
   1. Use content/chatgpt.js as template
   2. Update selectors for Perplexity UI:
      - textarea: '[data-testid="perplexity-input"]'
      - sendButton: '[data-testid="perplexity-send"]'
      - lastMessage: '.perplexity-response:last-child'
   3. Implement same 7-step flow
   4. Add Perplexity-specific error handling
   Follow chrome-extension-patterns steering doc"
   ```

2. **Update Manifest**
   ```
   Prompt to Kiro:
   "Update manifest.json to add Perplexity support:
   1. Add content script for https://www.perplexity.ai/*
   2. Add host_permissions for perplexity.ai
   3. Maintain Manifest V3 compliance
   Run validate-manifest hook after"
   ```

3. **Update Popup**
   ```
   Prompt to Kiro:
   "Add Perplexity to popup.html platform list:
   1. Add new platform card with Perplexity icon
   2. Update popup.js to show Perplexity stats
   3. Match existing Halloween theme styling"
   ```

### Fixing Bugs

1. **Describe the Bug**
   ```
   Prompt to Kiro:
   "Fix bug in content/chatgpt.js:
   - Issue: Button appears multiple times when navigating between chats
   - Expected: Button should appear only once
   - Current behavior: New button created on each navigation
   
   Solution approach:
   1. Check if button already exists before creating
   2. Remove old button if found
   3. Add unique ID to prevent duplicates
   
   Follow chrome-extension-patterns steering doc"
   ```

2. **Test the Fix**
   - Run security-check hook
   - Test manually on ChatGPT
   - Update dev-log.md with fix

### Refactoring Code

1. **Specify Refactoring Goal**
   ```
   Prompt to Kiro:
   "Refactor content scripts to reduce code duplication:
   1. Create content/shared.js with common functions:
      - waitForElement()
      - createMemoryButton()
      - showNotification()
      - enhanceAndSend()
   2. Update all content scripts to import shared.js
   3. Keep platform-specific selectors in each file
   4. Maintain same functionality
   
   Follow code-style steering doc for consistent naming"
   ```

2. **Verify No Regressions**
   - Run test-extension hook
   - Test on all platforms

## Kiro Prompting Best Practices

### 1. Be Specific
```
❌ Bad: "Add a button"
✅ Good: "Add a purple gradient button next to the send button in ChatGPT that triggers the 7-step flow when clicked"
```

### 2. Reference Steering Docs
```
✅ "Follow chrome-extension-patterns steering doc for proper message passing"
✅ "Use code-style steering doc conventions for naming and error handling"
```

### 3. Provide Context
```
✅ "Update background.js to add retry logic for failed API calls. Currently, if an API call fails, it returns an error immediately. Add 3 retry attempts with exponential backoff."
```

### 4. Include Examples
```
✅ "Add notification system like in content/chatgpt.js:
    - showNotification('✅ Success', 'success')
    - showNotification('❌ Error', 'error')
    - Auto-dismiss after 3 seconds"
```

### 5. Specify Testing
```
✅ "After implementation, run security-check hook and test manually on ChatGPT"
```

## Kiro Workflow

### Daily Development Flow

1. **Morning**: Review dev-log.md, check what was done yesterday
2. **Plan**: Update spec with today's tasks
3. **Develop**: Use Kiro vibe coding with specific prompts
4. **Test**: Run hooks and manual tests
5. **Document**: Update dev-log.md with progress
6. **Commit**: Git commit with descriptive message

### Feature Development Flow

1. **Spec**: Add feature to extension-spec.md
2. **Prompt**: Write detailed Kiro prompt
3. **Generate**: Let Kiro generate code
4. **Review**: Check generated code
5. **Test**: Run hooks and manual tests
6. **Iterate**: Refine if needed
7. **Document**: Update dev-log.md

### Bug Fix Flow

1. **Reproduce**: Understand the bug
2. **Locate**: Find the problematic code
3. **Prompt**: Describe bug and expected fix to Kiro
4. **Generate**: Let Kiro fix the code
5. **Test**: Verify fix works
6. **Document**: Update dev-log.md

## Steering Doc Usage

### When to Update Steering Docs

Update `chrome-extension-patterns.md` when:
- You discover a new Chrome extension pattern
- You find a better way to do something
- You encounter a common pitfall

Update `code-style.md` when:
- You establish a new naming convention
- You add a new code pattern
- You want to enforce a new standard

### How to Update Steering Docs

```
Prompt to Kiro:
"Update .kiro/steering/chrome-extension-patterns.md to add pattern for handling tab navigation:

Add new section 'Tab Navigation' with:
1. How to detect tab changes
2. How to clean up on tab close
3. How to restore state on tab switch
4. Example code

Follow existing format and style"
```

## Spec Usage

### When to Update Spec

Update `extension-spec.md` when:
- Adding new features
- Changing architecture
- Adding new API endpoints
- Updating requirements

### How to Update Spec

```
Prompt to Kiro:
"Update .kiro/specs/extension-spec.md to add Phase 8:

Phase 8: Conversation Search
- Task 8.1: Add search API endpoint
- Task 8.2: Add search UI to popup
- Task 8.3: Implement search logic
- Task 8.4: Add search results display

Include Kiro prompts for each task"
```

## Hook Usage

### Creating New Hooks

```
Prompt to Kiro:
"Create new agent hook .kiro/hooks/format-code.json:
- Trigger: onSave for *.js files
- Action: Check code formatting
- Auto-run: true
- Checks: indentation, semicolons, trailing commas
- Suggest: fixes for formatting issues"
```

### Enabling/Disabling Hooks

1. Open Kiro Hook UI (Command Palette → "Open Kiro Hook UI")
2. Toggle hooks on/off
3. Configure auto-run behavior

## Development Log Usage

### Daily Updates

At end of each day, update `.kiro/dev-log.md`:

```
## Day X - Date (Y hours)

### Session N: Task Name (Z hours)

**Time - Task Description**

Prompt to Kiro:
```
[Your prompt]
```

Result:
- ✅ What was accomplished
- ✅ What worked well

**Time - Testing**

Tested:
- ✅ Test case 1
- ✅ Test case 2

Time saved: ~X hours
```

## Tips for Maximum Productivity

1. **Use Steering Docs**: They ensure consistency without repeating yourself
2. **Update Spec First**: Plan before coding
3. **Specific Prompts**: More detail = better results
4. **Test Often**: Run hooks after each change
5. **Document Progress**: Update dev-log.md daily
6. **Iterate**: Refine prompts based on results
7. **Reference Examples**: Point to existing code as examples

## Common Kiro Prompts

### Generate New File
```
"Create [filename] for [purpose]:
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]
Follow [steering-doc] steering doc"
```

### Update Existing File
```
"Update [filename] to add [feature]:
- Current behavior: [description]
- Desired behavior: [description]
- Implementation: [approach]
Follow [steering-doc] steering doc"
```

### Fix Bug
```
"Fix bug in [filename]:
- Issue: [description]
- Expected: [behavior]
- Current: [behavior]
- Solution: [approach]"
```

### Refactor Code
```
"Refactor [filename] to [goal]:
1. [Change 1]
2. [Change 2]
3. [Change 3]
Maintain same functionality"
```

### Add Tests
```
"Add tests for [filename]:
1. Test [scenario 1]
2. Test [scenario 2]
3. Test [scenario 3]
Use [testing framework]"
```

## Kiro + Git Workflow

### Commit Messages

Use descriptive commits that show Kiro usage:

```bash
git commit -m "feat: Add conversation search (generated with Kiro)

- Created search UI in popup
- Implemented search API call
- Added search results display
- Followed chrome-extension-patterns steering doc

Time saved: ~3 hours"
```

### Branch Strategy

```bash
# Feature branch
git checkout -b feature/conversation-search

# Develop with Kiro
# ... use Kiro to generate code ...

# Commit
git commit -m "feat: Add conversation search (Kiro)"

# Merge
git checkout main
git merge feature/conversation-search
```

## Resources

- **Kiro Documentation**: [Kiro Docs](https://kiro.ai/docs)
- **Chrome Extension Docs**: [Chrome Developers](https://developer.chrome.com/docs/extensions/)
- **Manifest V3 Guide**: [Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

*Keep building with Kiro! 🎃*
