/* ==========================================================================
   Unit Converter
   ========================================================================== */

'use strict';

// Conversion rates (to base unit)
const CONVERSIONS = {
  // Length (base unit: meter)
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    ft: 0.3048,
    in: 0.0254
  },

  // Weight (base unit: gram)
  weight: {
    kg: 1000,
    g: 1,
    mg: 0.001,
    ton: 1000000,
    lb: 453.59237,
    oz: 28.349523125
  }

  // Temperature: special handling (non-linear conversion)
};

// DOM Elements
const categoryTabs = document.querySelectorAll('.category-tab');
const converterSections = document.querySelectorAll('.converter-section');
const swapButtons = document.querySelectorAll('.swap-button');

// Length converter elements
const lengthFromValue = document.getElementById('length-from-value');
const lengthFromUnit = document.getElementById('length-from-unit');
const lengthToValue = document.getElementById('length-to-value');
const lengthToUnit = document.getElementById('length-to-unit');
const lengthEquation = document.getElementById('length-equation');

// Weight converter elements
const weightFromValue = document.getElementById('weight-from-value');
const weightFromUnit = document.getElementById('weight-from-unit');
const weightToValue = document.getElementById('weight-to-value');
const weightToUnit = document.getElementById('weight-to-unit');
const weightEquation = document.getElementById('weight-equation');

// Temperature converter elements
const tempFromValue = document.getElementById('temp-from-value');
const tempFromUnit = document.getElementById('temp-from-unit');
const tempToValue = document.getElementById('temp-to-value');
const tempToUnit = document.getElementById('temp-to-unit');
const tempEquation = document.getElementById('temp-equation');

/* ==========================================================================
   Conversion Functions
   ========================================================================== */

/**
 * Convert length or weight units
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {string} category - Category (length or weight)
 * @returns {number} Converted value
 */
function convertLinearUnit(value, fromUnit, toUnit, category) {
  // Convert to base unit first
  const baseValue = value * CONVERSIONS[category][fromUnit];

  // Convert from base unit to target unit
  const result = baseValue / CONVERSIONS[category][toUnit];

  return result;
}

/**
 * Convert temperature units
 * @param {number} value - Temperature value
 * @param {string} fromUnit - Source unit (c, f, k)
 * @param {string} toUnit - Target unit (c, f, k)
 * @returns {number} Converted temperature
 */
function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return value;
  }

  let celsius;

  // Convert to Celsius first
  switch (fromUnit) {
    case 'c':
      celsius = value;
      break;
    case 'f':
      celsius = (value - 32) * (5 / 9);
      break;
    case 'k':
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // Convert from Celsius to target unit
  switch (toUnit) {
    case 'c':
      return celsius;
    case 'f':
      return (celsius * 9 / 5) + 32;
    case 'k':
      return celsius + 273.15;
    default:
      return celsius;
  }
}

/**
 * Format number for display
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  // Round to 6 decimal places and remove trailing zeros
  const rounded = parseFloat(num.toFixed(6));

  // Use locale string for thousands separator
  return rounded.toLocaleString('en-US', {
    maximumFractionDigits: 6
  });
}

/**
 * Get unit label with symbol
 * @param {string} unit - Unit code
 * @param {string} category - Category
 * @returns {string} Unit label
 */
function getUnitLabel(unit, category) {
  const labels = {
    length: {
      m: 'm',
      km: 'km',
      cm: 'cm',
      mm: 'mm',
      mile: 'mile',
      yard: 'yard',
      ft: 'ft',
      in: 'in'
    },
    weight: {
      kg: 'kg',
      g: 'g',
      mg: 'mg',
      ton: 'ton',
      lb: 'lb',
      oz: 'oz'
    },
    temperature: {
      c: '°C',
      f: '°F',
      k: 'K'
    }
  };

  return labels[category][unit] || unit;
}

/* ==========================================================================
   UI Update Functions
   ========================================================================== */

/**
 * Update conversion display
 * @param {number} fromValue - Source value
 * @param {string} fromUnit - Source unit
 * @param {number} toValue - Result value
 * @param {string} toUnit - Target unit
 * @param {string} category - Category
 * @param {HTMLElement} equationElement - Equation display element
 */
