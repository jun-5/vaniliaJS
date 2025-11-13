import "../style.css";

const practiceContainer = document.getElementById("practice");

let data = [{ id: 1, title: "1번" }];
let lastId = 1;

const renderInitalTable = () =>
  `<div>
    <button id="channel-add-button">add</button>
    <table class="practice-table">
      <colgroup>
    <col style="width: 20%;">
    <col style="width: 80%;">
    <col style="width: 20%;">
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>타이틀</th>
          <th>Button</th>
        </tr>
      </thead>
      <tbody id="channel-list">${data.map((row) => renderRow(row))}</tbody>
    </table>
  </div>`;

const renderRow = (row) =>
  `<tr data-row-id=${row.id}>
    <td>${row.id}</td>
    <td>${row.title}</td>
    <td class="button-group">
      <button class="edit-button">수정</button>
      <button class="delete-button">삭제</button>
    </td>
  </tr>`;

const renderRows = () => {
  const listConatier = document.getElementById("channel-list");
  const rows = data?.map((row) => renderRow(row)).join("");
  listConatier.innerHTML = `${rows}`;
};

const initalSetup = () => {
  if (practiceContainer) {
    practiceContainer.innerHTML = renderInitalTable();
  }

  practiceContainer.addEventListener("click", (e) => {
    const todoRow = e.target.closest("tr[data-row-id]");

    if (!todoRow) return;
    const rowId = parseInt(todoRow.dataset.rowId);
    if (e.target.classList.contains("edit-button")) {
      const newText = window.prompt(
        "채널 이름을 수정하세요:",
        data.find((row) => row.id === rowId).title
      );
      console.log(newText);
      if (newText !== null && newText.trim()) {
        data.find((row) => row.id === rowId).title = newText.trim();
        renderRows();
      }
    }
    if (e.target.classList.contains("delete-button")) {
      data = data.filter((row) => row.id !== rowId);
      renderRows();
    }
  });

  //이벤트리스너 등록
  const addButton = document.getElementById("channel-add-button");
  if (addButton) {
    addButton.addEventListener("click", () => {
      lastId += 1;
      data.push({ id: lastId, title: `${lastId}번입니다` });
      // renderRow방식은 리스트전체를 다시그림, 그렇기때문에 부하가있음
      // 가능하다면 기존 리스트에 row만 추가하는 방식도 좋을듯
      renderRows();
    });
  }
};

initalSetup();
