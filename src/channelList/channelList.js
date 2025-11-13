import "../style.css";
import { debounce, throttle } from "../utils/helpers.js";

// 상수 정의
const BUTTON_CLICK_LIMIT_MS = 1000; // Throttle: 버튼 중복 클릭 방지 시간
const SEARCH_DEBOUNCE_DELAY_MS = 300; // Debounce: 검색 입력 대기 시간

// 상태 관리
let Channels = [];
let nextId = 1;
let currentSearchKeyword = "";
let previousRenderedIds = new Set(); // Diff 알고리즘을 위한 이전 렌더링 ID 추적

/**
 * 검색 키워드로 텍스트 하이라이트 처리
 * @param {string} text - 원본 텍스트
 * @param {string} keyword - 검색 키워드
 * @returns {string} 하이라이트가 적용된 HTML 문자열
 */
const highlightKeyword = (text, keyword) => {
  if (!keyword.trim()) return text;

  return text.replace(
    new RegExp(`(${keyword})`, "gi"),
    '<span style="background-color: #ffd700; font-weight: bold;">$1</span>'
  );
};

/**
 * 단일 채널 행 생성
 * @param {Object} channel - 채널 객체
 * @param {string} keyword - 검색 키워드
 * @returns {HTMLTableRowElement} 생성된 행 엘리먼트
 */
const createChannelRow = (channel, keyword = "") => {
  const row = document.createElement("tr");
  row.setAttribute("data-channel-id", channel.id);

  const highlightedText = highlightKeyword(channel.text, keyword);

  row.innerHTML = `
    <td>${highlightedText}</td>
    <td>
      <button class="edit-channel-btn">수정</button>
      <button class="delete-channel-btn">삭제</button>
    </td>
  `;

  return row;
};

/**
 * 빈 메시지 행 생성
 * @param {string} message - 표시할 메시지
 * @returns {HTMLTableRowElement} 생성된 메시지 행
 */
