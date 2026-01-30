/* ==========================================================================
   JSON Formatter - JSON 포맷터
   ========================================================================== */

'use strict';

// DOM Elements
const jsonInput = document.getElementById('json-input');
const indentSize = document.getElementById('indent-size');
const formatBtn = document.getElementById('format-btn');
const minifyBtn = document.getElementById('minify-btn');
const validateBtn = document.getElementById('validate-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const successMessage = document.getElementById('success-message');
const jsonStats = document.getElementById('json-stats');
const statOriginal = document.getElementById('stat-original');
const statFormatted = document.getElementById('stat-formatted');
const statMinified = document.getElementById('stat-minified');

/* ==========================================================================
   JSON Processing Functions
   ========================================================================== */

/**
 * Get indent string based on selected option
 * @returns {string} Indent string
 */
function getIndentString() {
  const value = indentSize.value;
  if (value === 'tab') {
    return '\t';
  }
  return ' '.repeat(parseInt(value, 10));
}

/**
 * Format (prettify) JSON with indentation
 * @param {string} jsonString - JSON string to format
 * @returns {Object} Result object with success status and data/error
 */
function formatJSON(jsonString) {
  try {
    // Parse JSON
    const parsed = JSON.parse(jsonString);

    // Get indent setting
    const indent = getIndentString();

    // Stringify with indentation
    const formatted = JSON.stringify(parsed, null, indent);

    return {
      success: true,
      data: formatted
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      position: extractErrorPosition(error.message)
    };
  }
}

/**
 * Minify JSON (remove all whitespace)
 * @param {string} jsonString - JSON string to minify
 * @returns {Object} Result object with success status and data/error
 */
function minifyJSON(jsonString) {
  try {
    // Parse JSON
    const parsed = JSON.parse(jsonString);

    // Stringify without indentation
    const minified = JSON.stringify(parsed);

    return {
      success: true,
      data: minified
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      position: extractErrorPosition(error.message)
    };
  }
}

/**
 * Validate JSON
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} Result object with success status and error
 */
function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      position: extractErrorPosition(error.message)
    };
  }
}

/**
 * Extract error position from error message
 * @param {string} errorMsg - Error message
 * @returns {string|null} Position string or null
 */
function extractErrorPosition(errorMsg) {
  // Try to extract position info from error message
  const positionMatch = errorMsg.match(/position (\d+)/i);
  if (positionMatch) {
    return `위치: ${positionMatch[1]}`;
  }

  const lineMatch = errorMsg.match(/line (\d+)/i);
  if (lineMatch) {
    return `줄: ${lineMatch[1]}`;
  }

  return null;
}

/**
 * Get byte size of string
 * @param {string} str - String to measure
 * @returns {number} Size in bytes
 */
function getByteSize(str) {
  return new Blob([str]).size;
}

/**
 * Format bytes to human readable string
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 bytes';
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Show error message
 * @param {string} message - Error message
 * @param {string|null} position - Position information
 */
function showError(message, position = null) {
  let errorHTML = `<p>${message}</p>`;

  if (position) {
    errorHTML += `<pre>${position}</pre>`;
  }

  errorText.innerHTML = errorHTML;
  errorMessage.classList.add('show');
  successMessage.classList.remove('show');
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.classList.remove('show');
}

/**
 * Show success message
 */
