// TODO 목록 저장
let todos = [];
let nextId = 1;

/**
 * TODO 리스트 HTML을 생성하는 함수
 * @returns {string} TODO 리스트 HTML 문자열
 */
export function createTodoList() {
  return `
    <div>    
      <h3>TODO List</h3>
      <div class="card">
        <div class="todo-input-section">
          <input 
            type="text" 
            id="todo-input" 
            placeholder="할 일을 입력하세요..."
          />
          <button id="add-todo-btn">추가</button>
        </div>
        
        <table id="todo-table">
          <thead>
            <tr>
              <th style="width: 50px;">완료</th>
              <th>할 일</th>
              <th style="width: 120px; text-align: center;">액션</th>
            </tr>
          </thead>
          <tbody id="todo-list">
            <!-- TODO 항목들이 여기에 추가됩니다 -->
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * TODO 목록을 렌더링하는 함수
 */
function renderTodos() {
  const todoListElement = document.querySelector("#todo-list");

  if (!todoListElement) return;

  if (todos.length === 0) {
    todoListElement.innerHTML = `
      <tr>
        <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
          할 일이 없습니다. 위에서 추가해보세요!
        </td>
      </tr>
    `;
    return;
  }

  todoListElement.innerHTML = todos
    .map((todo) => {
      const completedStyle = todo.completed
        ? 'style="text-decoration: line-through; color: #999;"'
        : "";

      return `
        <tr data-todo-id="${todo.id}">
          <td style="text-align: center;">
            <input 
              type="checkbox" 
              class="todo-checkbox"
              ${todo.completed ? "checked" : ""}
            />
          </td>
          <td ${completedStyle}>
            ${todo.text}
          </td>
          <td style="text-align: center;">
            <button 
              class="edit-todo-btn" 
              ${todo.completed ? "disabled" : ""}
            >수정</button>
            <button class="delete-todo-btn">삭제</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

/**
 * 새로운 TODO를 추가하는 함수 (Create)
 * @param {string} text - TODO 내용
 */
function addTodo(text) {
  if (!text.trim()) return;

  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
  };

  todos.push(newTodo);
  renderTodos();
}

/**
 * TODO의 완료 상태를 토글하는 함수 (Update)
 * @param {number} id - TODO ID
 */
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

/**
 * TODO를 수정하는 함수 (Update)
 * @param {number} id - TODO ID
 */
function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo || todo.completed) return;

  const newText = prompt("할 일을 수정하세요:", todo.text);
  if (newText !== null && newText.trim()) {
    todo.text = newText.trim();
    renderTodos();
  }
}

/**
 * TODO를 삭제하는 함수 (Delete)
 * @param {number} id - TODO ID
 */
function deleteTodo(id) {
  if (confirm("정말 삭제하시겠습니까?")) {
    todos = todos.filter((t) => t.id !== id);
    renderTodos();
  }
}

/**
 * TODO 리스트 이벤트 핸들러를 설정하는 함수
 * @param {HTMLElement} element - TODO 리스트를 포함하는 DOM 요소
 */
export function setupTodoHandlers(element) {
  const addButton = element.querySelector("#add-todo-btn");
  const input = element.querySelector("#todo-input");
  const todoList = element.querySelector("#todo-list");

  // 추가 버튼 클릭
  if (addButton) {
    addButton.addEventListener("click", () => {
      addTodo(input.value);
      input.value = "";
      input.focus();
    });
  }

  // Enter 키로 추가
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTodo(input.value);
        input.value = "";
      }
    });
  }

  // 이벤트 위임을 사용한 TODO 액션 처리
  if (todoList) {
    todoList.addEventListener("click", (e) => {
      const todoRow = e.target.closest("tr[data-todo-id]");
      if (!todoRow) return;

      const todoId = parseInt(todoRow.dataset.todoId);

      // 체크박스 클릭
      if (e.target.classList.contains("todo-checkbox")) {
        toggleTodo(todoId);
      }

      // 수정 버튼 클릭
      if (e.target.classList.contains("edit-todo-btn")) {
        editTodo(todoId);
      }

      // 삭제 버튼 클릭
      if (e.target.classList.contains("delete-todo-btn")) {
        deleteTodo(todoId);
      }
    });
  }

  // 초기 렌더링
  renderTodos();
}
