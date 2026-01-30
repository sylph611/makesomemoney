/* ==========================================================================
   BMI Calculator
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
      name: 'Underweight',
      className: 'underweight',
      range: 'BMI below 18.5',
      description: 'Your current weight is below the healthy weight range. There may be risks of weakened immunity and osteoporosis due to malnutrition. It is recommended to reach a healthy weight through a balanced diet and appropriate exercise.',
      gaugePosition: (bmi / 18.5) * 25 // 0-25% range
    };
  } else if (bmi < 25) {
    return {
      name: 'Normal Weight',
      className: 'normal',
      range: 'BMI 18.5 ~ 24.9',
      description: 'This is an ideal weight range. Please continue to maintain your current weight through regular exercise and balanced eating habits. Check your health status through regular health checkups.',
      gaugePosition: 25 + ((bmi - 18.5) / (25 - 18.5)) * 25 // 25-50% range
    };
  } else if (bmi < 30) {
    return {
      name: 'Overweight',
      className: 'overweight',
      range: 'BMI 25.0 ~ 29.9',
      description: 'Your weight is above the normal range. The risk of hypertension, diabetes, and cardiovascular diseases may increase, so caution is needed. It is good to start weight management with dietary control and regular exercise.',
      gaugePosition: 50 + ((bmi - 25) / (30 - 25)) * 25 // 50-75% range
    };
  } else {
    // Obesity detailed classification
    let obesityLevel = '';
    if (bmi < 35) {
      obesityLevel = 'Class I (Mild Obesity)';
    } else if (bmi < 40) {
      obesityLevel = 'Class II (Moderate Obesity)';
    } else {
      obesityLevel = 'Class III (Severe Obesity)';
    }

    return {
      name: 'Obese',
      className: 'obese',
      range: `BMI 30.0 and above - ${obesityLevel}`,
      description: 'You are in an obese condition with very high risk of chronic diseases such as diabetes, hypertension, cardiovascular diseases, and joint diseases. Weight loss is necessary, and please consult with a doctor or nutritionist to establish a systematic management plan.',
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
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
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
      window.Utils.showToast('Please enter both height and weight', 'error');
    } else {
      alert('Please enter both height and weight');
    }
    return;
  }

  if (height < 50 || height > 250) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please enter height between 50~250cm', 'error');
    } else {
      alert('Please enter height between 50~250cm');
    }
    return;
  }

  if (weight < 20 || weight > 300) {
    if (window.Utils && window.Utils.showToast) {
      window.Utils.showToast('Please enter weight between 20~300kg', 'error');
    } else {
      alert('Please enter weight between 20~300kg');
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
