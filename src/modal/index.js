import "../style.css";
import { modal } from "./modal.js";

/**
 * 모달 시스템 데모
 */

function initModalDemo() {
  const app = document.querySelector("#modal-demo");

  app.innerHTML = `
    <div class="modal-demo-container">
      <h1>🎭 모달/다이얼로그 시스템</h1>
      <p class="subtitle">Vanilla JS로 구현한 완전한 모달 시스템</p>
      
      <div class="demo-section">
        <h3>📢 Alert 모달</h3>
        <p class="description">단순 알림 메시지를 표시합니다.</p>
        <button id="alert-basic" class="demo-btn">기본 Alert</button>
        <button id="alert-success" class="demo-btn demo-btn-success">성공 메시지</button>
        <button id="alert-error" class="demo-btn demo-btn-error">에러 메시지</button>
      </div>

      <div class="demo-section">
        <h3>❓ Confirm 모달</h3>
        <p class="description">사용자의 확인/취소를 받습니다.</p>
        <button id="confirm-delete" class="demo-btn">삭제 확인</button>
        <button id="confirm-logout" class="demo-btn">로그아웃 확인</button>
        <div id="confirm-result" class="result-box"></div>
      </div>

      <div class="demo-section">
        <h3>🎨 Custom 모달</h3>
        <p class="description">커스텀 컨텐츠를 표시합니다.</p>
        <button id="custom-form" class="demo-btn">폼 입력 모달</button>
        <button id="custom-select" class="demo-btn">옵션 선택 모달</button>
        <button id="custom-complex" class="demo-btn">복잡한 컨텐츠</button>
        <div id="custom-result" class="result-box"></div>
      </div>

      <div class="demo-section">
        <h3>⚙️ 기능 테스트</h3>
        <p class="description">다양한 옵션과 기능을 테스트합니다.</p>
        <button id="test-backdrop" class="demo-btn">백드롭 클릭 비활성화</button>
        <button id="test-esc" class="demo-btn">ESC 키 비활성화</button>
        <button id="test-nested" class="demo-btn">연속 모달 테스트</button>
      </div>

      <div class="features">
        <h3>✨ 주요 기능</h3>
        <ul>
          <li>✅ ESC 키로 닫기</li>
          <li>✅ 백드롭 클릭으로 닫기</li>
          <li>✅ 포커스 트랩 (Tab/Shift+Tab)</li>
          <li>✅ 부드러운 애니메이션</li>
          <li>✅ 접근성 (ARIA)</li>
          <li>✅ Promise 기반 API</li>
          <li>✅ 스크롤 방지</li>
          <li>✅ 이전 포커스 복원</li>
        </ul>
      </div>
    </div>
  `;

  setupEventHandlers();
}

