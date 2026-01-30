/* ==========================================================================
   BMI Calculator - BMI 계산기
   ========================================================================== */

'use strict';

// DOM Elements
const bmiForm = document.getElementById('bmi-form');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const resultArea = document.getElementById('result-area');
const bmiValue = document.getElementById('bmi-value');
const gaugeIndicator = document.getElementById('gauge-indicator');
const gaugeSegments = document.querySelectorAll('.gauge-segment');
const categoryInfo = document.getElementById('category-info');
const categoryName = document.getElementById('category-name');
const categoryRange = document.getElementById('category-range');
const categoryDescription = document.getElementById('category-description');
const idealWeightRange = document.getElementById('ideal-weight-range');

/* ==========================================================================
   BMI Calculation and Classification
   ========================================================================== */

/**
 * Calculate BMI from height and weight
 * @param {number} height - Height in cm
 * @param {number} weight - Weight in kg
 * @returns {number} BMI value
 */
function calculateBMI(height, weight) {
  // Convert height from cm to meters
  const heightInMeters = height / 100;

  // BMI = weight(kg) / (height(m))^2
  const bmi = weight / (heightInMeters * heightInMeters);

  return bmi;
}

/**
 * Get BMI category based on WHO classification
 * @param {number} bmi - BMI value
 * @returns {Object} Category information
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      name: '저체중',
      className: 'underweight',
      range: 'BMI 18.5 미만',
      description: '현재 체중이 건강 체중보다 낮습니다. 영양 부족으로 인한 면역력 저하, 골다공증 위험이 있을 수 있습니다. 균형 잡힌 식사와 적절한 운동으로 건강한 체중에 도달하는 것이 좋습니다.',
      gaugePosition: (bmi / 18.5) * 25 // 0-25% range
    };
  } else if (bmi < 25) {
    return {
      name: '정상 체중',
      className: 'normal',
      range: 'BMI 18.5 ~ 24.9',
      description: '이상적인 체중 범위입니다. 현재 체중을 유지하면서 규칙적인 운동과 균형 잡힌 식습관을 지속하시기 바랍니다. 정기적인 건강 검진을 통해 건강 상태를 확인하세요.',
      gaugePosition: 25 + ((bmi - 18.5) / (25 - 18.5)) * 25 // 25-50% range
    };
  } else if (bmi < 30) {
    return {
      name: '과체중',
      className: 'overweight',
      range: 'BMI 25.0 ~ 29.9',
      description: '정상 체중보다 높은 상태입니다. 고혈압, 당뇨병, 심혈관 질환의 위험이 증가할 수 있으므로 주의가 필요합니다. 식이 조절과 규칙적인 운동으로 체중 관리를 시작하는 것이 좋습니다.',
      gaugePosition: 50 + ((bmi - 25) / (30 - 25)) * 25 // 50-75% range
    };
  } else {
    // 비만 세부 분류
    let obesityLevel = '';
    if (bmi < 35) {
      obesityLevel = '1단계 (경도 비만)';
    } else if (bmi < 40) {
      obesityLevel = '2단계 (중등도 비만)';
    } else {
      obesityLevel = '3단계 (고도 비만)';
    }

    return {
      name: '비만',
      className: 'obese',
      range: `BMI 30.0 이상 - ${obesityLevel}`,
      description: '비만 상태로 당뇨병, 고혈압, 심혈관 질환, 관절 질환 등 만성질환의 위험이 매우 높습니다. 체중 감량이 필요하며, 의사나 영양사와 상담하여 체계적인 관리 계획을 수립하시기 바랍니다.',
      gaugePosition: Math.min(75 + ((bmi - 30) / 10) * 25, 98) // 75-100% range, max 98%
    };
  }
}

/**
 * Calculate ideal weight range for given height
 * @param {number} height - Height in cm
 * @returns {Object} Min and max ideal weight
 */
function calculateIdealWeightRange(height) {
  const heightInMeters = height / 100;

  // Normal BMI range: 18.5 - 24.9
  const minWeight = 18.5 * (heightInMeters * heightInMeters);
  const maxWeight = 24.9 * (heightInMeters * heightInMeters);

  return {
    min: minWeight,
    max: maxWeight
  };
}

