/**
 * Modal/Dialog System
 * Features: ESC close, backdrop click, focus trap, animations, accessibility
 */

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export class Modal {
  constructor() {
    this.activeModal = null;
    this.previousFocusElement = null;
    this.handleEscKey = this.handleEscKey.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleFocusTrap = this.handleFocusTrap.bind(this);
  }

  /**
   * Alert modal - 단순 알림
   */
  alert({ title, message, confirmText = "확인" }) {
    return new Promise((resolve) => {
      const modalElement = this.createModalElement({
        type: "alert",
        title,
        content: `<p class="modal-message">${message}</p>`,
        buttons: [
          {
            text: confirmText,
            primary: true,
            onClick: () => {
              this.close();
              resolve(true);
            },
          },
        ],
      });

      this.open(modalElement);
    });
  }

  /**
   * Confirm modal - 확인/취소
   */
  confirm({ title, message, confirmText = "확인", cancelText = "취소" }) {
    return new Promise((resolve) => {
      const modalElement = this.createModalElement({
        type: "confirm",
        title,
        content: `<p class="modal-message">${message}</p>`,
        buttons: [
          {
            text: cancelText,
            onClick: () => {
              this.close();
              resolve(false);
            },
          },
          {
            text: confirmText,
            primary: true,
            onClick: () => {
              this.close();
              resolve(true);
            },
          },
        ],
      });

      this.open(modalElement);
    });
  }

  /**
   * Custom modal - 커스텀 컨텐츠
   */
  custom({
    title,
    content,
    buttons = [],
    closeOnBackdrop = true,
    closeOnEsc = true,
  }) {
    return new Promise((resolve) => {
      const modalElement = this.createModalElement({
        type: "custom",
        title,
        content,
        buttons: buttons.map((btn) => ({
          ...btn,
          onClick: () => {
            if (btn.onClick) btn.onClick();
            this.close();
            resolve(btn.value !== undefined ? btn.value : true);
          },
        })),
      });

      this.open(modalElement, { closeOnBackdrop, closeOnEsc });
    });
  }

  /**
   * 모달 엘리먼트 생성
   */
  createModalElement({ type, title, content, buttons }) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "modal-title");

    const dialog = document.createElement("div");
    dialog.className = `modal-dialog modal-${type}`;

    // Header
    const header = document.createElement("div");
    header.className = "modal-header";
    header.innerHTML = `
      <h2 id="modal-title" class="modal-title">${title}</h2>
      <button class="modal-close-btn" aria-label="닫기">&times;</button>
    `;

    // Body
    const body = document.createElement("div");
    body.className = "modal-body";
    body.innerHTML = content;

    // Footer
    const footer = document.createElement("div");
    footer.className = "modal-footer";

    buttons.forEach((btn, index) => {
      const button = document.createElement("button");
      button.className = btn.primary ? "modal-btn modal-btn-primary" : "modal-btn";
      button.textContent = btn.text;
      button.onclick = btn.onClick;
      if (index === buttons.length - 1) {
        button.setAttribute("data-autofocus", "true");
      }
      footer.appendChild(button);
    });

    // Close button handler
    const closeBtn = header.querySelector(".modal-close-btn");
    closeBtn.onclick = () => {
      this.close();
    };

    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);
    backdrop.appendChild(dialog);

    return backdrop;
  }

  /**
   * 모달 열기
   */
  open(modalElement, options = {}) {
    const { closeOnBackdrop = true, closeOnEsc = true } = options;

    // 이전 포커스 저장
    this.previousFocusElement = document.activeElement;

    // 모달 추가
    document.body.appendChild(modalElement);
    this.activeModal = modalElement;

    // 바디 스크롤 방지
    document.body.style.overflow = "hidden";

    // 애니메이션을 위한 delay
    requestAnimationFrame(() => {
      modalElement.classList.add("modal-active");
    });

    // 이벤트 리스너 등록
    if (closeOnEsc) {
      document.addEventListener("keydown", this.handleEscKey);
    }

    if (closeOnBackdrop) {
      modalElement.addEventListener("click", this.handleBackdropClick);
    }

    // 포커스 트랩
    document.addEventListener("keydown", this.handleFocusTrap);

    // 첫 번째 포커스 가능한 엘리먼트에 포커스
    this.focusFirstElement(modalElement);
  }

  /**
   * 모달 닫기
   */
  close() {
    if (!this.activeModal) return;

    const modal = this.activeModal;

    // 애니메이션
    modal.classList.remove("modal-active");
    modal.classList.add("modal-closing");

    // 애니메이션 완료 후 제거
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }

      // 바디 스크롤 복원
      document.body.style.overflow = "";

      // 이벤트 리스너 제거
      document.removeEventListener("keydown", this.handleEscKey);
      document.removeEventListener("keydown", this.handleFocusTrap);
      modal.removeEventListener("click", this.handleBackdropClick);

      // 이전 포커스 복원
      if (this.previousFocusElement) {
        this.previousFocusElement.focus();
      }

      this.activeModal = null;
      this.previousFocusElement = null;
    }, 300); // CSS transition duration
  }

  /**
   * ESC 키 핸들러
   */
  handleEscKey(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  /**
   * 백드롭 클릭 핸들러
   */
  handleBackdropClick(event) {
    if (event.target.classList.contains("modal-backdrop")) {
      this.close();
    }
  }

  /**
   * 포커스 트랩 핸들러
   */
  handleFocusTrap(event) {
    if (event.key !== "Tab" || !this.activeModal) return;

    const focusableElements = this.getFocusableElements(this.activeModal);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    }
    // Tab
    else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * 포커스 가능한 엘리먼트 가져오기
   */
  getFocusableElements(container) {
    const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
    return elements.filter(
      (el) => !el.disabled && el.offsetParent !== null // visible elements only
    );
  }

  /**
   * 첫 번째 엘리먼트에 포커스
   */
  focusFirstElement(container) {
    // autofocus 속성이 있는 엘리먼트 우선
    const autofocusElement = container.querySelector("[data-autofocus]");
    if (autofocusElement) {
      autofocusElement.focus();
      return;
    }

    // 없으면 첫 번째 포커스 가능한 엘리먼트
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
}

// Singleton instance
export const modal = new Modal();

