/* ==========================================================================
   Age Calculator
   ========================================================================== */

'use strict';

// DOM Elements
const ageForm = document.getElementById('age-form');
const birthDateInput = document.getElementById('birth-date');
const referenceTypeRadios = document.querySelectorAll('input[name="reference-type"]');
const customDateGroup = document.getElementById('custom-date-group');
const referenceDateInput = document.getElementById('reference-date');
const resultArea = document.getElementById('result-area');

// Result elements
const koreanAgeEl = document.getElementById('korean-age');
const yearAgeEl = document.getElementById('year-age');
const birthDateDisplayEl = document.getElementById('birth-date-display');
const birthWeekdayEl = document.getElementById('birth-weekday');
const daysSinceBirthEl = document.getElementById('days-since-birth');
const referenceDateDisplayEl = document.getElementById('reference-date-display');
const referenceWeekdayEl = document.getElementById('reference-weekday');
const totalDaysEl = document.getElementById('total-days');
const preciseAgeEl = document.getElementById('precise-age');
const nextBirthdayEl = document.getElementById('next-birthday');
const daysToBirthdayEl = document.getElementById('days-to-birthday');
const timeAliveEl = document.getElementById('time-alive');
const weeksAliveEl = document.getElementById('weeks-alive');
const monthsAliveEl = document.getElementById('months-alive');

/* ==========================================================================
   Age Calculation Functions
   ========================================================================== */

/**
 * Calculate international age (Korean age / 만 나이)
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 * @returns {number} International age
 */
function calculateKoreanAge(birthDate, referenceDate) {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();

  // Check if birthday has passed this year
  const hasBirthdayPassed =
    referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() &&
     referenceDate.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}

/**
 * Calculate year age
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 * @returns {number} Year age
 */
function calculateYearAge(birthDate, referenceDate) {
  return referenceDate.getFullYear() - birthDate.getFullYear();
}

/**
 * Calculate precise age breakdown (years, months, days)
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 * @returns {Object} Precise age breakdown
 */
function calculatePreciseAge(birthDate, referenceDate) {
  let years = referenceDate.getFullYear() - birthDate.getFullYear();
  let months = referenceDate.getMonth() - birthDate.getMonth();
  let days = referenceDate.getDate() - birthDate.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    // Get days in previous month
    const prevMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculate days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Number of days
 */
function calculateDaysBetween(date1, date2) {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);

  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);

  const diffMs = d2 - d1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate next birthday
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 * @returns {Object} Next birthday info
 */