function showSuccess() {
  successMessage.classList.add('show');
  errorMessage.classList.remove('show');

  // Auto-hide after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}

/**
 * Update statistics display
 * @param {string} originalText - Original text
 * @param {string} formattedText - Formatted text
 * @param {string} minifiedText - Minified text
 */
function updateStats(originalText, formattedText, minifiedText) {
  const originalSize = getByteSize(originalText);
  const formattedSize = getByteSize(formattedText);
  const minifiedSize = getByteSize(minifiedText);

  statOriginal.textContent = formatBytes(originalSize);
  statFormatted.textContent = formatBytes(formattedSize);
  statMinified.textContent = formatBytes(minifiedSize);

  jsonStats.style.display = 'grid';
}

/**
 * Hide statistics
 */
function hideStats() {
  jsonStats.style.display = 'none';
}

/* ==========================================================================
   Event Handlers
   ========================================================================== */

/**
 * Handle format button click
 */
function handleFormat() {
  const input = jsonInput.value.trim();

  if (!input) {
    showError('JSON 데이터를 입력해주세요.');
    hideStats();
    return;
  }

  const result = formatJSON(input);

  if (result.success) {
    jsonInput.value = result.data;
    hideError();
    showSuccess();

    // Update stats
    const minifyResult = minifyJSON(input);
    if (minifyResult.success) {
      updateStats(input, result.data, minifyResult.data);
    }
  } else {
    showError(result.error, result.position);
    hideStats();
  }
}

/**
 * Handle minify button click
 */
function handleMinify() {
  const input = jsonInput.value.trim();

  if (!input) {
    showError('JSON 데이터를 입력해주세요.');
    hideStats();
    return;
  }

  const result = minifyJSON(input);

  if (result.success) {
    jsonInput.value = result.data;
    hideError();
    showSuccess();

    // Update stats
    const formatResult = formatJSON(input);
    if (formatResult.success) {
      updateStats(input, formatResult.data, result.data);
    }
  } else {
    showError(result.error, result.position);
    hideStats();
  }
}

/**
 * Handle validate button click
 */
function handleValidate() {
  const input = jsonInput.value.trim();

  if (!input) {
    showError('JSON 데이터를 입력해주세요.');
    hideStats();
    return;
  }

  const result = validateJSON(input);

  if (result.success) {
    hideError();
    showSuccess();

    // Show stats
    const formatResult = formatJSON(input);
    const minifyResult = minifyJSON(input);
    if (formatResult.success && minifyResult.success) {
      updateStats(input, formatResult.data, minifyResult.data);
    }
  } else {
    showError(result.error, result.position);
    hideStats();
  }
}

/**
 * Handle copy button click
 */
async function handleCopy() {
  const text = jsonInput.value;

  if (!text) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('복사할 내용이 없습니다', 'error');
    } else {
      alert('복사할 내용이 없습니다');
    }
    return;
  }

  try {
    // Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast('클립보드에 복사되었습니다', 'success');
      } else {
        alert('클립보드에 복사되었습니다');
      }
    } else {
      // Fallback for older browsers
      jsonInput.select();
      document.execCommand('copy');
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast('클립보드에 복사되었습니다', 'success');
      } else {
        alert('클립보드에 복사되었습니다');
      }
    }
  } catch (err) {
    console.error('복사 실패:', err);
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('복사에 실패했습니다', 'error');
    } else {
      alert('복사에 실패했습니다');
    }
  }
}

/**
 * Handle clear button click
 */
function handleClear() {
  jsonInput.value = '';
  hideError();
  successMessage.classList.remove('show');
  hideStats();
  jsonInput.focus();
}

/**
 * Handle indent size change
 */
function handleIndentChange() {
  // If there's valid JSON in the input, reformat it with new indent
  const input = jsonInput.value.trim();
  if (input) {
    const result = validateJSON(input);
    if (result.success) {
      handleFormat();
    }
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the JSON formatter
 */
function init() {
  // Event listeners
  formatBtn.addEventListener('click', handleFormat);
  minifyBtn.addEventListener('click', handleMinify);
  validateBtn.addEventListener('click', handleValidate);
  copyBtn.addEventListener('click', handleCopy);
  clearBtn.addEventListener('click', handleClear);
  indentSize.addEventListener('change', handleIndentChange);

  // Keyboard shortcuts
  jsonInput.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter: Format
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleFormat();
    }

    // Ctrl/Cmd + Shift + M: Minify
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
      e.preventDefault();
      handleMinify();
    }

    // Ctrl/Cmd + K: Clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      handleClear();
    }
  });

  // Tab key support in textarea
  jsonInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const value = this.value;

      // Insert tab or spaces
      const indent = getIndentString();
      this.value = value.substring(0, start) + indent + value.substring(end);

      // Move cursor
      this.selectionStart = this.selectionEnd = start + indent.length;
    }
  });

  // Focus on textarea
  jsonInput.focus();

  // Log initialization
  console.log('JSON Formatter initialized');
  console.log('Keyboard shortcuts:');
  console.log('  Ctrl/Cmd + Enter: Format');
  console.log('  Ctrl/Cmd + Shift + M: Minify');
  console.log('  Ctrl/Cmd + K: Clear');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ==========================================================================
   Export for testing (if needed)
   ========================================================================== */

// For potential unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatJSON,
    minifyJSON,
    validateJSON,
    getByteSize,
    formatBytes
  };
}
