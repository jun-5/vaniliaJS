// import { channels } from "./mock";

import { throttle, debounce } from "../utils/helpers";

let channels = [
  {
    id: 1,
    name: "General",
    unreadCount: 3,
    lastMessage: "팀 회의가 곧 시작됩니다.",
    lastMessageAt: "2025-11-10T10:00:00Z",
    members: ["juno", "alice", "bob"],
  },
  {
    id: 2,
    name: "Random",
    unreadCount: 0,
    lastMessage: "펫 사진 공유방입니다.",
    lastMessageAt: "2025-11-11T09:30:00Z",
    members: ["juno"],
  },
  {
    id: 3,
    name: "Sendbird FE",
    unreadCount: 10,
    lastMessage: "코드 리뷰 부탁드립니다.",
    lastMessageAt: "2025-11-12T12:00:00Z",
    members: ["juno", "denny"],
  },
];

// const container = document.getElementById("practice");

//setUpInitalHTML 구조는 바뀌지않는 구조인데 굳이 이렇게 계속 만들빠에는, HTML에 만드는게 어떄?
const setUpInitialHTML = () => {
  renderTBody();
  setUpEventListener();
};

const row = (channel) => {
  const { id, lastMessage, lastMessageAt, members, name, unreadCount } =
    channel || {};

  return `
    <tr data-id=${id}>
      <td>${id}</td>
      <td>${name}</td>
      <td><button class="delete-button">X</button></td>
      <td><button class="edit-button">Edit</button></td>
    </tr>
    `;
};

const renderRow = () => {
  return channels.map((channel) => row(channel)).join("");
};

const renderTBody = () => {
  const channelList = document.getElementById("channel-list");

  channelList.innerHTML = renderRow();
};

const setUpEventListener = () => {
  addInputEventListener();
  searchInputEventListener();
  tableEventDelegation();
};

const addList = (name) => {
  channels.push({
    id: Math.random(),
    name: name,
  });

  renderTBody();
};

const addInputEventListener = () => {
  const addInputEl = document.getElementById("add-input");
  const addButtonEl = document.getElementById("add-button");
  const throttledAdd = throttle(() => {
    addList(addInputEl.value);
    addInputEl.value = "";
  }, 3000);

  addInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (addInputEl.value.trim()) throttledAdd();
    }
  });

  addButtonEl.addEventListener("click", () => {
    if (addInputEl.value.trim()) throttledAdd();
  });
};

const searchInputEventListener = () => {
  const searchInputEl = document.getElementById("search-input");
  const handleSearchInput = () => {
    const filteredChannels = channels.filter((channel) =>
      channel.name.includes(searchInputEl.value)
    );
    const channelList = document.getElementById("channel-list");
    channelList.innerHTML = filteredChannels
      .map((channel) => row(channel))
      .join("");
  };

  const debouncedSearch = debounce(() => {
    handleSearchInput();
  }, 300);

  searchInputEl.addEventListener("input", () => {
    debouncedSearch();
  });
};

const tableEventDelegation = () => {
  const channelLists = document.getElementById("channel-list");
  channelLists.addEventListener("click", (e) => {
    const classList = e.target.classList;
    const targetId = e.target.closest("tr[data-id]")?.dataset?.id;

    if (!targetId) return;
    if (classList.contains("delete-button")) {
      channels = channels.filter((channel) => channel.id !== Number(targetId));
      channelLists.removeChild(e.target.closest("tr"));
    }

    if (classList.contains("edit-button")) {
      const targetIdx = channels.findIndex(
        (channel) => channel.id === Number(targetId)
      );
      const res = window.prompt(
        "수정할 이름을 입력해주세요",
        channels[targetIdx].name
      );
      channels[targetIdx].name = res;
      e.target.closest("tr").innerHTML = row(channels[targetIdx]);
    }
  });
};

setUpInitialHTML();
