import "../style.css";
import { createTodoList, setupTodoHandlers } from "./table.js";

// TODO 리스트 모듈 초기화
const todoContainer = document.querySelector("#table");
if (todoContainer) {
  todoContainer.innerHTML = createTodoList();
  setupTodoHandlers(todoContainer);
}