function calculateNextBirthday(birthDate, referenceDate) {
  const nextBirthday = new Date(
    referenceDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // If birthday has passed this year, calculate for next year
  if (nextBirthday < referenceDate) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  // Check if today is the birthday
  const isToday =
    nextBirthday.getFullYear() === referenceDate.getFullYear() &&
    nextBirthday.getMonth() === referenceDate.getMonth() &&
    nextBirthday.getDate() === referenceDate.getDate();

  const daysUntil = calculateDaysBetween(referenceDate, nextBirthday);

  return {
    date: nextBirthday,
    daysUntil,
    isToday
  };
}

/**
 * Calculate time alive in different units
 * @param {number} totalDays - Total days alive
 * @returns {Object} Time breakdown
 */
function calculateTimeAlive(totalDays) {
  const hours = totalDays * 24;
  const minutes = hours * 60;
  const weeks = Math.floor(totalDays / 7);
  const months = Math.floor(totalDays / 30.44); // Average month length

  return {
    days: totalDays,
    weeks,
    months,
    hours: Math.floor(hours),
    minutes: Math.floor(minutes)
  };
}

/* ==========================================================================
   Date Formatting Functions
   ========================================================================== */

/**
 * Format date in English format
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "January 1, 2024")
 */
function formatDateKorean(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get weekday name in English
 * @param {Date} date - Date
 * @returns {string} Weekday name in English
 */
function getKoreanWeekday(date) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[date.getDay()];
}

/**
 * Format number with comma separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/* ==========================================================================
   UI Update Functions
   ========================================================================== */

/**
 * Display age calculation results
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 */
function displayResults(birthDate, referenceDate) {
  // Calculate all age information
  const koreanAge = calculateKoreanAge(birthDate, referenceDate);
  const yearAge = calculateYearAge(birthDate, referenceDate);
  const preciseAge = calculatePreciseAge(birthDate, referenceDate);
  const totalDays = calculateDaysBetween(birthDate, referenceDate);
  const nextBirthday = calculateNextBirthday(birthDate, referenceDate);
  const timeAlive = calculateTimeAlive(totalDays);

  // Show result area
  resultArea.classList.remove('result-hidden');

  // Display main ages
  koreanAgeEl.textContent = `${koreanAge} years old`;
  yearAgeEl.textContent = `${yearAge} years old`;

  // Display birth date information
  birthDateDisplayEl.textContent = formatDateKorean(birthDate);
  birthWeekdayEl.textContent = getKoreanWeekday(birthDate);
  daysSinceBirthEl.textContent = `${formatNumber(totalDays)} days`;

  // Display reference date information
  referenceDateDisplayEl.textContent = formatDateKorean(referenceDate);
  referenceWeekdayEl.textContent = getKoreanWeekday(referenceDate);
  totalDaysEl.textContent = `${formatNumber(totalDays)} days`;

  // Display precise age
  preciseAgeEl.textContent = `${preciseAge.years} years, ${preciseAge.months} months, ${preciseAge.days} days`;

  // Display next birthday
  nextBirthdayEl.textContent = formatDateKorean(nextBirthday.date);

  if (nextBirthday.isToday) {
    daysToBirthdayEl.innerHTML = '<strong style="color: var(--color-success);">🎉 Happy Birthday!</strong>';
  } else if (nextBirthday.daysUntil === 0) {
    daysToBirthdayEl.textContent = 'Today';
  } else {
    daysToBirthdayEl.textContent = `${formatNumber(nextBirthday.daysUntil)} days remaining`;
  }

  // Display time alive
  timeAliveEl.textContent =
    `${formatNumber(timeAlive.hours)} hours (approx. ${formatNumber(timeAlive.minutes)} minutes)`;
  weeksAliveEl.textContent = `${formatNumber(timeAlive.weeks)} weeks`;
  monthsAliveEl.textContent = `Approx. ${formatNumber(timeAlive.months)} months`;

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

  // Get birth date
  const birthDateValue = birthDateInput.value;

  if (!birthDateValue) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please enter your date of birth', 'error');
    } else {
      alert('Please enter your date of birth');
    }
    return;
  }

  const birthDate = new Date(birthDateValue + 'T00:00:00');

  // Validate birth date
  if (isNaN(birthDate.getTime())) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please enter a valid date of birth', 'error');
    } else {
      alert('Please enter a valid date of birth');
    }
    return;
  }

  // Get reference date
  let referenceDate;
  const referenceType = document.querySelector('input[name="reference-type"]:checked').value;

  if (referenceType === 'custom') {
    const referenceDateValue = referenceDateInput.value;

    if (!referenceDateValue) {
      if (window.Utils && window.Utils.showToast) {
        window.Utils.showToast('Please enter a reference date', 'error');
      } else {
        alert('Please enter a reference date');
      }
      return;
    }

    referenceDate = new Date(referenceDateValue + 'T00:00:00');
  } else {
    referenceDate = new Date();
    referenceDate.setHours(0, 0, 0, 0);
  }

  // Validate reference date
  if (isNaN(referenceDate.getTime())) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please enter a valid reference date', 'error');
    } else {
      alert('Please enter a valid reference date');
    }
    return;
  }

  // Check if birth date is after reference date
  if (birthDate > referenceDate) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Date of birth cannot be in the future', 'error');
    } else {
      alert('Date of birth cannot be in the future');
    }
    return;
  }

  // Check if birth date is too far in the past (150 years)
  const maxAge = 150;
  const maxBirthDate = new Date(referenceDate);
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - maxAge);

  if (birthDate < maxBirthDate) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast(`Date of birth must be within ${maxAge} years`, 'error');
    } else {
      alert(`Date of birth must be within ${maxAge} years`);
    }
    return;
  }

  // Display results
  displayResults(birthDate, referenceDate);
}

/**
 * Handle form reset
 */
function handleReset() {
  resultArea.classList.add('result-hidden');
  customDateGroup.style.display = 'none';
}

/**
 * Handle reference type change
 * @param {Event} e - Change event
 */
function handleReferenceTypeChange(e) {
  const value = e.target.value;

  if (value === 'custom') {
    customDateGroup.style.display = 'block';
    referenceDateInput.required = true;
  } else {
    customDateGroup.style.display = 'none';
    referenceDateInput.required = false;
    referenceDateInput.value = '';
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the age calculator
 */
function init() {
  // Event listeners
  ageForm.addEventListener('submit', handleSubmit);
  ageForm.addEventListener('reset', handleReset);

  referenceTypeRadios.forEach(radio => {
    radio.addEventListener('change', handleReferenceTypeChange);
  });

  // Set date input limits
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Birth date: max = today, min = 150 years ago
  birthDateInput.setAttribute('max', todayString);
  const minDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - 150);
  birthDateInput.setAttribute('min', minDate.toISOString().split('T')[0]);

  // Reference date: default max = today
  referenceDateInput.setAttribute('max', todayString);
  referenceDateInput.value = todayString;

  // Update reference date max when birth date changes
  birthDateInput.addEventListener('change', function() {
    if (birthDateInput.value) {
      referenceDateInput.setAttribute('min', birthDateInput.value);
    }
  });

  // Focus on birth date input
  birthDateInput.focus();

  // Log initialization
  console.log('Age Calculator initialized');
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
    calculateKoreanAge,
    calculateYearAge,
    calculatePreciseAge,
    calculateDaysBetween,
    calculateNextBirthday,
    calculateTimeAlive,
    formatDateKorean,
    getKoreanWeekday
  };
}
