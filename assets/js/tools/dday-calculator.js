/* ==========================================================================
   D-Day Calculator - D-Day 계산기
   ========================================================================== */

'use strict';

// DOM Elements
const ddayForm = document.getElementById('dday-form');
const targetDateInput = document.getElementById('target-date');
const eventNameInput = document.getElementById('event-name');
const quickDateBtns = document.querySelectorAll('.quick-date-btn');
const resultArea = document.getElementById('result-area');
const eventLabel = document.getElementById('event-label');
const ddayPrefix = document.getElementById('dday-prefix');
const ddayNumber = document.getElementById('dday-number');
const ddayStatus = document.getElementById('dday-status');
const todayDate = document.getElementById('today-date');
const targetDateDisplay = document.getElementById('target-date-display');
const targetWeekday = document.getElementById('target-weekday');
const weeksMonths = document.getElementById('weeks-months');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const startDateEl = document.getElementById('start-date');
const endDateEl = document.getElementById('end-date');

/* ==========================================================================
   Date Calculation Functions
   ========================================================================== */

/**
 * Calculate D-Day (difference in days)
 * @param {Date} targetDate - Target date
 * @param {Date} baseDate - Base date (default: today)
 * @returns {number} Number of days (negative = future, positive = past)
 */
function calculateDDay(targetDate, baseDate = new Date()) {
  // Reset time to midnight for accurate day calculation
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const diffMs = target - base;

  // Convert to days
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Format date to US format
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (Month DD, YYYY)
 */
function formatDateUS(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get English weekday name
 * @param {Date} date - Date
 * @returns {string} Weekday name in English
 */
function getEnglishWeekday(date) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[date.getDay()];
}

/**
 * Convert days to weeks and months
 * @param {number} days - Number of days
 * @returns {string} Formatted string (X weeks Y days, X months Y days)
 */
function convertToWeeksMonths(days) {
  const absDays = Math.abs(days);

  // Calculate weeks
  const weeks = Math.floor(absDays / 7);
  const remainingDaysWeek = absDays % 7;

  // Calculate approximate months (30 days)
  const months = Math.floor(absDays / 30);
  const remainingDaysMonth = absDays % 30;

  let result = '';

  if (weeks > 0) {
    result += `${weeks} week${weeks > 1 ? 's' : ''}`;
    if (remainingDaysWeek > 0) {
      result += ` ${remainingDaysWeek} day${remainingDaysWeek > 1 ? 's' : ''}`;
    }
  } else {
    result += `${absDays} day${absDays !== 1 ? 's' : ''}`;
  }

  if (months > 0) {
    result += ` (approx. ${months} month${months > 1 ? 's' : ''}`;
    if (remainingDaysMonth > 0) {
      result += ` ${remainingDaysMonth} day${remainingDaysMonth > 1 ? 's' : ''}`;
    }
    result += ')';
  }

  return result;
}

/**
 * Calculate progress percentage
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Date} currentDate - Current date
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgress(startDate, endDate, currentDate) {
  const totalMs = endDate - startDate;
  const elapsedMs = currentDate - startDate;

  if (totalMs <= 0) return 100;
  if (elapsedMs <= 0) return 0;

  const percentage = (elapsedMs / totalMs) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

/**
 * Get date from offset days
 * @param {number} days - Number of days to add to today
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getDateFromOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/* ==========================================================================
   UI Update Functions
   ========================================================================== */

/**
 * Display D-Day results
 * @param {number} dday - D-Day value
 * @param {Date} targetDate - Target date
 * @param {string} eventName - Event name (optional)
 */
function displayResults(dday, targetDate, eventName) {
  const today = new Date();

  // Show result area
  resultArea.classList.remove('result-hidden');

  // Update event label
  if (eventName) {
    eventLabel.textContent = eventName;
  } else {
    eventLabel.textContent = 'D-Day';
  }

  // Update D-Day display
  if (dday > 0) {
    // Past date (D+)
    ddayPrefix.textContent = 'D+';
    ddayNumber.textContent = Math.abs(dday);
    const dayText = Math.abs(dday) === 1 ? 'day has passed' : 'days have passed';
    ddayStatus.textContent = `${Math.abs(dday)} ${dayText}`;
  } else if (dday < 0) {
    // Future date (D-)
    ddayPrefix.textContent = 'D-';
    ddayNumber.textContent = Math.abs(dday);
    const dayText = Math.abs(dday) === 1 ? 'day remaining' : 'days remaining';
    ddayStatus.textContent = `${Math.abs(dday)} ${dayText}`;
  } else {
    // Today (D-Day)
    ddayPrefix.textContent = 'D-';
    ddayNumber.textContent = 'Day';
    ddayStatus.textContent = 'Today is the day!';
  }

  // Update date information
  todayDate.textContent = formatDateUS(today);
  targetDateDisplay.textContent = formatDateUS(targetDate);
  targetWeekday.textContent = getEnglishWeekday(targetDate);
  weeksMonths.textContent = convertToWeeksMonths(dday);

  // Show progress bar only for future dates
  if (dday <= 0) {
    // Assume start date is today (you can modify this logic)
    const startDate = new Date();
    const progress = calculateProgress(startDate, targetDate, today);

    startDateEl.textContent = formatDateUS(startDate);
    endDateEl.textContent = formatDateUS(targetDate);
    progressFill.style.width = progress.toFixed(1) + '%';
    progressFill.textContent = progress.toFixed(1) + '%';

    progressContainer.style.display = 'block';
  } else {
    progressContainer.style.display = 'none';
  }

  // Scroll to results
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ==========================================================================
   Event Handlers
   ========================================================================== */

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleSubmit(e) {
  e.preventDefault();

  // Get input values
  const targetDateValue = targetDateInput.value;
  const eventName = eventNameInput.value.trim();

  // Validate
  if (!targetDateValue) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please select a target date', 'error');
    } else {
      alert('Please select a target date');
    }
    return;
  }

  // Parse date
  const targetDate = new Date(targetDateValue + 'T00:00:00');

  // Validate date
  if (isNaN(targetDate.getTime())) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please enter a valid date', 'error');
    } else {
      alert('Please enter a valid date');
    }
    return;
  }

  // Calculate D-Day
  const dday = calculateDDay(targetDate);

  // Display results
  displayResults(dday, targetDate, eventName);
}

