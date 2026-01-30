/* ==========================================================================
   Delivery Tracker - Integrated Delivery Tracking
   ========================================================================== */

'use strict';

// DOM Elements
const deliveryForm = document.getElementById('delivery-form');
const courierButtonsContainer = document.getElementById('courier-buttons');
const trackingNumberInput = document.getElementById('tracking-number');
const inputFormatHint = document.getElementById('input-format-hint');
const companyInfoBox = document.getElementById('company-info');
const companyInfoTitle = document.getElementById('company-info-title');
const companyInfoList = document.getElementById('company-info-list');

// Selected courier
let selectedCourier = null;

/* ==========================================================================
   Courier Data
   ========================================================================== */

const COURIERS = [
  {
    id: 'cj',
    name: 'CJ Daehan Express',
    icon: '📦',
    code: 'CJ',
    trackingUrl: 'https://www.cjlogistics.com/ko/tool/parcel/tracking',
    trackingPattern: /^\d{10,12}$/,
    lengthHint: '10-12 digits',
    phoneNumber: '1588-1255',
    description: 'Korea\'s largest courier service',
    tips: [
      'Tracking number is 10 or 12 digits',
      'Tracking available 1-2 hours after shipment',
      'Real-time location tracking available in CJ app'
    ]
  },
  {
    id: 'epost',
    name: 'Korea Post',
    icon: '📮',
    code: 'POST',
    trackingUrl: 'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm',
    trackingPattern: /^\d{13}$/,
    lengthHint: '13 digits',
    phoneNumber: '1588-1300',
    description: 'Korea Post parcel service',
    tips: [
      'Tracking number is 13 digits',
      'Delivered through nationwide post office network',
      'Pickup available at post offices'
    ]
  },
  {
    id: 'lotte',
    name: 'Lotte Global Logistics',
    icon: '🎁',
    code: 'LOTTE',
    trackingUrl: 'https://www.lotteglogis.com/home/reservation/tracking/linkView',
    trackingPattern: /^\d{12,13}$/,
    lengthHint: '12-13 digits',
    phoneNumber: '1588-2121',
    description: 'Lotte Global Logistics',
    tips: [
      'Tracking number is 12 or 13 digits',
      'Delivery notifications available in Lotte app',
      'Nationwide convenience store parcel service'
    ]
  },
  {
    id: 'hanjin',
    name: 'Hanjin Express',
    icon: '🚚',
    code: 'HANJIN',
    trackingUrl: 'https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do',
    trackingPattern: /^\d{10,12}$/,
    lengthHint: '10-12 digits',
    phoneNumber: '1588-0011',
    description: 'Hanjin parcel service',
    tips: [
      'Tracking number is 10 or 12 digits',
      'Dawn delivery service available',
      'GS25 convenience store parcel service'
    ]
  },
  {
    id: 'logen',
    name: 'Logen Express',
    icon: '📫',
    code: 'LOGEN',
    trackingUrl: 'https://www.ilogen.com/web/personal/trace',
    trackingPattern: /^\d{11}$/,
    lengthHint: '11 digits',
    phoneNumber: '1588-9988',
    description: 'Logen parcel service',
    tips: [
      'Tracking number is 11 digits',
      'Specialized in corporate logistics',
      'Many online shopping mall deliveries'
    ]
  },
  {
    id: 'kunyoung',
    name: 'Kunyoung Express',
    icon: '🚛',
    code: 'KUNYOUNG',
    trackingUrl: 'https://www.kunyoung.com/goods/goods_01.php',
    trackingPattern: /^\d{10,12}$/,
    lengthHint: '10-12 digits',
    phoneNumber: '1588-0002',
    description: 'Kunyoung parcel service',
    tips: [
      'Tracking number is 10 or 12 digits',
      'Local community-focused parcel service',
      'Specialized in fresh food delivery'
    ]
  },
  {
    id: 'coupang',
    name: 'Coupang Rocket',
    icon: '🚀',
    code: 'COUPANG',
    trackingUrl: 'https://www.coupang.com/my/orders',
    trackingPattern: /^\d{8,15}$/,
    lengthHint: '8-15 digits',
    phoneNumber: '1577-7011',
    description: 'Coupang Rocket Delivery',
    tips: [
      'Track on Coupang app or website',
      'Track using order number',
      'Rocket delivery offers same-day/dawn delivery'
    ]
  },
  {
    id: 'gs',
    name: 'GS Networks',
    icon: '📦',
    code: 'GS',
    trackingUrl: 'https://www.gsp.hanex.co.kr/web/main.do',
    trackingPattern: /^\d{12}$/,
    lengthHint: '12 digits',
    phoneNumber: '1588-1255',
    description: 'GS Networks parcel service',
    tips: [
      'Tracking number is 12 digits',
      'GS25 convenience store parcel service',
      'Convenience store return service available'
    ]
  },
  {
    id: 'daesin',
    name: 'Daesin Express',
    icon: '🚐',
    code: 'DAESIN',
    trackingUrl: 'https://www.ds3211.co.kr/freight/internalFreightSearch.ht',
    trackingPattern: /^\d{11,13}$/,
    lengthHint: '11-13 digits',
    phoneNumber: '1588-9040',
    description: 'Daesin parcel service',
    tips: [
      'Tracking number is 11 to 13 digits',
      'Nationwide delivery network',
      'Corporate delivery service available'
    ]
  },
  {
    id: 'kdexp',
    name: 'Kyungdong Express',
    icon: '🚙',
    code: 'KDEXP',
    trackingUrl: 'https://kdexp.com/basicNewDelivery.do',
    trackingPattern: /^\d{12,13}$/,
    lengthHint: '12-13 digits',
    phoneNumber: '1588-9040',
    description: 'Kyungdong parcel service',
    tips: [
      'Tracking number is 12 or 13 digits',
      'Specialized in Seoul metropolitan area',
      'Same-day delivery service available'
    ]
  }
];

