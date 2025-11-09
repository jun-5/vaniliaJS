import "../style.css";
import { debounce, throttle } from "../utils/helpers.js";

let Channels = [];
let nextId = 1;
let currentSearchKeyword = "";

const renderChannels = (keyword = "") => {
  const channelListElement = document.querySelector("#channel-list");

  // 검색 키워드로 필터링
  const filteredChannels = keyword.trim()
    ? Channels.filter((channel) =>
        channel.text.toLowerCase().includes(keyword.toLowerCase())
      )
    : Channels;

  if (filteredChannels.length === 0) {
    const emptyMessage = keyword.trim()
      ? `'${keyword}' 검색 결과가 없습니다.`
      : "채널이 없습니다. 위에서 추가해보세요!";

    channelListElement.innerHTML = `
      <tr>
        <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
          ${emptyMessage}
        </td>
      </tr>
    `;
    return;
  } else {
    channelListElement.innerHTML = filteredChannels
      .map((channel) => {
        // 검색 키워드 하이라이트
        const highlightedText = keyword.trim()
          ? channel.text.replace(
              new RegExp(`(${keyword})`, "gi"),
              '<span style="background-color: #ffd700; font-weight: bold;">$1</span>'
            )
          : channel.text;

        return `
        <tr data-channel-id="${channel.id}">
          <td>${highlightedText}</td>
          <td>
            <button class="edit-channel-btn">수정</button>
            <button class="delete-channel-btn">삭제</button>
          </td>
        </tr>
      `;
      })
      .join("");
  }
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

  // Throttle을 사용한 버튼 중복 클릭 방지 (1초에 최대 1번만)
  const BUTTON_CLICK_LIMIT_MS = 1000;
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

  // Debounce를 사용한 실시간 검색 (300ms 후 검색 실행)
  const SEARCH_DEBOUNCE_DELAY_MS = 300;
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
    const BUTTON_CLICK_LIMIT_MS = 1000;
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