function updateEquation(fromValue, fromUnit, toValue, toUnit, category, equationElement) {
  const fromLabel = getUnitLabel(fromUnit, category);
  const toLabel = getUnitLabel(toUnit, category);

  equationElement.innerHTML = `
    <span class="conversion-value">${formatNumber(fromValue)}</span> ${fromLabel}
    =
    <span class="conversion-value">${formatNumber(toValue)}</span> ${toLabel}
  `;
}

/**
 * Perform length conversion
 */
function performLengthConversion() {
  const value = parseFloat(lengthFromValue.value);

  if (isNaN(value)) {
    lengthToValue.value = '';
    lengthEquation.textContent = 'Please enter a value';
    return;
  }

  const fromUnit = lengthFromUnit.value;
  const toUnit = lengthToUnit.value;

  const result = convertLinearUnit(value, fromUnit, toUnit, 'length');

  lengthToValue.value = formatNumber(result);
  updateEquation(value, fromUnit, result, toUnit, 'length', lengthEquation);
}

/**
 * Perform weight conversion
 */
function performWeightConversion() {
  const value = parseFloat(weightFromValue.value);

  if (isNaN(value)) {
    weightToValue.value = '';
    weightEquation.textContent = 'Please enter a value';
    return;
  }

  const fromUnit = weightFromUnit.value;
  const toUnit = weightToUnit.value;

  const result = convertLinearUnit(value, fromUnit, toUnit, 'weight');

  weightToValue.value = formatNumber(result);
  updateEquation(value, fromUnit, result, toUnit, 'weight', weightEquation);
}

/**
 * Perform temperature conversion
 */
function performTemperatureConversion() {
  const value = parseFloat(tempFromValue.value);

  if (isNaN(value)) {
    tempToValue.value = '';
    tempEquation.textContent = 'Please enter a value';
    return;
  }

  const fromUnit = tempFromUnit.value;
  const toUnit = tempToUnit.value;

  const result = convertTemperature(value, fromUnit, toUnit);

  tempToValue.value = formatNumber(result);
  updateEquation(value, fromUnit, result, toUnit, 'temperature', tempEquation);
}

/* ==========================================================================
   Event Handlers
   ========================================================================== */

/**
 * Handle category tab click
 * @param {Event} e - Click event
 */
function handleCategoryChange(e) {
  const category = e.target.dataset.category;

  // Update active tab
  categoryTabs.forEach(tab => tab.classList.remove('active'));
  e.target.classList.add('active');

  // Show corresponding converter section
  converterSections.forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(`${category}-converter`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

/**
 * Handle swap button click
 * @param {Event} e - Click event
 */
function handleSwap(e) {
  const category = e.currentTarget.dataset.category;

  switch (category) {
    case 'length':
      // Swap units
      const tempLengthUnit = lengthFromUnit.value;
      lengthFromUnit.value = lengthToUnit.value;
      lengthToUnit.value = tempLengthUnit;

      // Recalculate
      performLengthConversion();
      break;

    case 'weight':
      // Swap units
      const tempWeightUnit = weightFromUnit.value;
      weightFromUnit.value = weightToUnit.value;
      weightToUnit.value = tempWeightUnit;

      // Recalculate
      performWeightConversion();
      break;

    case 'temperature':
      // Swap units
      const tempTempUnit = tempFromUnit.value;
      tempFromUnit.value = tempToUnit.value;
      tempToUnit.value = tempTempUnit;

      // Recalculate
      performTemperatureConversion();
      break;
  }
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the unit converter
 */
function init() {
  // Category tabs
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', handleCategoryChange);
  });

  // Swap buttons
  swapButtons.forEach(btn => {
    btn.addEventListener('click', handleSwap);
  });

  // Length converter
  lengthFromValue.addEventListener('input', performLengthConversion);
  lengthFromUnit.addEventListener('change', performLengthConversion);
  lengthToUnit.addEventListener('change', performLengthConversion);

  // Weight converter
  weightFromValue.addEventListener('input', performWeightConversion);
  weightFromUnit.addEventListener('change', performWeightConversion);
  weightToUnit.addEventListener('change', performWeightConversion);

  // Temperature converter
  tempFromValue.addEventListener('input', performTemperatureConversion);
  tempFromUnit.addEventListener('change', performTemperatureConversion);
  tempToUnit.addEventListener('change', performTemperatureConversion);

  // Initial conversions
  performLengthConversion();
  performWeightConversion();
  performTemperatureConversion();

  // Log initialization
  console.log('Unit Converter initialized');
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
    convertLinearUnit,
    convertTemperature,
    formatNumber,
    CONVERSIONS
  };
}