/* ==========================================================================
   UI Generation Functions
   ========================================================================== */

/**
 * Generate courier selection buttons
 */
function generateCourierButtons() {
  courierButtonsContainer.innerHTML = COURIERS.map(courier => `
    <label class="company-btn" data-courier-id="${courier.id}">
      <input type="radio" name="courier" value="${courier.id}" required>
      <span class="company-icon">${courier.icon}</span>
      <span class="company-name">${courier.name}</span>
      <span class="company-code">${courier.code}</span>
    </label>
  `).join('');

  // Add event listeners
  const courierButtons = courierButtonsContainer.querySelectorAll('.company-btn');
  courierButtons.forEach(btn => {
    btn.addEventListener('click', handleCourierSelect);
  });
}

/**
 * Handle courier selection
 * @param {Event} e - Click event
 */
function handleCourierSelect(e) {
  const courierId = e.currentTarget.dataset.courierId;
  selectedCourier = COURIERS.find(c => c.id === courierId);

  // Update active state
  const allButtons = courierButtonsContainer.querySelectorAll('.company-btn');
  allButtons.forEach(btn => btn.classList.remove('active'));
  e.currentTarget.classList.add('active');

  // Update input hint
  if (selectedCourier) {
    inputFormatHint.textContent = `${selectedCourier.lengthHint} numbers`;

    // Update tracking number pattern
    trackingNumberInput.pattern = selectedCourier.trackingPattern.source.replace(/\^|\$/g, '');

    // Show company info
    showCompanyInfo(selectedCourier);
  }

  // Clear any previous validation errors
  trackingNumberInput.setCustomValidity('');
}

/**
 * Show company information box
 * @param {Object} courier - Courier information
 */
function showCompanyInfo(courier) {
  companyInfoTitle.textContent = `${courier.icon} ${courier.name} Information`;

  companyInfoList.innerHTML = courier.tips.map(tip =>
    `<li>${tip}</li>`
  ).join('');

  companyInfoBox.style.display = 'block';
}

/* ==========================================================================
   Validation Functions
   ========================================================================== */

/**
 * Validate tracking number format
 * @param {string} trackingNumber - Tracking number to validate
 * @returns {Object} Validation result
 */
function validateTrackingNumber(trackingNumber) {
  // Remove all non-digit characters
  const cleanNumber = trackingNumber.replace(/\D/g, '');

  if (!selectedCourier) {
    return {
      valid: false,
      error: 'Please select a courier service'
    };
  }

  if (!cleanNumber) {
    return {
      valid: false,
      error: 'Please enter a tracking number'
    };
  }

  if (!selectedCourier.trackingPattern.test(cleanNumber)) {
    return {
      valid: false,
      error: `${selectedCourier.name} tracking number must be ${selectedCourier.lengthHint}`
    };
  }

  return {
    valid: true,
    cleanNumber
  };
}

/**
 * Show toast message
 * @param {string} message - Message to display
 * @param {string} type - Message type (error, success, info)
 */
function showToast(message, type = 'error') {
  if (window.Utils && window.Utils.showToast) {
    window.Utils.showToast(message, type);
  } else {
    alert(message);
  }
}

/* ==========================================================================
   Tracking Functions
   ========================================================================== */