function setupEventHandlers() {
  // Alert 모달들
  document.getElementById("alert-basic").addEventListener("click", async () => {
    await modal.alert({
      title: "알림",
      message: "이것은 기본 Alert 모달입니다.",
    });
    console.log("Alert closed");
  });

  document
    .getElementById("alert-success")
    .addEventListener("click", async () => {
      await modal.alert({
        title: "✅ 성공",
        message: "작업이 성공적으로 완료되었습니다!",
        confirmText: "좋아요",
      });
    });

  document.getElementById("alert-error").addEventListener("click", async () => {
    await modal.alert({
      title: "⚠️ 오류 발생",
      message: "요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      confirmText: "확인",
    });
  });

  // Confirm 모달들
  document
    .getElementById("confirm-delete")
    .addEventListener("click", async () => {
      const result = await modal.confirm({
        title: "정말 삭제하시겠습니까?",
        message: "이 작업은 되돌릴 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
      });

      const resultBox = document.getElementById("confirm-result");
      resultBox.textContent = result ? "✅ 삭제됨" : "❌ 취소됨";
      resultBox.className = `result-box ${
        result ? "result-success" : "result-cancel"
      }`;
    });

  document
    .getElementById("confirm-logout")
    .addEventListener("click", async () => {
      const result = await modal.confirm({
        title: "로그아웃",
        message: "정말 로그아웃하시겠습니까?",
        confirmText: "로그아웃",
        cancelText: "취소",
      });

      const resultBox = document.getElementById("confirm-result");
      resultBox.textContent = result ? "👋 로그아웃됨" : "계속 사용 중";
      resultBox.className = `result-box ${
        result ? "result-success" : "result-cancel"
      }`;
    });

  // Custom 모달들
  document.getElementById("custom-form").addEventListener("click", async () => {
    const content = `
      <div class="custom-form">
        <div class="form-group">
          <label for="username">이름</label>
          <input type="text" id="username" placeholder="이름을 입력하세요" />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" placeholder="email@example.com" />
        </div>
        <div class="form-group">
          <label for="message">메시지</label>
          <textarea id="message" rows="3" placeholder="메시지를 입력하세요"></textarea>
        </div>
      </div>
    `;

    await modal.custom({
      title: "📝 정보 입력",
      content,
      buttons: [
        { text: "취소", value: false },
        {
          text: "제출",
          primary: true,
          value: true,
          onClick: () => {
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;
            console.log("Form data:", { username, email, message });
          },
        },
      ],
    });
  });

  document
    .getElementById("custom-select")
    .addEventListener("click", async () => {
      const content = `
      <div class="custom-select-list">
        <div class="select-option" data-value="option1">
          <strong>옵션 1</strong>
          <p>첫 번째 선택지입니다</p>
        </div>
        <div class="select-option" data-value="option2">
          <strong>옵션 2</strong>
          <p>두 번째 선택지입니다</p>
        </div>
        <div class="select-option" data-value="option3">
          <strong>옵션 3</strong>
          <p>세 번째 선택지입니다</p>
        </div>
      </div>
    `;

      await modal.custom({
        title: "🎯 옵션 선택",
        content,
        buttons: [{ text: "닫기", primary: true }],
      });

      // 옵션 클릭 이벤트 (모달이 열린 후)
      setTimeout(() => {
        document.querySelectorAll(".select-option").forEach((option) => {
          option.addEventListener("click", () => {
            const value = option.dataset.value;
            const resultBox = document.getElementById("custom-result");
            resultBox.textContent = `선택됨: ${value}`;
            resultBox.className = "result-box result-success";
          });
        });
      }, 0);
    });

  document
    .getElementById("custom-complex")
    .addEventListener("click", async () => {
      const content = `
      <div class="complex-content">
        <img src="https://via.placeholder.com/400x200/646cff/ffffff?text=Complex+Modal" 
             alt="Example" 
             style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />
        <p>이것은 복잡한 컨텐츠를 포함하는 모달입니다.</p>
        <ul style="text-align: left; margin: 16px 0;">
          <li>이미지를 포함할 수 있습니다</li>
          <li>다양한 HTML 요소를 사용할 수 있습니다</li>
          <li>스타일을 자유롭게 적용할 수 있습니다</li>
        </ul>
        <div style="background: rgba(100, 108, 255, 0.1); padding: 12px; border-radius: 4px; margin-top: 16px;">
          💡 <strong>Tip:</strong> ESC 키를 누르거나 배경을 클릭하면 모달이 닫힙니다.
        </div>
      </div>
    `;

      await modal.custom({
        title: "🎨 복잡한 모달",
        content,
        buttons: [{ text: "취소" }, { text: "확인", primary: true }],
      });
    });

  // 기능 테스트들
  document
    .getElementById("test-backdrop")
    .addEventListener("click", async () => {
      await modal.custom({
        title: "⚠️ 백드롭 클릭 비활성화",
        content:
          "<p>이 모달은 배경을 클릭해도 닫히지 않습니다.<br>버튼을 클릭해야 닫힙니다.</p>",
        buttons: [{ text: "닫기", primary: true }],
        closeOnBackdrop: false,
      });
    });

  document.getElementById("test-esc").addEventListener("click", async () => {
    await modal.custom({
      title: "⚠️ ESC 키 비활성화",
      content:
        "<p>이 모달은 ESC 키를 눌러도 닫히지 않습니다.<br>버튼을 클릭해야 닫힙니다.</p>",
      buttons: [{ text: "닫기", primary: true }],
      closeOnEsc: false,
    });
  });

  document.getElementById("test-nested").addEventListener("click", async () => {
    const result1 = await modal.confirm({
      title: "첫 번째 모달",
      message: "두 번째 모달을 열까요?",
      confirmText: "네",
      cancelText: "아니오",
    });

    if (result1) {
      const result2 = await modal.confirm({
        title: "두 번째 모달",
        message: "세 번째 모달을 열까요?",
        confirmText: "네",
        cancelText: "아니오",
      });

      if (result2) {
        await modal.alert({
          title: "세 번째 모달",
          message: "연속으로 모달을 잘 열었습니다! 🎉",
        });
      }
    }
  });
}

// Initialize
initModalDemo();
