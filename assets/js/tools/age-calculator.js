/* ==========================================================================
   Age Calculator - 나이 계산기
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
 * Calculate Korean age (만 나이)
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 * @returns {number} Korean age
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
 * Calculate year age (연 나이)
 * @param {Date} birthDate - Birth date
 * @param {Date} referenceDate - Reference date
 * @returns {number} Year age
 */
function calculateYearAge(birthDate, referenceDate) {
  return referenceDate.getFullYear() - birthDate.getFullYear();
}

/**
 * Calculate precise age (years, months, days)
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
 * Format date to Korean format
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (YYYY년 MM월 DD일)
 */
function formatDateKorean(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Get Korean weekday name
 * @param {Date} date - Date
 * @returns {string} Weekday name in Korean
 */
function getKoreanWeekday(date) {
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return weekdays[date.getDay()];
}

/**
 * Format number with comma separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toLocaleString('ko-KR');
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
  koreanAgeEl.textContent = `${koreanAge}세`;
  yearAgeEl.textContent = `${yearAge}세`;

  // Display birth date information
  birthDateDisplayEl.textContent = formatDateKorean(birthDate);
  birthWeekdayEl.textContent = getKoreanWeekday(birthDate);
  daysSinceBirthEl.textContent = `${formatNumber(totalDays)}일`;

  // Display reference date information
  referenceDateDisplayEl.textContent = formatDateKorean(referenceDate);
  referenceWeekdayEl.textContent = getKoreanWeekday(referenceDate);
  totalDaysEl.textContent = `${formatNumber(totalDays)}일`;

  // Display precise age
  preciseAgeEl.textContent = `${preciseAge.years}년 ${preciseAge.months}개월 ${preciseAge.days}일`;

  // Display next birthday
  nextBirthdayEl.textContent = formatDateKorean(nextBirthday.date);

  if (nextBirthday.isToday) {
    daysToBirthdayEl.innerHTML = '<strong style="color: var(--color-success);">🎉 오늘이 생일입니다!</strong>';
  } else if (nextBirthday.daysUntil === 0) {
    daysToBirthdayEl.textContent = '오늘';
  } else {
    daysToBirthdayEl.textContent = `${formatNumber(nextBirthday.daysUntil)}일 남음`;
  }

  // Display time alive
  timeAliveEl.textContent =
    `${formatNumber(timeAlive.hours)}시간 (약 ${formatNumber(timeAlive.minutes)}분)`;
  weeksAliveEl.textContent = `${formatNumber(timeAlive.weeks)}주`;
  monthsAliveEl.textContent = `약 ${formatNumber(timeAlive.months)}개월`;

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
      window.Utils.showToast('생년월일을 입력해주세요', 'error');
    } else {
      alert('생년월일을 입력해주세요');
    }
    return;
  }

  const birthDate = new Date(birthDateValue + 'T00:00:00');

  // Validate birth date
  if (isNaN(birthDate.getTime())) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('올바른 생년월일을 입력해주세요', 'error');
    } else {
      alert('올바른 생년월일을 입력해주세요');
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
        window.Utils.showToast('기준 날짜를 입력해주세요', 'error');
      } else {
        alert('기준 날짜를 입력해주세요');
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
      window.Utils.showToast('올바른 기준 날짜를 입력해주세요', 'error');
    } else {
      alert('올바른 기준 날짜를 입력해주세요');
    }
    return;
  }

  // Check if birth date is after reference date
  if (birthDate > referenceDate) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('생년월일이 기준 날짜보다 미래일 수 없습니다', 'error');
    } else {
      alert('생년월일이 기준 날짜보다 미래일 수 없습니다');
    }
    return;
  }

  // Check if birth date is too far in the past (150 years)
  const maxAge = 150;
  const maxBirthDate = new Date(referenceDate);
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - maxAge);

  if (birthDate < maxBirthDate) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast(`생년월일은 ${maxAge}년 이내로 입력해주세요`, 'error');
    } else {
      alert(`생년월일은 ${maxAge}년 이내로 입력해주세요`);
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