/**
 * Open courier tracking page
 * @param {Object} courier - Courier information
 * @param {string} trackingNumber - Clean tracking number
 */
function openTrackingPage(courier, trackingNumber) {
  let trackingUrl = courier.trackingUrl;

  // Build tracking URL based on courier
  switch (courier.id) {
    case 'cj':
      trackingUrl = `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=${trackingNumber}`;
      break;

    case 'epost':
      trackingUrl = `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${trackingNumber}`;
      break;

    case 'lotte':
      trackingUrl = `https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=${trackingNumber}`;
      break;

    case 'hanjin':
      trackingUrl = `https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=${trackingNumber}`;
      break;

    case 'logen':
      trackingUrl = `https://www.ilogen.com/web/personal/trace/${trackingNumber}`;
      break;

    case 'kunyoung':
      trackingUrl = `https://www.kunyoung.com/goods/goods_01.php?mulno=${trackingNumber}`;
      break;

    case 'coupang':
      // Coupang requires login, so just open orders page
      trackingUrl = 'https://www.coupang.com/my/orders';
      showToast('For Coupang, please check your order history after logging in', 'info');
      break;

    case 'gs':
      trackingUrl = `https://www.gsp.hanex.co.kr/web/tracking.do?mode=search&invoiceNo=${trackingNumber}`;
      break;

    case 'daesin':
      trackingUrl = `https://www.ds3211.co.kr/freight/internalFreightSearch.ht?billno=${trackingNumber}`;
      break;

    case 'kdexp':
      trackingUrl = `https://kdexp.com/basicNewDelivery.do?barcode=${trackingNumber}`;
      break;

    default:
      // Fallback to main tracking page
      trackingUrl = courier.trackingUrl;
  }

  // Open in new tab
  window.open(trackingUrl, '_blank', 'noopener,noreferrer');
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

  const trackingNumber = trackingNumberInput.value.trim();

  // Validate
  const validation = validateTrackingNumber(trackingNumber);

  if (!validation.valid) {
    showToast(validation.error, 'error');
    trackingNumberInput.setCustomValidity(validation.error);
    trackingNumberInput.reportValidity();
    return;
  }

  // Clear validation
  trackingNumberInput.setCustomValidity('');

  // Show success message
  showToast(`Redirecting to ${selectedCourier.name} tracking page`, 'success');

  // Open tracking page
  setTimeout(() => {
    openTrackingPage(selectedCourier, validation.cleanNumber);
  }, 500);
}

/**
 * Handle form reset
 */
function handleReset() {
  selectedCourier = null;

  // Remove active state from all buttons
  const allButtons = courierButtonsContainer.querySelectorAll('.company-btn');
  allButtons.forEach(btn => btn.classList.remove('active'));

  // Reset input hint
  inputFormatHint.textContent = 'e.g., 123456789012';

  // Hide company info
  companyInfoBox.style.display = 'none';

  // Clear validation
  trackingNumberInput.setCustomValidity('');

  // Reset pattern
  trackingNumberInput.pattern = '[0-9]+';
}

/**
 * Handle tracking number input
 * @param {Event} e - Input event
 */
function handleTrackingInput(e) {
  // Remove non-digit characters
  const cleaned = e.target.value.replace(/\D/g, '');

  if (e.target.value !== cleaned) {
    e.target.value = cleaned;
  }

  // Clear custom validity on input
  e.target.setCustomValidity('');
}

/**
 * Handle tracking number paste
 * @param {Event} e - Paste event
 */
function handleTrackingPaste(e) {
  e.preventDefault();

  // Get pasted data
  const pastedText = (e.clipboardData || window.clipboardData).getData('text');

  // Clean and insert
  const cleaned = pastedText.replace(/\D/g, '');
  trackingNumberInput.value = cleaned;

  // Trigger input event for validation
  trackingNumberInput.dispatchEvent(new Event('input'));
}

/* ==========================================================================
   Initialization
   ========================================================================== */

/**
 * Initialize the delivery tracker
 */
function init() {
  // Generate courier buttons
  generateCourierButtons();

  // Event listeners
  deliveryForm.addEventListener('submit', handleSubmit);
  deliveryForm.addEventListener('reset', handleReset);
  trackingNumberInput.addEventListener('input', handleTrackingInput);
  trackingNumberInput.addEventListener('paste', handleTrackingPaste);

  // Focus on tracking number input
  trackingNumberInput.focus();

  // Log initialization
  console.log('Delivery Tracker initialized');
  console.log(`Loaded ${COURIERS.length} courier services`);
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
    COURIERS,
    validateTrackingNumber,
    openTrackingPage
  };
}
