/**
 * Debounce 함수
 * 연속된 호출을 지연시키고, 마지막 호출 후 일정 시간이 지나면 실행
 * 사용 예: 실시간 검색, 자동 저장, resize 이벤트
 *
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (밀리초)
 * @returns {Function} debounced 함수
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle 함수
 * 일정 시간 동안 함수가 한 번만 실행되도록 제한
 * 사용 예: 스크롤 이벤트, 버튼 중복 클릭 방지, 드래그 이벤트
 *
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 제한 시간 (밀리초)
 * @returns {Function} throttled 함수
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
