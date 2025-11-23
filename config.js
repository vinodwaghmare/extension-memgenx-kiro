/**
 * Memory Layer Configuration
 * Built with Kiro for Kiroween 2025 🎃
 */

const MEMORY_LAYER_CONFIG = {
  // Supabase Configuration
  supabase: {
    url: 'https://your-project.supabase.co', // ⚠️ REPLACE WITH YOUR SUPABASE URL
    anonKey: 'your-anon-key-here' // ⚠️ REPLACE WITH YOUR SUPABASE ANON KEY
  },
  
  // Backend API Configuration
  backend: {
    baseUrl: 'https://your-backend.onrender.com', // ⚠️ REPLACE WITH YOUR BACKEND URL
    endpoints: {
      savePrompt: '/save-prompt',
      saveResponse: '/save-response',
      getContext: '/context'
    }
  },
  
  // Extension Settings
  settings: {
    enableLogging: true,        // Enable console logging
    contextLimit: 5,             // Max context items to retrieve
    autoEnhance: true,           // Automatically enhance prompts
    debounceDelay: 2000          // Delay before capturing (ms)
  }
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.MEMORY_LAYER_CONFIG = MEMORY_LAYER_CONFIG;
}

if (typeof self !== 'undefined' && typeof self.MEMORY_LAYER_CONFIG === 'undefined') {
  self.MEMORY_LAYER_CONFIG = MEMORY_LAYER_CONFIG;
}

console.log('✅ Memory Layer Config loaded');
