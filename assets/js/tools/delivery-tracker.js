/* ==========================================================================
   Delivery Tracker - 택배 배송조회 통합
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
    name: 'CJ대한통운',
    icon: '📦',
    code: 'CJ',
    trackingUrl: 'https://www.cjlogistics.com/ko/tool/parcel/tracking',
    trackingPattern: /^\d{10,12}$/,
    lengthHint: '10~12자리',
    phoneNumber: '1588-1255',
    description: '국내 최대 택배 업체',
    tips: [
      '운송장 번호는 10자리 또는 12자리 숫자입니다',
      '발송 후 1~2시간 뒤 조회 가능합니다',
      'CJ대한통운 앱에서 실시간 위치 추적 가능'
    ]
  },
  {
    id: 'epost',
    name: '우체국택배',
    icon: '📮',
    code: 'POST',
    trackingUrl: 'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm',
    trackingPattern: /^\d{13}$/,
    lengthHint: '13자리',
    phoneNumber: '1588-1300',
    description: '우체국 택배 서비스',
    tips: [
      '운송장 번호는 13자리 숫자입니다',
      '전국 우체국 네트워크를 통해 배송됩니다',
      '우체국 방문 수령 가능'
    ]
  },
  {
    id: 'lotte',
    name: '롯데택배',
    icon: '🎁',
    code: 'LOTTE',
    trackingUrl: 'https://www.lotteglogis.com/home/reservation/tracking/linkView',
    trackingPattern: /^\d{12,13}$/,
    lengthHint: '12~13자리',
    phoneNumber: '1588-2121',
    description: '롯데 글로벌 로지스',
    tips: [
      '운송장 번호는 12자리 또는 13자리 숫자입니다',
      '롯데택배 앱에서 배송 알림 받기 가능',
      '전국 편의점 택배 서비스 제공'
    ]
  },
  {
    id: 'hanjin',
    name: '한진택배',
    icon: '🚚',
    code: 'HANJIN',
    trackingUrl: 'https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do',
    trackingPattern: /^\d{10,12}$/,
    lengthHint: '10~12자리',
    phoneNumber: '1588-0011',
    description: '한진 택배 서비스',
    tips: [
      '운송장 번호는 10자리 또는 12자리 숫자입니다',
      '새벽배송 서비스 제공',
      'GS25 편의점 택배 이용 가능'
    ]
  },
  {
    id: 'logen',
    name: '로젠택배',
    icon: '📫',
    code: 'LOGEN',
    trackingUrl: 'https://www.ilogen.com/web/personal/trace',
    trackingPattern: /^\d{11}$/,
    lengthHint: '11자리',
    phoneNumber: '1588-9988',
    description: '로젠 택배 서비스',
    tips: [
      '운송장 번호는 11자리 숫자입니다',
      '기업 물류 전문 택배사',
      '온라인 쇼핑몰 배송 다수'
    ]
  },
  {
    id: 'kunyoung',
    name: '건영택배',
    icon: '🚛',
    code: 'KUNYOUNG',
    trackingUrl: 'https://www.kunyoung.com/goods/goods_01.php',
    trackingPattern: /^\d{10,12}$/,
    lengthHint: '10~12자리',
    phoneNumber: '1588-0002',
    description: '건영 택배 서비스',
    tips: [
      '운송장 번호는 10자리 또는 12자리 숫자입니다',
      '지역 밀착형 택배 서비스',
      '신선식품 배송 전문'
    ]
  },
  {
    id: 'coupang',
    name: '쿠팡로켓',
    icon: '🚀',
    code: 'COUPANG',
    trackingUrl: 'https://www.coupang.com/my/orders',
    trackingPattern: /^\d{8,15}$/,
    lengthHint: '8~15자리',
    phoneNumber: '1577-7011',
    description: '쿠팡 로켓배송',
    tips: [
      '쿠팡 앱 또는 웹사이트에서 조회하세요',
      '주문번호로 배송 조회 가능',
      '로켓배송은 당일/새벽배송 제공'
    ]
  },
  {
    id: 'gs',
    name: 'GS택배',
    icon: '📦',
    code: 'GS',
    trackingUrl: 'https://www.gsp.hanex.co.kr/web/main.do',
    trackingPattern: /^\d{12}$/,
    lengthHint: '12자리',
    phoneNumber: '1588-1255',
    description: 'GS 네트웍스 택배',
    tips: [
      '운송장 번호는 12자리 숫자입니다',
      'GS25 편의점 택배 제공',
      '편의점 반품 서비스 가능'
    ]
  },
  {
    id: 'daesin',
    name: '대신택배',
    icon: '🚐',
    code: 'DAESIN',
    trackingUrl: 'https://www.ds3211.co.kr/freight/internalFreightSearch.ht',
    trackingPattern: /^\d{11,13}$/,
    lengthHint: '11~13자리',
    phoneNumber: '1588-9040',
    description: '대신 택배 서비스',
    tips: [
      '운송장 번호는 11자리 ~ 13자리 숫자입니다',
      '전국 배송 네트워크 운영',
      '기업 전용 배송 서비스 제공'
    ]
  },
  {
    id: 'kdexp',
    name: '경동택배',
    icon: '🚙',
    code: 'KDEXP',
    trackingUrl: 'https://kdexp.com/basicNewDelivery.do',
    trackingPattern: /^\d{12,13}$/,
    lengthHint: '12~13자리',
    phoneNumber: '1588-9040',
    description: '경동 택배 서비스',
    tips: [
      '운송장 번호는 12자리 또는 13자리 숫자입니다',
      '수도권 배송 전문',
      '당일배송 서비스 제공'
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
    inputFormatHint.textContent = `${selectedCourier.lengthHint} 숫자`;

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
  companyInfoTitle.textContent = `${courier.icon} ${courier.name} 안내`;

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
      error: '택배사를 선택해주세요'
    };
  }

  if (!cleanNumber) {
    return {
      valid: false,
      error: '운송장 번호를 입력해주세요'
    };
  }

  if (!selectedCourier.trackingPattern.test(cleanNumber)) {
    return {
      valid: false,
      error: `${selectedCourier.name}의 운송장 번호는 ${selectedCourier.lengthHint} 숫자여야 합니다`
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
      showToast('쿠팡은 로그인 후 주문 내역에서 확인하세요', 'info');
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
  showToast(`${selectedCourier.name} 조회 페이지로 이동합니다`, 'success');

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
  inputFormatHint.textContent = '예: 123456789012';

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
