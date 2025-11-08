import "../style.css";

let Channels = [];
let nextId = 1;

const renderChannels = () => {
  const channelListElement = document.querySelector("#channel-list");

  if (Channels.length === 0) {
    channelListElement.innerHTML = `
      <tr>
        <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
          채널이 없습니다. 위에서 추가해보세요!
        </td>
      </tr>
    `;
    return;
  } else {
    channelListElement.innerHTML = Channels.map((channel) => {
      return `
        <tr data-channel-id="${channel.id}">
          <td>${channel.text}</td>
          <td>
            <button class="edit-channel-btn">수정</button>
            <button class="delete-channel-btn">삭제</button>
          </td>
        </tr>
      `;
    }).join("");
  }
};

const addChannel = (text) => {
  if (!text.trim()) return;

  const newChannel = {
    id: nextId++,
    text: text.trim(),
  };

  Channels.push(newChannel);
  renderChannels();
};

const deleteChannel = (id) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    Channels = Channels.filter((channel) => channel.id !== id);
    renderChannels();
  }
};

const updateChannel = (id, text) => {
  const channel = Channels.find((channel) => channel.id === id);
  if (channel) {
    channel.text = text;
    renderChannels();
  }
};

export const setupChannelListHandlers = (element) => {
  const addButton = element.querySelector("#add-channel-btn");
  const input = element.querySelector("#channel-input");
  const channelList = element.querySelector("#channel-list");

  if (addButton) {
    addButton.addEventListener("click", () => {
      addChannel(input.value);
      input.value = "";
      input.focus();
    });
  }

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addChannel(input.value);
        input.value = "";
      }
    });
  }

  if (channelList) {
    // 이벤트 위임방식
    // 성능: 100개의 버튼 각각에 리스너를 달 필요 없이 부모 하나로 해결
    // JS로 새로 추가된 행도 자동으로 이벤트 처리됨
    // 한 곳에서 모든 클릭 이벤트를 관리할 수 있음
    channelList.addEventListener("click", (e) => {
      const channelRow = e.target.closest("tr[data-channel-id]");
      if (!channelRow) return;

      const channelId = parseInt(channelRow.dataset.channelId);

      //   if (e.target.classList.contains("channel-checkbox")) {
      //     toggleChannel(channelId);
      //   }

      if (e.target.classList.contains("edit-channel-btn")) {
        const newText = window.prompt(
          "채널 이름을 수정하세요:",
          Channels.find((channel) => channel.id === channelId).text
        );
        if (newText !== null && newText.trim()) {
          updateChannel(channelId, newText.trim());
        }
      }

      if (e.target.classList.contains("delete-channel-btn")) {
        deleteChannel(channelId);
      }
    });
  }

  renderChannels();
};