/**
 * Format number to 1 decimal place
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatDecimal(num) {
  return num.toFixed(1);
}

/* ==========================================================================
   UI Update Functions
   ========================================================================== */

/**
 * Update gauge indicator position
 * @param {number} position - Position percentage (0-100)
 */
function updateGaugeIndicator(position) {
  gaugeIndicator.style.left = position + '%';
  gaugeIndicator.classList.add('show');
}

/**
 * Update gauge segments opacity based on category
 * @param {string} className - Category class name
 */
function updateGaugeSegments(className) {
  gaugeSegments.forEach(segment => {
    if (segment.classList.contains(className)) {
      segment.classList.remove('dim');
    } else {
      segment.classList.add('dim');
    }
  });
}

/**
 * Display BMI results
 * @param {number} bmi - BMI value
 * @param {Object} category - Category information
 * @param {Object} idealWeight - Ideal weight range
 */
function displayResults(bmi, category, idealWeight) {
  // Show result area
  resultArea.classList.remove('result-hidden');

  // Display BMI value
  bmiValue.textContent = formatDecimal(bmi);

  // Update gauge
  updateGaugeIndicator(category.gaugePosition);
  updateGaugeSegments(category.className);

  // Display category information
  categoryName.textContent = category.name;
  categoryRange.textContent = category.range;
  categoryDescription.textContent = category.description;

  // Display ideal weight range
  idealWeightRange.textContent =
    `${formatDecimal(idealWeight.min)}kg ~ ${formatDecimal(idealWeight.max)}kg`;

  // Update category info styling
  categoryInfo.className = 'bmi-category-info show ' + category.className;

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
  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);

  // Validate inputs
  if (!height || !weight) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('키와 몸무게를 모두 입력해주세요', 'error');
    } else {
      alert('키와 몸무게를 모두 입력해주세요');
    }
    return;
  }

  if (height < 50 || height > 250) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('키는 50~250cm 범위로 입력해주세요', 'error');
    } else {
      alert('키는 50~250cm 범위로 입력해주세요');
    }
    return;
  }

  if (weight < 20 || weight > 300) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('몸무게는 20~300kg 범위로 입력해주세요', 'error');
    } else {
      alert('몸무게는 20~300kg 범위로 입력해주세요');
    }
    return;
  }

  // Calculate BMI
  const bmi = calculateBMI(height, weight);
  const category = getBMICategory(bmi);
  const idealWeight = calculateIdealWeightRange(height);

  // Display results
  displayResults(bmi, category, idealWeight);
}

/**
 * Handle form reset
 */
function handleReset() {
  resultArea.classList.add('result-hidden');
  gaugeIndicator.classList.remove('show');
  gaugeSegments.forEach(segment => segment.classList.remove('dim'));
  categoryInfo.classList.remove('show');
}

/**
 * Handle input changes (real-time validation)
 */
function handleInputChange(e) {
  const input = e.target;
  const value = parseFloat(input.value);

  // Remove any existing error styling
  input.style.borderColor = '';

  // Validate range
  if (input.id === 'height' && value && (value < 50 || value > 250)) {
    input.style.borderColor = 'var(--color-error)';
  } else if (input.id === 'weight' && value && (value < 20 || value > 300)) {
    input.style.borderColor = 'var(--color-error)';
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the BMI calculator
 */
function init() {
  // Event listeners
  bmiForm.addEventListener('submit', handleSubmit);
  bmiForm.addEventListener('reset', handleReset);
  heightInput.addEventListener('input', handleInputChange);
  weightInput.addEventListener('input', handleInputChange);

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Enter key in inputs (submit form)
    if (e.key === 'Enter' && (e.target === heightInput || e.target === weightInput)) {
      e.preventDefault();
      handleSubmit(e);
    }
  });

  // Focus on first input
  heightInput.focus();

  // Log initialization
  console.log('BMI Calculator initialized');
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
    calculateBMI,
    getBMICategory,
    calculateIdealWeightRange,
    formatDecimal
  };
}