/**
 * Handle form reset
 */
function handleReset() {
  resultArea.classList.add('result-hidden');
  progressContainer.style.display = 'none';
}

/**
 * Handle quick date button click
 * @param {Event} e - Click event
 */
function handleQuickDate(e) {
  const offset = parseInt(e.currentTarget.dataset.offset, 10);
  const dateString = getDateFromOffset(offset);

  targetDateInput.value = dateString;

  // Optionally trigger calculation immediately
  // handleSubmit(new Event('submit'));
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the D-Day calculator
 */
function init() {
  // Event listeners
  ddayForm.addEventListener('submit', handleSubmit);
  ddayForm.addEventListener('reset', handleReset);

  // Quick date buttons
  quickDateBtns.forEach(btn => {
    btn.addEventListener('click', handleQuickDate);
  });

  // Set min date to prevent very old dates (optional)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 10);
  const minDateString = minDate.toISOString().split('T')[0];
  targetDateInput.setAttribute('min', minDateString);

  // Set max date to prevent very future dates (optional)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  const maxDateString = maxDate.toISOString().split('T')[0];
  targetDateInput.setAttribute('max', maxDateString);

  // Set default date to tomorrow (optional)
  const tomorrow = getDateFromOffset(1);
  // targetDateInput.value = tomorrow;

  // Focus on date input
  targetDateInput.focus();

  // Log initialization
  console.log('D-Day Calculator initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ==========================================================================
   Auto-update (Optional Feature)
   ========================================================================== */

/**
 * Update D-Day every midnight
 * This is useful if the page stays open for a long time
 */
function setupAutoUpdate() {
  // Check if there's a calculated result
  if (!resultArea.classList.contains('result-hidden')) {
    // Recalculate at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow - now;

    setTimeout(() => {
      // Recalculate if date input has value
      if (targetDateInput.value) {
        handleSubmit(new Event('submit'));
      }

      // Set up next update
      setupAutoUpdate();
    }, msUntilMidnight);
  }
}

// Uncomment to enable auto-update
// setupAutoUpdate();

/* ==========================================================================
   Export for testing (if needed)
   ========================================================================== */

// For potential unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateDDay,
    formatDateUS,
    getEnglishWeekday,
    convertToWeeksMonths,
    calculateProgress,
    getDateFromOffset
  };
}