const createEmptyMessageRow = (message) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
      ${message}
    </td>
  `;
  return row;
};

/**
 * Diff Algorithm을 사용한 채널 리스트 렌더링
 * - 변경된 항목만 업데이트하여 성능 최적화
 * - DOM 조작 최소화로 불필요한 리플로우/리페인트 방지
 */
const renderChannels = (keyword = "") => {
  const channelListElement = document.querySelector("#channel-list");

  // 검색 키워드로 필터링
  const filteredChannels = keyword.trim()
    ? Channels.filter((channel) =>
        channel.text.toLowerCase().includes(keyword.toLowerCase())
      )
    : Channels;

  // 빈 상태 처리
  if (filteredChannels.length === 0) {
    const emptyMessage = keyword.trim()
      ? `'${keyword}' 검색 결과가 없습니다.`
      : "채널이 없습니다. 위에서 추가해보세요!";

    channelListElement.innerHTML = "";
    channelListElement.appendChild(createEmptyMessageRow(emptyMessage));
    previousRenderedIds.clear();
    return;
  }

  // Diff Algorithm 적용
  const currentIds = new Set(filteredChannels.map((ch) => ch.id));
  const existingRows = channelListElement.querySelectorAll(
    "tr[data-channel-id]"
  );

  console.log(existingRows, "얍");

  // 1. 삭제: 현재 필터링 결과에 없는 행 제거
  existingRows.forEach((row) => {
    const id = parseInt(row.dataset.channelId);
    if (!currentIds.has(id)) {
      row.remove();
    }
  });

  // 2. 추가 및 업데이트
  filteredChannels.forEach((channel, index) => {
    const existingRow = channelListElement.querySelector(
      `tr[data-channel-id="${channel.id}"]`
    );

    if (existingRow) {
      // 기존 행이 있는 경우: 내용이 변경되었는지 확인 후 업데이트
      const originalChannel = Channels.find((ch) => ch.id === channel.id);
      const currentText =
        existingRow.querySelector("td:first-child").textContent;
      const newHighlightedText = highlightKeyword(channel.text, keyword);

      // 텍스트 또는 하이라이트가 변경된 경우에만 업데이트
      if (currentText !== channel.text || keyword.trim()) {
        existingRow.querySelector("td:first-child").innerHTML =
          newHighlightedText;
      }

      // 위치가 변경된 경우 재정렬
      const currentPosition = Array.from(channelListElement.children).indexOf(
        existingRow
      );
      if (currentPosition !== index) {
        if (index === 0) {
          channelListElement.prepend(existingRow);
        } else {
          const referenceNode = channelListElement.children[index];
          channelListElement.insertBefore(existingRow, referenceNode);
        }
      }
    } else {
      // 새로운 행 추가
      const newRow = createChannelRow(channel, keyword);

      if (index === 0) {
        channelListElement.prepend(newRow);
      } else if (index >= channelListElement.children.length) {
        channelListElement.appendChild(newRow);
      } else {
        const referenceNode = channelListElement.children[index];
        channelListElement.insertBefore(newRow, referenceNode);
      }
    }
  });

  // 이전 렌더링 ID 업데이트
  previousRenderedIds = currentIds;
};

const addChannel = (text) => {
  if (!text.trim()) return;

  const newChannel = {
    id: nextId++,
    text: text.trim(),
  };

  Channels.push(newChannel);
  renderChannels(currentSearchKeyword);
};

const deleteChannel = (id) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    Channels = Channels.filter((channel) => channel.id !== id);
    renderChannels(currentSearchKeyword);
  }
};

const updateChannel = (id, text) => {
  const channel = Channels.find((channel) => channel.id === id);
  if (channel) {
    channel.text = text;
    renderChannels(currentSearchKeyword);
  }
};

export const setupChannelListHandlers = (element) => {
  const addButton = element.querySelector("#add-channel-btn");
  const input = element.querySelector("#channel-input");
  const searchInput = element.querySelector("#channel-search-input");
  const channelList = element.querySelector("#channel-list");

  // Throttle을 사용한 버튼 중복 클릭 방지
  const throttledAddChannel = throttle((value) => {
    addChannel(value);
    input.value = "";
    input.focus();
  }, BUTTON_CLICK_LIMIT_MS);

  if (addButton) {
    addButton.addEventListener("click", () => {
      throttledAddChannel(input.value);
    });
  }

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        throttledAddChannel(input.value);
      }
    });
  }

  // Debounce를 사용한 실시간 검색
  if (searchInput) {
    const debouncedSearch = debounce((keyword) => {
      currentSearchKeyword = keyword;
      renderChannels(keyword);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    searchInput.addEventListener("input", (e) => {
      debouncedSearch(e.target.value);
    });
  }

  if (channelList) {
    // 이벤트 위임방식
    // 성능: 100개의 버튼 각각에 리스너를 달 필요 없이 부모 하나로 해결
    // JS로 새로 추가된 행도 자동으로 이벤트 처리됨
    // 한 곳에서 모든 클릭 이벤트를 관리할 수 있음

    // Throttle을 사용한 수정/삭제 버튼 중복 클릭 방지
    const throttledEditChannel = throttle((channelId) => {
      const newText = window.prompt(
        "채널 이름을 수정하세요:",
        Channels.find((channel) => channel.id === channelId).text
      );
      if (newText !== null && newText.trim()) {
        updateChannel(channelId, newText.trim());
      }
    }, BUTTON_CLICK_LIMIT_MS);

    const throttledDeleteChannel = throttle((channelId) => {
      deleteChannel(channelId);
    }, BUTTON_CLICK_LIMIT_MS);

    channelList.addEventListener("click", (e) => {
      const channelRow = e.target.closest("tr[data-channel-id]");
      if (!channelRow) return;

      const channelId = parseInt(channelRow.dataset.channelId);

      if (e.target.classList.contains("edit-channel-btn")) {
        throttledEditChannel(channelId);
      }

      if (e.target.classList.contains("delete-channel-btn")) {
        throttledDeleteChannel(channelId);
      }
    });
  }

  renderChannels();
};
