/**
 * Memory Layer - Claude Content Script
 * Built with Kiro for Kiroween 2025 🎃
 */

console.log('[Memory Layer] 🎃 Initializing Claude integration...');

let userId = null;
let isAuthenticated = false;
let memoryButton = null;

// Initialize
init();

async function init() {
  // Check authentication
  try {
    const authResponse = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
    isAuthenticated = authResponse?.isAuthenticated || false;
    
    if (isAuthenticated && authResponse?.user) {
      userId = authResponse.user.id;
      console.log('[Memory Layer] ✅ Authenticated:', userId);
    } else {
      console.warn('[Memory Layer] ⚠️  Not authenticated');
      userId = null;
    }
  } catch (error) {
    console.error('[Memory Layer] ❌ Auth check failed:', error);
    userId = null;
  }
  
  // Wait for Claude UI to load
  waitForClaudeUI();
}

function waitForClaudeUI() {
  const checkInterval = setInterval(() => {
    // Claude uses different selectors
    const textarea = document.querySelector('div[contenteditable="true"]') ||
                     document.querySelector('textarea');
    
    if (textarea) {
      clearInterval(checkInterval);
      console.log('[Memory Layer] Claude UI detected');
      createMemoryButton();
    }
  }, 1000);
}

function createMemoryButton() {
  // Find Claude's send button
  const sendButton = document.querySelector('button[aria-label*="Send"]') ||
                     document.querySelector('button[type="submit"]');
  
  if (!sendButton) {
    console.log('[Memory Layer] Send button not found, retrying...');
    setTimeout(createMemoryButton, 1000);
    return;
  }
  
  // Create button
  memoryButton = document.createElement('button');
  memoryButton.id = 'memory-layer-btn';
  memoryButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke-width="2"/>
      <path d="M12 8v8M8 12h8" stroke-width="2"/>
    </svg>
  `;
  memoryButton.title = 'Memory Layer - Save & Enhance';
  memoryButton.className = 'memory-layer-button';
  
  // Add click handler
  memoryButton.addEventListener('click', handleMemoryClick);
  
  // Insert next to send button
  sendButton.parentElement.insertBefore(memoryButton, sendButton);
  
  console.log('[Memory Layer] ✅ Button created for Claude!');
}

async function handleMemoryClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  console.log('[Memory Layer] Button clicked on Claude');
  
  if (!isAuthenticated || !userId) {
    showNotification('❌ Please sign in first');
    return;
  }
  
  // Get prompt from Claude's contenteditable div
  const textarea = document.querySelector('div[contenteditable="true"]');
  
  if (!textarea) {
    showNotification('❌ Could not find text input');
    return;
  }
  
  const promptText = textarea.textContent || textarea.innerText;
  
  if (!promptText || promptText.trim().length === 0) {
    showNotification('❌ Please type a message first');
    return;
  }
  
  const originalPrompt = promptText.trim();
  
  memoryButton.disabled = true;
  memoryButton.style.opacity = '0.5';
  showNotification('⏳ Processing...');
  
  try {
    await executeFlow(originalPrompt, textarea);
  } catch (error) {
    console.error('[Memory Layer] Error:', error);
    showNotification('❌ Error: ' + error.message);
  } finally {
    memoryButton.disabled = false;
    memoryButton.style.opacity = '1';
  }
}

async function executeFlow(originalPrompt, textarea) {
  // Save prompt and get context in parallel
  const [saveResult, contextResult] = await Promise.all([
    savePrompt(originalPrompt),
    getContext(originalPrompt)
  ]);
  
  console.log('[Memory Layer] ✅ Prompt saved, context retrieved');
  
  // Enhance prompt
  let enhancedPrompt = originalPrompt;
  
  if (contextResult.length > 0) {
    const contextStr = contextResult.join('\n- ');
    enhancedPrompt = `Based on previous context:\n- ${contextStr}\n\nQuestion: ${originalPrompt}`;
  }
  
  // Update textarea
  textarea.textContent = enhancedPrompt;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Store for response capture
  window.memoryLayerOriginalPrompt = originalPrompt;
  window.memoryLayerWaitingForResponse = true;
  
  // Click send
  const sendButton = document.querySelector('button[aria-label*="Send"]') ||
                     document.querySelector('button[type="submit"]');
  
  if (sendButton) {
    setTimeout(() => {
      sendButton.click();
      showNotification('🚀 Sent with memory!');
      observeForResponse();
    }, 200);
  }
}

async function savePrompt(prompt) {
  const response = await chrome.runtime.sendMessage({
    type: 'SAVE_PROMPT',
    data: { prompt: prompt, provider: 'claude' }
  });
  
  if (!response || !response.success) {
    throw new Error(response?.error || 'Save prompt failed');
  }
  return response.data;
}

async function getContext(query) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_CONTEXT',
      query: query
    });
    
    return response?.contexts || [];
  } catch (error) {
    console.error('[Memory Layer] Context retrieval failed:', error);
    return [];
  }
}

async function saveResponse(prompt, responseText) {
  const result = await chrome.runtime.sendMessage({
    type: 'SAVE_RESPONSE',
    data: {
      prompt: prompt,
      response: responseText,
      provider: 'claude'
    }
  });
  
  if (!result || !result.success) {
    throw new Error(result?.error || 'Save response failed');
  }
  return result.data;
}

function observeForResponse() {
  console.log('[Memory Layer] Waiting for Claude response...');
  
  const observer = new MutationObserver(() => {
    if (!window.memoryLayerWaitingForResponse) return;
    
    // Find Claude's response
    const messages = document.querySelectorAll('[data-test-render-count]');
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    const responseText = lastMessage.textContent;
    
    if (!responseText || !responseText.trim()) return;
    
    // Check if response is complete (Claude shows a stop button while generating)
    const stopButton = document.querySelector('button[aria-label*="Stop"]');
    if (stopButton) return;
    
    // Response complete
    window.memoryLayerWaitingForResponse = false;
    observer.disconnect();
    
    console.log('[Memory Layer] ✅ Claude response received');
    saveTheResponse(responseText);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

async function saveTheResponse(responseText) {
  console.log('[Memory Layer] Saving response...');
  
  try {
    await saveResponse(window.memoryLayerOriginalPrompt, responseText);
    console.log('[Memory Layer] ✅ Response saved!');
    showNotification('💾 Memory saved!');
    delete window.memoryLayerOriginalPrompt;
  } catch (error) {
    console.error('[Memory Layer] Save response failed:', error);
    showNotification('❌ Save failed');
  }
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'memory-layer-notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.classList.add('show'), 10);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}

console.log('[Memory Layer] Ready for Claude! 🎃');
