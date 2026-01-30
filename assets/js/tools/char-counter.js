/* ==========================================================================
   Character Counter
   ========================================================================== */

'use strict';

// DOM Elements
const textInput = document.getElementById('text-input');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');

// Result Elements
const charWithSpace = document.getElementById('char-with-space');
const charWithoutSpace = document.getElementById('char-without-space');
const wordCount = document.getElementById('word-count');
const koreanCount = document.getElementById('korean-count');
const englishCount = document.getElementById('english-count');
const numberCount = document.getElementById('number-count');
const spaceCount = document.getElementById('space-count');
const lineCount = document.getElementById('line-count');

/* ==========================================================================
   Text Analysis Functions
   ========================================================================== */

/**
 * Analyze text and return statistics
 * @param {string} text - Text to analyze
 * @returns {Object} Statistics object
 */
function analyzeText(text) {
  // Total characters (with spaces)
  const totalChars = text.length;

  // Characters without spaces
  const charsNoSpace = text.replace(/\s/g, '').length;

  // Word count (split by whitespace, filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const totalWords = text.trim() === '' ? 0 : words.length;

  // Korean characters (Hangul syllables)
  const koreanChars = text.match(/[가-힣]/g);
  const totalKorean = koreanChars ? koreanChars.length : 0;

  // English characters (a-z, A-Z)
  const englishChars = text.match(/[a-zA-Z]/g);
  const totalEnglish = englishChars ? englishChars.length : 0;

  // Numbers (0-9)
  const numbers = text.match(/[0-9]/g);
  const totalNumbers = numbers ? numbers.length : 0;

  // Spaces (space, tab, etc.)
  const spaces = text.match(/\s/g);
  const totalSpaces = spaces ? spaces.length : 0;

  // Line count
  const lines = text.split('\n');
  const totalLines = text === '' ? 0 : lines.length;

  return {
    totalChars,
    charsNoSpace,
    totalWords,
    totalKorean,
    totalEnglish,
    totalNumbers,
    totalSpaces,
    totalLines
  };
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * Update all result displays
 * @param {Object} stats - Statistics object from analyzeText
 */
function updateResults(stats) {
  charWithSpace.textContent = formatNumber(stats.totalChars);
  charWithoutSpace.textContent = formatNumber(stats.charsNoSpace);
  wordCount.textContent = formatNumber(stats.totalWords);
  koreanCount.textContent = formatNumber(stats.totalKorean);
  englishCount.textContent = formatNumber(stats.totalEnglish);
  numberCount.textContent = formatNumber(stats.totalNumbers);
  spaceCount.textContent = formatNumber(stats.totalSpaces);
  lineCount.textContent = formatNumber(stats.totalLines);
}

/* ==========================================================================
   Event Handlers
   ========================================================================== */

/**
 * Handle text input changes (real-time analysis)
 */
function handleTextInput() {
  const text = textInput.value;
  const stats = analyzeText(text);
  updateResults(stats);
}

/**
 * Handle clear button click
 */
function handleClear() {
  textInput.value = '';
  handleTextInput(); // Update results to show zeros
  textInput.focus();
}

/**
 * Handle copy button click
 */
async function handleCopy() {
  const text = textInput.value;

  if (!text) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('No text to copy', 'error');
    } else {
      alert('No text to copy');
    }
    return;
  }

  try {
    // Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast('Text copied successfully', 'success');
      } else {
        alert('Text copied successfully');
      }
    } else {
      // Fallback for older browsers
      textInput.select();
      document.execCommand('copy');
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast('Text copied successfully', 'success');
      } else {
        alert('Text copied successfully');
      }
    }
  } catch (err) {
    console.error('Copy failed:', err);
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Failed to copy text', 'error');
    } else {
      alert('Failed to copy text');
    }
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the character counter
 */
function init() {
  // Event listeners
  textInput.addEventListener('input', handleTextInput);
  textInput.addEventListener('paste', function() {
    // Use setTimeout to ensure paste is processed before analysis
    setTimeout(handleTextInput, 0);
  });
  clearBtn.addEventListener('click', handleClear);
  copyBtn.addEventListener('click', handleCopy);

  // Keyboard shortcuts
  textInput.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K: Clear text
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      handleClear();
    }
  });

  // Initial calculation (in case there's default text)
  handleTextInput();

  // Focus on textarea
  textInput.focus();

  // Log initialization
  console.log('Character Counter initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ==========================================================================
   Additional Features
   ========================================================================== */

/**
 * Save text to localStorage (optional - for persistence)
 */
function saveToLocalStorage() {
  try {
    const text = textInput.value;
    localStorage.setItem('char-counter-text', text);
  } catch (e) {
    // Silently fail if localStorage is not available
    console.warn('localStorage not available:', e);
  }
}

/**
 * Load text from localStorage (optional - for persistence)
 */
function loadFromLocalStorage() {
  try {
    const savedText = localStorage.getItem('char-counter-text');
    if (savedText) {
      textInput.value = savedText;
      handleTextInput();
    }
  } catch (e) {
    // Silently fail if localStorage is not available
    console.warn('localStorage not available:', e);
  }
}

// Uncomment below lines to enable text persistence across page reloads
// loadFromLocalStorage();
// textInput.addEventListener('input', saveToLocalStorage);

/* ==========================================================================
   Export for testing (if needed)
   ========================================================================== */

// For potential unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeText,
    formatNumber
  };
}
